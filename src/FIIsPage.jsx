import { useState, useEffect, useRef } from 'react';

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

/* ── Load Carteiras from localStorage ── */
function loadCarteirasLocal() {
  try {
    var s = localStorage.getItem("tt-carteiras-suno");
    if (s) return JSON.parse(s);
  } catch(e) {}
  return { carteiras: [], ativos: {} };
}

/* ── Tone helpers ── */
var TONE_OPTIONS = [
  { key: "simples", label: "Simples" },
  { key: "intermediario", label: "Intermediário" },
  { key: "profissional", label: "Profissional" },
];
var TONE_MAP = {
  simples: "TOM SIMPLES: escreva para alguém que nunca investiu. Sem termos técnicos (P/VP, DY, FFO, CRI, spread). Use analogias do dia a dia. Frases curtas.",
  intermediario: "TOM INTERMEDIÁRIO: cliente com noções básicas. Termos populares liberados (dividendo, rendimento, cotação). Termos avançados (DY, P/VP, FFO) explicados brevemente.",
  profissional: "TOM PROFISSIONAL: linguagem técnica completa. Use livremente: DY, P/VP, FFO, ABL, vacância, cap rate, NOI, LTV, CRI, IPCA+, spread, duration, wault.",
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

var EMPTY_FORM = { ticker: "", nome: "", periodo: "", raw_text: "", tone: "intermediario" };
var SECTIONS = [
  { key: "resultado_periodo", label: "📊 Resultado do Período" },
  { key: "comentario_gestao", label: "💬 Comentário de Gestão" },
  { key: "vacancia_ocupacao", label: "🏗️ Vacância e Ocupação" },
  { key: "aquisicoes", label: "🔄 Aquisições e Movimentos" },
  { key: "perspectivas", label: "🔭 Perspectivas" },
];

/* ════════════════════════════════════════════
   MAIN COMPONENT
════════════════════════════════════════════ */
export default function FIIsPage() {
  var [fiis, setFiis] = useState([]);
  var [loading, setLoading] = useState(true);
  var [mainTab, setMainTab] = useState("carteira"); // carteira | todos | import
  var [mode, setMode] = useState("list"); // list | single | batch (within import tab)
  var [editingFii, setEditingFii] = useState(null);
  var [form, setForm] = useState(EMPTY_FORM);
  var [processing, setProcessing] = useState(false);
  var [expandedId, setExpandedId] = useState(null);
  var [error, setError] = useState("");

  // Carteiras data
  var [carteirasData, setCarteirasData] = useState(function() { return loadCarteirasLocal(); });

  // Batch import state
  var [batchText, setBatchText] = useState("");
  var [batchFileName, setBatchFileName] = useState("");
  var [batchIsBase64, setBatchIsBase64] = useState(false);
  var [batchTone, setBatchTone] = useState("intermediario");
  var [batchPeriodo, setBatchPeriodo] = useState("");
  var [batchLoading, setBatchLoading] = useState(false);
  var [batchProgress, setBatchProgress] = useState("");
  var [batchResults, setBatchResults] = useState(null);
  var [batchSaving, setBatchSaving] = useState(false);
  var pdfRef = useRef(null);

  useEffect(function() { loadFiis(); }, []);

  async function loadFiis() {
    setLoading(true);
    try {
      var rows = await fiiGet();
      if (Array.isArray(rows)) setFiis(rows);
    } catch(err) { console.error("[FIIs] load:", err); }
    setLoading(false);
  }

  /* ── Build FII list from Carteiras ── */
  function getCarteiraFIIs() {
    var result = [];
    var carts = carteirasData.carteiras || [];
    var ativos = carteirasData.ativos || {};
    carts.forEach(function(cart) {
      var items = ativos[cart.id] || [];
      items.forEach(function(a) {
        // Only FIIs: tickers ending in 11
        if (/11$/.test(a.ticker)) {
          var report = null;
          for (var i = 0; i < fiis.length; i++) {
            if (fiis[i].ticker === a.ticker) { report = fiis[i]; break; }
          }
          result.push({
            ticker: a.ticker,
            nome: a.name || "",
            rank: a.rank,
            precoTeto: a.precoTeto,
            vies: a.vies || "Comprar",
            carteira: cart.name,
            carteiraIntl: cart.intl,
            report: report
          });
        }
      });
    });
    result.sort(function(a, b) { return (a.rank || 999) - (b.rank || 999); });
    return result;
  }

  /* ── Single FII ── */
  function openNew() { setEditingFii(null); setForm(EMPTY_FORM); setError(""); setMode("single"); setMainTab("import"); }
  function openEdit(fii) {
    setEditingFii(fii);
    setForm({ ticker: fii.ticker, nome: fii.nome || "", periodo: fii.periodo || "", raw_text: fii.raw_text || "", tone: fii.tone || "intermediario" });
    setError(""); setMode("single"); setMainTab("import");
  }

  async function processSingle() {
    if (!form.ticker || !form.raw_text) return;
    setProcessing(true); setError("");
    try {
      var prompt = "Você é um analista especialista em Fundos Imobiliários.\n\n" +
        getToneInstruction(form.tone) + "\n\n" +
        "FII: " + form.ticker.toUpperCase() +
        (form.nome ? " — " + form.nome : "") +
        (form.periodo ? " | Período: " + form.periodo : "") +
        "\n\nRELATÓRIO:\n" + form.raw_text +
        '\n\nResponda APENAS com JSON:\n{"resultado_periodo":"...","comentario_gestao":"...","vacancia_ocupacao":"...","aquisicoes":"...","perspectivas":"..."}\n' +
        'Seção ausente: "Não informado no relatório."';

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
      setMode("list"); setMainTab("todos");
    } catch(err) { setError("Erro: " + err.message); }
    setProcessing(false);
  }

  async function handleDelete(id) {
    if (!window.confirm("Remover este FII?")) return;
    await fiiDelete(id);
    await loadFiis();
  }

  /* ── PDF Upload ── */
  function handlePdfUpload(e) {
    var f = e.target.files[0];
    if (!f) return;
    setBatchFileName(f.name);
    setError("");
    var reader = new FileReader();
    reader.onload = function() {
      var base64 = reader.result.split(",")[1];
      setBatchText(base64);
      setBatchIsBase64(true);
    };
    reader.onerror = function() { setError("Erro ao ler o PDF."); };
    reader.readAsDataURL(f);
  }

  function clearFile() {
    setBatchText(""); setBatchFileName(""); setBatchIsBase64(false);
    setBatchResults(null); setError("");
    if (pdfRef.current) pdfRef.current.value = "";
  }

  /* ── Batch Process ── */
  async function processBatch() {
    if (!batchText.trim() && !batchIsBase64) return;
    setBatchLoading(true); setBatchProgress("Identificando FIIs..."); setBatchResults(null); setError("");
    try {
      var toneInst = getToneInstruction(batchTone);
      var periodoInfo = batchPeriodo ? " Período: " + batchPeriodo + "." : "";

      // Sanitize and truncate text to avoid API 400
      function sanitize(txt) {
        return txt.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, " ").replace(/\s+/g, " ").trim();
      }
      var cleanText = batchIsBase64 ? batchText : sanitize(batchText).slice(0, 18000);

      var buildMessages = function(content) {
        if (batchIsBase64) {
          return [{ role: "user", content: [
            { type: "document", source: { type: "base64", media_type: "application/pdf", data: cleanText } },
            { type: "text", text: content }
          ]}];
        }
        return [{ role: "user", content: content + "\n\nRELATÓRIO:\n" + cleanText }];
      };

      // Step 1: identify FIIs
      setBatchProgress("Passo 1/2 — Identificando FIIs no documento...");
      var identResp = await fetch("/api/anthropic", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514", max_tokens: 800,
          messages: buildMessages(
            "Liste os tickers de FIIs (formato XXXX11) com informações substantivas neste documento." +
            " Responda APENAS com JSON: [{\"ticker\":\"BRCO11\",\"nome\":\"Bresco\"}]"
          )
        })
      });
      if (!identResp.ok) {
        var errBody = await identResp.text().catch(function(){return "";});
        throw new Error("API " + identResp.status + (errBody ? ": " + errBody.slice(0,200) : ""));
      }
      var identD = await identResp.json();
      var identRaw = (identD.content || []).map(function(c) { return c.text || ""; }).join("").trim();
      identRaw = identRaw.replace(/```json/g, "").replace(/```/g, "").trim();
      var si2 = identRaw.indexOf("["); var ei2 = identRaw.lastIndexOf("]");
      if (si2 >= 0 && ei2 > si2) identRaw = identRaw.slice(si2, ei2 + 1);
      var identified = JSON.parse(identRaw);

      if (!identified || identified.length === 0) {
        setError("Nenhum FII identificado. Verifique se o conteúdo foi colado corretamente.");
        setBatchLoading(false); setBatchProgress(""); return;
      }

      setBatchProgress("Identificados " + identified.length + " FIIs: " + identified.slice(0,5).map(function(f){return f.ticker;}).join(", ") + (identified.length > 5 ? "..." : ""));

      // Step 2: extract data in batches of 4 (smaller to avoid 400)
      var allResults = [];
      var batchSize = 4;
      for (var b = 0; b < identified.length; b += batchSize) {
        var chunk = identified.slice(b, b + batchSize);
        var tickerList = chunk.map(function(f) { return f.ticker + (f.nome ? " (" + f.nome + ")" : ""); }).join(", ");
        setBatchProgress("Extraindo " + (b + 1) + "-" + Math.min(b + batchSize, identified.length) + "/" + identified.length + ": " + tickerList + "...");

        // Keep extraction prompt concise to avoid 400
        var extractContent = "Tom: " + toneInst.slice(0, 300) + periodoInfo +
          "\n\nExtraia para cada FII: resultado_periodo, comentario_gestao, vacancia_ocupacao, aquisicoes, perspectivas." +
          " Seção ausente: \"Não informado.\"" +
          "\n\nFIIs: " + tickerList +
          '\n\nJSON APENAS:\n[{"ticker":"","nome":"","resultado_periodo":"","comentario_gestao":"","vacancia_ocupacao":"","aquisicoes":"","perspectivas":""}]';

        var extractResp = await fetch("/api/anthropic", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            model: "claude-sonnet-4-20250514", max_tokens: 3000,
            messages: buildMessages(extractContent)
          })
        });
        if (!extractResp.ok) {
          var eb = await extractResp.text().catch(function(){return "";});
          throw new Error("API " + extractResp.status + " ao extrair " + tickerList + (eb ? ": " + eb.slice(0,150) : ""));
        }
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
      setError("Erro: " + err.message);
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
          ticker: r.ticker, nome: r.nome || (existing ? existing.nome : ""),
          periodo: batchPeriodo || (existing ? existing.periodo : ""),
          raw_text: batchIsBase64 ? "[PDF: " + batchFileName + "]" : batchText.slice(0, 3000),
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
      setBatchText(""); setBatchFileName(""); setBatchIsBase64(false);
      setBatchResults(null); setBatchPeriodo("");
      if (pdfRef.current) pdfRef.current.value = "";
      setMainTab("todos"); setMode("list");
      alert(saved + " FIIs adicionados e " + updated + " atualizados!");
    } catch(err) { setError("Erro ao salvar: " + err.message); }
    setBatchSaving(false);
  }

  /* ── Styles ── */
  var iS = { width: "100%", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", padding: "8px 10px", color: "#e2e8f0", fontSize: "12px", outline: "none", boxSizing: "border-box", fontFamily: "inherit" };
  var lS = { fontSize: "10px", fontWeight: 600, color: "rgba(255,255,255,0.5)", marginBottom: "4px", display: "block" };
  var viesColors = { "Comprar": "#4ade80", "Aguardar": "#fbbf24", "Vender": "#f87171" };

  var carteiraFIIs = getCarteiraFIIs();
  var fiisComRelatorio = carteiraFIIs.filter(function(f) { return !!f.report; }).length;

  /* ════════════ RENDER ════════════ */
  return (
    <div style={{ padding: "20px 24px", maxWidth: "960px" }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px", flexWrap: "wrap", gap: "8px" }}>
        <div>
          <h1 style={{ margin: 0, fontSize: "22px", fontWeight: 800, color: "#fff" }}>Fundos Imobiliários</h1>
          <p style={{ margin: "4px 0 0", fontSize: "11px", color: "rgba(255,255,255,0.35)" }}>
            {carteiraFIIs.length} na carteira recomendada · {fiis.length} com relatório importado
          </p>
        </div>
      </div>

      {/* Main tabs */}
      <div style={{ display: "flex", gap: "2px", borderBottom: "1px solid rgba(255,255,255,0.06)", marginBottom: "20px" }}>
        {[
          { k: "carteira", l: "Carteira Recomendada", badge: carteiraFIIs.length },
          { k: "todos", l: "Todos os Relatórios", badge: fiis.length },
          { k: "import", l: "Importar Relatório", badge: null },
        ].map(function(t) {
          var active = mainTab === t.k;
          return <button key={t.k} onClick={function() { setMainTab(t.k); if (t.k !== "import") setMode("list"); }}
            style={{ padding: "9px 16px", border: "none", cursor: "pointer", fontSize: "11px", fontWeight: 700, borderRadius: "7px 7px 0 0", background: active ? "rgba(220,38,38,0.12)" : "transparent", color: active ? "#DC2626" : "rgba(255,255,255,0.4)", borderBottom: active ? "2px solid #DC2626" : "2px solid transparent", display: "flex", alignItems: "center", gap: "6px" }}>
            {t.l}
            {t.badge !== null && <span style={{ fontSize: "9px", padding: "1px 6px", borderRadius: "10px", background: active ? "rgba(220,38,38,0.2)" : "rgba(255,255,255,0.06)", color: active ? "#DC2626" : "rgba(255,255,255,0.3)", fontWeight: 700 }}>{t.badge}</span>}
          </button>;
        })}
      </div>

      {error && <div style={{ background: "rgba(220,38,38,0.1)", border: "1px solid rgba(220,38,38,0.2)", borderRadius: "8px", padding: "10px 14px", marginBottom: "14px", fontSize: "11px", color: "#f87171" }}>{error}</div>}

      {/* ════════ TAB: CARTEIRA RECOMENDADA ════════ */}
      {mainTab === "carteira" && (<div>
        {carteiraFIIs.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 0", color: "rgba(255,255,255,0.15)" }}>
            <div style={{ fontSize: "40px", marginBottom: "10px" }}>📋</div>
            <p style={{ margin: 0, fontSize: "13px", fontWeight: 600 }}>Nenhum FII encontrado nas Carteiras Suno.</p>
            <p style={{ margin: "6px 0 0", fontSize: "11px" }}>Adicione FIIs (tickers terminados em 11) no módulo <strong>Carteiras Suno</strong> no menu Research.</p>
          </div>
        ) : (<div>
          <div style={{ marginBottom: "12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.3)" }}>
              {fiisComRelatorio} de {carteiraFIIs.length} com relatório importado
            </div>
            <button onClick={function() { setMainTab("import"); setMode("batch"); }}
              style={{ fontSize: "10px", padding: "5px 12px", borderRadius: "7px", border: "1px solid rgba(251,191,36,0.2)", background: "rgba(251,191,36,0.08)", color: "#fbbf24", cursor: "pointer", fontWeight: 600 }}>
              + Importar Relatório
            </button>
          </div>

          {/* Group by carteira */}
          {(function() {
            var groups = {};
            carteiraFIIs.forEach(function(f) {
              if (!groups[f.carteira]) groups[f.carteira] = [];
              groups[f.carteira].push(f);
            });
            return Object.keys(groups).map(function(cartName) {
              return (
                <div key={cartName} style={{ marginBottom: "20px" }}>
                  <div style={{ fontSize: "10px", fontWeight: 700, color: "#DC2626", textTransform: "uppercase", letterSpacing: "1.2px", marginBottom: "8px", display: "flex", alignItems: "center", gap: "8px" }}>
                    {cartName}
                    <span style={{ fontSize: "9px", color: "rgba(255,255,255,0.2)", fontWeight: 400, textTransform: "none", letterSpacing: 0 }}>{groups[cartName].length} FII{groups[cartName].length !== 1 ? "s" : ""}</span>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                    {groups[cartName].map(function(f) {
                      var hasReport = !!f.report;
                      var isExpanded = expandedId === f.ticker + "_cart";
                      var vc = viesColors[f.vies] || "#94a3b8";
                      return (
                        <div key={f.ticker} style={{ background: "#111", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.06)", overflow: "hidden" }}>
                          {/* Card header */}
                          <div style={{ display: "flex", alignItems: "center", padding: "10px 14px", gap: "10px", cursor: hasReport ? "pointer" : "default" }}
                            onClick={function() { if (hasReport) setExpandedId(isExpanded ? null : f.ticker + "_cart"); }}>
                            {/* Rank */}
                            {f.rank && <span style={{ fontSize: "10px", fontWeight: 800, color: "rgba(255,255,255,0.25)", width: "24px", flexShrink: 0 }}>#{f.rank}</span>}
                            {/* Ticker */}
                            <span style={{ background: "rgba(220,38,38,0.1)", color: "#DC2626", fontWeight: 800, fontSize: "12px", padding: "3px 9px", borderRadius: "7px", border: "1px solid rgba(220,38,38,0.2)", flexShrink: 0 }}>{f.ticker}</span>
                            {/* Nome */}
                            <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.6)", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{f.nome || f.report?.nome || ""}</span>
                            {/* Preço-teto */}
                            {f.precoTeto && <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.35)", flexShrink: 0 }}>Teto: R$ {Number(f.precoTeto).toFixed(2)}</span>}
                            {/* Viés */}
                            <span style={{ fontSize: "9px", padding: "2px 8px", borderRadius: "10px", background: vc + "18", color: vc, border: "1px solid " + vc + "33", fontWeight: 700, flexShrink: 0 }}>{f.vies}</span>
                            {/* Report status */}
                            {hasReport
                              ? <span style={{ fontSize: "8px", padding: "2px 7px", borderRadius: "10px", background: "rgba(74,222,128,0.1)", color: "#4ade80", fontWeight: 700, flexShrink: 0 }}>✓ Relatório</span>
                              : <button onClick={function(e) { e.stopPropagation(); setMainTab("import"); setMode("single"); setForm(Object.assign({}, EMPTY_FORM, { ticker: f.ticker, nome: f.nome || "" })); setEditingFii(null); }}
                                  style={{ fontSize: "8px", padding: "2px 7px", borderRadius: "10px", background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.25)", border: "1px solid rgba(255,255,255,0.08)", cursor: "pointer", fontWeight: 600, flexShrink: 0 }}>
                                  + Adicionar
                                </button>
                            }
                            {hasReport && <span style={{ color: "rgba(255,255,255,0.2)", fontSize: "10px" }}>{isExpanded ? "▲" : "▼"}</span>}
                          </div>

                          {/* Expanded report */}
                          {hasReport && isExpanded && f.report && (
                            <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                              {/* Report period + edit */}
                              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 14px", background: "rgba(255,255,255,0.02)" }}>
                                <span style={{ fontSize: "9px", color: "rgba(255,255,255,0.25)" }}>
                                  {f.report.periodo && "Período: " + f.report.periodo + " · "}
                                  Atualizado: {new Date(f.report.updated_at).toLocaleDateString("pt-BR")}
                                </span>
                                <button onClick={function() { openEdit(f.report); }}
                                  style={{ fontSize: "9px", color: "rgba(255,255,255,0.3)", background: "transparent", border: "none", cursor: "pointer", padding: "2px 6px" }}>✏️ Editar</button>
                              </div>
                              {SECTIONS.map(function(sec) {
                                if (!f.report[sec.key] || f.report[sec.key] === "Não informado neste relatório." || f.report[sec.key] === "Não informado no relatório.") return null;
                                return (
                                  <div key={sec.key} style={{ padding: "12px 16px", borderBottom: "1px solid rgba(255,255,255,0.03)" }}>
                                    <p style={{ margin: "0 0 5px", fontSize: "9px", fontWeight: 700, color: "rgba(255,255,255,0.35)", textTransform: "uppercase", letterSpacing: "1px" }}>{sec.label}</p>
                                    <p style={{ margin: 0, fontSize: "11.5px", color: "rgba(255,255,255,0.65)", lineHeight: 1.65 }}>{f.report[sec.key]}</p>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            });
          })()}
        </div>)}
      </div>)}

      {/* ════════ TAB: TODOS OS RELATÓRIOS ════════ */}
      {mainTab === "todos" && (<div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
          <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.3)" }}>{fiis.length} relatório{fiis.length !== 1 ? "s" : ""} importado{fiis.length !== 1 ? "s" : ""}</span>
          <button onClick={openNew} style={{ fontSize: "10px", padding: "5px 12px", borderRadius: "7px", border: "none", background: "#DC2626", color: "#fff", cursor: "pointer", fontWeight: 600 }}>+ FII Individual</button>
        </div>
        {loading ? (
          <div style={{ textAlign: "center", padding: "60px 0", color: "rgba(255,255,255,0.2)", fontSize: "12px" }}>Carregando...</div>
        ) : fiis.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 0", color: "rgba(255,255,255,0.15)" }}>
            <div style={{ fontSize: "40px", marginBottom: "10px" }}>🏢</div>
            <p style={{ margin: 0, fontSize: "13px" }}>Nenhum relatório importado ainda.</p>
            <p style={{ margin: "6px 0 0", fontSize: "11px" }}>Use a aba "Importar Relatório" para processar um relatório Suno.</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
            {fiis.map(function(fii) {
              return <FiiCard key={fii.id} fii={fii} expanded={expandedId === fii.id}
                onToggle={function() { setExpandedId(expandedId === fii.id ? null : fii.id); }}
                onEdit={function() { openEdit(fii); }}
                onDelete={function() { handleDelete(fii.id); }} />;
            })}
          </div>
        )}
      </div>)}

      {/* ════════ TAB: IMPORTAR ════════ */}
      {mainTab === "import" && (<div>

        {/* Sub-mode tabs */}
        {mode === "list" && (<div>
          <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
            <button onClick={function() { setMode("batch"); setBatchResults(null); setBatchText(""); setBatchFileName(""); setBatchIsBase64(false); setError(""); }}
              style={{ flex: 1, padding: "14px", borderRadius: "10px", border: "1px solid rgba(251,191,36,0.2)", background: "rgba(251,191,36,0.05)", cursor: "pointer", textAlign: "left" }}>
              <div style={{ fontSize: "13px", fontWeight: 700, color: "#fbbf24", marginBottom: "4px" }}>📋 Relatório Completo</div>
              <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.4)", lineHeight: 1.5 }}>Cole texto ou envie PDF — a IA detecta e extrai todos os FIIs automaticamente<br/><span style={{ color: "rgba(251,191,36,0.5)" }}>Ideal para: Suno FIIs #475, Radar de FIIs #470</span></div>
            </button>
            <button onClick={function() { setMode("single"); setEditingFii(null); setForm(EMPTY_FORM); setError(""); }}
              style={{ flex: 1, padding: "14px", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.02)", cursor: "pointer", textAlign: "left" }}>
              <div style={{ fontSize: "13px", fontWeight: 700, color: "rgba(255,255,255,0.7)", marginBottom: "4px" }}>🏢 FII Individual</div>
              <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.35)", lineHeight: 1.5 }}>Adicione ou atualize um FII específico com seu próprio texto ou relatório gerencial individual</div>
            </button>
          </div>
        </div>)}

        {/* ── Batch ── */}
        {mode === "batch" && (<div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px" }}>
            <button onClick={function() { setMode("list"); setBatchResults(null); setError(""); }}
              style={{ background: "transparent", border: "none", color: "rgba(255,255,255,0.4)", cursor: "pointer", fontSize: "13px" }}>←</button>
            <div>
              <div style={{ fontSize: "14px", fontWeight: 800, color: "#fbbf24" }}>Importar Relatório Completo</div>
              <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.3)" }}>Cole o texto ou envie o PDF — todos os FIIs serão extraídos de uma vez</div>
            </div>
          </div>

          {/* PDF note */}
          <div style={{ background: "rgba(96,165,250,0.04)", border: "1px solid rgba(96,165,250,0.12)", borderRadius: "8px", padding: "10px 14px", marginBottom: "12px", fontSize: "10px", color: "rgba(255,255,255,0.4)", lineHeight: 1.6 }}>
            <strong style={{ color: "#60a5fa" }}>📄 Sobre PDFs com gráficos:</strong> A IA lê o texto e os valores dos gráficos (ex: 0,94 P/VP, 10,99% DY), mas não interpreta as curvas históricas visualmente. Para relatórios majoritariamente visuais como o Suno FIIs #475, o texto colado tende a funcionar melhor. Para o <strong style={{ color: "rgba(255,255,255,0.6)" }}>Radar de FIIs</strong> (texto estruturado), o PDF funciona muito bem.
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

            {/* Input: text or PDF */}
            <div style={{ marginBottom: "12px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                <label style={lS}>Conteúdo do Relatório *</label>
                <label style={{ fontSize: "10px", padding: "4px 12px", borderRadius: "7px", border: "1px solid rgba(96,165,250,0.2)", background: "rgba(96,165,250,0.06)", color: "#60a5fa", cursor: "pointer", fontWeight: 600 }}>
                  {batchFileName ? "📄 " + batchFileName : "📤 Upload PDF"}
                  <input ref={pdfRef} type="file" accept=".pdf" onChange={handlePdfUpload} style={{ display: "none" }} />
                </label>
              </div>

              {batchIsBase64 ? (
                <div style={{ background: "rgba(96,165,250,0.06)", border: "1px solid rgba(96,165,250,0.15)", borderRadius: "8px", padding: "16px", textAlign: "center" }}>
                  <div style={{ fontSize: "28px", marginBottom: "6px" }}>📄</div>
                  <div style={{ fontSize: "12px", fontWeight: 700, color: "#60a5fa", marginBottom: "4px" }}>{batchFileName}</div>
                  <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.35)", marginBottom: "10px" }}>PDF carregado e pronto para processamento</div>
                  <button onClick={clearFile} style={{ fontSize: "10px", padding: "4px 12px", borderRadius: "6px", border: "1px solid rgba(248,113,113,0.2)", background: "transparent", color: "rgba(248,113,113,0.6)", cursor: "pointer" }}>Remover</button>
                </div>
              ) : (
                <textarea style={Object.assign({}, iS, { resize: "vertical", minHeight: "260px", lineHeight: 1.6, fontSize: "11px" })}
                  placeholder={"Cole aqui o texto completo do relatório Suno FIIs ou Radar de FIIs...\n\nFunciona com:\n• Suno FIIs #475 (relatório com vários FIIs)\n• Radar de FIIs #470 (relatório gerencial)\n• Qualquer relatório com múltiplos FIIs\n\nOu use o botão 'Upload PDF' acima"}
                  value={batchText}
                  onChange={function(e) { setBatchText(e.target.value); setError(""); }} />
              )}
              {!batchIsBase64 && batchText && <p style={{ margin: "4px 0 0", fontSize: "9px", color: "rgba(255,255,255,0.2)" }}>{batchText.length.toLocaleString("pt-BR")} caracteres</p>}
            </div>

            <div style={{ display: "flex", gap: "8px" }}>
              <button onClick={function() { setMode("list"); clearFile(); }}
                style={{ padding: "10px 18px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.1)", background: "transparent", color: "rgba(255,255,255,0.4)", fontSize: "12px", fontWeight: 600, cursor: "pointer" }}>
                Cancelar
              </button>
              <button onClick={processBatch} disabled={batchLoading || (!batchText.trim() && !batchIsBase64)}
                style={{ flex: 1, padding: "10px 18px", borderRadius: "8px", border: "none",
                  background: (batchLoading || (!batchText.trim() && !batchIsBase64)) ? "rgba(255,255,255,0.05)" : "#fbbf24",
                  color: (batchLoading || (!batchText.trim() && !batchIsBase64)) ? "rgba(255,255,255,0.3)" : "#000",
                  fontSize: "12px", fontWeight: 700, cursor: batchLoading ? "wait" : "pointer" }}>
                {batchLoading ? (batchProgress || "Processando...") : "🤖 Processar com IA"}
              </button>
            </div>
          </div>)}

          {/* Results preview */}
          {batchResults && (<div>
            <div style={{ background: "rgba(74,222,128,0.04)", border: "1px solid rgba(74,222,128,0.15)", borderRadius: "10px", padding: "12px 16px", marginBottom: "12px" }}>
              <div style={{ fontSize: "13px", fontWeight: 700, color: "#4ade80", marginBottom: "3px" }}>✓ {batchResults.length} FII{batchResults.length !== 1 ? "s" : ""} identificado{batchResults.length !== 1 ? "s" : ""}</div>
              <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.4)" }}>
                Revise e confirme para salvar.
                {batchResults.filter(function(r) { return fiis.some(function(f) { return f.ticker === r.ticker; }); }).length > 0 &&
                  <span style={{ color: "#fbbf24", marginLeft: "8px" }}>
                    ⚠ {batchResults.filter(function(r) { return fiis.some(function(f) { return f.ticker === r.ticker; }); }).length} serão atualizados
                  </span>}
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "5px", marginBottom: "12px", maxHeight: "400px", overflowY: "auto" }}>
              {batchResults.map(function(r, idx) {
                var isExisting = fiis.some(function(f) { return f.ticker === r.ticker; });
                return (
                  <div key={idx} style={{ background: "#111", borderRadius: "8px", padding: "10px 14px", border: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", gap: "10px" }}>
                    <span style={{ background: "rgba(220,38,38,0.1)", color: "#DC2626", fontWeight: 800, fontSize: "11px", padding: "3px 9px", borderRadius: "7px" }}>{r.ticker}</span>
                    <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.5)", flex: 1 }}>{r.nome}</span>
                    {isExisting
                      ? <span style={{ fontSize: "8px", padding: "2px 7px", borderRadius: "10px", background: "rgba(251,191,36,0.1)", color: "#fbbf24", fontWeight: 700 }}>ATUALIZAR</span>
                      : <span style={{ fontSize: "8px", padding: "2px 7px", borderRadius: "10px", background: "rgba(74,222,128,0.1)", color: "#4ade80", fontWeight: 700 }}>NOVO</span>}
                  </div>
                );
              })}
            </div>
            <div style={{ display: "flex", gap: "8px" }}>
              <button onClick={function() { setBatchResults(null); setError(""); }}
                style={{ padding: "10px 18px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.1)", background: "transparent", color: "rgba(255,255,255,0.4)", fontSize: "12px", fontWeight: 600, cursor: "pointer" }}>← Refazer</button>
              <button onClick={saveBatchResults} disabled={batchSaving}
                style={{ flex: 1, padding: "10px 18px", borderRadius: "8px", border: "none", background: batchSaving ? "rgba(74,222,128,0.2)" : "#16a34a", color: batchSaving ? "rgba(255,255,255,0.3)" : "#fff", fontSize: "12px", fontWeight: 700, cursor: batchSaving ? "wait" : "pointer" }}>
                {batchSaving ? "Salvando..." : "✓ Salvar todos (" + batchResults.length + " FIIs)"}
              </button>
            </div>
          </div>)}
        </div>)}

        {/* ── Single ── */}
        {mode === "single" && (<div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px" }}>
            <button onClick={function() { setMode("list"); setError(""); }}
              style={{ background: "transparent", border: "none", color: "rgba(255,255,255,0.4)", cursor: "pointer", fontSize: "13px" }}>←</button>
            <div style={{ fontSize: "14px", fontWeight: 800, color: "#fff" }}>{editingFii ? "Atualizar " + editingFii.ticker : "FII Individual"}</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px", background: "#111", borderRadius: "12px", padding: "20px", border: "1px solid rgba(255,255,255,0.06)" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <div><label style={lS}>Ticker *</label><input style={iS} placeholder="KNRI11" value={form.ticker} onChange={function(e) { setForm(Object.assign({}, form, { ticker: e.target.value.toUpperCase() })); }} /></div>
              <div><label style={lS}>Nome do Fundo</label><input style={iS} placeholder="Kinea Renda Imobiliária" value={form.nome} onChange={function(e) { setForm(Object.assign({}, form, { nome: e.target.value })); }} /></div>
            </div>
            <div><label style={lS}>Período</label><input style={iS} placeholder="Ex: fev/26 | Radar #470" value={form.periodo} onChange={function(e) { setForm(Object.assign({}, form, { periodo: e.target.value })); }} /></div>
            <div><label style={lS}>Tom</label><ToneSelector value={form.tone} onChange={function(t) { setForm(Object.assign({}, form, { tone: t })); }} /></div>
            <div>
              <label style={lS}>Texto do Relatório *</label>
              <textarea style={Object.assign({}, iS, { resize: "vertical", minHeight: "200px", lineHeight: 1.6 })}
                placeholder="Cole o trecho do relatório referente a este FII..."
                value={form.raw_text} onChange={function(e) { setForm(Object.assign({}, form, { raw_text: e.target.value })); setError(""); }} />
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
      </div>)}
    </div>
  );
}

/* ── FII Card (used in Todos os Relatórios tab) ── */
function FiiCard(p) {
  var fii = p.fii;
  return (
    <div style={{ background: "#111", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.06)", overflow: "hidden" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "11px 14px", cursor: "pointer" }} onClick={p.onToggle}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
          <span style={{ background: "rgba(220,38,38,0.12)", color: "#DC2626", fontWeight: 800, fontSize: "12px", padding: "3px 9px", borderRadius: "7px", border: "1px solid rgba(220,38,38,0.2)" }}>{fii.ticker}</span>
          {fii.nome && <span style={{ fontSize: "11px", fontWeight: 600, color: "rgba(255,255,255,0.65)" }}>{fii.nome}</span>}
          {fii.periodo && <span style={{ fontSize: "9px", color: "rgba(255,255,255,0.25)", background: "rgba(255,255,255,0.04)", padding: "2px 7px", borderRadius: "5px" }}>{fii.periodo}</span>}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "4px", flexShrink: 0 }}>
          <button onClick={function(e) { e.stopPropagation(); p.onEdit(); }} style={{ background: "transparent", border: "none", color: "rgba(255,255,255,0.25)", cursor: "pointer", padding: "3px 5px", fontSize: "12px" }}>✏️</button>
          <button onClick={function(e) { e.stopPropagation(); p.onDelete(); }} style={{ background: "transparent", border: "none", color: "rgba(255,255,255,0.25)", cursor: "pointer", padding: "3px 5px", fontSize: "12px" }}>🗑️</button>
          <span style={{ color: "rgba(255,255,255,0.2)", fontSize: "10px", marginLeft: "2px" }}>{p.expanded ? "▲" : "▼"}</span>
        </div>
      </div>
      {p.expanded && (
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
          {SECTIONS.map(function(sec) {
            if (!fii[sec.key] || fii[sec.key] === "Não informado neste relatório." || fii[sec.key] === "Não informado no relatório.") return null;
            return (
              <div key={sec.key} style={{ padding: "12px 16px", borderBottom: "1px solid rgba(255,255,255,0.03)" }}>
                <p style={{ margin: "0 0 5px", fontSize: "9px", fontWeight: 700, color: "rgba(255,255,255,0.35)", textTransform: "uppercase", letterSpacing: "1px" }}>{sec.label}</p>
                <p style={{ margin: 0, fontSize: "11.5px", color: "rgba(255,255,255,0.65)", lineHeight: 1.65, whiteSpace: "pre-wrap" }}>{fii[sec.key]}</p>
              </div>
            );
          })}
          <div style={{ padding: "6px 16px", textAlign: "right" }}>
            <span style={{ fontSize: "9px", color: "rgba(255,255,255,0.12)" }}>Tom: {fii.tone} · {new Date(fii.updated_at).toLocaleDateString("pt-BR")}</span>
          </div>
        </div>
      )}
    </div>
  );
}
