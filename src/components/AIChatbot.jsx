import { useEffect, useRef, useState } from "react";

const STARTER_MESSAGES = [
  {
    role: "assistant",
    content:
      "Salom! Men AI Business Twin yordamchisiman. Kreditga tayyorgarlik, biznes reja va marketing masalalari bo'yicha tezkor maslahat beraman."
  }
];

function formatSom(value) {
  return new Intl.NumberFormat("uz-UZ").format(Math.round(value)) + " so'm";
}

function buildAiReply(input, setup = {}, projection = null) {
  const text = input.toLowerCase().trim();
  if (!text) return "Savolingizni yozing, men sizga aniq tavsiya beraman.";

  const businessName = setup.businessName || "Biznesingiz";
  const baseRevenue = Number(setup.baseRevenue) || 10_000_000;
  const currentProfit = projection?.totals?.profit ?? baseRevenue * 0.22;
  const currentRevenue = projection?.totals?.revenue ?? baseRevenue * 6;
  const growthRate = Number(setup.monthlyGrowthRate) || 5;

  const percentMatch = text.match(/(\d+(?:[.,]\d+)?)\s*%/);
  const percent = percentMatch ? Number(percentMatch[1].replace(",", ".")) : null;

  const hasBusinessData = setup.businessName || setup.baseRevenue || setup.monthlyGrowthRate;
  const isScenarioQuestion = /(narx|xarajat|marketing|kelajak|nima bo['’]?ladi|10%|20%|30%|o'zi|oshirsa|qoshilsa|ko'paysa)/i.test(text);

  if (!hasBusinessData && isScenarioQuestion) {
    const fallbackBase = 10_000_000;
    const fallbackRevenue = 6 * fallbackBase;
    const fallbackProfit = fallbackRevenue * 0.28;
    if ((text.includes("narx") || text.includes("price")) && (text.includes("osh") || text.includes("qosh") || text.includes("ko'pay"))) {
      const scenarioPercent = percent ?? 10;
      const estimateRevenue = fallbackRevenue * (1 + scenarioPercent / 100);
      const estimateProfit = fallbackProfit * (1 + scenarioPercent / 100);
      return `Agar narx ${scenarioPercent}% oshirilsa, taxminiy 6 oylik daromad ${formatSom(estimateRevenue)} gacha ko'payishi mumkin. Sof foyda ${formatSom(estimateProfit)} bo'lib, marja ancha yaxshilanadi. Biroq, mijozlar soni yoki sotuv hajmi tushib qolmasligi uchun narxni ko'tarishdan oldin maqsadli auditoriyani tekshirish tavsiya etiladi.`;
    }
    if ((text.includes("xarajat") || text.includes("cost")) && (text.includes("osh") || text.includes("qosh") || text.includes("ko'pay"))) {
      const scenarioPercent = percent ?? 10;
      const estimateProfit = fallbackProfit * (1 - scenarioPercent / 100);
      return `Agar xarajatlar ${scenarioPercent}% oshsa, taxminiy sof foyda ${formatSom(estimateProfit)} ga tushishi mumkin. Bu holatda marjaning pasayishi ehtimoli yuqori bo'ladi, shuning uchun xarajatlar nazoratidan o'tishingiz kerak.`;
    }
    return `Agar siz narxni 10% oshirsangiz, 6 oy ichida daromad va foydangiz ko'tarilishi mumkin, lekin bu har doim mijozlar oqimi va marketing samaradorligiga bog'liq. Menga biznesingizning oylik daromadi va xarajatlari ma'lum bo'lsa, aniqroq prognoz beraman.`;
  }

  if (!hasBusinessData) {
    return "Avval 'Ma'lumot' bo'limida biznesingiz haqidagi ma'lumotlarni kiriting: oylik daromad, o'sish sur'ati va faoliyat tarixi. Keyin men 'narxni 10% oshirsam nima bo'ladi?' kabi savollarga aniq javob beraman."
  }

  if ((text.includes("narx") || text.includes("price")) && (text.includes("osh") || text.includes("qosh") || text.includes("ko'pay")) && percent !== null) {
    const newRevenue = currentRevenue * (1 + percent / 100);
    const newProfit = currentProfit * (1 + percent / 100);
    return `${businessName} uchun narx ${percent}% oshirilsa, 6 oylik daromad taxminan ${formatSom(newRevenue)} ga yetishi mumkin. Agar xarajatlar o'zgarmagan bo'lsa, sof foyda taxminan ${formatSom(newProfit)} bo'lib, ${(percent / 10).toFixed(1)} barobar ko'proq marja kuchayishi mumkin. Shu bilan birga, yangi narxga mos marketing va mijozlar segmentini ko'rib chiqish tavsiya etiladi.`;
  }

  if ((text.includes("xarajat") || text.includes("cost")) && (text.includes("osh") || text.includes("qosh") || text.includes("ko'pay")) && percent !== null) {
    const newProfit = currentProfit * (1 - percent / 100);
    return `${businessName}dagi xarajatlar ${percent}% ga oshsa, taxminiy sof foyda ${formatSom(newProfit)} gacha pasayishi mumkin. Bu holatda marja pasayadi, shuning uchun narxni ko'tarish yoki marketing samaradorligini oshirishni ko'rib chiqish kerak.`;
  }

  if ((text.includes("marketing") || text.includes("reklama") || text.includes("sotuv")) && percent !== null) {
    const lift = currentRevenue * (percent / 100) * 0.35;
    return `Marketing byudjeti ${percent}% ortirilsa, ${businessName} uchun daromad taxminan ${formatSom(currentRevenue + lift)} darajasiga yetishi mumkin, agar konversiya 15-20% ga oshsa. Biroq, birinchi ishlovchi omil - maqsadli auditoriya va CTR.`;
  }

  if (text.includes("kredit")) {
    return `Kreditga ariza berishdan oldin ${businessName}ning oylik daromadi, xarajatlari va to'lov intizomi to'liq ko'rsatilishi kerak. Hozirgi ma'lumotlarga ko'ra, 6 oylik daromad ${formatSom(currentRevenue)} va taxminiy foyda ${formatSom(currentProfit)}. Bankka bu ko'rsatkichlarni taqdim qiling, kredit tarixi va garovni hisobga oling.`;
  }

  if (text.includes("biznes reja") || text.includes("reja")) {
    return "Biznes reja uchun asosiy bo'limlar: mahsulot, bozor, mijozlar, narxlar, marketing, operatsion xarajatlar va 6 oylik daromad prognozi. Har bir bo'limda maqsad, hisob-kitob va risklarni ko'rsating."
  }

  if (text.includes("marketing") || text.includes("reklama") || text.includes("sotuv") || text.includes("mijoz")) {
    return "Marketingda birinchi qadam - maqsadli auditoriyani aniqlash. Targeting, ijtimoiy tarmoqlar, SEO va tanlovli kampaniyalar orqali xarajatni kamaytirib, aylanishni oshirish mumkin."
  }

  if (text.includes("daromad") || text.includes("foyda") || text.includes("pul")) {
    return `${businessName} uchun daromadni oshirishning 3 asosiy yo'nalishi: narxlar, mijozlar oqimi va xarajatlar nazorati. Hozirgi prognoz bo'yicha 6 oylik daromad ${formatSom(currentRevenue)}, sof foyda ${formatSom(currentProfit)}. Har oy ma'lumotlarni tahlil qilib, eng yaxshi kanalni ko'paytiring.`;
  }

  if (text.includes("salom") || text.includes("hi") || text.includes("assalom")) {
    return "Salom! Men AI Business Twin yordamchisiman. Kredit, biznes reja, narxni oshirish yoki marketing bo'yicha savollaringiz bo'lsa, bemalol so'rang."
  }

  if (text.includes("qanday") || text.includes("yordam") || text.includes("qilib")) {
    return `Avval ${businessName} uchun bazaviy ma'lumotlarni ko'rib chiqamiz: oylik daromad ${formatSom(baseRevenue)}, o'sish sur'ati ${growthRate}%. Keyin sizning savolingizga yanada aniq javob beraman.`;
  }

  return `Savolingizga aniq javob berish uchun biznesingizning hajmi, daromadi, xarajatlari va maqsadlari haqidagi ma'lumotlarni yozing. Hozirgi ma'lumotlar bilan men ${businessName} bo'yicha taxminiy javob beraman.`;
}

export default function AIChatbot({ setup = {}, projection = null }) {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState(STARTER_MESSAGES);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  function handleSend() {
    const trimmed = question.trim();
    if (!trimmed) return;

    const userMessage = { role: "user", content: trimmed };
    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setQuestion("");
    setLoading(true);

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: buildAiReply(trimmed, setup, projection)
        }
      ]);
      setLoading(false);
    }, 550);
  }

  return (
    <section className="chatbot-section">
      <div className="wrap">
        <div className="section-head">
          <h2>AI</h2>
          <p>
            Kredit, biznes reja va marketing bo'yicha tezkor maslahat olish uchun AI yordamchisidan foydalaning.
          </p>
        </div>

        <div className="chatbot-shell">
          <div className="chatbot-topbar">
            <div>
              <div className="chatbot-badge">AI</div>
              <span className="chatbot-status">Demo rejimda ishlaydi</span>
            </div>
          </div>

          <div className="chat-window">
            {messages.map((msg, index) => (
              <div key={`${msg.role}-${index}`} className={`chat-message ${msg.role}`}>
                <div className="chat-avatar">{msg.role === "assistant" ? "AI" : "S"}</div>
                <div className="chat-bubble">{msg.content}</div>
              </div>
            ))}
            {loading && (
              <div className="chat-message assistant">
                <div className="chat-avatar">AI</div>
                <div className="chat-bubble typing">Yozilmoqda...</div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          <div className="chat-input-row">
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              rows={3}
              placeholder="Masalan: Mening biznesim uchun kreditga tayyorgarlik qanday bo'lishi kerak?"
            />
            <button
              className="btn-primary"
              onClick={handleSend}
              disabled={loading || !question.trim()}
            >
              {loading ? "Yuborilmoqda..." : "Yuborish"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
