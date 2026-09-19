const MONTH_LABELS = ["1-oy", "2-oy", "3-oy", "4-oy", "5-oy", "6-oy"];
const SEASONALITY = [1, 0.95, 1.05, 1.1, 1.0, 1.15];

export function buildProjection({
  baseRevenue = 10_000_000,
  monthlyGrowthRate = 0.05,
  costRatio = 0.65,
  marketingBoost = false
}) {
  const growth = marketingBoost ? monthlyGrowthRate + 0.02 : monthlyGrowthRate;
  const costs = marketingBoost ? Math.min(costRatio + 0.04, 0.95) : costRatio;

  let revenue = baseRevenue;
  const months = MONTH_LABELS.map((label, i) => {
    if (i > 0) revenue = revenue * (1 + growth);
    const seasonRevenue = Math.round(revenue * SEASONALITY[i]);
    const profit = Math.round(seasonRevenue * (1 - costs));
    return { label, revenue: seasonRevenue, profit };
  });

  const totalRevenue = months.reduce((sum, m) => sum + m.revenue, 0);
  const totalProfit = months.reduce((sum, m) => sum + m.profit, 0);
  const margin = totalRevenue > 0 ? totalProfit / totalRevenue : 0;
  const breakEvenMonth = months.findIndex((m) => m.profit > 0) + 1;

  return {
    months,
    totals: {
      revenue: totalRevenue,
      profit: totalProfit,
      margin: Number((margin * 100).toFixed(1))
    },
    breakEvenMonth: breakEvenMonth || null
  };
}

export function buildPersonas(industry = "other") {
  const catalog = {
    savdo: [
      { name: "Nodira, 34", role: "Doimiy xaridor", note: "Oyiga 2-3 marta xarid qiladi, chegirmalarga sezgir" },
      { name: "Bekzod, 27", role: "Onlayn xaridor", note: "Instagram orqali topadi, tez yetkazib berishni kutadi" },
      { name: "Gulnoza, 45", role: "Ulgurji buyurtmachi", note: "Katta hajmda, muddatli to'lovni afzal ko'radi" }
    ],
    xizmat: [
      { name: "Jasur, 30", role: "Birinchi marta murojaat qiluvchi", note: "Sharhlarga qarab tanlaydi" },
      { name: "Malika, 41", role: "Doimiy mijoz", note: "Sifat va vaqtga rioya qilishni qadrlaydi" },
      { name: "Sardor, 25", role: "Narx solishtiruvchi", note: "3-4 ta variantni solishtirib qaror qiladi" }
    ],
    it: [
      { name: "Aziz, 28", role: "Startap asoschisi", note: "Tez MVP va arzon narx qidiradi" },
      { name: "Kamola, 33", role: "Korporativ mijoz", note: "SLA va xavfsizlikka e'tibor beradi" },
      { name: "Otabek, 22", role: "Frilanser hamkor", note: "API va integratsiya imkoniyatlarini qidiradi" }
    ],
    other: [
      { name: "Umid, 36", role: "Maqsadli mijoz", note: "Narx va sifat balansini qidiradi" },
      { name: "Feruza, 29", role: "Qaytar mijoz", note: "Yaxshi xizmatdan keyin do'stlariga tavsiya qiladi" },
      { name: "Shoxrux, 40", role: "Hamkor", note: "Uzoq muddatli hamkorlikka qiziqadi" }
    ]
  };
  return catalog[industry] ?? catalog.other;
}
