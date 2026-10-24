import { StockData, PortfolioPosition, MutualFund } from '../types';
import { LIVE_GOLD_24K_PRICE } from './egxService';

export type RecommendationType = 
  | 'STRONG_BUY'     // شراء قوي واختراق
  | 'SWING_BUY'      // مضاربة سريعة وارتداد
  | 'ACCUMULATE'     // استثمار وتجميع متوسط الأجل
  | 'TAKE_PROFIT'    // جني أرباح وتخفيف
  | 'STOP_LOSS';     // وقف خسارة وتحذير خروج

export interface StockRecommendation {
  stock: StockData;
  type: RecommendationType;
  badgeLabel: string;
  badgeColor: string; // Tailwind color classes
  horizon: 'مضاربة لحظية / يومية' | 'مضاربة سوينج (3 - 10 أيام)' | 'استثماري (أسابيع / شهر)';
  entryPrice: number;
  entryZoneMin: number;
  entryZoneMax: number;
  target1: number;
  target1Pct: number;
  target2: number;
  target2Pct: number;
  stopLoss: number;
  stopLossPct: number;
  riskRewardRatio: number;
  technicalScore: number; // 0 - 100
  rationale: {
    rsiReason: string;
    emaReason: string;
    volumeReason: string;
    pivotsReason: string;
    summary: string;
  };
}

export interface PortfolioStockDiagnosis {
  position: PortfolioPosition;
  liveStock?: StockData;
  status: 'PROFIT_TAKE' | 'TRENDING_UP' | 'HOLD_CAUTIOUS' | 'AVERAGE_DOWN' | 'STOP_LOSS_ALERT';
  statusTitle: string;
  statusColor: string;
  currentPnlPct: number;
  currentValue: number;
  currentPrice: number;
  actionTitle: string;
  actionDetails: string;
  suggestedStopLoss: number;
  suggestedTarget: number;
  priority: 'high' | 'medium' | 'normal';
}

/**
 * Generates an in-depth technical recommendation for a single stock
 */
export function analyzeStock(stock: StockData): StockRecommendation {
  const price = stock.close;
  const s1 = stock.support1;
  const s2 = stock.support2;
  const r1 = stock.resistance1;
  const r2 = stock.resistance2;
  const p = stock.pivot;
  const rsi = stock.rsi;
  const ema20 = stock.ema20;
  const ema50 = stock.ema50;
  const ema200 = stock.ema200;

  let type: RecommendationType = 'ACCUMULATE';
  let badgeLabel = 'تجميع واستثمار';
  let badgeColor = 'bg-blue-500/10 text-blue-400 border-blue-500/30';
  let horizon: StockRecommendation['horizon'] = 'استثماري (أسابيع / شهر)';

  // Calculate Levels
  let entryPrice = price;
  let entryZoneMin = Number((price * 0.985).toFixed(2));
  let entryZoneMax = Number((price * 1.01).toFixed(2));

  // Determine Stop Loss (S1 or S2 or -4% trailing)
  let stopLoss = s1 < price ? s1 : Number((price * 0.95).toFixed(2));
  if (stopLoss >= price) {
    stopLoss = Number((price * 0.95).toFixed(2));
  }
  let stopLossPct = Number((((price - stopLoss) / price) * 100).toFixed(1));

  // Determine Targets (R1, R2 or percentages)
  let target1 = r1 > price ? r1 : Number((price * 1.06).toFixed(2));
  let target2 = r2 > target1 ? r2 : Number((target1 * 1.07).toFixed(2));

  let target1Pct = Number((((target1 - price) / price) * 100).toFixed(1));
  let target2Pct = Number((((target2 - price) / price) * 100).toFixed(1));

  // Risk / Reward Ratio
  const riskAmount = price - stopLoss;
  const rewardAmount = target1 - price;
  let riskRewardRatio = riskAmount > 0 ? Number((rewardAmount / riskAmount).toFixed(1)) : 2.0;
  if (riskRewardRatio <= 0) riskRewardRatio = 1.5;

  // Technical Scoring (0 to 100)
  let technicalScore = 50;
  if (price > ema20) technicalScore += 10;
  if (price > ema50) technicalScore += 10;
  if (price > ema200) technicalScore += 15;
  if (rsi >= 45 && rsi <= 62) technicalScore += 15;
  if (stock.changePercent > 0) technicalScore += 10;
  if (stock.recommendationScore > 0.1) technicalScore += 10;

  // Classify Recommendation Type
  if (rsi > 72 || price >= r2) {
    type = 'TAKE_PROFIT';
    badgeLabel = 'جني أرباح وتخفيف مراكز';
    badgeColor = 'bg-amber-500/10 text-amber-400 border-amber-500/30';
    horizon = 'مضاربة لحظية / يومية';
  } else if (price < s2 || (price < ema50 && stock.recommendationScore < -0.2) || rsi < 28) {
    if (rsi < 28 && price >= s2 * 0.98) {
      // Deep oversold bounce potential
      type = 'SWING_BUY';
      badgeLabel = 'مضاربة ارتدادية (قاع مفرط)';
      badgeColor = 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30';
      horizon = 'مضاربة سوينج (3 - 10 أيام)';
    } else {
      type = 'STOP_LOSS';
      badgeLabel = 'تحذير خروج ووقف خسارة';
      badgeColor = 'bg-rose-500/10 text-rose-400 border-rose-500/30';
      horizon = 'مضاربة لحظية / يومية';
    }
  } else if (stock.recommendationScore >= 0.15 && price > ema20 && price > ema50) {
    type = 'STRONG_BUY';
    badgeLabel = 'شراء قوي (اختراق وزخم)';
    badgeColor = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
    horizon = 'مضاربة سوينج (3 - 10 أيام)';
  } else if (rsi <= 42 || (price <= p && price >= s1)) {
    type = 'SWING_BUY';
    badgeLabel = 'مضاربة سريعة (ارتداد من دعم)';
    badgeColor = 'bg-teal-500/10 text-teal-400 border-teal-500/30';
    horizon = 'مضاربة سوينج (3 - 10 أيام)';
  } else {
    type = 'ACCUMULATE';
    badgeLabel = 'تجميع واستثمار متوازن';
    badgeColor = 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30';
    horizon = 'استثماري (أسابيع / شهر)';
  }

  // Construct Detailed Rationale
  let rsiReason = '';
  if (rsi > 70) {
    rsiReason = `مؤشر القوة النسبية RSI عند (${rsi.toFixed(1)}) في منطقة تشبع شرائي حاد، مما يعكس احتمال حدوث جني أرباح وشيك وتصحيح هابط.`;
  } else if (rsi < 35) {
    rsiReason = `مؤشر القوة النسبية RSI عند (${rsi.toFixed(1)}) في منطقة تشبع بيعي، مما يتيح فرصة ارتداد صاعد سريعة نحو متوسط الحركة.`;
  } else {
    rsiReason = `مؤشر القوة النسبية RSI عند (${rsi.toFixed(1)}) في نطاق إيجابي متوازن ومستقر يسمح بمواصلة الصعود.`;
  }

  let emaReason = '';
  if (price > ema20 && price > ema50 && price > ema200) {
    emaReason = `السهم يتداول فوق كافة المتوسطات المتحركة (20 و 50 و 200 يوم) مما يؤكد استقرار الاتجاه الصاعد العام كاتجاه مؤسسي قوي.`;
  } else if (price > ema20 && price < ema50) {
    emaReason = `السهم متماسك فوق متوسط 20 يوم (${ema20.toFixed(2)} ج.م) في محاولة لاختراق متوسط 50 يوم (${ema50.toFixed(2)} ج.م) وتأكيد العودة للمسار الصاعد.`;
  } else if (price < ema200) {
    emaReason = `السهم يتداول تحت متوسط 200 يوم (${ema200.toFixed(2)} ج.م) مما يتطلب الحذر وعدم الإفراط في الكميات حتى تأكيد الكسر لأعلى.`;
  } else {
    emaReason = `المتوسطات المتحركة تشير إلى حركة عرضية وتجميعية بين مستويات ${ema20.toFixed(2)} و ${ema50.toFixed(2)} ج.م.`;
  }

  let volumeReason = '';
  if (stock.volume > 1500000) {
    volumeReason = `أحجام التداول نشطة وكثيفة (${(stock.volume / 1000000).toFixed(2)} مليون سهم) مما يؤكد وجود سيولة مؤسسية تدعم الحركة.`;
  } else {
    volumeReason = `أحجام التداول تسجل ${(stock.volume / 1000).toFixed(0)} ألف سهم، وهي وتيرة تجميعية معتادة.`;
  }

  let pivotsReason = `نقطة الارتكاز المحورية (Pivot) عند ${p.toFixed(2)} ج.م. المقاومة الأولى (R1) تمثل المستهدف الأولي عند ${target1.toFixed(2)} ج.م، بينما الدعم الأول (S1) يشكل صمام أمان وقف الخسارة عند ${stopLoss.toFixed(2)} ج.م.`;

  let summary = '';
  if (type === 'STRONG_BUY') {
    summary = `فرصة دخول شرائي ممتازة لاستهداف المقاومة الأولى ${target1.toFixed(2)} ج.م (+${target1Pct}%) مع الالتزام التام بوقف الخسارة أسفل ${stopLoss.toFixed(2)} ج.م. نسبة العائد للمخاطرة مغرية جداً (1 : ${riskRewardRatio}).`;
  } else if (type === 'SWING_BUY') {
    summary = `إشارة ارتداد إيجابية من مستويات الدعم، يُفضل الشراء في نطاق ${entryZoneMin} - ${entryZoneMax} ج.م بهدف تحقيق ربح سريع نحو ${target1.toFixed(2)} ج.م.`;
  } else if (type === 'TAKE_PROFIT') {
    summary = `يُنصح بجني جزء من الأرباح وتخفيف المراكز وتفعيل وقف الأرباح (Trailing Stop) نظراً للاقتراب من قمم سعرية ومقاومة R2.`;
  } else if (type === 'STOP_LOSS') {
    summary = `تحذير فني: السهم في وضع سلبي وكسر لمستويات الدعم، يُنصح بتفعيل وقف الخسارة عند ${stopLoss.toFixed(2)} ج.م لتجنب احتجاز السيولة.`;
  } else {
    summary = `سهم دفاعي استثماري مستقر، مناسب للتجميع التدريجي وتوزيع السيولة بهدف استثماري متوسط الأجل عند ${target2.toFixed(2)} ج.م.`;
  }

  return {
    stock,
    type,
    badgeLabel,
    badgeColor,
    horizon,
    entryPrice,
    entryZoneMin,
    entryZoneMax,
    target1,
    target1Pct,
    target2,
    target2Pct,
    stopLoss,
    stopLossPct,
    riskRewardRatio,
    technicalScore: Math.min(100, Math.max(10, technicalScore)),
    rationale: {
      rsiReason,
      emaReason,
      volumeReason,
      pivotsReason,
      summary
    }
  };
}

/**
 * Diagnoses an owned portfolio position and determines the exact actionable plan
 * Accurately handles stocks, mutual funds (NAV), and Thndr Gold (grams, 1% sell fee, break-even)
 */
export function diagnosePortfolioPosition(
  pos: PortfolioPosition, 
  liveStock?: StockData,
  liveFund?: MutualFund
): PortfolioStockDiagnosis {
  const isGold = pos.isGold || pos.assetType === 'gold' || pos.symbol.toUpperCase() === 'THNDRGOLD';
  const isFund = pos.assetType === 'fund' || Boolean(liveFund);

  // --- SPECIAL CASE 1: THNDR GOLD (بالجرام وعمولات الشراء والبيع ونقطة التعادل) ---
  if (isGold) {
    const grams = pos.grams || pos.shares;
    const goldLivePrice = liveStock?.close && liveStock.close > 1000 
      ? liveStock.close 
      : (liveFund?.nav && liveFund.nav > 1000 ? liveFund.nav : LIVE_GOLD_24K_PRICE);
    
    const cost = pos.totalCostWithFees || (pos.buyPrice * grams);
    // Net cash in hand upon liquidation after Thndr's 1% sell fee:
    const currentValue = Number((grams * goldLivePrice * 0.99).toFixed(2));
    const pnl = Number((currentValue - cost).toFixed(2));
    const pnlPct = cost > 0 ? Number(((pnl / cost) * 100).toFixed(2)) : 0;
    
    // Break-even price required to cover both 1% buy fee and 1% sell fee:
    const breakEvenPrice = pos.breakEvenPrice || (grams > 0 ? Number((cost / (grams * 0.99)).toFixed(2)) : Number((pos.buyPrice * 1.0202).toFixed(2)));
    const target5Pct = Number((breakEvenPrice * 1.05).toFixed(2));

    if (goldLivePrice >= breakEvenPrice) {
      return {
        position: pos,
        liveStock,
        status: 'PROFIT_TAKE',
        statusTitle: '🟢 في منطقة الربح الصافي للذهب',
        statusColor: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
        currentPnlPct: pnlPct,
        currentValue,
        currentPrice: goldLivePrice,
        actionTitle: 'تجاوز نقطة التعادل • تحقيق أرباح صافية',
        actionDetails: `سعر بيع الجرام اللحظي (${goldLivePrice.toFixed(2)} ج.م) أعلى من نقطة التعادل (${breakEvenPrice.toFixed(2)} ج.م). أنت الآن في مرحلة الأرباح الصافية بعد تغطية عمولة الشراء 1% وعمولة البيع 1%. المستهدف القادم هو ${target5Pct.toFixed(2)} ج.م.`,
        suggestedStopLoss: Number((pos.buyPrice * 0.95).toFixed(2)),
        suggestedTarget: target5Pct,
        priority: 'high'
      };
    } else {
      const diff = Number((breakEvenPrice - goldLivePrice).toFixed(2));
      return {
        position: pos,
        liveStock,
        status: 'HOLD_CAUTIOUS',
        statusTitle: '🟡 في مرحلة التماسك لتغطية العمولات',
        statusColor: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
        currentPnlPct: pnlPct,
        currentValue,
        currentPrice: goldLivePrice,
        actionTitle: `متبقي صعود +${diff} ج.م/جرام للوصول للربح الصافي`,
        actionDetails: `إجمالي ما دفعته ${cost.toFixed(2)} ج.م. صافي الكاش في يدك بعد خصم 1% عمولة ثاندر هو ${currentValue.toFixed(2)} ج.م (${pnlPct}%). يحتاج جرام الذهب للوصول إلى ${breakEvenPrice.toFixed(2)} ج.م لتغطية عمولة الشراء وعمولة البيع وبدء جني الأرباح. مستهدف الربح الصافي +5% هو ${target5Pct.toFixed(2)} ج.م.`,
        suggestedStopLoss: Number((pos.buyPrice * 0.95).toFixed(2)),
        suggestedTarget: breakEvenPrice,
        priority: 'normal'
      };
    }
  }

  // --- SPECIAL CASE 2: MUTUAL FUNDS (صناديق الاستثمار وقيمة الوثيقة NAV) ---
  if (isFund) {
    const currentPrice = liveFund?.nav || liveStock?.close || pos.buyPrice;
    const cost = pos.buyPrice * pos.shares;
    const currentValue = Number((currentPrice * pos.shares).toFixed(2));
    const pnlPct = cost > 0 ? Number((((currentValue - cost) / cost) * 100).toFixed(2)) : 0;
    const effectiveStop = pos.stopLoss || Number((pos.buyPrice * 0.95).toFixed(2));
    const effectiveTarget = pos.targetPrice || Number((pos.buyPrice * 1.10).toFixed(2));

    if (pnlPct >= 5) {
      return {
        position: pos,
        liveStock,
        status: 'PROFIT_TAKE',
        statusTitle: '🎯 أرباح ممتازة على الوثائق',
        statusColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
        currentPnlPct: pnlPct,
        currentValue,
        currentPrice,
        actionTitle: 'استثمار رابح • احتفاظ أو إعادة استثمار العوائد',
        actionDetails: `صافي قيمة الوثيقة (NAV) ارتفعت إلى ${currentPrice.toFixed(2)} ج.م محققة عائداً ممتازاً (+${pnlPct.toFixed(1)}%). الصندوق يحقق أداءً قوياً ويُنصح بالاستمرار في التجميع مع استثمار التوزيعات الدورية.`,
        suggestedStopLoss: effectiveStop,
        suggestedTarget: effectiveTarget,
        priority: 'high'
      };
    } else {
      return {
        position: pos,
        liveStock,
        status: 'TRENDING_UP',
        statusTitle: '📈 استثمار نشط وتجميع دوري',
        statusColor: 'text-blue-400 bg-blue-500/10 border-blue-500/30',
        currentPnlPct: pnlPct,
        currentValue,
        currentPrice,
        actionTitle: 'الاحتفاظ والتجميع مع العائد التراكمي',
        actionDetails: `سعر الوثيقة الحالي ${currentPrice.toFixed(2)} ج.م (تغير ${pnlPct >= 0 ? '+' : ''}${pnlPct}%). الصندوق مناسب تماماً للاستثمار وتنمية المدخرات على المدى المتوسط، مستهدف الصندوق عند ${effectiveTarget.toFixed(2)} ج.م.`,
        suggestedStopLoss: effectiveStop,
        suggestedTarget: effectiveTarget,
        priority: 'normal'
      };
    }
  }

  // --- STANDARD CASE: EQUITIES (الأسهم المدرجة بالبورصة) ---
  const currentPrice = liveStock ? liveStock.close : pos.buyPrice;
  const cost = pos.buyPrice * pos.shares;
  const currentValue = Number((currentPrice * pos.shares).toFixed(2));
  const pnlPct = cost > 0 ? ((currentValue - cost) / cost) * 100 : 0;

  // Consult the rigorous technical analysis for this stock to ensure 100% alignment
  const stockRec = liveStock ? analyzeStock(liveStock) : null;
  const techStop = stockRec?.stopLoss || pos.stopLoss || (currentPrice * 0.95);
  const techTarget1 = stockRec?.target1 || pos.targetPrice || (currentPrice * 1.06);

  // 1. If the technical engine signals STOP_LOSS / Negative Breakdown (e.g. TMGH breaking support):
  if (stockRec && (stockRec.type === 'STOP_LOSS' || currentPrice <= techStop)) {
    if (pnlPct > 0) {
      return {
        position: pos,
        liveStock,
        status: 'STOP_LOSS_ALERT',
        statusTitle: '🚨 كسر فني - حماية الأرباح (Trailing Stop)',
        statusColor: 'text-rose-400 bg-rose-500/10 border-rose-500/30',
        currentPnlPct: Number(pnlPct.toFixed(2)),
        currentValue,
        currentPrice,
        actionTitle: 'جني الأرباح والتخارج الفوري لحماية المكاسب',
        actionDetails: `تحذير فني: السهم في وضع سلبي وكسر لمستويات الدعم والمتوسطات المتحركة. على الرغم من أن مركزك محقق ربحاً (+${pnlPct.toFixed(1)}%)، إلا أن استمرار الاحتفاظ يعرض أرباحك للتآكل. يُنصح بالخروج عند ${techStop.toFixed(2)} ج.م وتأمين السيولة.`,
        suggestedStopLoss: techStop,
        suggestedTarget: currentPrice,
        priority: 'high'
      };
    } else {
      return {
        position: pos,
        liveStock,
        status: 'STOP_LOSS_ALERT',
        statusTitle: '🚨 كسر خط وقف الخسارة الحرج',
        statusColor: 'text-rose-400 bg-rose-500/10 border-rose-500/30',
        currentPnlPct: Number(pnlPct.toFixed(2)),
        currentValue,
        currentPrice,
        actionTitle: 'تفعيل وقف الخسارة فوراً لحماية رأس المال',
        actionDetails: `تحذير فني: السهم في وضع سلبي وكسر لمستويات الدعم الفني (${techStop.toFixed(2)} ج.م). الإجراء الاحترافي هو الخروج لحماية رأس المال وإعادة التمركز بعد تأكيد الاستقرار.`,
        suggestedStopLoss: techStop,
        suggestedTarget: techTarget1,
        priority: 'high'
      };
    }
  }

  // 2. If the technical engine signals TAKE_PROFIT or Extreme Overbought (RSI > 70 or Target reached):
  if (stockRec && (stockRec.type === 'TAKE_PROFIT' || currentPrice >= techTarget1 || (liveStock && liveStock.rsi > 70))) {
    return {
      position: pos,
      liveStock,
      status: 'PROFIT_TAKE',
      statusTitle: '🎯 وصل لمستهدف جني الأرباح / تشبع شرائي',
      statusColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
      currentPnlPct: Number(pnlPct.toFixed(2)),
      currentValue,
      currentPrice,
      actionTitle: 'جني 50% من الأرباح ورفع الوقف لسعر الدخول',
      actionDetails: `حقق السهم مستهدفه الفني الأول عند (${techTarget1.toFixed(2)} ج.م) بربح (+${pnlPct.toFixed(1)}%). يُوصى ببيع نصف الكمية لتأمين المكاسب ورفع وقف الخسارة للنصف المتبقي إلى سعر الشراء (${pos.buyPrice.toFixed(2)} ج.م).`,
      suggestedStopLoss: pos.buyPrice,
      suggestedTarget: stockRec.target2,
      priority: 'high'
    };
  }

  // 3. If the technical engine signals STRONG_BUY / Breakout:
  if (stockRec && stockRec.type === 'STRONG_BUY') {
    return {
      position: pos,
      liveStock,
      status: 'TRENDING_UP',
      statusTitle: '🚀 اختراق صاعد وزخم شرائي قوي',
      statusColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
      currentPnlPct: Number(pnlPct.toFixed(2)),
      currentValue,
      currentPrice,
      actionTitle: 'استمرار الاحتفاظ مع رفع الوقف لاستهداف المقاومة',
      actionDetails: `السهم يتمتع بزخم شرائي مؤسسي عالي وتداول فوق المتوسطات. استمر في الاحتفاظ لاستهداف ${techTarget1.toFixed(2)} ج.م (+${stockRec.target1Pct}%) مع وضع وقف الخسارة عند ${techStop.toFixed(2)} ج.م.`,
      suggestedStopLoss: techStop,
      suggestedTarget: techTarget1,
      priority: 'normal'
    };
  }

  // 4. If the technical engine signals SWING_BUY:
  if (stockRec && stockRec.type === 'SWING_BUY') {
    return {
      position: pos,
      liveStock,
      status: 'TRENDING_UP',
      statusTitle: '⚡ ارتداد إيجابي ومضاربة صاعدة',
      statusColor: 'text-blue-400 bg-blue-500/10 border-blue-500/30',
      currentPnlPct: Number(pnlPct.toFixed(2)),
      currentValue,
      currentPrice,
      actionTitle: 'الاحتفاظ لتحقيق المستهدف السريع',
      actionDetails: `إشارة ارتداد إيجابية من مستويات الدعم. استمر في المركز لاستهداف ${techTarget1.toFixed(2)} ج.م مع الالتزام بوقف الخسارة عند ${techStop.toFixed(2)} ج.م.`,
      suggestedStopLoss: techStop,
      suggestedTarget: techTarget1,
      priority: 'normal'
    };
  }

  // 5. Oversold condition:
  if (liveStock && liveStock.rsi < 35 && pnlPct < -3) {
    return {
      position: pos,
      liveStock,
      status: 'AVERAGE_DOWN',
      statusTitle: '💡 منطقة تشبع بيعي وفرصة تبريد',
      statusColor: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30',
      currentPnlPct: Number(pnlPct.toFixed(2)),
      currentValue,
      currentPrice,
      actionTitle: 'تبريد مدروس بالقرب من مستويات الدعم',
      actionDetails: `السهم في منطقة قاع وتشبع بيعي (RSI ${liveStock.rsi.toFixed(1)}). إذا كنت مستثمراً متوسط الأجل، يمكنك إضافة كمية لتعديل متوسط الشراء بشرط عدم كسر الدعم S2 (${liveStock.support2.toFixed(2)} ج.م).`,
      suggestedStopLoss: liveStock.support2,
      suggestedTarget: liveStock.pivot,
      priority: 'medium'
    };
  }

  // 6. Healthy hold / positive path:
  if (pnlPct >= 0) {
    return {
      position: pos,
      liveStock,
      status: 'HOLD_CAUTIOUS',
      statusTitle: '📈 استثمار رابح وتماسك إيجابي',
      statusColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
      currentPnlPct: Number(pnlPct.toFixed(2)),
      currentValue,
      currentPrice,
      actionTitle: 'احتفاظ مع مراقبة مستويات المقاومة',
      actionDetails: `المركز محقق ربحاً (+${pnlPct.toFixed(1)}%) ويتداول في مسار مستقر. استمر في الاحتفاظ حتى تحقيق المستهدف (${techTarget1.toFixed(2)} ج.م) مع الحفاظ على وقف الخسارة عند ${techStop.toFixed(2)} ج.م.`,
      suggestedStopLoss: techStop,
      suggestedTarget: techTarget1,
      priority: 'normal'
    };
  }

  return {
    position: pos,
    liveStock,
    status: 'HOLD_CAUTIOUS',
    statusTitle: '🔄 تذبذب طبيعي ضمن الحدود الآمنة',
    statusColor: 'text-slate-400 bg-slate-500/10 border-slate-500/30',
    currentPnlPct: Number(pnlPct.toFixed(2)),
    currentValue,
    currentPrice,
    actionTitle: 'احتفاظ حذر ومتابعة مستويات الدعم',
    actionDetails: `التراجع الحالي (-${Math.abs(pnlPct).toFixed(1)}%) لا يزال أعلى من نقطة وقف الخسارة (${techStop.toFixed(2)} ج.م). راقب الجلسة القادمة والتزم بالخروج في حال كسر الدعم.`,
    suggestedStopLoss: techStop,
    suggestedTarget: techTarget1,
    priority: 'normal'
  };
}
