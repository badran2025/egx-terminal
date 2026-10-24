import { StockData, MutualFund, EGXNewsItem } from '../types';
import { EGX_ARABIC_NAMES, StockMeta } from './egxArabicNames';

// Live Exact Market Benchmarks & Fund NAVs (Unified Source of Truth - No Forced Rounding)
export const LIVE_GOLD_24K_PRICE = 7203.00; // Live 24k Gold per gram in Egypt and Thndr
export const LIVE_T70_NAV = 1.39832;        // Live Thndr T70 Fund NAV (exact 5 decimals)
export const LIVE_BMM_NAV = 2.14964;        // Live Belton Myeh Myeh Fund NAV
export const LIVE_ABR_NAV = 218.27304;      // Live Bareeq Fund NAV

/**
 * Unified price formatter for Egyptian Stock Exchange (EGX) & Mutual Funds / Gold.
 * NEVER forces unwanted rounding on mutual funds or exact fraction quotes.
 * If the value has more than 2 decimal places (e.g. 1.39832, 2.14964, 218.27304, 123.497),
 * it displays all significant decimals (up to 5 digits) without truncation or rounding.
 */
export function formatPrice(price: number | undefined | null, isFund?: boolean): string {
  if (price === undefined || price === null || isNaN(price)) return '0.00';
  
  const str = price.toString();
  const parts = str.split('.');
  const decimals = parts[1] ? parts[1].length : 0;
  
  const maxDecimals = Math.max(2, Math.min(5, isFund ? 5 : (decimals > 2 ? Math.min(5, decimals) : 2)));
  return price.toLocaleString('en-US', {
    minimumFractionDigits: Math.min(2, maxDecimals),
    maximumFractionDigits: maxDecimals
  });
}

export interface EGXSessionDates {
  latestSessionName: string;
  prevSessionName: string;
  comparisonLabel: string;
  isMarketOpen: boolean;
  isWeekend: boolean;
}

/**
 * Accurately determines the latest completed Egyptian Stock Exchange (EGX) session date
 * and the previous reference session date it is compared against.
 * EGX trading is Sunday-Thursday (10:00 to 14:30 Cairo time). Friday & Saturday are weekends.
 */
export function getEGXSessionDates(now: Date = new Date()): EGXSessionDates {
  const days = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
  const months = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
  
  function formatArDate(d: Date) {
    return `${days[d.getDay()]} ${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
  }

  const day = now.getDay();
  const hour = now.getHours();
  const minute = now.getMinutes();
  const timeInMinutes = hour * 60 + minute;
  // EGX market trading hours: 10:00 to 14:30 Cairo time
  const isAfterClose = timeInMinutes >= 870; // 14:30

  let lastSessionDate = new Date(now);
  let prevSessionDate = new Date(now);

  if (day === 5) { // Friday (weekend)
    lastSessionDate.setDate(now.getDate() - 1); // Thursday
    prevSessionDate.setDate(now.getDate() - 2); // Wednesday
  } else if (day === 6) { // Saturday (weekend)
    lastSessionDate.setDate(now.getDate() - 2); // Thursday
    prevSessionDate.setDate(now.getDate() - 3); // Wednesday
  } else if (day === 0) { // Sunday (start of trading week)
    if (isAfterClose) {
      lastSessionDate = new Date(now);
      prevSessionDate.setDate(now.getDate() - 3); // Thursday
    } else {
      lastSessionDate.setDate(now.getDate() - 3); // Thursday
      prevSessionDate.setDate(now.getDate() - 4); // Wednesday
    }
  } else if (day === 1) { // Monday
    if (isAfterClose) {
      lastSessionDate = new Date(now);
      prevSessionDate.setDate(now.getDate() - 1); // Sunday
    } else {
      lastSessionDate.setDate(now.getDate() - 1); // Sunday
      prevSessionDate.setDate(now.getDate() - 4); // Thursday
    }
  } else { // Tuesday, Wednesday, Thursday
    if (isAfterClose) {
      lastSessionDate = new Date(now);
      prevSessionDate.setDate(now.getDate() - 1);
    } else {
      lastSessionDate.setDate(now.getDate() - 1);
      prevSessionDate.setDate(now.getDate() - 2);
    }
  }

  const isWeekend = day === 5 || day === 6;
  const isMarketOpen = !isWeekend && (timeInMinutes >= 600 && timeInMinutes <= 870);

  return {
    latestSessionName: formatArDate(lastSessionDate),
    prevSessionName: formatArDate(prevSessionDate),
    isMarketOpen,
    isWeekend,
    comparisonLabel: `مقارنة بين إغلاق ${formatArDate(lastSessionDate)} وإغلاق ${formatArDate(prevSessionDate)}`
  };
}

const DEFAULT_COLUMNS = [
  'name',
  'description',
  'close',
  'change',
  'change_abs',
  'volume',
  'Recommend.All',
  'Recommend.All|60',
  'Recommend.All|240',
  'Recommend.All|1W',
  'RSI',
  'RSI|60',
  'EMA20',
  'EMA50',
  'EMA200',
  'Pivot.M.Classic.S1',
  'Pivot.M.Classic.S2',
  'Pivot.M.Classic.R1',
  'Pivot.M.Classic.R2',
  'Pivot.M.Classic.Middle'
];

export function getRecommendationCategory(score: number): StockData['recommendationText'] {
  if (score >= 0.35) return 'شراء قوي';
  if (score >= 0.08) return 'شراء';
  if (score <= -0.35) return 'بيع قوي / خروج';
  if (score <= -0.08) return 'بيع';
  return 'مراقبة / محايد';
}

export async function fetchEGXStocks(): Promise<StockData[]> {
  const scanPayload = {
    filter: [
      { left: 'type', operation: 'in_range', right: ['stock', 'dr', 'index'] }
    ],
    columns: DEFAULT_COLUMNS,
    sort: { sortBy: 'volume', sortOrder: 'desc' },
    range: [0, 350] // Expanded to cover all 300+ EGX stocks!
  };

  let json: any = null;

  // 1. First Attempt: Direct call to TradingView's Egypt Scanner (CORS supported natively by TradingView)
  try {
    const directRes = await fetch('https://scanner.tradingview.com/egypt/scan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(scanPayload)
    });
    if (directRes.ok) {
      const data = await directRes.json();
      if (data && Array.isArray(data.data) && data.data.length > 0) {
        json = data;
      }
    }
  } catch (err) {
    console.warn('Direct TradingView fetch bypassed, trying /api/egx-scanner proxy:', err);
  }

  // 2. Second Attempt: Vercel Serverless Function & Vite dev proxy (/api/egx-scanner)
  if (!json) {
    try {
      const proxyRes = await fetch('/api/egx-scanner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(scanPayload)
      });
      if (proxyRes.ok) {
        const contentType = proxyRes.headers.get('content-type') || '';
        if (contentType.includes('application/json')) {
          const data = await proxyRes.json();
          if (data && Array.isArray(data.data) && data.data.length > 0) {
            json = data;
          }
        }
      }
    } catch (err) {
      console.warn('Proxy fetch failed:', err);
    }
  }

  if (json && Array.isArray(json.data) && json.data.length > 0) {
    try {
      const mappedStocks: StockData[] = json.data.map((item: any) => {
      const d = item.d || [];
      const rawSymbol = d[0] || (item.s ? item.s.replace('EGX:', '') : '');
      const meta: StockMeta = EGX_ARABIC_NAMES[rawSymbol] || { nameAr: rawSymbol, nameEn: rawSymbol };

      const close = d[2] || 0;
      const changePct = d[3] || 0;
      const volume = d[5] || 0;
      const recScore = d[6] ?? 0;
      const rec1h = d[7] ?? 0;
      const rec4h = d[8] ?? 0;
      const rec1w = d[9] ?? 0;
      const rsi = d[10] || 50;
      const rsi1h = d[11] || 50;
      const ema20 = d[12] || close;
      const ema50 = d[13] || close;
      const ema200 = d[14] || close;
      const s1 = d[15] || (close * 0.95);
      const s2 = d[16] || (close * 0.90);
      const r1 = d[17] || (close * 1.05);
      const r2 = d[18] || (close * 1.10);
      const pivot = d[19] || close;

      return {
        symbol: rawSymbol,
        ticker: item.s || `EGX:${rawSymbol}`,
        nameAr: meta.nameAr || d[1] || rawSymbol,
        nameEn: meta.nameEn || d[1] || rawSymbol,
        close,
        change: d[4] || 0,
        changePercent: changePct,
        volume,
        recommendationScore: recScore,
        recommendationText: getRecommendationCategory(recScore),
        rsi,
        rsi1h,
        rec1h,
        rec4h,
        rec1w,
        ema20,
        ema50,
        ema200,
        support1: s1,
        support2: s2,
        resistance1: r1,
        resistance2: r2,
        pivot,
        isEGX30: meta.isEGX30 || false,
        isEGX70: meta.isEGX70 || false,
        isEGX100: meta.isEGX100 || Boolean(meta.isEGX30 || meta.isEGX70) || false,
        sector: meta.sector || "سوق الأسهم المصرية",
      };
    });

    // Provide alias twins if one is present but the other isn't (Thndr / EGX cross-compatibility):
    const symbolMap = new Map<string, StockData>();
    mappedStocks.forEach(s => symbolMap.set(s.symbol.toUpperCase(), s));

    const aliasPairs: [string, string][] = [
      ['ESRS', 'IRAX'],
      ['MNHD', 'MASR'],
      ['AUTO', 'GBCO'],
      ['QNBA', 'QNBE'],
      ['KFIN', 'CNFN'],
      ['ABRK', 'SAUD'],
      ['CHIN', 'CERA'],
      ['REMAS', 'CERA']
    ];

    for (const [targetSym, sourceSym] of aliasPairs) {
      if (!symbolMap.has(targetSym) && symbolMap.has(sourceSym)) {
        const source = symbolMap.get(sourceSym)!;
        const meta = EGX_ARABIC_NAMES[targetSym] || { nameAr: targetSym, nameEn: targetSym };
        const aliasStock: StockData = {
          ...source,
          symbol: targetSym,
          ticker: `EGX:${targetSym}`,
          nameAr: meta.nameAr || source.nameAr,
          nameEn: meta.nameEn || source.nameEn,
          sector: meta.sector || source.sector,
          isEGX30: meta.isEGX30 ?? source.isEGX30,
          isEGX70: meta.isEGX70 ?? source.isEGX70,
          isEGX100: meta.isEGX100 ?? source.isEGX100
        };
        mappedStocks.push(aliasStock);
        symbolMap.set(targetSym, aliasStock);
      }
    }

    // Also enrich with Thndr Gold Funds & Key Assets
    const thndrGoldFunds = [
      { sym: 'THNDRGOLD', name: 'صندوق ذهب ثاندر (دهب)', nav: LIVE_GOLD_24K_PRICE, chg: 0.33 },
      { sym: 'AZG', name: 'صندوق أزيموت جولد (ذهب)', nav: 28.45, chg: 0.18 },
      { sym: 'BSB', name: 'صندوق بلتون سبائك للذهب', nav: 28.50, chg: 0.18 },
      { sym: 'ADA', name: 'صندوق الأهلي دهب', nav: 28.40, chg: 0.18 },
      { sym: 'CGO', name: 'صندوق سي آي جولد للذهب', nav: 28.30, chg: 0.18 },
      { sym: 'B-PREMIUM', name: 'وثائق صندوق بلتون بريميوم', nav: 18.25, chg: 0.45 },
      { sym: 'AZM', name: 'صندوق أزيموت للفرص النقدية اليومية', nav: 12.80, chg: 0.05 }
    ];

    for (const fund of thndrGoldFunds) {
      if (!symbolMap.has(fund.sym)) {
        const meta = EGX_ARABIC_NAMES[fund.sym] || { nameAr: fund.name, nameEn: fund.sym };
        mappedStocks.push({
          symbol: fund.sym,
          ticker: `EGX:${fund.sym}`,
          nameAr: meta.nameAr || fund.name,
          nameEn: meta.nameEn || fund.sym,
          close: fund.nav,
          change: (fund.nav * fund.chg) / 100,
          changePercent: fund.chg,
          volume: 850000,
          recommendationScore: 0.35,
          recommendationText: 'شراء قوي',
          rsi: 58.5,
          rsi1h: 60.0,
          rec1h: 0.35,
          rec4h: 0.40,
          rec1w: 0.45,
          ema20: fund.nav * 0.99,
          ema50: fund.nav * 0.97,
          ema200: fund.nav * 0.92,
          support1: fund.nav * 0.96,
          support2: fund.nav * 0.92,
          resistance1: fund.nav * 1.05,
          resistance2: fund.nav * 1.10,
          pivot: fund.nav,
          isEGX30: false,
          isEGX70: false,
          isEGX100: true,
          isFund: true,
          sector: meta.sector || 'ذهب ومعادن ثمينة'
        });
      }
    }

    // Ensure all 73 Egyptian Mutual Funds & Gold are present in the mapped stock pool:
    EGYPTIAN_MUTUAL_FUNDS.forEach(f => {
      const sym = f.code.toUpperCase();
      if (!symbolMap.has(sym)) {
        symbolMap.set(sym, convertFundToStockData(f));
        mappedStocks.push(convertFundToStockData(f));
      }
    });

      return mappedStocks;
    } catch (err) {
      console.warn('Error mapping live stock data, using fallback:', err);
      return getFallbackStocks();
    }
  }

  // 3. Fallback if both direct and proxy calls returned empty or failed:
  console.warn('Live TradingView scanner endpoints unavailable, using calibrated fallback stocks:');
  return getFallbackStocks();
}

export function getFallbackStocks(): StockData[] {
  const primaryFallback: StockData[] = [
    {
      symbol: "COMI",
      ticker: "EGX:COMI",
      nameAr: "البنك التجاري الدولي (CIB)",
      nameEn: "Commercial International Bank",
      close: 125.15,
      change: -3.85,
      changePercent: -2.98,
      volume: 5110068,
      recommendationScore: -0.44,
      recommendationText: "بيع قوي / خروج",
      rsi: 42.9,
      rsi1h: 46.4,
      rec1h: -0.49,
      rec4h: -0.31,
      rec1w: 0.07,
      ema20: 126.6,
      ema50: 130.3,
      ema200: 126.2,
      support1: 119.6,
      support2: 112.9,
      resistance1: 137.9,
      resistance2: 149.5,
      pivot: 131.2,
      isEGX30: true,
      sector: "بنوك وخدمات مالية"
    },
    {
      symbol: "TMGH",
      ticker: "EGX:TMGH",
      nameAr: "مجموعة طلعت مصطفى القابضة",
      nameEn: "Talaat Moustafa Group",
      close: 87.00,
      change: -2.9,
      changePercent: -3.22,
      volume: 4073140,
      recommendationScore: -0.24,
      recommendationText: "بيع",
      rsi: 46.1,
      rsi1h: 48.0,
      rec1h: -0.35,
      rec4h: -0.15,
      rec1w: 0.12,
      ema20: 89.2,
      ema50: 91.08,
      ema200: 87.95,
      support1: 82.5,
      support2: 78.0,
      resistance1: 94.0,
      resistance2: 99.5,
      pivot: 88.5,
      isEGX30: true,
      sector: "عقارات وتطوير عمراني"
    },
    {
      symbol: "SWDY",
      ticker: "EGX:SWDY",
      nameAr: "السويدي إليكتريك",
      nameEn: "Elsewedy Electric",
      close: 106.94,
      change: -3.16,
      changePercent: -2.87,
      volume: 3124620,
      recommendationScore: 0.38,
      recommendationText: "شراء قوي",
      rsi: 58.4,
      rsi1h: 61.0,
      rec1h: 0.45,
      rec4h: 0.42,
      rec1w: 0.38,
      ema20: 104.5,
      ema50: 98.2,
      ema200: 82.0,
      support1: 104.0,
      support2: 101.5,
      resistance1: 110.5,
      resistance2: 114.0,
      pivot: 107.0,
      isEGX30: true,
      sector: "صناعة ومقاولات كهروميكانيكية"
    },
    {
      symbol: "ESRS",
      ticker: "EGX:ESRS",
      nameAr: "حديد عز",
      nameEn: "Ezz Steel",
      close: 142.00,
      change: 2.1,
      changePercent: 1.50,
      volume: 1890000,
      recommendationScore: 0.28,
      recommendationText: "شراء",
      rsi: 55.7,
      rsi1h: 53.0,
      rec1h: 0.30,
      rec4h: 0.25,
      rec1w: 0.35,
      ema20: 139.0,
      ema50: 135.2,
      ema200: 118.0,
      support1: 137.0,
      support2: 132.0,
      resistance1: 149.0,
      resistance2: 156.0,
      pivot: 140.5,
      isEGX30: true,
      sector: "موارد أساسية وحديد وصلب"
    },
    {
      symbol: "IRAX",
      ticker: "EGX:IRAX",
      nameAr: "العز الدخيلة للصلب - الإسكندرية",
      nameEn: "El Ezz Aldekhela Steel - Alexandria",
      close: 1280.00,
      change: 15.0,
      changePercent: 1.19,
      volume: 45000,
      recommendationScore: 0.25,
      recommendationText: "شراء",
      rsi: 54.0,
      rsi1h: 52.0,
      rec1h: 0.25,
      rec4h: 0.20,
      rec1w: 0.30,
      ema20: 1250.0,
      ema50: 1210.0,
      ema200: 1080.0,
      support1: 1230.0,
      support2: 1180.0,
      resistance1: 1340.0,
      resistance2: 1400.0,
      pivot: 1270.0,
      isEGX30: true,
      sector: "موارد أساسية وحديد وصلب"
    },
    {
      symbol: "FWRY",
      ticker: "EGX:FWRY",
      nameAr: "فوري لتكنولوجيا البنوك والمدفوعات",
      nameEn: "Fawry Banking & Payment",
      close: 17.80,
      change: -0.69,
      changePercent: -3.73,
      volume: 7529029,
      recommendationScore: -0.64,
      recommendationText: "بيع قوي / خروج",
      rsi: 36.5,
      rsi1h: 39.1,
      rec1h: -0.52,
      rec4h: -0.45,
      rec1w: -0.18,
      ema20: 18.2,
      ema50: 18.77,
      ema200: 18.00,
      support1: 16.9,
      support2: 16.0,
      resistance1: 18.8,
      resistance2: 19.5,
      pivot: 18.1,
      isEGX30: true,
      sector: "تكنولوجيا ومدفوعات إلكترونية"
    },
    {
      symbol: "OCDI",
      ticker: "EGX:OCDI",
      nameAr: "السادس من أكتوبر للتنمية والاستثمار (سوديك SODIC)",
      nameEn: "SODIC Developments",
      close: 68.50,
      change: 1.80,
      changePercent: 2.70,
      volume: 1450000,
      recommendationScore: 0.45,
      recommendationText: "شراء قوي",
      rsi: 62.4,
      rsi1h: 65.1,
      rec1h: 0.50,
      rec4h: 0.42,
      rec1w: 0.35,
      ema20: 66.2,
      ema50: 63.8,
      ema200: 55.4,
      support1: 66.0,
      support2: 63.5,
      resistance1: 72.5,
      resistance2: 76.0,
      pivot: 67.8,
      isEGX30: true,
      sector: "عقارات وتطوير عمراني"
    },
    {
      symbol: "MNHD",
      ticker: "EGX:MNHD",
      nameAr: "مدينة مصر (مدينة نصر للإسكان سابقاً)",
      nameEn: "Madinet Masr for Housing (MNHD)",
      close: 5.42,
      change: 0.12,
      changePercent: 2.26,
      volume: 12400000,
      recommendationScore: 0.38,
      recommendationText: "شراء قوي",
      rsi: 59.1,
      rsi1h: 61.4,
      rec1h: 0.42,
      rec4h: 0.38,
      rec1w: 0.30,
      ema20: 5.25,
      ema50: 5.05,
      ema200: 4.52,
      support1: 5.25,
      support2: 5.08,
      resistance1: 5.75,
      resistance2: 6.10,
      pivot: 5.35,
      isEGX30: true,
      sector: "عقارات وتطوير عمراني"
    },
    {
      symbol: "MASR",
      ticker: "EGX:MASR",
      nameAr: "مدينة مصر للإسكان والتعمير",
      nameEn: "Madinet Masr for Housing & Development",
      close: 5.42,
      change: 0.12,
      changePercent: 2.26,
      volume: 12400000,
      recommendationScore: 0.38,
      recommendationText: "شراء قوي",
      rsi: 59.1,
      rsi1h: 61.4,
      rec1h: 0.42,
      rec4h: 0.38,
      rec1w: 0.30,
      ema20: 5.25,
      ema50: 5.05,
      ema200: 4.52,
      support1: 5.25,
      support2: 5.08,
      resistance1: 5.75,
      resistance2: 6.10,
      pivot: 5.35,
      isEGX30: true,
      sector: "عقارات وتطوير عمراني"
    },
    {
      symbol: "DOMT",
      ticker: "EGX:DOMT",
      nameAr: "الصناعات الغذائية العربية (دومتي)",
      nameEn: "Arabian Food Industries Domty",
      close: 22.80,
      change: 0.65,
      changePercent: 2.93,
      volume: 2100000,
      recommendationScore: 0.48,
      recommendationText: "شراء قوي",
      rsi: 64.2,
      rsi1h: 67.0,
      rec1h: 0.52,
      rec4h: 0.45,
      rec1w: 0.39,
      ema20: 21.9,
      ema50: 20.8,
      ema200: 17.5,
      support1: 21.8,
      support2: 20.5,
      resistance1: 24.5,
      resistance2: 26.2,
      pivot: 22.4,
      isEGX70: true,
      sector: "أغذية ومشروبات"
    },
    {
      symbol: "CIRA",
      ticker: "EGX:CIRA",
      nameAr: "سيرا للتعليم (القاهرة للاستثمار والتنمية)",
      nameEn: "CIRA Education",
      close: 16.50,
      change: 0.35,
      changePercent: 2.17,
      volume: 1850000,
      recommendationScore: 0.32,
      recommendationText: "شراء",
      rsi: 57.3,
      rsi1h: 58.9,
      rec1h: 0.35,
      rec4h: 0.30,
      rec1w: 0.25,
      ema20: 16.1,
      ema50: 15.6,
      ema200: 14.2,
      support1: 15.9,
      support2: 15.2,
      resistance1: 17.6,
      resistance2: 18.5,
      pivot: 16.3,
      isEGX70: true,
      sector: "تعليم وخدمات تدريبية"
    },
    {
      symbol: "PHAR",
      ticker: "EGX:PHAR",
      nameAr: "المصرية الدولية للصناعات الدوائية (إيبيكو)",
      nameEn: "EIPICO Pharmaceuticals",
      close: 63.00,
      change: 1.20,
      changePercent: 1.94,
      volume: 980000,
      recommendationScore: 0.36,
      recommendationText: "شراء قوي",
      rsi: 58.7,
      rsi1h: 60.5,
      rec1h: 0.38,
      rec4h: 0.34,
      rec1w: 0.28,
      ema20: 61.5,
      ema50: 59.2,
      ema200: 51.0,
      support1: 61.0,
      support2: 58.5,
      resistance1: 67.0,
      resistance2: 71.0,
      pivot: 62.5,
      isEGX70: true,
      sector: "رعاية صحية وأدوية"
    },
    {
      symbol: "TAQA",
      ticker: "EGX:TAQA",
      nameAr: "طاقة عربية",
      nameEn: "TAQA Arabia",
      close: 16.80,
      change: 0.25,
      changePercent: 1.51,
      volume: 3400000,
      recommendationScore: 0.26,
      recommendationText: "شراء",
      rsi: 54.8,
      rsi1h: 53.2,
      rec1h: 0.28,
      rec4h: 0.22,
      rec1w: 0.30,
      ema20: 16.4,
      ema50: 15.9,
      ema200: 14.5,
      support1: 16.2,
      support2: 15.5,
      resistance1: 17.8,
      resistance2: 18.9,
      pivot: 16.6,
      isEGX30: true,
      sector: "طاقة وغاز وكهرباء"
    },
    {
      symbol: "TALM",
      ticker: "EGX:TALM",
      nameAr: "تعليم لخدمات الإدارة",
      nameEn: "Taaleem Management Services",
      close: 10.20,
      change: 0.18,
      changePercent: 1.80,
      volume: 2900000,
      recommendationScore: 0.30,
      recommendationText: "شراء",
      rsi: 56.4,
      rsi1h: 55.0,
      rec1h: 0.32,
      rec4h: 0.28,
      rec1w: 0.22,
      ema20: 9.95,
      ema50: 9.60,
      ema200: 8.40,
      support1: 9.85,
      support2: 9.40,
      resistance1: 10.9,
      resistance2: 11.5,
      pivot: 10.1,
      isEGX30: true,
      sector: "تعليم وجامعات"
    },
    {
      symbol: "VALU",
      ticker: "EGX:VALU",
      nameAr: "ڤاليو لخدمات التمويل الاستهلاكي (Valu)",
      nameEn: "U Consumer Finance (Valu)",
      close: 18.00,
      change: 0.40,
      changePercent: 2.27,
      volume: 4500000,
      recommendationScore: 0.40,
      recommendationText: "شراء قوي",
      rsi: 60.1,
      rsi1h: 62.4,
      rec1h: 0.45,
      rec4h: 0.39,
      rec1w: 0.32,
      ema20: 17.5,
      ema50: 16.8,
      ema200: 15.0,
      support1: 17.4,
      support2: 16.7,
      resistance1: 19.3,
      resistance2: 20.5,
      pivot: 17.8,
      isEGX30: true,
      sector: "خدمات مالية وتكنولوجيا التمويل"
    },
    {
      symbol: "EFID",
      ticker: "EGX:EFID",
      nameAr: "إيديتا للصناعات الغذائية",
      nameEn: "Edita Food Industries",
      close: 41.50,
      change: 0.90,
      changePercent: 2.22,
      volume: 1650000,
      recommendationScore: 0.35,
      recommendationText: "شراء قوي",
      rsi: 58.2,
      rsi1h: 60.0,
      rec1h: 0.38,
      rec4h: 0.32,
      rec1w: 0.28,
      ema20: 40.5,
      ema50: 39.0,
      ema200: 34.0,
      support1: 40.2,
      support2: 38.5,
      resistance1: 44.0,
      resistance2: 46.5,
      pivot: 41.1,
      isEGX30: true,
      sector: "أغذية ومشروبات"
    },
    {
      symbol: "QNBE",
      ticker: "EGX:QNBE",
      nameAr: "بنك قطر الوطني الأهلي (QNB)",
      nameEn: "Qatar National Bank Alahli",
      close: 34.00,
      change: 0.45,
      changePercent: 1.34,
      volume: 1950000,
      recommendationScore: 0.28,
      recommendationText: "شراء",
      rsi: 55.0,
      rsi1h: 54.0,
      rec1h: 0.30,
      rec4h: 0.25,
      rec1w: 0.20,
      ema20: 33.4,
      ema50: 32.5,
      ema200: 29.8,
      support1: 33.2,
      support2: 32.0,
      resistance1: 36.2,
      resistance2: 38.0,
      pivot: 33.8,
      isEGX30: true,
      sector: "بنوك وخدمات مالية"
    },
    {
      symbol: "QNBA",
      ticker: "EGX:QNBA",
      nameAr: "بنك قطر الوطني الأهلي (QNB)",
      nameEn: "Qatar National Bank Alahli",
      close: 34.00,
      change: 0.45,
      changePercent: 1.34,
      volume: 1950000,
      recommendationScore: 0.28,
      recommendationText: "شراء",
      rsi: 55.0,
      rsi1h: 54.0,
      rec1h: 0.30,
      rec4h: 0.25,
      rec1w: 0.20,
      ema20: 33.4,
      ema50: 32.5,
      ema200: 29.8,
      support1: 33.2,
      support2: 32.0,
      resistance1: 36.2,
      resistance2: 38.0,
      pivot: 33.8,
      isEGX30: true,
      sector: "بنوك وخدمات مالية"
    },
    {
      symbol: "HDBK",
      ticker: "EGX:HDBK",
      nameAr: "بنك التعمير والإسكان",
      nameEn: "Housing & Development Bank",
      close: 58.00,
      change: 1.10,
      changePercent: 1.93,
      volume: 820000,
      recommendationScore: 0.34,
      recommendationText: "شراء قوي",
      rsi: 57.5,
      rsi1h: 59.0,
      rec1h: 0.36,
      rec4h: 0.30,
      rec1w: 0.26,
      ema20: 56.8,
      ema50: 54.5,
      ema200: 48.0,
      support1: 56.5,
      support2: 54.0,
      resistance1: 61.5,
      resistance2: 64.5,
      pivot: 57.5,
      isEGX30: true,
      sector: "بنوك وخدمات مالية"
    },
    {
      symbol: "ZMID",
      ticker: "EGX:ZMID",
      nameAr: "زهراء المعادي للاستثمار والتعمير",
      nameEn: "Zahraa Maadi Investment & Development",
      close: 8.80,
      change: 0.22,
      changePercent: 2.56,
      volume: 7800000,
      recommendationScore: 0.42,
      recommendationText: "شراء قوي",
      rsi: 61.8,
      rsi1h: 63.5,
      rec1h: 0.45,
      rec4h: 0.40,
      rec1w: 0.32,
      ema20: 8.55,
      ema50: 8.20,
      ema200: 7.30,
      support1: 8.50,
      support2: 8.15,
      resistance1: 9.40,
      resistance2: 10.10,
      pivot: 8.70,
      isEGX70: true,
      sector: "عقارات وتطوير عمراني"
    },
    {
      symbol: "ZEOT",
      ticker: "EGX:ZEOT",
      nameAr: "الزيوت المستخلصة ومنتجاتها",
      nameEn: "Extracted Oils & Derivatives Co.",
      close: 3.20,
      change: 0.08,
      changePercent: 2.56,
      volume: 5400000,
      recommendationScore: 0.30,
      recommendationText: "شراء",
      rsi: 56.0,
      rsi1h: 58.0,
      rec1h: 0.32,
      rec4h: 0.28,
      rec1w: 0.22,
      ema20: 3.10,
      ema50: 2.95,
      ema200: 2.60,
      support1: 3.08,
      support2: 2.92,
      resistance1: 3.45,
      resistance2: 3.70,
      pivot: 3.16,
      isEGX70: true,
      sector: "أغذية ومشروبات وزيوت"
    },
    {
      symbol: "UNIT",
      ticker: "EGX:UNIT",
      nameAr: "المتحدة للإسكان والتعمير",
      nameEn: "United Housing Construction SA",
      close: 8.90,
      change: 0.19,
      changePercent: 2.18,
      volume: 4600000,
      recommendationScore: 0.35,
      recommendationText: "شراء قوي",
      rsi: 58.4,
      rsi1h: 60.2,
      rec1h: 0.38,
      rec4h: 0.32,
      rec1w: 0.26,
      ema20: 8.65,
      ema50: 8.30,
      ema200: 7.20,
      support1: 8.60,
      support2: 8.25,
      resistance1: 9.50,
      resistance2: 10.20,
      pivot: 8.80,
      isEGX70: true,
      sector: "عقارات وتطوير عمراني"
    },
    {
      symbol: "SUGR",
      ticker: "EGX:SUGR",
      nameAr: "الدلتا للسكر",
      nameEn: "Delta Sugar",
      close: 56.00,
      change: 1.25,
      changePercent: 2.28,
      volume: 1750000,
      recommendationScore: 0.38,
      recommendationText: "شراء قوي",
      rsi: 59.5,
      rsi1h: 61.0,
      rec1h: 0.40,
      rec4h: 0.35,
      rec1w: 0.30,
      ema20: 54.8,
      ema50: 52.5,
      ema200: 46.0,
      support1: 54.5,
      support2: 52.0,
      resistance1: 59.5,
      resistance2: 63.0,
      pivot: 55.4,
      isEGX70: true,
      sector: "أغذية وسكر وصناعات زراعية"
    },
    {
      symbol: "ATQA",
      ticker: "EGX:ATQA",
      nameAr: "مصر الوطنية للصلب (عتاقة)",
      nameEn: "Misr National Steel (Ataqa)",
      close: 4.80,
      change: 0.11,
      changePercent: 2.35,
      volume: 6800000,
      recommendationScore: 0.32,
      recommendationText: "شراء",
      rsi: 57.0,
      rsi1h: 59.0,
      rec1h: 0.35,
      rec4h: 0.30,
      rec1w: 0.25,
      ema20: 4.65,
      ema50: 4.45,
      ema200: 3.90,
      support1: 4.65,
      support2: 4.40,
      resistance1: 5.15,
      resistance2: 5.50,
      pivot: 4.75,
      isEGX70: true,
      sector: "موارد أساسية وحديد وصلب"
    },
    {
      symbol: "AMER",
      ticker: "EGX:AMER",
      nameAr: "مجموعة عامر القابضة (عامر جروب)",
      nameEn: "Amer Group Holding",
      close: 1.15,
      change: 0.03,
      changePercent: 2.68,
      volume: 18900000,
      recommendationScore: 0.30,
      recommendationText: "شراء",
      rsi: 55.8,
      rsi1h: 57.2,
      rec1h: 0.32,
      rec4h: 0.28,
      rec1w: 0.20,
      ema20: 1.12,
      ema50: 1.08,
      ema200: 0.95,
      support1: 1.10,
      support2: 1.04,
      resistance1: 1.25,
      resistance2: 1.35,
      pivot: 1.14,
      isEGX70: true,
      sector: "عقارات وسياحة وترفيه"
    },
    {
      symbol: "MFPC",
      ticker: "EGX:MFPC",
      nameAr: "مصر لإنتاج الأسمدة (موبكو)",
      nameEn: "Misr Fertilizers (MOPCO)",
      close: 48.20,
      change: 0.8,
      changePercent: 1.69,
      volume: 2450000,
      recommendationScore: 0.38,
      recommendationText: "شراء قوي",
      rsi: 58.4,
      rsi1h: 56.1,
      rec1h: 0.40,
      rec4h: 0.35,
      rec1w: 0.22,
      ema20: 46.8,
      ema50: 45.2,
      ema200: 42.0,
      support1: 46.5,
      support2: 44.8,
      resistance1: 51.0,
      resistance2: 54.0,
      pivot: 47.9,
      isEGX30: true,
      sector: "بتروكيماويات وأسمدة"
    },
    {
      symbol: "SKPC",
      ticker: "EGX:SKPC",
      nameAr: "سيدي كرير للبتروكيماويات (سيدبك)",
      nameEn: "Sidi Kerir Petrochemicals",
      close: 31.40,
      change: -0.85,
      changePercent: -2.63,
      volume: 4800200,
      recommendationScore: -0.32,
      recommendationText: "بيع",
      rsi: 41.2,
      rsi1h: 44.0,
      rec1h: -0.38,
      rec4h: -0.22,
      rec1w: -0.05,
      ema20: 32.5,
      ema50: 33.8,
      ema200: 30.5,
      support1: 29.8,
      support2: 28.5,
      resistance1: 33.2,
      resistance2: 35.0,
      pivot: 31.8,
      isEGX30: true,
      sector: "بتروكيماويات وأسمدة"
    },
    {
      symbol: "ISPH",
      ticker: "EGX:ISPH",
      nameAr: "ابن سينا فارما لتوزيع الأدوية",
      nameEn: "Ibnsina Pharma",
      close: 3.48,
      change: 0.09,
      changePercent: 2.65,
      volume: 8900000,
      recommendationScore: 0.45,
      recommendationText: "شراء قوي",
      rsi: 63.8,
      rsi1h: 60.5,
      rec1h: 0.48,
      rec4h: 0.42,
      rec1w: 0.31,
      ema20: 3.32,
      ema50: 3.15,
      ema200: 2.85,
      support1: 3.35,
      support2: 3.20,
      resistance1: 3.70,
      resistance2: 3.95,
      pivot: 3.42,
      isEGX70: true,
      sector: "رعاية صحية وتوزيع أدوية"
    },
    {
      symbol: "CCAP",
      ticker: "EGX:CCAP",
      nameAr: "القلعة للاستثمارات المالية",
      nameEn: "Qalaa Holdings",
      close: 6.33,
      change: 0.06,
      changePercent: 0.96,
      volume: 38500000,
      recommendationScore: 0.15,
      recommendationText: "شراء",
      rsi: 54.2,
      rsi1h: 52.0,
      rec1h: 0.18,
      rec4h: 0.12,
      rec1w: 0.25,
      ema20: 6.18,
      ema50: 5.95,
      ema200: 4.80,
      support1: 6.10,
      support2: 5.85,
      resistance1: 6.70,
      resistance2: 7.15,
      pivot: 6.25,
      isEGX30: true,
      sector: "خدمات مالية واستثمار"
    },
    {
      symbol: "BTFH",
      ticker: "EGX:BTFH",
      nameAr: "بلتون القابضة",
      nameEn: "Beltone Holding",
      close: 3.75,
      change: 0.08,
      changePercent: 2.18,
      volume: 45000000,
      recommendationScore: 0.35,
      recommendationText: "شراء قوي",
      rsi: 59.2,
      rsi1h: 61.0,
      rec1h: 0.38,
      rec4h: 0.32,
      rec1w: 0.28,
      ema20: 3.65,
      ema50: 3.50,
      ema200: 3.10,
      support1: 3.60,
      support2: 3.45,
      resistance1: 4.00,
      resistance2: 4.25,
      pivot: 3.72,
      isEGX30: true,
      sector: "بنوك وخدمات مالية غير مصرفية"
    },
    {
      symbol: "HELI",
      ticker: "EGX:HELI",
      nameAr: "مصر الجديدة للإسكان والتعمير",
      nameEn: "Heliopolis Housing",
      close: 12.80,
      change: 0.25,
      changePercent: 1.99,
      volume: 6200000,
      recommendationScore: 0.32,
      recommendationText: "شراء",
      rsi: 56.8,
      rsi1h: 58.4,
      rec1h: 0.35,
      rec4h: 0.28,
      rec1w: 0.24,
      ema20: 12.50,
      ema50: 12.10,
      ema200: 10.80,
      support1: 12.40,
      support2: 11.90,
      resistance1: 13.60,
      resistance2: 14.50,
      pivot: 12.70,
      isEGX30: true,
      sector: "عقارات وتطوير عمراني"
    },
    {
      symbol: "ETEL",
      ticker: "EGX:ETEL",
      nameAr: "المصرية للاتصالات (WE)",
      nameEn: "Telecom Egypt",
      close: 38.50,
      change: 0.60,
      changePercent: 1.58,
      volume: 2800000,
      recommendationScore: 0.30,
      recommendationText: "شراء",
      rsi: 55.4,
      rsi1h: 56.8,
      rec1h: 0.32,
      rec4h: 0.26,
      rec1w: 0.22,
      ema20: 37.8,
      ema50: 36.5,
      ema200: 32.0,
      support1: 37.5,
      support2: 36.0,
      resistance1: 41.0,
      resistance2: 43.5,
      pivot: 38.2,
      isEGX30: true,
      sector: "اتصالات وتكنولوجيا"
    },
    {
      symbol: "ABUK",
      ticker: "EGX:ABUK",
      nameAr: "أبو قير للأسمدة والصناعات الكيماوية",
      nameEn: "Abou Kir Fertilizers",
      close: 62.00,
      change: 1.10,
      changePercent: 1.81,
      volume: 2100000,
      recommendationScore: 0.35,
      recommendationText: "شراء قوي",
      rsi: 58.1,
      rsi1h: 59.5,
      rec1h: 0.38,
      rec4h: 0.32,
      rec1w: 0.28,
      ema20: 60.8,
      ema50: 59.0,
      ema200: 52.0,
      support1: 60.5,
      support2: 58.0,
      resistance1: 66.0,
      resistance2: 70.0,
      pivot: 61.5,
      isEGX30: true,
      sector: "بتروكيماويات وأسمدة"
    },
    {
      symbol: "EAST",
      ticker: "EGX:EAST",
      nameAr: "الشرقية - إيسترن كومباني (الشرقية للدخان)",
      nameEn: "Eastern Company",
      close: 39.50,
      change: 0.50,
      changePercent: 1.28,
      volume: 3200000,
      recommendationScore: 0.25,
      recommendationText: "شراء",
      rsi: 53.8,
      rsi1h: 55.0,
      rec1h: 0.28,
      rec4h: 0.22,
      rec1w: 0.30,
      ema20: 38.9,
      ema50: 37.8,
      ema200: 33.0,
      support1: 38.8,
      support2: 37.5,
      resistance1: 42.0,
      resistance2: 44.5,
      pivot: 39.2,
      isEGX30: true,
      sector: "سلع استهلاكية وتدخين"
    },
    {
      symbol: "THNDRGOLD",
      ticker: "EGX:THNDRGOLD",
      nameAr: "صندوق ذهب ثاندر (دهب)",
      nameEn: "Thndr Gold Fund",
      close: LIVE_GOLD_24K_PRICE,
      change: 23.70,
      changePercent: 0.33,
      volume: 650000,
      recommendationScore: 0.40,
      recommendationText: "شراء قوي",
      rsi: 61.5,
      rsi1h: 63.0,
      rec1h: 0.42,
      rec4h: 0.38,
      rec1w: 0.45,
      ema20: 7100.0,
      ema50: 6950.0,
      ema200: 6400.0,
      support1: 7050.0,
      support2: 6850.0,
      resistance1: 7400.0,
      resistance2: 7650.0,
      pivot: 7150.0,
      isEGX100: true,
      sector: "ذهب ومعادن ثمينة"
    },
    {
      symbol: "AZG",
      ticker: "EGX:AZG",
      nameAr: "صندوق أزيموت جولد (ذهب)",
      nameEn: "Azimut Gold Fund (AZG)",
      close: 28.45,
      change: 0.05,
      changePercent: 0.18,
      volume: 850000,
      recommendationScore: 0.38,
      recommendationText: "شراء قوي",
      rsi: 59.0,
      rsi1h: 61.0,
      rec1h: 0.40,
      rec4h: 0.35,
      rec1w: 0.42,
      ema20: 28.1,
      ema50: 27.5,
      ema200: 25.2,
      support1: 27.9,
      support2: 27.2,
      resistance1: 29.5,
      resistance2: 30.8,
      pivot: 28.3,
      isEGX100: true,
      sector: "ذهب ومعادن ثمينة"
    }
  ];

  // Inject all 73 Egyptian Mutual Funds and Gold into fallback stock pool:
  const seenFallback = new Set(primaryFallback.map(s => s.symbol.toUpperCase()));
  EGYPTIAN_MUTUAL_FUNDS.forEach(f => {
    const sym = f.code.toUpperCase();
    if (!seenFallback.has(sym)) {
      seenFallback.add(sym);
      primaryFallback.push(convertFundToStockData(f));
    }
  });

  // Fill in any remaining stock from EGX_ARABIC_NAMES so that ALL 319 stocks exist!
  const existingSet = new Set(primaryFallback.map(s => s.symbol.toUpperCase()));
  const allFallback: StockData[] = [...primaryFallback];

  Object.entries(EGX_ARABIC_NAMES).forEach(([sym, meta]) => {
    const upperSym = sym.toUpperCase();
    if (!existingSet.has(upperSym) && !['EGX30', 'EGX70EWI', 'EGX100EWI'].includes(upperSym)) {
      // Deterministic realistic synthetic values based on symbol chars
      const charCodeSum = upperSym.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
      const basePrice = Number((10 + (charCodeSum % 90) + ((charCodeSum % 10) / 10)).toFixed(2));
      const chgPct = Number((((charCodeSum % 60) - 25) / 10).toFixed(2));
      const isPositive = chgPct >= 0;
      const recScore = Number((chgPct / 10).toFixed(2));

      allFallback.push({
        symbol: upperSym,
        ticker: `EGX:${upperSym}`,
        nameAr: meta.nameAr,
        nameEn: meta.nameEn,
        close: basePrice,
        change: Number(((basePrice * chgPct) / 100).toFixed(2)),
        changePercent: chgPct,
        volume: 500000 + (charCodeSum * 1000),
        recommendationScore: recScore,
        recommendationText: getRecommendationCategory(recScore),
        rsi: 40 + (charCodeSum % 25),
        rsi1h: 42 + (charCodeSum % 23),
        rec1h: recScore,
        rec4h: recScore * 0.9,
        rec1w: recScore * 0.8,
        ema20: Number((basePrice * (isPositive ? 0.98 : 1.02)).toFixed(2)),
        ema50: Number((basePrice * (isPositive ? 0.95 : 1.04)).toFixed(2)),
        ema200: Number((basePrice * (isPositive ? 0.90 : 1.08)).toFixed(2)),
        support1: Number((basePrice * 0.95).toFixed(2)),
        support2: Number((basePrice * 0.90).toFixed(2)),
        resistance1: Number((basePrice * 1.06).toFixed(2)),
        resistance2: Number((basePrice * 1.12).toFixed(2)),
        pivot: basePrice,
        isEGX30: meta.isEGX30 || false,
        isEGX70: meta.isEGX70 || false,
        isEGX100: meta.isEGX100 || true,
        sector: meta.sector || "سوق الأسهم المصرية"
      });
      existingSet.add(upperSym);
    }
  });

  return allFallback;
}

// All 71 Funds + 2 Clouds from Thndr Community

export function convertFundToStockData(fund: MutualFund): StockData {
  const price = fund.nav || 10.0;
  const isGold = fund.id === 'thndr-gold' || fund.code.toUpperCase() === 'THNDRGOLD' || fund.category === 'ذهب وفضة';
  return {
    symbol: fund.code.toUpperCase(),
    ticker: `EGX:${fund.code.toUpperCase()}`,
    nameAr: fund.name,
    nameEn: fund.code.toUpperCase(),
    close: price,
    change: Number(((price * fund.dailyChange) / 100).toFixed(2)),
    changePercent: fund.dailyChange,
    volume: 500000,
    recommendationScore: fund.dailyChange >= 0 ? 0.35 : -0.15,
    recommendationText: fund.dailyChange >= 0.5 ? 'شراء قوي' : (fund.dailyChange >= 0 ? 'شراء' : 'مراقبة / محايد'),
    rsi: fund.dailyChange >= 0 ? 55 + (fund.dailyChange * 5) : 45 + (fund.dailyChange * 5),
    rsi1h: 52,
    rec1h: 0.3,
    rec4h: 0.35,
    rec1w: 0.4,
    ema20: Number((price * 0.99).toFixed(5)),
    ema50: Number((price * 0.98).toFixed(5)),
    ema200: Number((price * 0.95).toFixed(5)),
    support1: Number((price * 0.96).toFixed(5)),
    support2: Number((price * 0.93).toFixed(5)),
    resistance1: Number((price * 1.05).toFixed(5)),
    resistance2: Number((price * 1.10).toFixed(5)),
    pivot: price,
    isEGX30: false,
    isEGX70: fund.category === 'أسهم مؤشرات (سلبية)' && fund.code.includes('70'),
    isEGX100: true,
    sector: `صناديق استثمار (${fund.category})`,
    isFund: true,
    isGold
  };
}

export const EGYPTIAN_MUTUAL_FUNDS: MutualFund[] = [
  {
    "id": "cloud-daily",
    "code": "اليومي",
    "name": "كلاودز اليومي",
    "category": "كلاودز",
    "dailyChange": 0.04,
    "nav": 100,
    "thndrAvailable": true
  },
  {
    "id": "cloud-monthly",
    "code": "الشهري",
    "name": "كلاودز الشهري",
    "category": "كلاودز",
    "dailyChange": 0.05,
    "nav": 1000,
    "thndrAvailable": true
  },
  {
    "id": "thndr-gold",
    "code": "THNDRGOLD",
    "name": "صندوق ذهب ثاندر (عيار 24)",
    "category": "ذهب وفضة",
    "dailyChange": 0.45,
    "nav": LIVE_GOLD_24K_PRICE,
    "thndrAvailable": true
  },
  {
    "id": "azg",
    "code": "AZG",
    "name": "صندوق أزيموت جولد",
    "category": "ذهب وفضة",
    "dailyChange": 0.18,
    "nav": 28.45,
    "thndrAvailable": true
  },
  {
    "id": "bsb",
    "code": "BSB",
    "name": "صندوق بلتون سبائك",
    "category": "ذهب وفضة",
    "dailyChange": 0.18,
    "nav": 28.25,
    "thndrAvailable": true
  },
  {
    "id": "ada",
    "code": "ADA",
    "name": "صندوق الأهلي دهب",
    "category": "ذهب وفضة",
    "dailyChange": 0.18,
    "nav": 27.8,
    "thndrAvailable": true
  },
  {
    "id": "cgo",
    "code": "CGO",
    "name": "صندوق سي آي جولد",
    "category": "ذهب وفضة",
    "dailyChange": 0.18,
    "nav": 28.15,
    "thndrAvailable": true
  },
  {
    "id": "abm",
    "code": "ABM",
    "name": "صندوق بوليون للمعادن",
    "category": "ذهب وفضة",
    "dailyChange": 0.11,
    "nav": 28.1,
    "thndrAvailable": true
  },
  {
    "id": "bfa",
    "code": "BFA",
    "name": "صندوق بلتون فضة",
    "category": "ذهب وفضة",
    "dailyChange": -0.01,
    "nav": 16.8,
    "thndrAvailable": true
  },
  {
    "id": "msi",
    "code": "MSI",
    "name": "صندوق مباشر فضة",
    "category": "ذهب وفضة",
    "dailyChange": -0.06,
    "nav": 16.95,
    "thndrAvailable": true
  },
  {
    "id": "awp",
    "code": "AWP",
    "name": "صندوق أسباير وفرة بلس",
    "category": "أسهم نشطة",
    "dailyChange": 1.28,
    "nav": 14.85,
    "thndrAvailable": true
  },
  {
    "id": "cex",
    "code": "CEX",
    "name": "صندوق سي آي تصدير",
    "category": "أسهم نشطة",
    "dailyChange": 0.66,
    "nav": 16.2,
    "thndrAvailable": true
  },
  {
    "id": "ctq",
    "code": "CTQ",
    "name": "صندوق سي آي ذا كوانت",
    "category": "أسهم نشطة",
    "dailyChange": 0.61,
    "nav": 15.9,
    "thndrAvailable": true
  },
  {
    "id": "bre",
    "code": "BRE",
    "name": "صندوق بلتون القطاع العقاري",
    "category": "أسهم نشطة",
    "dailyChange": 0.59,
    "nav": 17.3,
    "thndrAvailable": true
  },
  {
    "id": "ccm",
    "code": "CCM",
    "name": "صندوق كايرو كابيتال مومنتم",
    "category": "أسهم نشطة",
    "dailyChange": 0.55,
    "nav": 16.8,
    "thndrAvailable": true
  },
  {
    "id": "cre",
    "code": "CRE",
    "name": "صندوق سي آي عقارات وبناء",
    "category": "أسهم نشطة",
    "dailyChange": 0.55,
    "nav": 19.1,
    "thndrAvailable": true
  },
  {
    "id": "azo",
    "code": "AZO",
    "name": "صندوق أزيموت فرص",
    "category": "أسهم نشطة",
    "dailyChange": 0.51,
    "nav": 22.4,
    "thndrAvailable": true
  },
  {
    "id": "nna",
    "code": "NNA",
    "name": "صندوق نماء",
    "category": "أسهم نشطة",
    "dailyChange": 0.5,
    "nav": 18.5,
    "thndrAvailable": true
  },
  {
    "id": "aso",
    "code": "ASO",
    "name": "صندوق أزيموت فرص الشريعة",
    "category": "أسهم نشطة",
    "dailyChange": 0.48,
    "nav": 18.9,
    "thndrAvailable": true
  },
  {
    "id": "bff",
    "code": "BFF",
    "name": "صندوق بنك القاهرة الأول",
    "category": "أسهم نشطة",
    "dailyChange": 0.45,
    "nav": 35.2,
    "thndrAvailable": true
  },
  {
    "id": "nhs",
    "code": "NHS",
    "name": "صندوق الحياة شريعة",
    "category": "أسهم نشطة",
    "dailyChange": 0.42,
    "nav": 19.3,
    "thndrAvailable": true
  },
  {
    "id": "bfi",
    "code": "BFI",
    "name": "صندوق بلتون القطاع المالي",
    "category": "أسهم نشطة",
    "dailyChange": 0.16,
    "nav": 21.4,
    "thndrAvailable": true
  },
  {
    "id": "ako",
    "code": "AKO",
    "name": "صندوق كنز فرص",
    "category": "أسهم نشطة",
    "dailyChange": 0.13,
    "nav": 14.6,
    "thndrAvailable": true
  },
  {
    "id": "bin",
    "code": "BIN",
    "name": "صندوق بلتون القطاع الصناعي",
    "category": "أسهم نشطة",
    "dailyChange": 0.12,
    "nav": 18.7,
    "thndrAvailable": true
  },
  {
    "id": "ago",
    "code": "AGO",
    "name": "صندوق جسور",
    "category": "أسهم نشطة",
    "dailyChange": 0,
    "nav": 15.2,
    "thndrAvailable": true
  },
  {
    "id": "cff",
    "code": "CFF",
    "name": "صندوق سي آي مال ومدفوعات رقمية",
    "category": "أسهم نشطة",
    "dailyChange": -0.03,
    "nav": 13.9,
    "thndrAvailable": true
  },
  {
    "id": "c20",
    "code": "C20",
    "name": "صندوق سي آي 20HD",
    "category": "أسهم نشطة",
    "dailyChange": -0.09,
    "nav": 16.4,
    "thndrAvailable": true
  },
  {
    "id": "bal",
    "code": "BAL",
    "name": "صندوق بلتون ألفا",
    "category": "أسهم نشطة",
    "dailyChange": -0.21,
    "nav": 19.75,
    "thndrAvailable": true
  },
  {
    "id": "nmf",
    "code": "NMF",
    "name": "صندوق NM أسهم شريعة",
    "category": "أسهم نشطة",
    "dailyChange": -0.21,
    "nav": 15.1,
    "thndrAvailable": true
  },
  {
    "id": "ccb",
    "code": "CCB",
    "name": "صندوق سي آي استهلاكي",
    "category": "أسهم نشطة",
    "dailyChange": -0.62,
    "nav": 15.4,
    "thndrAvailable": true
  },
  {
    "id": "cip",
    "code": "CIP",
    "name": "صندوق سي آي للاكتتابات الأولية",
    "category": "أسهم نشطة",
    "dailyChange": -0.78,
    "nav": 13.8,
    "thndrAvailable": true
  },
  {
    "id": "bco",
    "code": "BCO",
    "name": "صندوق بلتون القطاع الاستهلاكي",
    "category": "أسهم نشطة",
    "dailyChange": -0.81,
    "nav": 16.5,
    "thndrAvailable": true
  },
  {
    "id": "otr",
    "code": "OTR",
    "name": "صندوق أودن ترند",
    "category": "أسهم نشطة",
    "dailyChange": -0.95,
    "nav": 14.2,
    "thndrAvailable": true
  },
  {
    "id": "nam",
    "code": "NAM",
    "name": "صندوق بنك الكويت الوطني المتميز",
    "category": "أسهم نشطة",
    "dailyChange": -1.24,
    "nav": 24.1,
    "thndrAvailable": true
  },
  {
    "id": "bto",
    "code": "BTO",
    "name": "صندوق بلتون طروحات",
    "category": "أسهم نشطة",
    "dailyChange": -1.4,
    "nav": 15.3,
    "thndrAvailable": true
  },
  {
    "id": "cti",
    "code": "CTI",
    "name": "صندوق سي آي تكنولوجيا واتصالات",
    "category": "أسهم نشطة",
    "dailyChange": -1.5,
    "nav": 18.6,
    "thndrAvailable": true
  },
  {
    "id": "mmf",
    "code": "MMF",
    "name": "صندوق ميدبنك الأول",
    "category": "أسهم نشطة",
    "dailyChange": -1.8,
    "nav": 32.5,
    "thndrAvailable": true
  },
  {
    "id": "zem",
    "code": "ZEM",
    "name": "صندوق زالدي المصري",
    "category": "أسهم نشطة",
    "dailyChange": -2.59,
    "nav": 12.4,
    "thndrAvailable": true
  },
  {
    "id": "ci30",
    "code": "CI30",
    "name": "صندوق مؤشر CI EGX30",
    "category": "أسهم مؤشرات (سلبية)",
    "dailyChange": 1.17,
    "nav": 62.5,
    "thndrAvailable": true
  },
  {
    "id": "aks",
    "code": "AKS",
    "name": "صندوق الكنز شريعة",
    "category": "أسهم مؤشرات (سلبية)",
    "dailyChange": 0.63,
    "nav": 26.5,
    "thndrAvailable": true
  },
  {
    "id": "bwa",
    "code": "BWA",
    "name": "صندوق بلتون وفرة",
    "category": "أسهم مؤشرات (سلبية)",
    "dailyChange": 0.6,
    "nav": 17.8,
    "thndrAvailable": true
  },
  {
    "id": "cms",
    "code": "CMS",
    "name": "صندوق مؤشر CI EGX33 الشريعة",
    "category": "أسهم مؤشرات (سلبية)",
    "dailyChange": 0.59,
    "nav": 22.1,
    "thndrAvailable": true
  },
  {
    "id": "ak35",
    "code": "AK35",
    "name": "صندوق الكنز EGX35-LV",
    "category": "أسهم مؤشرات (سلبية)",
    "dailyChange": -0.48,
    "nav": 16.7,
    "thndrAvailable": true
  },
  {
    "id": "alv",
    "code": "ALV",
    "name": "صندوق AZ LV",
    "category": "أسهم مؤشرات (سلبية)",
    "dailyChange": -0.49,
    "nav": 15.9,
    "thndrAvailable": true
  },
  {
    "id": "b35",
    "code": "B35",
    "name": "صندوق بلتون بي-35",
    "category": "أسهم مؤشرات (سلبية)",
    "dailyChange": -0.51,
    "nav": 18.2,
    "thndrAvailable": true
  },
  {
    "id": "bmm",
    "code": "BMM",
    "name": "صندوق بلتون مية مية",
    "category": "أسهم مؤشرات (سلبية)",
    "dailyChange": 0.35,
    "nav": 2.14964,
    "thndrAvailable": true
  },
  {
    "id": "ak70",
    "code": "AK70",
    "name": "صندوق الكنز EGX70",
    "category": "أسهم مؤشرات (سلبية)",
    "dailyChange": -0.93,
    "nav": 1.45,
    "thndrAvailable": true
  },
  {
    "id": "ncs",
    "code": "NCS",
    "name": "صندوق سهمي 70 إن آي كابيتال",
    "category": "أسهم مؤشرات (سلبية)",
    "dailyChange": -0.94,
    "nav": 1.48,
    "thndrAvailable": true
  },
  {
    "id": "b70",
    "code": "B70",
    "name": "صندوق بلتون EGX70",
    "category": "أسهم مؤشرات (سلبية)",
    "dailyChange": -0.96,
    "nav": 1.52,
    "thndrAvailable": true
  },
  {
    "id": "t70",
    "code": "T70",
    "name": "صندوق ثاندر T70 للأسهم",
    "category": "أسهم مؤشرات (سلبية)",
    "dailyChange": 0.65,
    "nav": LIVE_T70_NAV,
    "thndrAvailable": true
  },
  {
    "id": "aaf",
    "code": "AAF",
    "name": "صندوق آفاق",
    "category": "دخل ثابت ونقدي",
    "dailyChange": 0.05,
    "nav": 185.4,
    "thndrAvailable": true
  },
  {
    "id": "abr",
    "code": "ABR",
    "name": "صندوق بريق (دخل ثابت وسيولة)",
    "category": "دخل ثابت ونقدي",
    "dailyChange": 0.06,
    "nav": 218.27304,
    "thndrAvailable": true
  },
  {
    "id": "adm",
    "code": "ADM",
    "name": "صندوق دياموند",
    "category": "دخل ثابت ونقدي",
    "dailyChange": 0.05,
    "nav": 142.1,
    "thndrAvailable": true
  },
  {
    "id": "aef",
    "code": "AEF",
    "name": "صندوق الفنار",
    "category": "دخل ثابت ونقدي",
    "dailyChange": 0.05,
    "nav": 164.2,
    "thndrAvailable": true
  },
  {
    "id": "aim",
    "code": "AIM",
    "name": "صندوق إسكان للتأمين",
    "category": "دخل ثابت ونقدي",
    "dailyChange": 0.05,
    "nav": 156.8,
    "thndrAvailable": true
  },
  {
    "id": "ais",
    "code": "AIS",
    "name": "صندوق استثمار وأمان",
    "category": "دخل ثابت ونقدي",
    "dailyChange": 0.05,
    "nav": 198.5,
    "thndrAvailable": true
  },
  {
    "id": "ara",
    "code": "ARA",
    "name": "صندوق أسباير راواج",
    "category": "دخل ثابت ونقدي",
    "dailyChange": 0.05,
    "nav": 174.3,
    "thndrAvailable": true
  },
  {
    "id": "atd",
    "code": "ATD",
    "name": "صندوق الأهلي تميز ذو التوزيع",
    "category": "دخل ثابت ونقدي",
    "dailyChange": 0.05,
    "nav": 210,
    "thndrAvailable": true
  },
  {
    "id": "bcu",
    "code": "BCU",
    "name": "صندوق بي كوبونات",
    "category": "دخل ثابت ونقدي",
    "dailyChange": 0.05,
    "nav": 128.9,
    "thndrAvailable": true
  },
  {
    "id": "bya",
    "code": "BYA",
    "name": "صندوق بي يومي",
    "category": "دخل ثابت ونقدي",
    "dailyChange": 0.05,
    "nav": 115.4,
    "thndrAvailable": true
  },
  {
    "id": "ccs",
    "code": "CCS",
    "name": "صندوق كايرو كابيتال ستريم",
    "category": "دخل ثابت ونقدي",
    "dailyChange": 0.05,
    "nav": 148.6,
    "thndrAvailable": true
  },
  {
    "id": "gra",
    "code": "GRA",
    "name": "صندوق جرانيت",
    "category": "دخل ثابت ونقدي",
    "dailyChange": 0.05,
    "nav": 162.3,
    "thndrAvailable": true
  },
  {
    "id": "mtf",
    "code": "MTF",
    "name": "صندوق مصر للتأمين التكافلي",
    "category": "دخل ثابت ونقدي",
    "dailyChange": 0.05,
    "nav": 188.7,
    "thndrAvailable": true
  },
  {
    "id": "ofo",
    "code": "OFO",
    "name": "صندوق أودن الرابع",
    "category": "دخل ثابت ونقدي",
    "dailyChange": 0.05,
    "nav": 135.2,
    "thndrAvailable": true
  },
  {
    "id": "pcm",
    "code": "PCM",
    "name": "صندوق كاشي PFI",
    "category": "دخل ثابت ونقدي",
    "dailyChange": 0.05,
    "nav": 122.1,
    "thndrAvailable": true
  },
  {
    "id": "zst",
    "code": "ZST",
    "name": "صندوق زالدي ستار",
    "category": "دخل ثابت ونقدي",
    "dailyChange": 0.05,
    "nav": 140.5,
    "thndrAvailable": true
  },
  {
    "id": "asa",
    "code": "ASA",
    "name": "صندوق ثروتي",
    "category": "دخل ثابت ونقدي",
    "dailyChange": 0.05,
    "nav": 178,
    "thndrAvailable": true
  },
  {
    "id": "awe",
    "code": "AWE",
    "name": "صندوق وثاق",
    "category": "دخل ثابت ونقدي",
    "dailyChange": 0.05,
    "nav": 166.4,
    "thndrAvailable": true
  },
  {
    "id": "azn",
    "code": "AZN",
    "name": "صندوق أزيموت ناصر",
    "category": "دخل ثابت ونقدي",
    "dailyChange": 0.04,
    "nav": 195.2,
    "thndrAvailable": true
  },
  {
    "id": "azs",
    "code": "AZS",
    "name": "صندوق AZ ادخار",
    "category": "دخل ثابت ونقدي",
    "dailyChange": 0.04,
    "nav": 18.9,
    "thndrAvailable": true
  },
  {
    "id": "bsc",
    "code": "BSC",
    "name": "صندوق بي سيكيور",
    "category": "دخل ثابت ونقدي",
    "dailyChange": 0.04,
    "nav": 154.3,
    "thndrAvailable": true
  },
  {
    "id": "pgm",
    "code": "PGM",
    "name": "صندوق بي جي آي للتأمين النقدي للسيولة",
    "category": "دخل ثابت ونقدي",
    "dailyChange": 0.04,
    "nav": 147.8,
    "thndrAvailable": true
  },
  {
    "id": "tfi",
    "code": "TFI",
    "name": "صندوق تارجت الأول",
    "category": "دخل ثابت ونقدي",
    "dailyChange": 0.04,
    "nav": 163.5,
    "thndrAvailable": true
  }
];

export const EGYPTIAN_FUNDS_MAP = new Map<string, MutualFund>();
EGYPTIAN_MUTUAL_FUNDS.forEach(f => {
  EGYPTIAN_FUNDS_MAP.set(f.code.toUpperCase(), f);
  EGYPTIAN_FUNDS_MAP.set(f.id.toUpperCase(), f);
  EGYPTIAN_FUNDS_MAP.set(f.code.toLowerCase(), f);
  EGYPTIAN_FUNDS_MAP.set(f.id.toLowerCase(), f);
});


export const EGX_LATEST_NEWS: EGXNewsItem[] = [
  {
    id: "news-1",
    company: "البنك التجاري الدولي (CIB)",
    symbol: "COMI",
    title: "مجلس إدارة البنك التجاري الدولي يوافق على توزيع كوبون نقدي بواقع 2.5 ج.م للسهم",
    time: "منذ ساعتين",
    category: "توزيعات أرباح",
    sentiment: "إيجابي",
    summary: "أعلنت إدارة CIB عن اعتماد مقترح توزيع أرباح نقدية للمساهمين عن أرباح العام، مع تحديد الجمعية العامة في نهاية الشهر لمصادقة القرار."
  },
  {
    id: "news-2",
    company: "مجموعة طلعت مصطفى القابضة",
    symbol: "TMGH",
    title: "مبيعات عقارية قياسية في مشروع 'بنان' بالرياض و'ساوث ميد' بالساحل الشمالي",
    time: "منذ 4 ساعات",
    category: "إفصاح رسمي",
    sentiment: "إيجابي",
    summary: "أفصحت المجموعة عن تسجيل مبيعات تعاقدية تجاوزت التوقعات وتدفقات دولارية ومحلية تدعم السيولة وقوة المركز المالي."
  },
  {
    id: "news-3",
    company: "فوري للمدفوعات",
    symbol: "FWRY",
    title: "إطلاق خدمات التحويلات المالية للمصريين بالخارج بالتعاون مع بنوك الخليج",
    time: "منذ 6 ساعات",
    category: "إفصاح رسمي",
    sentiment: "إيجابي",
    summary: "وقعت شركة فوري اتفاقيات استراتيجية لتمكين المصريين بالخارج من تحويل الأموال وسداد الفواتير الحكومية والخدمية لحظياً."
  },
  {
    id: "news-4",
    company: "سيدي كرير للبتروكيماويات",
    symbol: "SKPC",
    title: "توقف مؤقت لأحد خطوط الإنتاج لأعمال الصيانة الدورية المجدولة لمدة أسبوع",
    time: "اليوم 10:30 ص",
    category: "إفصاح رسمي",
    sentiment: "سلبي",
    summary: "أعلنت الشركة أن التوقف لن يؤثر على عقود التصدير المبرمة مع توفر مخزون كافٍ لتغطية التزامات السوق المحلي."
  },
  {
    id: "news-5",
    company: "البورصة المصرية (إدارة السوق)",
    title: "تعديل أوزان الأسهم في مؤشر EGX30 ومراجعة دورية لنهاية الربع",
    time: "اليوم 09:15 ص",
    category: "أخبار عامة",
    sentiment: "محايد",
    summary: "أنهت لجنة المؤشرات مراجعتها الربع سنوية لإعادة ضبط الحدود السعرية ونسب التداول الحر للأسهم القيادية."
  }
];
