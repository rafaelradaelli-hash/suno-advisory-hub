import { useState, useEffect, useRef } from 'react';

/* ═══════════════════════════════════════════════════════════════════
   AdvisorChat — Chat IA com base nas recomendações Suno (ações)
   Fase 1: Context stuffing de Dividendos + Valor + Small Caps + Internacional
   ═══════════════════════════════════════════════════════════════════ */

/* ── Build compact knowledge base from data object ─────────────────
   Recebe o objeto `data` do App (já carregado do Supabase/localStorage).
   Extrai só as ações e monta um texto denso e estruturado para o prompt. */
function buildKnowledgeBase(data) {
  var sections = ["Dividendos", "Valor", "Small Caps", "Internacional"];
  var lines = [];
  var totalStocks = 0;

  sections.forEach(function(section) {
    var stocks = (data && data[section]) || [];
    if (stocks.length === 0) return;

    // Ordena por rankScore (maiores primeiro)
    var sorted = stocks.slice().sort(function(a, b) {
      return (b.rankScore || 0) - (a.rankScore || 0);
    });

    lines.push("\n═══ CARTEIRA " + section.toUpperCase() + " (" + sorted.length + " ativos) ═══");

    sorted.forEach(function(s, idx) {
      totalStocks++;
      var rank = idx + 1;
      var header = "\n[" + section + " #" + rank + "] " + s.ticker + " — " + (s.name || "");
      if (s.intlSub) header += " [" + s.intlSub + "]";
      if (s.quarter) header += " | " + s.quarter;
      if (s.sentiment) header += " | Sentimento: " + s.sentiment;
      if (typeof s.rankScore === "number") header += " | Score: " + s.rankScore.toFixed(1);
      lines.push(header);

      if (s.thesis) lines.push("TESE: " + s.thesis);

      if (s.thesisPros && s.thesisPros.length) {
        lines.push("PONTOS FORTES DA TESE: " + s.thesisPros.slice(0, 6).join(" | "));
      }
      if (s.thesisCons && s.thesisCons.length) {
        lines.push("RISCOS DA TESE: " + s.thesisCons.slice(0, 6).join(" | "));
      }

      if (s.result) lines.push("ÚLTIMO RESULTADO: " + s.result);

      if (s.resultPros && s.resultPros.length) {
        lines.push("DESTAQUES POSITIVOS DO RESULTADO: " + s.resultPros.slice(0, 7).join(" | "));
      }
      if (s.resultCons && s.resultCons.length) {
        lines.push("PONTOS DE ATENÇÃO DO RESULTADO: " + s.resultCons.slice(0, 7).join(" | "));
      }

      if (s.sunoView) lines.push("VISÃO SUNO: " + s.sunoView);
      if (s.lastUpdated) lines.push("Atualizado: " + s.lastUpdated);
    });
  });

  return {
    text: lines.join("\n"),
    totalStocks: totalStocks
  };
}

/* ── Suggested starter prompts ─────────────────────────────────── */
var SUGGESTIONS = [
  "Dentre todas as recomendações, quais ações tendem a pagar mais dividendos nos próximos 12 meses?",
  "Quais ações têm maior margem de segurança (cotação vs preço-teto)?",
  "Compare as teses de Petrobras vs Vale. Qual tem mais upside?",
  "Quais small caps tiveram o resultado mais positivo no último trimestre?",
  "Quais ações internacionais da carteira têm a melhor qualidade de negócio (moat)?",
  "Me dê 3 ações defensivas para um cliente avesso a risco.",
  "Quais ações estão negociando acima do preço-teto? Devo alertar o cliente?",
  "Entre BBAS3 e BBSE3, qual tese é mais sólida agora?"
];

/* ── Message bubble ────────────────────────────────────────────── */
function Bubble(p) {
  var isUser = p.role === "user";
  return (
    <div style={{ display: "flex", justifyContent: isUser ? "flex-end" : "flex-start", marginBottom: "10px" }}>
      <div style={{
        maxWidth: "85%",
        padding: "10px 14px",
        borderRadius: isUser ? "14px 14px 4px 14px" : "14px 14px 14px 4px",
        background: isUser ? "#DC2626" : "rgba(255,255,255,0.04)",
        border: isUser ? "none" : "1px solid rgba(255,255,255,0.06)",
        color: isUser ? "#fff" : "rgba(255,255,255,0.85)",
        fontSize: "12.5px",
        lineHeight: 1.6,
        whiteSpace: "pre-wrap",
        wordBreak: "break-word"
      }}>
        {p.content}
      </div>
    </div>
  );
}

/* ── Typing indicator ─────────────────────────────────────────── */
function Typing() {
  return (
    <div style={{ display: "flex", justifyContent: "flex-start", marginBottom: "10px" }}>
      <div style={{ padding: "12px 16px", borderRadius: "14px 14px 14px 4px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)", display: "flex", gap: "4px" }}>
        {[0, 1, 2].map(function(i) {
          return (
            <span key={i} style={{
              width: "6px", height: "6px", borderRadius: "50%",
              background: "rgba(220,38,38,0.6)",
              animation: "pulse 1.2s ease-in-out " + (i * 0.2) + "s infinite"
            }} />
          );
        })}
      </div>
      <style>{"@keyframes pulse{0%,60%,100%{opacity:0.3;transform:scale(0.8)}30%{opacity:1;transform:scale(1.2)}}"}</style>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════════════ */
export default function AdvisorChat(p) {
  var data = p.data || {};

  var [messages, setMessages] = useState([]);
  var [input, setInput] = useState("");
  var [loading, setLoading] = useState(false);
  var [error, setError] = useState("");
  var scrollRef = useRef(null);

  // Build knowledge base (memoized per data change via recompute)
  var kb = buildKnowledgeBase(data);

  // Autoscroll to bottom on new messages
  useEffect(function() {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  // Load conversation history from localStorage (persists across sessions)
  useEffect(function() {
    try {
      var saved = localStorage.getItem("suno-advisor-chat");
      if (saved) {
        var parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) setMessages(parsed);
      }
    } catch (e) {}
  }, []);

  // Save history on change
  useEffect(function() {
    try {
      // Keep only last 20 messages in storage to avoid bloating
      var toSave = messages.slice(-20);
      localStorage.setItem("suno-advisor-chat", JSON.stringify(toSave));
    } catch (e) {}
  }, [messages]);

  async function sendMessage(overrideText) {
    var text = (overrideText !== undefined ? overrideText : input).trim();
    if (!text || loading) return;

    setError("");
    var userMsg = { role: "user", content: text };
    var newMessages = messages.concat([userMsg]);
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      // System prompt: defines behavior + injects the knowledge base
      var sys = "Você é o assistente IA do Suno Advisory Hub, uma plataforma de apoio a consultores de investimento certificados (CNPI). "
        + "Seu papel é responder dúvidas dos consultores sobre as AÇÕES RECOMENDADAS pela Suno Research (nacionais e internacionais), usando EXCLUSIVAMENTE a base de conhecimento fornecida abaixo.\n\n"
        + "REGRAS:\n"
        + "1. Responda sempre em português brasileiro, com tom profissional e técnico — o interlocutor é um consultor de investimentos, não um investidor leigo.\n"
        + "2. Use LIVREMENTE termos técnicos: P/L, P/VP, EV/EBITDA, dividend yield, FCF yield, ROE, ROIC, payout, margem EBITDA, alavancagem, DCF, preço-teto, margem de segurança, etc.\n"
        + "3. Seja CONCRETO: cite tickers, números, percentuais e preços-teto exatos da base. Evite generalizações.\n"
        + "4. Quando comparar ativos, organize em formato claro (ex: tabela mental com critérios) e sempre conclua com uma recomendação ou síntese.\n"
        + "5. Se a pergunta pedir projeção de dividendos, baseie-se em payout histórico, dividend yield mencionado, geração de caixa livre e guidance — e deixe claro que é uma estimativa derivada dos relatórios, não uma projeção oficial.\n"
        + "6. Se uma informação NÃO estiver na base, diga isso explicitamente em vez de inventar. Ex: 'Os relatórios disponíveis não trazem essa informação especificamente.'\n"
        + "7. Ao sugerir ativos, sempre mencione a carteira de origem (Dividendos/Valor/Small Caps/Internacional) e o sentimento/score quando relevante.\n"
        + "8. Lembre-se: o consultor vai usar suas respostas para embasar conversas com clientes. Seja preciso, citando fontes dentro da base quando possível.\n"
        + "9. NÃO dê recomendação pessoal de compra/venda para o próprio consultor — trate sempre como análise fundamentalista apoiando a decisão dele.\n"
        + "10. Formate respostas longas com quebras de linha claras. Use '•' para listas quando necessário. Evite markdown pesado (sem **, sem #).\n\n"
        + "═══════════════════════════════════════════════════\n"
        + "BASE DE CONHECIMENTO — RECOMENDAÇÕES SUNO ATIVAS\n"
        + "(Total: " + kb.totalStocks + " ações recomendadas)\n"
        + "═══════════════════════════════════════════════════\n"
        + kb.text
        + "\n═══════════════════════════════════════════════════\n"
        + "FIM DA BASE DE CONHECIMENTO";

      // Build messages history for API (last 10 turns to keep context manageable)
      var historyForAPI = newMessages.slice(-10).map(function(m) {
        return { role: m.role, content: m.content };
      });

      var resp = await fetch("/api/anthropic", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 2048,
          system: sys,
          messages: historyForAPI
        })
      });

      var respData = await resp.json();

      if (respData.error) {
        throw new Error(respData.error.message || "Erro na API");
      }

      var assistantText = "";
      if (respData.content && Array.isArray(respData.content)) {
        assistantText = respData.content
          .filter(function(b) { return b.type === "text"; })
          .map(function(b) { return b.text; })
          .join("\n");
      }

      if (!assistantText) {
        throw new Error("Resposta vazia da IA");
      }

      setMessages(newMessages.concat([{ role: "assistant", content: assistantText }]));
    } catch (e) {
      console.error("[AdvisorChat]", e);
      setError(e.message || "Erro ao processar pergunta");
      // Rollback last user message so they can retry
      setMessages(messages);
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  function clearChat() {
    if (window.confirm("Limpar toda a conversa? Esta ação não pode ser desfeita.")) {
      setMessages([]);
      try { localStorage.removeItem("suno-advisor-chat"); } catch (e) {}
    }
  }

  // Empty state (no data loaded)
  if (kb.totalStocks === 0) {
    return (
      <div style={{ textAlign: "center", padding: "80px 0", color: "rgba(255,255,255,0.25)" }}>
        <div style={{ fontSize: "44px", marginBottom: "12px" }}>💬</div>
        <div style={{ fontSize: "14px", fontWeight: 600, color: "rgba(255,255,255,0.5)" }}>
          Nenhuma ação recomendada carregada ainda.
        </div>
        <div style={{ fontSize: "11px", marginTop: "8px", color: "rgba(255,255,255,0.3)" }}>
          Acesse <strong>Research → Teses & Resultados</strong> e adicione recomendações para ativar o chat.
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 140px)", maxWidth: "900px", margin: "0 auto" }}>
      {/* Header */}
      <div style={{ padding: "0 0 14px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(255,255,255,0.05)", marginBottom: "14px" }}>
        <div>
          <div style={{ fontSize: "16px", fontWeight: 800, color: "#fff", display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ background: "#DC2626", borderRadius: "8px", padding: "3px 8px", fontSize: "10px", fontWeight: 800 }}>IA</span>
            Consulta Inteligente
          </div>
          <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.35)", marginTop: "3px" }}>
            Perguntas sobre {kb.totalStocks} ações recomendadas (nacionais + internacionais)
          </div>
        </div>
        {messages.length > 0 && (
          <button onClick={clearChat} style={{
            padding: "5px 12px", borderRadius: "14px", border: "1px solid rgba(255,255,255,0.08)",
            background: "transparent", color: "rgba(255,255,255,0.4)", fontSize: "10px", fontWeight: 600, cursor: "pointer"
          }}>
            Limpar conversa
          </button>
        )}
      </div>

      {/* Messages area */}
      <div ref={scrollRef} style={{ flex: 1, overflowY: "auto", paddingRight: "4px" }}>
        {messages.length === 0 && (
          <div style={{ padding: "20px 0" }}>
            <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", marginBottom: "14px", fontWeight: 600 }}>
              💡 Sugestões para começar:
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {SUGGESTIONS.map(function(s, i) {
                return (
                  <button key={i} onClick={function() { sendMessage(s); }} disabled={loading} style={{
                    textAlign: "left", padding: "11px 14px", borderRadius: "10px",
                    border: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.02)",
                    color: "rgba(255,255,255,0.7)", fontSize: "11.5px", cursor: loading ? "not-allowed" : "pointer",
                    transition: "all 0.15s", lineHeight: 1.5
                  }}
                  onMouseEnter={function(e){ if(!loading){ e.currentTarget.style.background="rgba(220,38,38,0.06)"; e.currentTarget.style.borderColor="rgba(220,38,38,0.2)"; e.currentTarget.style.color="rgba(255,255,255,0.9)"; }}}
                  onMouseLeave={function(e){ e.currentTarget.style.background="rgba(255,255,255,0.02)"; e.currentTarget.style.borderColor="rgba(255,255,255,0.06)"; e.currentTarget.style.color="rgba(255,255,255,0.7)"; }}>
                    {s}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {messages.map(function(m, i) {
          return <Bubble key={i} role={m.role} content={m.content} />;
        })}

        {loading && <Typing />}
      </div>

      {/* Error banner */}
      {error && (
        <div style={{ padding: "8px 12px", marginBottom: "8px", borderRadius: "8px", background: "rgba(220,38,38,0.1)", border: "1px solid rgba(220,38,38,0.2)", color: "#f87171", fontSize: "11px" }}>
          ⚠ {error}
        </div>
      )}

      {/* Input area */}
      <div style={{ display: "flex", gap: "8px", paddingTop: "12px", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <textarea
          value={input}
          onChange={function(e) { setInput(e.target.value); }}
          onKeyDown={handleKeyDown}
          disabled={loading}
          rows={1}
          placeholder="Pergunte sobre as ações recomendadas..."
          style={{
            flex: 1, padding: "10px 14px", borderRadius: "10px",
            border: "1px solid rgba(255,255,255,0.08)",
            background: "rgba(255,255,255,0.03)", color: "#e2e8f0",
            fontSize: "12px", outline: "none", resize: "none",
            fontFamily: "inherit", lineHeight: 1.5,
            minHeight: "40px", maxHeight: "120px"
          }}
        />
        <button onClick={function() { sendMessage(); }} disabled={loading || !input.trim()} style={{
          padding: "0 18px", borderRadius: "10px", border: "none", cursor: loading || !input.trim() ? "not-allowed" : "pointer",
          background: loading || !input.trim() ? "rgba(255,255,255,0.05)" : "#DC2626",
          color: loading || !input.trim() ? "rgba(255,255,255,0.3)" : "#fff",
          fontSize: "12px", fontWeight: 700, minWidth: "80px", transition: "all 0.15s"
        }}>
          {loading ? "..." : "Enviar"}
        </button>
      </div>

      {/* Footer hint */}
      <div style={{ fontSize: "9px", color: "rgba(255,255,255,0.2)", textAlign: "center", marginTop: "6px" }}>
        Respostas baseadas exclusivamente nos relatórios Suno cadastrados em Research. Sempre confirme com o relatório original antes de recomendar ao cliente.
      </div>
    </div>
  );
}
