export interface StockData {
  symbol: string;         // e.g. "COMI"
  ticker: string;         // e.g. "EGX:COMI"
  nameAr: string;         // e.g. "البنك التجاري الدولي"
  nameEn: string;
  close: number;
  change: number;
  changePercent: number;
  volume: number;
  recommendationScore: number; // -1 to 1
  recommendationText: 'شراء قوي' | 'شراء' | 'مراقبة / محايد' | 'بيع' | 'بيع قوي / خروج';
  rsi: number;
  rsi1h?: number;
  rec1h?: number;
  rec4h?: number;
  rec1w?: number;
  ema20: number;
  ema50: number;
  ema200: number;
  support1: number;
  support2: number;
  resistance1: number;
  resistance2: number;
  pivot: number;
  isEGX30?: boolean;
  isEGX70?: boolean;
  isEGX100?: boolean;
  sector?: string;
  isFund?: boolean;
  isGold?: boolean;
}

export interface PortfolioPosition {
  id: string;
  symbol: string;
  assetType?: 'stock' | 'fund' | 'gold';
  shares: number; // For stocks: count of shares; for gold: grams (e.g. 0.0824)
  buyPrice: number; // For stocks: price per share; for gold: buy price per gram
  buyDate: string;
  stopLoss?: number;
  targetPrice?: number;
  notes?: string;
  iconUrl?: string; // Optional custom logo or avatar
  isGold?: boolean;
  isFund?: boolean;
  grams?: number;
  goldKarat?: number; // 24, 21, etc.
  buyFeePercent?: number; // Thndr default 1%
  sellFeePercent?: number; // Thndr default 1%
  breakEvenPrice?: number; // Required selling price per gram to break even
  targetProfitPrice?: number; // Suggested price for target profit
  totalCostWithFees?: number; // Actual total cash paid including 1% buy fee
}

export interface MutualFund {
  id: string;
  code: string;
  name: string;
  category: 'كلاودز' | 'ذهب وفضة' | 'أسهم نشطة' | 'أسهم مؤشرات (سلبية)' | 'دخل ثابت ونقدي';
  dailyChange: number; // Daily change %
  nav?: number;        // Latest net asset value
  thndrAvailable: boolean;
  isSavingPot?: boolean;
}

export interface SavingPotProduct {
  id: string;
  name: string;
  code: string;
  type: 'daily' | 'monthly';
  expectedAnnualRate: string;
  payoutFrequency: string;
  minDeposit: number;
  fee: string;
  navPriceText: string;
  description: string;
}

export interface EGXNewsItem {
  id: string;
  title: string;
  company: string;
  symbol?: string;
  time: string;
  category: 'إفصاح رسمي' | 'توزيعات أرباح' | 'نتائج أعمال' | 'استحواذ ودمج' | 'أخبار عامة';
  sentiment: 'إيجابي' | 'محايد' | 'سلبي';
  summary: string;
}
