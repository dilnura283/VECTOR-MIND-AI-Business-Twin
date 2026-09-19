import { useState } from "react";
import { api } from "../api.js";

const INDUSTRIES = [
  { value: "savdo", label: "Savdo" },
  { value: "xizmat", label: "Xizmat ko'rsatish" },
  { value: "ishlabchiqarish", label: "Ishlab chiqarish" },
  { value: "it", label: "IT / dasturiy ta'minot" },
  { value: "other", label: "Boshqa" }
];

const initialForm = {
  monthlyRevenue: "",
  businessAgeMonths: "",
  monthlyDebtPayments: "",
  hasCollateral: false,
  latePayments: "0",
  industry: "savdo"
};

function formatSom(n) {
  return new Intl.NumberFormat("uz-UZ").format(Math.round(n)) + " so'm";
}

function scoreColor(score) {
  if (score >= 750) return "var(--accent)";
  if (score >= 670) return "var(--accent)";
  if (score >= 580) return "var(--accent-2)";
  return "var(--danger)";
}

export default function CreditCalculator() {
  const [form, setForm] = useState(initialForm);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [autofillPreview, setAutofillPreview] = useState(null);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleAutofill() {
    try {
      const data = await api.getAutofill();
      setForm({
        monthlyRevenue: String(data.monthlyRevenue),
        businessAgeMonths: String(data.businessAgeMonths),
        monthlyDebtPayments: String(data.monthlyDebtPayments),
        hasCollateral: data.hasCollateral,
        latePayments: String(data.latePayments),
        industry: data.industry
      });
      setAutofillPreview(data);
    } catch (e) {
      setError(e.message);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const payload = {
        monthlyRevenue: Number(form.monthlyRevenue) || 0,
        businessAgeMonths: Number(form.businessAgeMonths) || 0,
        monthlyDebtPayments: Number(form.monthlyDebtPayments) || 0,
        hasCollateral: Boolean(form.hasCollateral),
        latePayments: Number(form.latePayments) || 0,
        industry: form.industry
      };
      const data = await api.getScore(payload);
      setResult(data);
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
          <h2>Kredit reytingini tekshiring</h2>
          <p>Ma'lumotlaringiz bizning serverimizda haqiqiy formulalar bilan hisoblanadi.</p>
        </div>

        <div className="calc-grid">
          <form className="form-panel" onSubmit={handleSubmit}>
            <div className="field">
              <label>Oylik daromad (so'm)</label>
              <input
                type="number" min="0" required
                value={form.monthlyRevenue}
                onChange={(e) => update("monthlyRevenue", e.target.value)}
                placeholder="masalan, 20000000"
              />
            </div>

            <div className="field-row">
              <div className="field">
                <label>Faoliyat tarixi (oy)</label>
                <input
                  type="number" min="0" required
                  value={form.businessAgeMonths}
                  onChange={(e) => update("businessAgeMonths", e.target.value)}
                />
              </div>
              <div className="field">
                <label>Soha</label>
                <select value={form.industry} onChange={(e) => update("industry", e.target.value)}>
                  {INDUSTRIES.map((i) => <option key={i.value} value={i.value}>{i.label}</option>)}
                </select>
              </div>
            </div>

            <div className="field-row">
              <div className="field">
                <label>Oylik qarz to'lovi (so'm)</label>
                <input
                  type="number" min="0"
                  value={form.monthlyDebtPayments}
                  onChange={(e) => update("monthlyDebtPayments", e.target.value)}
                />
              </div>
              <div className="field">
                <label>Kechikkan to'lovlar soni</label>
                <input
                  type="number" min="0"
                  value={form.latePayments}
                  onChange={(e) => update("latePayments", e.target.value)}
                />
              </div>
            </div>

            <div className="field">
              <label>
                <input
                  type="checkbox"
                  style={{ width: "auto", marginRight: 8 }}
                  checked={form.hasCollateral}
                  onChange={(e) => update("hasCollateral", e.target.checked)}
                />
                Garov mulkim bor
              </label>
            </div>

            <button className="btn-primary calc-btn" type="submit" disabled={loading}>
              {loading ? "Hisoblanmoqda..." : "Reytingni hisoblash"}
            </button>

            <button type="button" className="autofill-btn" onClick={handleAutofill}>
              Namunaviy ma'lumot bilan to'ldirish
            </button>

            {autofillPreview && (
              <div className="autofill-preview show">
                <div><span>Biznes</span><b>{autofillPreview.businessName}</b></div>
                <div><span>Oylik daromad</span><b>{formatSom(autofillPreview.monthlyRevenue)}</b></div>
                <div><span>Faoliyat</span><b>{autofillPreview.businessAgeMonths} oy</b></div>
              </div>
            )}

            {error && <div className="status-line error">{error}</div>}
          </form>

          <div className="result-panel">
            {!result && (
              <div className="status-line">
                Natijani ko'rish uchun forma to'ldirib "Reytingni hisoblash" tugmasini bosing.
              </div>
            )}

            {result && (
              <>
                <div className="gauge-wrap">
                  <div className="gauge-num" style={{ color: scoreColor(result.score) }}>
                    {result.score}
                  </div>
                  <div className="gauge-status">300-850 shkala bo'yicha</div>
                  <div className="gauge-badge" style={{ background: "color-mix(in srgb, var(--accent) 18%, transparent)", color: "var(--accent)" }}>
                    {result.tag}
                  </div>
                </div>

                <ul className="doc-list">
                  {result.breakdown.map((b) => (
                    <li key={b.factor}>
                      <span className={`doc-dot ${b.points / b.max >= 0.6 ? "ok" : "miss"}`} />
                      <div>
                        {b.factor}
                        <span className="label">{b.points} / {b.max} ball</span>
                      </div>
                    </li>
                  ))}
                </ul>

                <div className="ai-box">
                  <h4><span className="ai-dot" />Mos banklar</h4>
                  <ul>
                    {result.banks.map((b) => (
                      <li key={b.id}>
                        {b.name} — {b.pass ? `maks. ${formatSom(b.maxLoan)}, ${(b.rate * 100).toFixed(0)}% yillik` : "hozircha mos kelmaydi"}
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
