export default function Hero({ setView }) {
  return (
    <section className="hero">
      <div className="wrap hero-grid">
        <div>
          <div className="eyebrow">Sun'iy intellekt asosida</div>
          <h1>Biznes rejangizni AI bilan yarating va kreditga tayyorlaning</h1>
          <p className="lead">
            Moliyaviy ma'lumotlaringizni kiriting — AI Business Twin real vaqtda kredit
            reytingini hisoblaydi, mos banklarni topadi, biznes rejangizni shakllantiradi va AI chatbot yordamida tezkor maslahat oladi.
          </p>
          <div className="hero-actions">
            <button className="btn-primary" onClick={() => setView("credit")}>
              Kredit reytingini tekshirish
            </button>
            <button className="btn-ghost" onClick={() => setView("twin")}>
              Biznes rejasini ko'rish
            </button>
          </div>
          <div className="hero-stats">
            <div className="hero-stat">
              <div className="num">3</div>
              <div className="lbl">hamkor bank</div>
            </div>
            <div className="hero-stat">
              <div className="num">6 oy</div>
              <div className="lbl">daromad prognozi</div>
            </div>
            <div className="hero-stat">
              <div className="num">300-850</div>
              <div className="lbl">kredit ball shkalasi</div>
            </div>
          </div>
        </div>

        <div className="score-card">
          <div className="score-card-head">
            <span>Namunaviy kredit reytingi</span>
          </div>
          <div className="score-ring-wrap">
            <div>
              <div className="gauge-num">712</div>
              <div className="score-tag">Yaxshi</div>
            </div>
          </div>
          <div className="mini-row"><span>Daromad barqarorligi</span><span className="ok">Yaxshi</span></div>
          <div className="mini-row"><span>Faoliyat tarixi</span><span className="ok">14 oy</span></div>
          <div className="mini-row"><span>To'lov intizomi</span><span className="miss">1 ta kechikish</span></div>
        </div>
      </div>
    </section>
  );
}
