export const banks = [
  {
    id: "ipak-yuli",
    name: "Ipak Yo'li Bank",
    minScore: 620,
    minMonthlyRevenue: 15_000_000,
    minBusinessAgeMonths: 6,
    maxLoanMultiplier: 4,
    rate: 0.24,
    reqs: [
      "Kamida 6 oylik faoliyat tarixi",
      "Bank hisobvarag'i bo'yicha aylanma",
      "Kafolat yoki garov (30 mln so'mdan yuqori kreditlar uchun)"
    ]
  },
  {
    id: "hamkorbank",
    name: "Hamkorbank",
    minScore: 560,
    minMonthlyRevenue: 8_000_000,
    minBusinessAgeMonths: 3,
    maxLoanMultiplier: 3,
    rate: 0.26,
    reqs: [
      "Kamida 3 oylik faoliyat",
      "Soliq to'lovlari bo'yicha qarzdorlik yo'qligi",
      "Biznes reja (50 mln so'mdan yuqori kreditlar uchun)"
    ]
  },
  {
    id: "tbc",
    name: "TBC Bank Uzbekistan",
    minScore: 680,
    minMonthlyRevenue: 25_000_000,
    minBusinessAgeMonths: 12,
    maxLoanMultiplier: 5,
    rate: 0.22,
    reqs: [
      "Kamida 12 oylik faoliyat tarixi",
      "Ijobiy kredit tarixi (BKI)",
      "Rasmiy soliq hisobotlari"
    ]
  }
];
