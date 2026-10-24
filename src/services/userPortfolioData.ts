import { PortfolioPosition } from '../types';

// The exact 8 assets extracted directly from the user's Thndr Web Screenshot (media_1792710541269_f1f3779d.png)
export const USER_ACTUAL_THNDR_POSITIONS: PortfolioPosition[] = [
  {
    id: "thndr-comi",
    symbol: "COMI",
    assetType: "stock",
    shares: 277,
    buyPrice: 123.497,
    buyDate: "2026-10-21",
    stopLoss: 119.60,
    targetPrice: 137.90,
    notes: "البنك التجاري الدولي (CIB) • الوزن بالمحفظة 34.26%"
  },
  {
    id: "thndr-tmgh",
    symbol: "TMGH",
    assetType: "stock",
    shares: 180,
    buyPrice: 84.069,
    buyDate: "2026-10-21",
    stopLoss: 82.50,
    targetPrice: 94.00,
    notes: "مجموعة طلعت مصطفى • الوزن بالمحفظة 15.48%"
  },
  {
    id: "thndr-swdy",
    symbol: "SWDY",
    assetType: "stock",
    shares: 105,
    buyPrice: 105.288,
    buyDate: "2026-10-21",
    stopLoss: 100.00,
    targetPrice: 115.00,
    notes: "السويدي إليكتريك • الوزن بالمحفظة 11.10%"
  },
  {
    id: "thndr-ccap",
    symbol: "CCAP",
    assetType: "stock",
    shares: 1403,
    buyPrice: 6.085,
    buyDate: "2026-10-21",
    stopLoss: 5.85,
    targetPrice: 7.15,
    notes: "القلعة للاستشارات • الوزن بالمحفظة 8.78%"
  },
  {
    id: "thndr-t70",
    symbol: "T70",
    assetType: "fund",
    shares: 10780,
    buyPrice: 1.50,
    buyDate: "2026-10-21",
    stopLoss: 1.35,
    targetPrice: 1.65,
    notes: "صندوق ثاندر T70 للأسهم • الوزن بالمحفظة 14.90%"
  },
  {
    id: "thndr-abr",
    symbol: "ABR",
    assetType: "fund",
    shares: 41,
    buyPrice: 217.29,
    buyDate: "2026-10-21",
    stopLoss: 215.00,
    targetPrice: 225.00,
    notes: "صندوق بريق (دخل ثابت وسيولة) • الوزن بالمحفظة 8.84%"
  },
  {
    id: "thndr-bmm",
    symbol: "BMM",
    assetType: "fund",
    shares: 1608,
    buyPrice: 2.61,
    buyDate: "2026-10-21",
    stopLoss: 2.10,
    targetPrice: 2.80,
    notes: "صندوق بلتون مية مية • الوزن بالمحفظة 3.42%"
  },
  {
    id: "thndr-gold",
    symbol: "THNDRGOLD",
    assetType: "gold",
    shares: 0.0824,
    grams: 0.0824,
    isGold: true,
    buyPrice: 7351.54,
    buyDate: "2026-10-21",
    stopLoss: 7000.00,
    targetPrice: 7793.29,
    breakEvenPrice: 7422.18,
    totalCostWithFees: 605.47,
    buyFeePercent: 1.0,
    sellFeePercent: 1.0,
    notes: "دهب ثاندر عيار 24 • وزن 0.0824 جرام • سعر التعادل 7,422.18 ج.م/جرام"
  }
];
