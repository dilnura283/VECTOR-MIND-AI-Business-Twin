export function Problem() {
  const items = [
    { d: "1", h: "Kredit rad etilishi sababsiz", p: "Tadbirkorlar ko'pincha nima uchun kredit rad etilganini bilishmaydi." },
    { d: "2", h: "Har bir bank talabi boshqacha", p: "Vaqt sarflab har bir bankka alohida murojaat qilish shart emas." },
    { d: "3", h: "Biznes rejasi tayyorlash qiyin", p: "Moliyaviy prognoz tuzish uchun maxsus bilim va vaqt kerak bo'ladi." }
  ];
  return (
    <section className="band">
      <div className="wrap">
        <div className="section-head">
          <h2>Tadbirkorlar duch keladigan muammolar</h2>
          <p>AI Business Twin shu uchta muammoni bitta platformada hal qiladi.</p>
        </div>
        <div className="cards3">
          {items.map((it) => (
            <div className="card3" key={it.d}>
              <div className="dot">{it.d}</div>
              <h3>{it.h}</h3>
              <p>{it.p}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Steps() {
  const steps = [
    { idx: "01", h: "Ma'lumot kiriting", p: "Daromad, xarajat va faoliyat tarixingizni kiriting." },
    { idx: "02", h: "AI tahlil qiladi", p: "Model 6 ta omil bo'yicha kredit ballingizni hisoblaydi." },
    { idx: "03", h: "Banklarni solishtiring", p: "Qaysi banklar sizga mos kelishini darhol ko'ring." },
    { idx: "04", h: "Ariza yuboring", p: "Tanlangan bankka to'g'ridan-to'g'ri murojaat qiling." }
  ];
  return (
    <section>
      <div className="wrap">
        <div className="section-head">
          <h2>Qanday ishlaydi</h2>
          <p>To'rt qadamda kredit reytingingizdan tortib bank tanlashgacha.</p>
        </div>
        <div className="steps">
          {steps.map((s) => (
            <div className="step" key={s.idx}>
              <div className="idx">{s.idx}</div>
              <h3>{s.h}</h3>
              <p>{s.p}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Pricing() {
  const plans = [
    { name: "Boshlang'ich", price: "Bepul", features: ["Kredit ballini tekshirish", "1 ta bank taklifi", "Asosiy hisobot"] },
    { name: "Biznes", price: "199 000", features: ["Cheksiz bank taqqoslash", "6 oylik prognoz", "Mijoz personalari"], featured: true },
    { name: "Agentlik", price: "690 000", features: ["Ko'p biznes uchun", "API kirish", "Shaxsiy menejer"] }
  ];
  return (
    <section className="band">
      <div className="wrap">
        <div className="section-head">
          <h2>Tariflar</h2>
          <p>Biznesingiz bosqichiga mos rejani tanlang.</p>
        </div>
        <div className="plans">
          {plans.map((p) => (
            <div className={`plan ${p.featured ? "featured" : ""}`} key={p.name}>
              <h3>{p.name}</h3>
              <div className="price">{p.price}{p.price !== "Bepul" && <span> so'm/oy</span>}</div>
              <ul>
                {p.features.map((f) => <li key={f}>{f}</li>)}
              </ul>
              <button className={p.featured ? "btn-primary" : "btn-ghost"}>Tanlash</button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
