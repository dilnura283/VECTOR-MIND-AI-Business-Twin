import { useEffect, useState } from "react";
import { api } from "../api.js";
import AIChatbot from "./AIChatbot.jsx";

const INDUSTRIES = [
  { value: "savdo", label: "Savdo" },
  { value: "xizmat", label: "Xizmat ko'rsatish" },
  { value: "it", label: "IT / dasturiy ta'minot" },
  { value: "other", label: "Boshqa" }
];

function formatSom(n) {
  return new Intl.NumberFormat("uz-UZ").format(Math.round(n)) + " so'm";
}

function FormPanel({ setup, setSetup, onGenerate, loading }) {
  return (
    <div className="panel-inner active">
      <div className="form-grid">
        <div className="field">
          <label>Biznes nomi</label>
          <input
            value={setup.businessName}
            onChange={(e) => setSetup((s) => ({ ...s, businessName: e.target.value }))}
            placeholder="masalan, Zamin Market"
          />
        </div>
        <div className="field">
          <label>Soha</label>
          <select value={setup.industry} onChange={(e) => setSetup((s) => ({ ...s, industry: e.target.value }))}>
            {INDUSTRIES.map((i) => <option key={i.value} value={i.value}>{i.label}</option>)}
          </select>
        </div>
        <div className="field">
          <label>Joriy oylik daromad (so'm)</label>
          <input
            type="number" min="0"
            value={setup.baseRevenue}
            onChange={(e) => setSetup((s) => ({ ...s, baseRevenue: e.target.value }))}
          />
        </div>
        <div className="field">
          <label>Kutilayotgan oylik o'sish (%)</label>
          <input
            type="number" min="0" max="50" step="0.5"
            value={setup.monthlyGrowthRate}
            onChange={(e) => setSetup((s) => ({ ...s, monthlyGrowthRate: e.target.value }))}
          />
        </div>
      </div>
      <div className="app-cta">
        <button className="btn-primary" onClick={onGenerate} disabled={loading || !setup.businessName}>
          {loading ? "Yaratilmoqda..." : "Biznes egizagini yaratish"}
        </button>
      </div>
    </div>
  );
}

function TwinPanel({ setup, projection, personas }) {
  if (!projection) {
    return <div className="panel-inner active"><div className="status-line">Avval "Ma'lumot" bo'limida forma to'ldiring.</div></div>;
  }

  const maxRevenue = Math.max(...projection.months.map((m) => m.revenue));

  return (
    <div className="panel-inner active">
      <div className="twin-head">
        <div>
          <h3>{setup.businessName}</h3>
          <div className="sub">{INDUSTRIES.find((i) => i.value === setup.industry)?.label} · 6 oylik prognoz</div>
        </div>
        <span className="pill">Marja: {projection.totals.margin}%</span>
      </div>

      <div className="twin-grid">
        <div>
          <div className="bars">
            {projection.months.map((m) => (
              <div className="bar-col" key={m.label}>
                <div className="bar" style={{ height: `${Math.max(6, (m.revenue / maxRevenue) * 100)}%` }} />
                <div className="bar-label">{m.label}</div>
                <div className="bar-val">{(m.revenue / 1_000_000).toFixed(1)} mln</div>
              </div>
            ))}
          </div>

          <div className="persona-row">
            {personas.map((p) => (
              <div className="persona" key={p.name}>
                <div className="av" />
                <div>
                  <h6>{p.name}</h6>
                  <span>{p.role}</span>
                  <p>{p.note}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="side-card">
          <div>Jami daromad (6 oy)</div>
          <div className="big">{formatSom(projection.totals.revenue)}</div>
          <h5>Asosiy ko'rsatkichlar</h5>
          <ul>
            <li>Jami sof foyda: {formatSom(projection.totals.profit)}</li>
            <li>O'rtacha marja: {projection.totals.margin}%</li>
            <li>
              {projection.breakEvenMonth
                ? `Foyda ${projection.breakEvenMonth}-oydan boshlab musbat`
                : "Prognoz oralig'ida foyda musbatga chiqmaydi"}
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

function WhatIfPanel({ setup }) {
  const [growth, setGrowth] = useState(Number(setup.monthlyGrowthRate) || 5);
  const [costRatio, setCostRatio] = useState(65);
  const [marketingBoost, setMarketingBoost] = useState(false);
  const [projection, setProjection] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const base = Number(setup.baseRevenue) || 10_000_000;
    const timer = setTimeout(() => {
      api.getProjection({
        baseRevenue: base,
        monthlyGrowthRate: growth / 100,
        costRatio: costRatio / 100,
        marketingBoost
      }).then(setProjection).catch((e) => setError(e.message));
    }, 250); // debounce
    return () => clearTimeout(timer);
  }, [growth, costRatio, marketingBoost, setup.baseRevenue]);

  return (
    <div className="panel-inner active">
      <div className="whatif-grid">
        <div>
          <div className="slider-block">
            <label><span>Oylik o'sish sur'ati</span><span>{growth}%</span></label>
            <input type="range" min="0" max="30" value={growth} onChange={(e) => setGrowth(Number(e.target.value))} />
          </div>
          <div className="slider-block">
            <label><span>Xarajatlar ulushi</span><span>{costRatio}%</span></label>
            <input type="range" min="30" max="95" value={costRatio} onChange={(e) => setCostRatio(Number(e.target.value))} />
          </div>
          <div className="toggle-row">
            <span>Marketingga qo'shimcha byudjet</span>
            <label className="switch">
              <input type="checkbox" checked={marketingBoost} onChange={(e) => setMarketingBoost(e.target.checked)} />
              <span className="slider-toggle" />
            </label>
          </div>
        </div>

        <div className="result-card">
          {error && <div className="status-line error">{error}</div>}
          {projection && (
            <>
              <div className="result-row">
                <span className="label">6 oylik jami daromad</span>
                <span className="val">{formatSom(projection.totals.revenue)}</span>
              </div>
              <div className="result-row">
                <span className="label">6 oylik jami foyda</span>
                <span className={`val ${projection.totals.profit >= 0 ? "up" : "down"}`}>
                  {formatSom(projection.totals.profit)}
                </span>
              </div>
              <div className="result-row">
                <span className="label">Marja</span>
                <span className="val">{projection.totals.margin}%</span>
              </div>
              <div className="disclaimer">
                Bu simulyatsiya taxminiy model asosida ishlaydi va moliyaviy kafolat hisoblanmaydi.
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function MapPanel() {
  const criteria = [
    "Ko'chaga yaqin, piyodalar oqimi yuqori joy",
    "Raqobatchilar zichligi past hudud",
    "Maqsadli auditoriya yashash zichligi yuqori",
    "Jamoat transporti bekatiga yaqinlik"
  ];
  const dots = [
    { top: "30%", left: "40%" },
    { top: "55%", left: "60%" },
    { top: "68%", left: "35%" }
  ];
  return (
    <div className="panel-inner active">
      <div className="map-wrap">
        <div>
          <div className="chip-row">
            <span className="chip">Toshkent shahri</span>
            <span className="chip">Yunusobod tumani</span>
            <span className="chip">3 nomzod hudud</span>
          </div>
          <ul className="criteria">
            {criteria.map((c) => <li key={c}>{c}</li>)}
          </ul>
        </div>
        <div className="map-canvas">
          Interaktiv xarita (demo)
          {dots.map((d, i) => (
            <span className="map-dot" style={{ top: d.top, left: d.left }} key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function TwinApp() {
  const [tab, setTab] = useState("form");
  const [setup, setSetup] = useState({
    businessName: "",
    industry: "savdo",
    baseRevenue: "10000000",
    monthlyGrowthRate: "5"
  });
  const [projection, setProjection] = useState(null);
  const [personas, setPersonas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const tabs = [
    { id: "form", label: "Ma'lumot" },
    { id: "twin", label: "Biznes egizagi", disabled: !projection },
    { id: "whatif", label: "Nima bo'lsa-chi?", disabled: !projection },
    { id: "map", label: "Joylashuv" },
    { id: "ai", label: "AI" }
  ];

  async function handleGenerate() {
    setError(null);
    setLoading(true);
    try {
      const [proj, personaList] = await Promise.all([
        api.getProjection({
          baseRevenue: Number(setup.baseRevenue) || 10_000_000,
          monthlyGrowthRate: (Number(setup.monthlyGrowthRate) || 5) / 100
        }),
        api.getPersonas(setup.industry)
      ]);
      setProjection(proj);
      setPersonas(personaList);
      setTab("twin");
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section>
      <div className="wrap">
        <div className="section-head">
          <h2>AI Business Twin</h2>
          <p>Biznesingizning raqamli nusxasi — daromad prognozi, mijoz personalari va joylashuv tahlili.</p>
        </div>

        <div className="app">
          <div className="app-tabs">
            {tabs.map((t) => (
              <button
                key={t.id}
                className={tab === t.id ? "active" : ""}
                disabled={t.disabled}
                onClick={() => setTab(t.id)}
              >
                {t.label}
              </button>
            ))}
          </div>
          <div className="app-body">
            {error && <div className="status-line error">{error}</div>}
            {tab === "form" && (
              <FormPanel setup={setup} setSetup={setSetup} onGenerate={handleGenerate} loading={loading} />
            )}
            {tab === "twin" && <TwinPanel setup={setup} projection={projection} personas={personas} />}
            {tab === "whatif" && <WhatIfPanel setup={setup} />}
            {tab === "map" && <MapPanel />}
            {tab === "ai" && <AIChatbot setup={setup} projection={projection} />}
          </div>
        </div>
      </div>
    </section>
  );
}
