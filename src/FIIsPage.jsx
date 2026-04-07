import { useState, useEffect } from 'react';

/* ── Supabase helpers ── */
var SUPABASE_URL = "https://zjowgamtmfqzievqnrhg.supabase.co";
var SUPABASE_KEY = "sb_publishable_L9M6LKA_YuyygIPs_t1oMA_Z-pF2kGz";

async function fiiGet() {
  var r = await fetch(SUPABASE_URL + "/rest/v1/fii_reports?select=*&order=updated_at.desc", {
    headers: { "apikey": SUPABASE_KEY, "Authorization": "Bearer " + SUPABASE_KEY }
  });
  return r.json();
}
async function fiiInsert(body) {
  return fetch(SUPABASE_URL + "/rest/v1/fii_reports", {
    method: "POST",
    headers: { "apikey": SUPABASE_KEY, "Authorization": "Bearer " + SUPABASE_KEY, "Content-Type": "application/json", "Prefer": "return=minimal" },
    body: JSON.stringify(body)
  });
}
async function fiiUpdate(id, body) {
  return fetch(SUPABASE_URL + "/rest/v1/fii_reports?id=eq." + id, {
    method: "PATCH",
    headers: { "apikey": SUPABASE_KEY, "Authorization": "Bearer " + SUPABASE_KEY, "Content-Type": "application/json", "Prefer": "return=minimal" },
    body: JSON.stringify(body)
  });
}
async function fiiDelete(id) {
  return fetch(SUPABASE_URL + "/rest/v1/fii_reports?id=eq." + id, {
    method: "DELETE",
    headers: { "apikey": SUPABASE_KEY, "Authorization": "Bearer " + SUPABASE_KEY }
  });
}

/* ── Tone helpers ── */
var TONE_OPTIONS = [
  { key: "simples", label: "Simples" },
  { key: "intermediario", label: "Intermediário" },
  { key: "profissional", label: "Profissional" },
];
var TONE_MAP = {
  simples: "TOM SIMPLES: escreva para alguém que nunca investiu. Sem termos técnicos (P/VP, DY, FFO, CRI, spread, duration). Use analogias do dia a dia. Frases curtas.",
  intermediario: "TOM INTERMEDIÁRIO: cliente que investe há alguns anos. Termos populares liberados (dividendo, rendimento, cotação). Termos avançados (DY, P/VP, FFO) explicados brevemente na primeira vez.",
  profissional: "TOM PROFISSIONAL: linguagem técnica completa. Use livremente: DY, P/VP, FFO, ABL, vacância, cap rate, NOI, LTV, CRI, IPCA+, spread, duration, wault. Tom de research institucional.",
};
function getToneInstruction(tone) { return TONE_MAP[tone] || TONE_MAP["intermediario"]; }

function ToneSelector(p) {
  var val = p.value || "intermediario";
  return (
    <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
      <label style={{ fontSize: "9px", color: "rgba(255,255,255,0.4)", whiteSpace: "nowrap" }}>Tom:</label>
      {TONE_OPTIONS.map(function(t) {
        var active = val === t.key;
        return <button key={t.key} onClick={function() { p.onChange(t.key); }}
          style={{ padding: "4px 10px", borderRadius: "14px", border: active ? "1px solid #DC2626" : "1px solid rgba(255,255,255,0.08)", background: active ? "rgba(220,38,38,0.12)" : "transparent", color: active ? "#DC2626" : "rgba(255,255,255,0.35)", fontSize: "9px", fontWeight: active ? 700 : 500, cursor: "pointer" }}>
          {t.label}
        </button>;
      })}
    </div>
  );
}

/* ── Constants ── */
var EMPTY_FORM = { ticker: "", nome: "", periodo: "", raw_text: "", tone: "intermediario" };
var SECTIONS = [
  { key: "resultado_periodo", label: "📊 Resultado do Período" },
  { key: "comentario_gestao", label: "💬 Comentário de Gestão" },
  { key: "vacancia_ocupacao", label: "🏗️ Vacância e Ocupação" },
  { key: "aquisicoes", label: "🔄 Aquisições e Movimentos" },
  { key: "perspectivas", label: "🔭 Perspectivas" },
];

/* ════════════════════════════════════════════════
   MAIN COMPONENT
════════════════════════════════════════════════ */
export default function FIIsPage() {
  var [fiis, setFiis] = useState([]);
  var [loading, setLoading] = useState(true);
  var [mode, setMode] = useState("list"); // list | single | batch
  var [editingFii, setEditingFii] = useState(null);
  var [form, setForm] = useState(EMPTY_FORM);
  var [processing, setProcessing] = useState(false);
  var [expandedId, setExpandedId] = useState(null);
  var [error, setError] = useState("");

  // Batch import state
  var [batchText, setBatchText] = useState("");
  var [batchTone, setBatchTone] = useState("intermediario");
  var [batchPeriodo, setBatchPeriodo] = useState("");
  var [batchLoading, setBatchLoading] = useState(false);
  var [batchProgress, setBatchProgress] = useState("");
  var [batchResults, setBatchResults] = useState(null); // [{ticker, nome, ...}]
  var [batchSaving, setBatchSaving] = useState(false);

  useEffect(function() { loadFiis(); }, []);

  async function loadFiis() {
    setLoading(true);
    try {
      var rows = await fiiGet();
      if (Array.isArray(rows)) setFiis(rows);
    } catch(err) { console.error("[FIIs] load:", err); }
    setLoading(false);
  }

  /* ── Single FII ── */
  function openNew() { setEditingFii(null); setForm(EMPTY_FORM); setError(""); setMode("single"); }
  function openEdit(fii) {
    setEditingFii(fii);
    setForm({ ticker: fii.ticker, nome: fii.nome || "", periodo: fii.periodo || "", raw_text: fii.raw_text || "", tone: fii.tone || "intermediario" });
    setError(""); setMode("single");
  }

  async function processSingle() {
    if (!form.ticker || !form.raw_text) return;
    setProcessing(true); setError("");
    try {
      var prompt = "Você é um analista especialista em Fundos Imobiliários (FIIs).\n\n" +
        getToneInstruction(form.tone) + "\n\n" +
        "FII: " + form.ticker.toUpperCase() +
        (form.nome ? " — " + form.nome : "") +
        (form.periodo ? " | Período: " + form.periodo : "") +
        "\n\nRELATÓRIO:\n" + form.raw_text +
        '\n\nResponda APENAS com JSON válido, sem markdown:\n{"resultado_periodo":"...","comentario_gestao":"...","vacancia_ocupacao":"...","aquisicoes":"...","perspectivas":"..."}\n' +
        'Se alguma seção não estiver no relatório: "Não informado no relatório."';

      var resp = await fetch("/api/anthropic", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 2000, messages: [{ role: "user", content: prompt }] })
      });
      if (!resp.ok) throw new Error("API " + resp.status);
      var d = await resp.json();
      var text = (d.content || []).map(function(c) { return c.text || ""; }).join("").trim();
      text = text.replace(/```json/g, "").replace(/```/g, "").trim();
      var si = text.indexOf("{"); var ei = text.lastIndexOf("}");
      if (si >= 0 && ei > si) text = text.slice(si, ei + 1);
      var extracted = JSON.parse(text);

      var record = {
        ticker: form.ticker.toUpperCase(), nome: form.nome, periodo: form.periodo,
        raw_text: form.raw_text, tone: form.tone,
        resultado_periodo: extracted.resultado_periodo || "",
        comentario_gestao: extracted.comentario_gestao || "",
        vacancia_ocupacao: extracted.vacancia_ocupacao || "",
        aquisicoes: extracted.aquisicoes || "",
        perspectivas: extracted.perspectivas || "",
        updated_at: new Date().toISOString()
      };

      if (editingFii) { await fiiUpdate(editingFii.id, record); }
      else { await fiiInsert(record); }
      await loadFiis();
      setMode("list");
    } catch(err) { console.error("[FIIs] save:", err); setError("Erro: " + err.message); }
    setProcessing(false);
  }

  async function handleDelete(id) {
    if (!window.confirm("Remover este FII?")) return;
    await fiiDelete(id);
    await loadFiis();
  }

  /* ── Batch Import ── */
  async function processBatch() {
    if (!batchText.trim()) return;
    setBatchLoading(true); setBatchProgress("Identificando FIIs no relatório..."); setBatchResults(null); setError("");
    try {
      var toneInst = getToneInstruction(batchTone);
      var periodoInfo = batchPeriodo ? " O período de referência é: " + batchPeriodo + "." : "";

      // Step 1: identify all FIIs in the report
      setBatchProgress("Passo 1/2 — Identificando todos os FIIs mencionados...");
      var identResp = await fetch("/api/anthropic", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{
            role: "user",
            content: "Leia o relatório abaixo e liste TODOS os tickers de FIIs mencionados (formato XXXX11)." +
              " Responda APENAS com JSON: [{\"ticker\":\"BRCO11\",\"nome\":\"Bresco Logística\"}, ...]" +
              " Inclua apenas FIIs com informações substantivas no texto (não apenas citações de passagem).\n\n" +
              "RELATÓRIO:\n" + batchText.slice(0, 20000)
          }]
        })
      });
      if (!identResp.ok) throw new Error("API " + identResp.status);
      var identD = await identResp.json();
      var identRaw = (identD.content || []).map(function(c) { return c.text || ""; }).join("").trim();
      identRaw = identRaw.replace(/```json/g, "").replace(/```/g, "").trim();
      var si = identRaw.indexOf("["); var ei = identRaw.lastIndexOf("]");
      if (si >= 0 && ei > si) identRaw = identRaw.slice(si, ei + 1);
      var identified = JSON.parse(identRaw);

      if (!identified || identified.length === 0) {
        setError("Nenhum FII identificado no texto. Verifique se o conteúdo foi colado corretamente.");
        setBatchLoading(false); setBatchProgress(""); return;
      }

      setBatchProgress("Passo 2/2 — Extraindo dados de " + identified.length + " FIIs...");

      // Step 2: extract data for all FIIs in one call (batch of up to 10)
      var allResults = [];
      var batchSize = 6;
      for (var b = 0; b < identified.length; b += batchSize) {
        var chunk = identified.slice(b, b + batchSize);
        var tickerList = chunk.map(function(f) { return f.ticker + (f.nome ? " (" + f.nome + ")" : ""); }).join(", ");
        setBatchProgress("Extraindo: " + tickerList + "...");

        var extractResp = await fetch("/api/anthropic", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            model: "claude-sonnet-4-20250514",
            max_tokens: 4000,
            messages: [{
              role: "user",
              content: toneInst + periodoInfo +
                "\n\nPara cada FII listado abaixo, extraia do RELATÓRIO as 5 seções solicitadas." +
                " Se uma seção não estiver no relatório, use: \"Não informado neste relatório.\"" +
                "\n\nFIIs para extrair: " + tickerList +
                "\n\nResponda APENAS com JSON puro, sem markdown:\n" +
                '[{"ticker":"XXXX11","nome":"Nome do Fundo","resultado_periodo":"...","comentario_gestao":"...","vacancia_ocupacao":"...","aquisicoes":"...","perspectivas":"..."}]' +
                "\n\nRELATÓRIO:\n" + batchText.slice(0, 25000)
            }]
          })
        });
        if (!extractResp.ok) throw new Error("API " + extractResp.status);
        var extractD = await extractResp.json();
        var extractRaw = (extractD.content || []).map(function(c) { return c.text || ""; }).join("").trim();
        extractRaw = extractRaw.replace(/```json/g, "").replace(/```/g, "").trim();
        var es = extractRaw.indexOf("["); var ee = extractRaw.lastIndexOf("]");
        if (es >= 0 && ee > es) extractRaw = extractRaw.slice(es, ee + 1);
        var extracted = JSON.parse(extractRaw);
        allResults = allResults.concat(extracted);
      }

      setBatchResults(allResults);
      setBatchProgress("");
    } catch(err) {
      console.error("[FIIs batch]", err);
      setError("Erro ao processar: " + err.message);
      setBatchProgress("");
    }
    setBatchLoading(false);
  }

  async function saveBatchResults() {
    if (!batchResults || batchResults.length === 0) return;
    setBatchSaving(true);
    var saved = 0; var updated = 0;
    try {
      for (var i = 0; i < batchResults.length; i++) {
        var r = batchResults[i];
        var existing = null;
        for (var j = 0; j < fiis.length; j++) {
          if (fiis[j].ticker === r.ticker) { existing = fiis[j]; break; }
        }
        var record = {
          ticker: r.ticker,
          nome: r.nome || (existing ? existing.nome : ""),
          periodo: batchPeriodo || (existing ? existing.periodo : ""),
          raw_text: batchText.slice(0, 5000),
          tone: batchTone,
          resultado_periodo: r.resultado_periodo || "",
          comentario_gestao: r.comentario_gestao || "",
          vacancia_ocupacao: r.vacancia_ocupacao || "",
          aquisicoes: r.aquisicoes || "",
          perspectivas: r.perspectivas || "",
          updated_at: new Date().toISOString()
        };
        if (existing) { await fiiUpdate(existing.id, record); updated++; }
        else { await fiiInsert(record); saved++; }
      }
      await loadFiis();
      setBatchText(""); setBatchResults(null); setBatchPeriodo("");
      setMode("list");
      alert(saved + " FIIs adicionados e " + updated + " atualizados com sucesso!");
    } catch(err) {
      console.error("[FIIs batch save]", err);
      setError("Erro ao salvar: " + err.message);
    }
    setBatchSaving(false);
  }

  /* ── Styles ── */
  var iS = { width: "100%", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", padding: "8px 10px", color: "#e2e8f0", fontSize: "12px", outline: "none", boxSizing: "border-box", fontFamily: "inherit" };
  var lS = { fontSize: "10px", fontWeight: 600, color: "rgba(255,255,255,0.5)", marginBottom: "4px", display: "block" };

  /* ════════════ RENDER ════════════ */
  return (
    <div style={{ padding: "20px 24px", maxWidth: "900px" }}>

      {/* ── Header ── */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px", flexWrap: "wrap", gap: "8px" }}>
        <div>
          <h1 style={{ margin: 0, fontSize: "22px", fontWeight: 800, color: "#fff" }}>Fundos Imobiliários</h1>
          <p style={{ margin: "4px 0 0", fontSize: "11px", color: "rgba(255,255,255,0.35)" }}>
            {fiis.length} FII{fiis.length !== 1 ? "s" : ""} cadastrado{fiis.length !== 1 ? "s" : ""}
          </p>
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          <button onClick={function() { setBatchResults(null); setBatchText(""); setError(""); setMode("batch"); }}
            style={{ background: "rgba(251,191,36,0.12)", color: "#fbbf24", border: "1px solid rgba(251,191,36,0.25)", borderRadius: "8px", padding: "8px 16px", fontWeight: 700, fontSize: "11px", cursor: "pointer" }}>
            📋 Importar Relatório Suno
          </button>
          <button onClick={openNew}
            style={{ background: "#DC2626", color: "#fff", border: "none", borderRadius: "8px", padding: "9px 16px", fontWeight: 700, fontSize: "11px", cursor: "pointer" }}>
            + FII Individual
          </button>
        </div>
      </div>

      {/* ── Error ── */}
      {error && <div style={{ background: "rgba(220,38,38,0.1)", border: "1px solid rgba(220,38,38,0.2)", borderRadius: "8px", padding: "10px 14px", marginBottom: "14px", fontSize: "11px", color: "#f87171" }}>{error}</div>}

      {/* ════════════ LIST ════════════ */}
      {mode === "list" && (<div>
        {loading ? (
          <div style={{ textAlign: "center", padding: "60px 0", color: "rgba(255,255,255,0.2)", fontSize: "12px" }}>Carregando...</div>
        ) : fiis.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 0", color: "rgba(255,255,255,0.15)" }}>
            <div style={{ fontSize: "52px", marginBottom: "12px" }}>🏢</div>
            <p style={{ margin: 0, fontSize: "14px", fontWeight: 600 }}>Nenhum FII cadastrado ainda.</p>
            <p style={{ margin: "6px 0 0", fontSize: "11px" }}>Use "Importar Relatório Suno" para processar um relatório completo de uma vez.</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            {fiis.map(function(fii) {
              return <FiiCard key={fii.id} fii={fii} expanded={expandedId === fii.id}
                onToggle={function() { setExpandedId(expandedId === fii.id ? null : fii.id); }}
                onEdit={function() { openEdit(fii); }}
                onDelete={function() { handleDelete(fii.id); }} />;
            })}
          </div>
        )}
      </div>)}

      {/* ════════════ BATCH IMPORT ════════════ */}
      {mode === "batch" && (<div>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
          <button onClick={function() { setMode("list"); setBatchResults(null); setError(""); }}
            style={{ background: "transparent", border: "none", color: "rgba(255,255,255,0.4)", cursor: "pointer", fontSize: "13px", padding: "4px" }}>← Voltar</button>
          <div>
            <div style={{ fontSize: "15px", fontWeight: 800, color: "#fbbf24" }}>Importar Relatório Suno</div>
            <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.35)" }}>Cole o texto completo — a IA identifica e extrai todos os FIIs automaticamente</div>
          </div>
        </div>

        {/* Instructions */}
        <div style={{ background: "rgba(251,191,36,0.04)", border: "1px solid rgba(251,191,36,0.15)", borderRadius: "10px", padding: "12px 16px", marginBottom: "14px", fontSize: "11px", color: "rgba(255,255,255,0.5)", lineHeight: 1.7 }}>
          <strong style={{ color: "#fbbf24" }}>Como funciona:</strong> Cole o texto do relatório Suno FIIs ou Radar de FIIs abaixo.
          A IA detecta todos os FIIs e extrai as 5 seções de cada um em um único processo.
          FIIs já cadastrados serão <strong style={{ color: "rgba(255,255,255,0.7)" }}>atualizados</strong> automaticamente.
        </div>

        {!batchResults && (<div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "12px" }}>
            <div>
              <label style={lS}>Período de Referência</label>
              <input style={iS} placeholder="Ex: Abril 2026 | Suno FIIs #475"
                value={batchPeriodo} onChange={function(e) { setBatchPeriodo(e.target.value); }} />
            </div>
            <div>
              <label style={lS}>Tom da análise</label>
              <ToneSelector value={batchTone} onChange={setBatchTone} />
            </div>
          </div>

          <div style={{ marginBottom: "12px" }}>
            <label style={lS}>
              Texto do Relatório <span style={{ color: "#DC2626" }}>*</span>
              {batchText && <span style={{ color: "rgba(255,255,255,0.2)", fontWeight: 400, marginLeft: "8px" }}>({batchText.length.toLocaleString("pt-BR")} caracteres)</span>}
            </label>
            <textarea style={Object.assign({}, iS, { resize: "vertical", minHeight: "280px", lineHeight: 1.6, fontSize: "11px" })}
              placeholder={"Cole aqui o texto completo do relatório Suno FIIs ou Radar de FIIs...\n\nFunciona com:\n• Suno FIIs #475 (relatório mensal com vários FIIs)\n• Radar de FIIs #470 (relatório gerencial com vários FIIs)\n• Qualquer relatório com múltiplos FIIs"}
              value={batchText}
              onChange={function(e) { setBatchText(e.target.value); setError(""); }} />
          </div>

          <div style={{ display: "flex", gap: "8px" }}>
            <button onClick={function() { setMode("list"); setBatchText(""); setError(""); }}
              style={{ padding: "10px 18px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.1)", background: "transparent", color: "rgba(255,255,255,0.4)", fontSize: "12px", fontWeight: 600, cursor: "pointer" }}>
              Cancelar
            </button>
            <button onClick={processBatch} disabled={batchLoading || !batchText.trim()}
              style={{ flex: 1, padding: "10px 18px", borderRadius: "8px", border: "none",
                background: (batchLoading || !batchText.trim()) ? "rgba(255,255,255,0.05)" : "#fbbf24",
                color: (batchLoading || !batchText.trim()) ? "rgba(255,255,255,0.3)" : "#000",
                fontSize: "12px", fontWeight: 700, cursor: batchLoading ? "wait" : "pointer" }}>
              {batchLoading ? batchProgress || "Processando..." : "🤖 Processar com IA"}
            </button>
          </div>
        </div>)}

        {/* Batch Results Preview */}
        {batchResults && (<div>
          <div style={{ background: "rgba(74,222,128,0.04)", border: "1px solid rgba(74,222,128,0.15)", borderRadius: "10px", padding: "14px 18px", marginBottom: "14px" }}>
            <div style={{ fontSize: "13px", fontWeight: 700, color: "#4ade80", marginBottom: "4px" }}>
              ✓ {batchResults.length} FII{batchResults.length !== 1 ? "s" : ""} identificado{batchResults.length !== 1 ? "s" : ""}
            </div>
            <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.4)" }}>
              Revise abaixo e confirme para salvar todos de uma vez.
              {batchResults.filter(function(r) { return fiis.some(function(f) { return f.ticker === r.ticker; }); }).length > 0 &&
                <span style={{ color: "#fbbf24", marginLeft: "8px" }}>
                  ⚠ {batchResults.filter(function(r) { return fiis.some(function(f) { return f.ticker === r.ticker; }); }).length} já existem e serão atualizados
                </span>
              }
            </div>
          </div>

          {/* Preview cards */}
          <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginBottom: "14px", maxHeight: "500px", overflowY: "auto" }}>
            {batchResults.map(function(r, idx) {
              var isExisting = fiis.some(function(f) { return f.ticker === r.ticker; });
              return (
                <div key={idx} style={{ background: "#111", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.06)", overflow: "hidden" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 14px" }}>
                    <span style={{ background: "rgba(220,38,38,0.12)", color: "#DC2626", fontWeight: 800, fontSize: "12px", padding: "3px 10px", borderRadius: "7px", border: "1px solid rgba(220,38,38,0.2)" }}>{r.ticker}</span>
                    <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.6)", flex: 1 }}>{r.nome}</span>
                    {isExisting
                      ? <span style={{ fontSize: "8px", padding: "2px 8px", borderRadius: "10px", background: "rgba(251,191,36,0.1)", color: "#fbbf24", fontWeight: 700 }}>ATUALIZAR</span>
                      : <span style={{ fontSize: "8px", padding: "2px 8px", borderRadius: "10px", background: "rgba(74,222,128,0.1)", color: "#4ade80", fontWeight: 700 }}>NOVO</span>
                    }
                  </div>
                  {/* Quick preview of extracted data */}
                  <div style={{ borderTop: "1px solid rgba(255,255,255,0.04)", padding: "8px 14px" }}>
                    {r.resultado_periodo && r.resultado_periodo !== "Não informado neste relatório." && (
                      <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.4)", lineHeight: 1.5 }}>
                        <span style={{ color: "rgba(255,255,255,0.25)", fontWeight: 600 }}>📊 </span>
                        {r.resultado_periodo.slice(0, 150)}{r.resultado_periodo.length > 150 ? "..." : ""}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ display: "flex", gap: "8px" }}>
            <button onClick={function() { setBatchResults(null); setError(""); }}
              style={{ padding: "10px 18px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.1)", background: "transparent", color: "rgba(255,255,255,0.4)", fontSize: "12px", fontWeight: 600, cursor: "pointer" }}>
              ← Refazer
            </button>
            <button onClick={saveBatchResults} disabled={batchSaving}
              style={{ flex: 1, padding: "10px 18px", borderRadius: "8px", border: "none",
                background: batchSaving ? "rgba(74,222,128,0.2)" : "#16a34a",
                color: batchSaving ? "rgba(255,255,255,0.3)" : "#fff",
                fontSize: "12px", fontWeight: 700, cursor: batchSaving ? "wait" : "pointer" }}>
              {batchSaving ? "Salvando..." : "✓ Salvar todos (" + batchResults.length + " FIIs)"}
            </button>
          </div>
        </div>)}
      </div>)}

      {/* ════════════ SINGLE FII ════════════ */}
      {mode === "single" && (<div>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
          <button onClick={function() { setMode("list"); setError(""); }}
            style={{ background: "transparent", border: "none", color: "rgba(255,255,255,0.4)", cursor: "pointer", fontSize: "13px", padding: "4px" }}>← Voltar</button>
          <div style={{ fontSize: "15px", fontWeight: 800, color: "#fff" }}>{editingFii ? "Atualizar " + editingFii.ticker : "Adicionar FII Individual"}</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "12px", background: "#111", borderRadius: "12px", padding: "20px", border: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div><label style={lS}>Ticker *</label><input style={iS} placeholder="KNRI11" value={form.ticker} onChange={function(e) { setForm(Object.assign({}, form, { ticker: e.target.value.toUpperCase() })); }} /></div>
            <div><label style={lS}>Nome do Fundo</label><input style={iS} placeholder="Kinea Renda Imobiliária" value={form.nome} onChange={function(e) { setForm(Object.assign({}, form, { nome: e.target.value })); }} /></div>
          </div>
          <div><label style={lS}>Período de Referência</label><input style={iS} placeholder="Ex: Março 2025 | 4T24" value={form.periodo} onChange={function(e) { setForm(Object.assign({}, form, { periodo: e.target.value })); }} /></div>
          <div><label style={lS}>Tom da Análise</label><ToneSelector value={form.tone} onChange={function(t) { setForm(Object.assign({}, form, { tone: t })); }} /></div>
          <div>
            <label style={lS}>Texto do Relatório *</label>
            <textarea style={Object.assign({}, iS, { resize: "vertical", minHeight: "220px", lineHeight: 1.6 })}
              placeholder="Cole aqui o texto do relatório deste FII específico..."
              value={form.raw_text}
              onChange={function(e) { setForm(Object.assign({}, form, { raw_text: e.target.value })); setError(""); }} />
            {form.raw_text && <p style={{ margin: "4px 0 0", fontSize: "9px", color: "rgba(255,255,255,0.2)" }}>{form.raw_text.length.toLocaleString("pt-BR")} caracteres</p>}
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            <button onClick={function() { setMode("list"); setError(""); }} style={{ padding: "9px 20px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.1)", background: "transparent", color: "rgba(255,255,255,0.5)", fontSize: "12px", fontWeight: 600, cursor: "pointer" }}>Cancelar</button>
            <button onClick={processSingle} disabled={processing || !form.ticker.trim() || !form.raw_text.trim()}
              style={{ flex: 1, padding: "9px 22px", borderRadius: "8px", border: "none", background: (!processing && form.ticker.trim() && form.raw_text.trim()) ? "#DC2626" : "rgba(255,255,255,0.05)", color: (!processing && form.ticker.trim() && form.raw_text.trim()) ? "#fff" : "rgba(255,255,255,0.3)", fontSize: "12px", fontWeight: 700, cursor: processing ? "wait" : "pointer" }}>
              {processing ? "⏳ Processando..." : editingFii ? "✓ Atualizar" : "✨ Processar e Salvar"}
            </button>
          </div>
        </div>
      </div>)}
    </div>
  );
}

/* ── FII Card ── */
function FiiCard(p) {
  var fii = p.fii;
  return (
    <div style={{ background: "#111", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.06)", overflow: "hidden" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", cursor: "pointer" }} onClick={p.onToggle}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
          <span style={{ background: "rgba(220,38,38,0.12)", color: "#DC2626", fontWeight: 800, fontSize: "13px", padding: "4px 10px", borderRadius: "8px", border: "1px solid rgba(220,38,38,0.2)" }}>{fii.ticker}</span>
          {fii.nome && <span style={{ fontSize: "12px", fontWeight: 600, color: "rgba(255,255,255,0.7)" }}>{fii.nome}</span>}
          {fii.periodo && <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.3)", background: "rgba(255,255,255,0.04)", padding: "2px 8px", borderRadius: "6px" }}>{fii.periodo}</span>}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "4px", flexShrink: 0 }}>
          <button onClick={function(e) { e.stopPropagation(); p.onEdit(); }} style={{ background: "transparent", border: "none", color: "rgba(255,255,255,0.3)", cursor: "pointer", padding: "4px 6px" }}>✏️</button>
          <button onClick={function(e) { e.stopPropagation(); p.onDelete(); }} style={{ background: "transparent", border: "none", color: "rgba(255,255,255,0.3)", cursor: "pointer", padding: "4px 6px" }}>🗑️</button>
          <span style={{ color: "rgba(255,255,255,0.2)", fontSize: "11px", marginLeft: "2px" }}>{p.expanded ? "▲" : "▼"}</span>
        </div>
      </div>
      {p.expanded && (
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
          {SECTIONS.map(function(sec) {
            return (
              <div key={sec.key} style={{ padding: "14px 18px", borderBottom: "1px solid rgba(255,255,255,0.03)" }}>
                <p style={{ margin: "0 0 6px", fontSize: "9px", fontWeight: 700, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "1.2px" }}>{sec.label}</p>
                <p style={{ margin: 0, fontSize: "12px", color: "rgba(255,255,255,0.65)", lineHeight: 1.65, whiteSpace: "pre-wrap" }}>{fii[sec.key] || "—"}</p>
              </div>
            );
          })}
          <div style={{ padding: "8px 18px", textAlign: "right" }}>
            <span style={{ fontSize: "9px", color: "rgba(255,255,255,0.15)" }}>Tom: {fii.tone} · Atualizado: {new Date(fii.updated_at).toLocaleDateString("pt-BR")}</span>
          </div>
        </div>
      )}
    </div>
  );
}
