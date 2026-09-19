// Ballarni 300-850 oralig'ida hisoblovchi og'irliklashtirilgan model.
// Bu serversiz, to'g'ridan-to'g'ri brauzerda ishlaydigan versiya.

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

export function computeCreditScore(input) {
  const {
    monthlyRevenue = 0,
    businessAgeMonths = 0,
    monthlyDebtPayments = 0,
    hasCollateral = false,
    latePayments = 0,
    industry = "other"
  } = input;

  const breakdown = [];

  const revenueScore = clamp(Math.log10(monthlyRevenue + 1) * 40, 0, 220);
  breakdown.push({ factor: "Oylik daromad", points: Math.round(revenueScore), max: 220 });

  const ageScore = clamp(businessAgeMonths * 4, 0, 160);
  breakdown.push({ factor: "Faoliyat tarixi", points: Math.round(ageScore), max: 160 });

  const dti = monthlyRevenue > 0 ? monthlyDebtPayments / monthlyRevenue : 1;
  const dtiScore = clamp((1 - dti) * 180, 0, 180);
  breakdown.push({ factor: "Qarz/daromad nisbati", points: Math.round(dtiScore), max: 180 });

  const collateralScore = hasCollateral ? 90 : 0;
  breakdown.push({ factor: "Garov mavjudligi", points: collateralScore, max: 90 });

  const paymentScore = clamp(150 - latePayments * 30, 0, 150);
  breakdown.push({ factor: "To'lov intizomi", points: Math.round(paymentScore), max: 150 });

  const industryWeights = {
    savdo: 45,
    xizmat: 40,
    ishlabchiqarish: 50,
    it: 50,
    other: 30
  };
  const industryScore = industryWeights[industry] ?? industryWeights.other;
  breakdown.push({ factor: "Soha barqarorligi", points: industryScore, max: 50 });

  const rawTotal = revenueScore + ageScore + dtiScore + collateralScore + paymentScore + industryScore;
  const maxTotal = 220 + 160 + 180 + 90 + 150 + 50; // 850
  const score = Math.round(300 + (rawTotal / maxTotal) * 550);

  let tag = "Past";
  if (score >= 750) tag = "A'lo";
  else if (score >= 670) tag = "Yaxshi";
  else if (score >= 580) tag = "O'rtacha";

  return { score: clamp(score, 300, 850), tag, breakdown };
}

export function matchBanks(score, input, banks) {
  const { monthlyRevenue = 0, businessAgeMonths = 0 } = input;

  return banks.map((bank) => {
    const passScore = score >= bank.minScore;
    const passRevenue = monthlyRevenue >= bank.minMonthlyRevenue;
    const passAge = businessAgeMonths >= bank.minBusinessAgeMonths;
    const pass = passScore && passRevenue && passAge;

    const maxLoan = pass ? Math.round(monthlyRevenue * bank.maxLoanMultiplier) : 0;

    return {
      id: bank.id,
      name: bank.name,
      rate: bank.rate,
      reqs: bank.reqs,
      pass,
      maxLoan,
      checks: { score: passScore, revenue: passRevenue, age: passAge }
    };
  });
}
