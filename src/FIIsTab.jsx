import { useState, useEffect } from 'react';

/* ── Load Supabase fii_reports ── */
var SUPABASE_URL = "https://zjowgamtmfqzievqnrhg.supabase.co";
var SUPABASE_KEY = "sb_publishable_L9M6LKA_YuyygIPs_t1oMA_Z-pF2kGz";

async function loadFiiReports() {
  try {
    var r = await fetch(SUPABASE_URL + "/rest/v1/fii_reports?select=*", {
      headers: { "apikey": SUPABASE_KEY, "Authorization": "Bearer " + SUPABASE_KEY }
    });
    var data = await r.json();
    if (Array.isArray(data)) return data;
  } catch(e) { console.error("[FIIsTab] load:", e); }
  return [];
}

/* ── Load FII carteira from localStorage ── */
function loadFIICarteira() {
  try {
    var s = localStorage.getItem("tt-carteiras-suno");
    if (!s) return [];
    var data = JSON.parse(s);
    var carteiras = data.carteiras || [];
    var ativos = data.ativos || {};
    // Find carteira named "Fundos Imobiliários" (or any carteira with FII tickers)
    var fiiCart = carteiras.find(function(c) {
      return /fii|imobili/i.test(c.name);
    });
    if (!fiiCart) {
      // Fallback: any carteira with tickers ending in 11
      fiiCart = carteiras.find(function(c) {
        return (ativos[c.id] || []).some(function(a) { return /11$/.test(a.ticker); });
      });
    }
    if (!fiiCart) return [];
    return (ativos[fiiCart.id] || []).filter(function(a) { return /11$/.test(a.ticker); });
  } catch(e) { return []; }
}

/* ── Sentiment badge (mirrors App.jsx) ── */
function SentimentBadge(p) {
  var map = {
    positive: { l: "Positivo", bg: "rgba(34,197,94,0.1)", c: "#4ade80", b: "rgba(34,197,94,0.2)" },
    neutral:  { l: "Neutro",   bg: "rgba(255,255,255,0.04)", c: "#94a3b8", b: "rgba(255,255,255,0.1)" },
    negative: { l: "Negativo", bg: "rgba(220,38,38,0.1)", c: "#f87171", b: "rgba(220,38,38,0.2)" }
  };
  var c = map[p.sentiment] || map.neutral;
  return (
    <span style={{ display: "inline-block", padding: "2px 9px", borderRadius: "20px", fontSize: "10px", fontWeight: 700, background: c.bg, color: c.c, border: "1px solid " + c.b, letterSpacing: "0.5px", textTransform: "uppercase" }}>
      {c.l}
    </span>
  );
}

/* ── Viés badge ── */
function ViesBadge(p) {
  var map = { "Comprar": "#4ade80", "Aguardar": "#fbbf24", "Vender": "#f87171" };
  var c = map[p.vies] || "#94a3b8";
  return (
    <span style={{ display: "inline-block", padding: "2px 9px", borderRadius: "20px", fontSize: "10px", fontWeight: 700, background: c + "18", color: c, border: "1px solid " + c + "33", letterSpacing: "0.5px" }}>
      {p.vies || "—"}
    </span>
  );
}

/* ── FII Card ── */
function FiiCard(p) {
  var item = p.item; // { ticker, nome, rank, precoTeto, vies, report }
  var report = item.report;
  var [open, setOpen] = useState(false);

  var SECTIONS = [
    { key: "resultado_periodo", label: "📊 Resultado do Período", color: "#fbbf24" },
    { key: "comentario_gestao", label: "💬 Comentário de Gestão", color: "#94a3b8" },
    { key: "vacancia_ocupacao", label: "🏗️ Vacância e Ocupação", color: "#60a5fa" },
    { key: "aquisicoes",        label: "🔄 Aquisições e Movimentos", color: "#a78bfa" },
    { key: "perspectivas",      label: "🔭 Perspectivas", color: "#4ade80" },
  ];

  var hasReport = !!report;

  return (
    <div style={{ background: "#111", borderRadius: "12px", overflow: "hidden", border: "1px solid rgba(255,255,255,0.06)", marginBottom: "8px" }}>
      {/* Header */}
      <div onClick={function() { if (hasReport) setOpen(!open); }}
        style={{ padding: "14px 18px", cursor: hasReport ? "pointer" : "default", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: open ? "1px solid rgba(255,255,255,0.05)" : "none" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {/* Rank + ticker icon */}
          <div style={{ position: "relative", flexShrink: 0 }}>
            <div style={{ background: "#DC2626", borderRadius: "8px", width: "40px", height: "40px", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: "9px", color: "#fff" }}>
              {item.ticker.replace(/\d/g, "").slice(0, 4)}
            </div>
            {item.rank && (
              <div style={{ position: "absolute", top: "-6px", left: "-6px", background: "#0A0A0A", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "10px", padding: "0px 5px", fontSize: "9px", fontWeight: 800, color: "rgba(255,255,255,0.6)", lineHeight: "16px" }}>
                #{item.rank}
              </div>
            )}
          </div>
          {/* Ticker + name */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <span style={{ fontWeight: 700, fontSize: "14px", color: "#f1f5f9" }}>{item.ticker}</span>
              {report && report.periodo && (
                <span style={{ color: "rgba(255,255,255,0.25)", fontSize: "11px" }}>{report.periodo}</span>
              )}
              {report && report.updated_at && (
                <span style={{ color: "rgba(255,255,255,0.18)", fontSize: "10px" }}>({new Date(report.updated_at).toLocaleDateString("pt-BR")})</span>
              )}
            </div>
            <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "11px", marginTop: "1px" }}>
              {item.nome || (report && report.nome) || ""}
            </div>
          </div>
        </div>

        {/* Right side */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {/* Preço-teto */}
          {item.precoTeto && (
            <div style={{ textAlign: "right", flexShrink: 0 }}>
              <div style={{ fontSize: "9px", color: "rgba(255,255,255,0.25)", marginBottom: "1px" }}>Teto</div>
              <div style={{ fontSize: "12px", fontWeight: 700, color: "rgba(255,255,255,0.6)" }}>R$ {Number(item.precoTeto).toFixed(2)}</div>
            </div>
          )}
          <ViesBadge vies={item.vies} />
          {hasReport
            ? <span style={{ color: "rgba(255,255,255,0.2)", fontSize: "14px", transition: "transform 0.2s", display: "inline-block", transform: open ? "rotate(180deg)" : "rotate(0)" }}>▾</span>
            : <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.2)", fontStyle: "italic" }}>sem relatório</span>
          }
        </div>
      </div>

      {/* Expanded sections */}
      {open && hasReport && (
        <div>
          {SECTIONS.map(function(sec) {
            var text = report[sec.key];
            if (!text || text === "Não informado neste relatório." || text === "Não informado no relatório.") return null;
            return (
              <div key={sec.key} style={{ padding: "14px 18px", borderBottom: "1px solid rgba(255,255,255,0.04)", background: "rgba(255,255,255,0.01)" }}>
                <div style={{ fontSize: "9px", fontWeight: 700, color: sec.color, textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: "6px", opacity: 0.8 }}>
                  {sec.label}
                </div>
                <div style={{ fontSize: "12.5px", color: "rgba(255,255,255,0.7)", lineHeight: 1.65, whiteSpace: "pre-wrap" }}>
                  {text}
                </div>
              </div>
            );
          })}
          <div style={{ padding: "8px 18px", textAlign: "right" }}>
            <span style={{ fontSize: "9px", color: "rgba(255,255,255,0.15)" }}>
              Tom: {report.tone} · Atualizado: {new Date(report.updated_at).toLocaleDateString("pt-BR")}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

/* ════════════════════════════
   MAIN EXPORT
════════════════════════════ */
export default function FIIsTab() {
  var [reports, setReports] = useState([]);
  var [carteiraItems, setCarteiraItems] = useState([]);
  var [loading, setLoading] = useState(true);
  var [filter, setFilter] = useState("all"); // all | hasReport | noReport
  var [search, setSearch] = useState("");

  useEffect(function() {
    var cart = loadFIICarteira();
    setCarteiraItems(cart);
    loadFiiReports().then(function(data) {
      setReports(data);
      setLoading(false);
    });
  }, []);

  // Build merged list: carteira items + cross-referenced reports
  var merged = carteiraItems.map(function(item) {
    var report = null;
    for (var i = 0; i < reports.length; i++) {
      if (reports[i].ticker === item.ticker) { report = reports[i]; break; }
    }
    return {
      ticker: item.ticker,
      nome: item.name || (report ? report.nome : ""),
      rank: item.rank,
      precoTeto: item.precoTeto,
      vies: item.vies || "Comprar",
      report: report
    };
  });

  // Sort by rank
  merged.sort(function(a, b) { return (a.rank || 999) - (b.rank || 999); });

  // Stats
  var withReport = merged.filter(function(m) { return !!m.report; }).length;

  // Filter
  var displayed = merged.filter(function(m) {
    var matchFilter = filter === "all" || (filter === "hasReport" && !!m.report) || (filter === "noReport" && !m.report);
    var matchSearch = !search || m.ticker.toLowerCase().indexOf(search.toLowerCase()) >= 0 || (m.nome || "").toLowerCase().indexOf(search.toLowerCase()) >= 0;
    return matchFilter && matchSearch;
  });

  if (loading) {
    return <div style={{ textAlign: "center", padding: "60px 0", color: "rgba(255,255,255,0.2)", fontSize: "12px" }}>Carregando FIIs...</div>;
  }

  if (carteiraItems.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "60px 0", color: "rgba(255,255,255,0.15)" }}>
        <div style={{ fontSize: "40px", marginBottom: "10px" }}>📋</div>
        <p style={{ margin: 0, fontSize: "13px", fontWeight: 600 }}>Nenhum FII cadastrado nas Carteiras Suno.</p>
        <p style={{ margin: "6px 0 0", fontSize: "11px", color: "rgba(255,255,255,0.25)" }}>
          Acesse Research → Carteiras Suno e adicione uma carteira com FIIs (tickers terminados em 11).
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Stats bar */}
      <div style={{ display: "flex", gap: "6px", marginBottom: "14px", flexWrap: "wrap", alignItems: "center" }}>
        {[
          { l: "Total", v: merged.length, c: "#DC2626" },
          { l: "Com relatório", v: withReport, c: "#4ade80" },
          { l: "Sem relatório", v: merged.length - withReport, c: "#f87171" },
        ].map(function(s) {
          return (
            <div key={s.l} style={{ background: "#111", borderRadius: "10px", padding: "8px 14px", border: "1px solid rgba(255,255,255,0.05)", textAlign: "center", minWidth: "70px" }}>
              <div style={{ fontSize: "16px", fontWeight: 800, color: s.c }}>{s.v}</div>
              <div style={{ fontSize: "7px", color: "rgba(255,255,255,0.3)", textTransform: "uppercase" }}>{s.l}</div>
            </div>
          );
        })}

        {/* Search */}
        <input value={search} onChange={function(e) { setSearch(e.target.value); }}
          placeholder="Buscar..."
          style={{ padding: "7px 12px", borderRadius: "7px", border: "1px solid rgba(255,255,255,0.07)", background: "rgba(255,255,255,0.02)", color: "#e2e8f0", fontSize: "11px", outline: "none", width: "150px" }} />

        {/* Filter buttons */}
        {[
          { k: "all", l: "Todos" },
          { k: "hasReport", l: "Com relatório" },
          { k: "noReport", l: "Sem relatório" }
        ].map(function(f) {
          return (
            <button key={f.k} onClick={function() { setFilter(f.k); }}
              style={{ padding: "5px 12px", borderRadius: "14px", border: "none", cursor: "pointer", fontSize: "10px", fontWeight: 600, background: filter === f.k ? "#DC2626" : "rgba(255,255,255,0.04)", color: filter === f.k ? "#fff" : "rgba(255,255,255,0.35)" }}>
              {f.l}
            </button>
          );
        })}
      </div>

      {/* Cards */}
      <div>
        {displayed.length === 0 && (
          <div style={{ textAlign: "center", padding: "40px 0", color: "rgba(255,255,255,0.2)", fontSize: "12px" }}>Nenhum FII encontrado.</div>
        )}
        {displayed.map(function(item) {
          return <FiiCard key={item.ticker} item={item} />;
        })}
      </div>

      {/* Footer hint */}
      {withReport < merged.length && (
        <div style={{ marginTop: "12px", padding: "10px 14px", background: "rgba(251,191,36,0.04)", borderRadius: "8px", border: "1px solid rgba(251,191,36,0.1)", fontSize: "10px", color: "rgba(255,255,255,0.35)", lineHeight: 1.6 }}>
          💡 {merged.length - withReport} FII{merged.length - withReport !== 1 ? "s" : ""} ainda sem relatório importado.
          Acesse <strong style={{ color: "rgba(255,255,255,0.5)" }}>Research → FIIs</strong> para importar os relatórios Suno.
        </div>
      )}
    </div>
  );
}
