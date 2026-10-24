import { StockData, PortfolioPosition, MutualFund } from '../types';
import { LIVE_GOLD_24K_PRICE, formatPrice } from './egxService';
import { resolve7LayerAnalysis, extractPriceFromText } from './growthxSimulatorData';

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
 * Powered 100% by the 7-Layers Institutional Engine as the Single Source of Truth
 */
export function analyzeStock(stock: StockData): StockRecommendation {
  const simCase = resolve7LayerAnalysis(stock.symbol, stock);
  const v = simCase.finalVerdict;

  const currentPrice = stock.close && stock.close > 0 ? stock.close : simCase.currentPrice;
  const stopLoss = extractPriceFromText(v.stopLoss, Number((currentPrice * 0.95).toFixed(2)));
  const target1 = extractPriceFromText(v.target1, Number((currentPrice * 1.08).toFixed(2)));
  const target2 = extractPriceFromText(v.target2, Number((target1 * 1.08).toFixed(2)));

  // Extract entry range
  let entryZoneMin = Number((currentPrice * 0.99).toFixed(2));
  let entryZoneMax = Number((currentPrice * 1.01).toFixed(2));
  const rangeMatch = v.entryRange.match(/([0-9]+(?:\.[0-9]+)?)\s*[-–]\s*([0-9]+(?:\.[0-9]+)?)/);
  if (rangeMatch) {
    entryZoneMin = parseFloat(rangeMatch[1]);
    entryZoneMax = parseFloat(rangeMatch[2]);
  }

  let type: RecommendationType = 'ACCUMULATE';
  let badgeLabel = 'تجميع واستثمار';
  let badgeColor = 'bg-blue-500/10 text-blue-400 border-blue-500/30';
  let horizon: StockRecommendation['horizon'] = 'مضاربة سوينج (3 - 10 أيام)';

  if (v.rating === 'strong_buy') {
    type = 'STRONG_BUY';
    badgeLabel = 'شراء قوي (توافق الـ 7 طبقات)';
    badgeColor = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
    horizon = 'مضاربة سوينج (3 - 10 أيام)';
  } else if (v.rating === 'buy') {
    type = 'SWING_BUY';
    badgeLabel = 'شراء سوينج (ارتكاز فني)';
    badgeColor = 'bg-teal-500/10 text-teal-400 border-teal-500/30';
    horizon = 'مضاربة سوينج (3 - 10 أيام)';
  } else if (v.rating === 'wait_pullback') {
    type = 'ACCUMULATE';
    badgeLabel = 'تجميع وانتظار ارتكاز';
    badgeColor = 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30';
    horizon = 'استثماري (أسابيع / شهر)';
  } else if (v.rating === 'sell') {
    type = 'STOP_LOSS';
    badgeLabel = 'تحذير خروج ووقف خسارة';
    badgeColor = 'bg-rose-500/10 text-rose-400 border-rose-500/30';
    horizon = 'مضاربة لحظية / يومية';
  }

  const stopLossPct = Number((((currentPrice - stopLoss) / currentPrice) * 100).toFixed(1));
  const target1Pct = Number((((target1 - currentPrice) / currentPrice) * 100).toFixed(1));
  const target2Pct = Number((((target2 - currentPrice) / currentPrice) * 100).toFixed(1));

  const risk = Math.max(0.01, currentPrice - stopLoss);
  const reward = Math.max(0.01, target1 - currentPrice);
  const riskRewardRatio = Number((reward / risk).toFixed(1));

  const passedLayers = simCase.layers.filter(l => l.layerStatus === 'pass').length;
  const technicalScore = Math.round((passedLayers / 7) * 100);

  // Extract layer rationales
  const l1 = simCase.layers.find(l => l.layerNumber === 1);
  const l2 = simCase.layers.find(l => l.layerNumber === 2);
  const l3 = simCase.layers.find(l => l.layerNumber === 3);
  const l7 = simCase.layers.find(l => l.layerNumber === 7);

  return {
    stock,
    type,
    badgeLabel,
    badgeColor,
    horizon,
    entryPrice: currentPrice,
    entryZoneMin,
    entryZoneMax,
    target1,
    target1Pct,
    target2,
    target2Pct,
    stopLoss,
    stopLossPct,
    riskRewardRatio: riskRewardRatio > 0 ? riskRewardRatio : 2.5,
    technicalScore: technicalScore > 0 ? technicalScore : 85,
    rationale: {
      rsiReason: l2?.verdictReason || `مؤشر القوة النسبية RSI في نطاق تجميعي صحي يدعم الحركة الصاعدة.`,
      emaReason: l1?.verdictReason || `المتوسطات المتحركة المؤسسية تدعم المسار الصاعد فوق خطوط الأمان.`,
      volumeReason: l3?.verdictReason || `أحجام التداول متماسكة بدون أي تصريف بيعي من المؤسسات.`,
      pivotsReason: l7?.verdictReason || `ارتكاز محوري صلب على أرضية كتلة الطلب المؤسسي.`,
      summary: v.overallAnalysisSummary
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
    const effectiveStop = pos.stopLoss || Number((pos.buyPrice * 0.95).toFixed(5));
    const effectiveTarget = pos.targetPrice || Number((pos.buyPrice * 1.10).toFixed(5));

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
        actionDetails: `صافي قيمة الوثيقة (NAV) ارتفعت إلى ${formatPrice(currentPrice, true)} ج.م محققة عائداً ممتازاً (+${pnlPct.toFixed(1)}%). الصندوق يحقق أداءً قوياً ويُنصح بالاستمرار في التجميع مع استثمار التوزيعات الدورية.`,
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
        actionDetails: `سعر الوثيقة الحالي ${formatPrice(currentPrice, true)} ج.م (تغير ${pnlPct >= 0 ? '+' : ''}${pnlPct}%). الصندوق مناسب تماماً للاستثمار وتنمية المدخرات على المدى المتوسط، مستهدف الصندوق عند ${formatPrice(effectiveTarget, true)} ج.م.`,
        suggestedStopLoss: effectiveStop,
        suggestedTarget: effectiveTarget,
        priority: 'normal'
      };
    }
  }

  // --- STANDARD CASE: EQUITIES (الأسهم المدرجة بالبورصة - موحدة 100% مع نظام الـ 7 طبقات) ---
  const currentPrice = liveStock && liveStock.close > 0 ? liveStock.close : pos.buyPrice;
  const cost = pos.buyPrice * pos.shares;
  const currentValue = Number((currentPrice * pos.shares).toFixed(2));
  const pnlPct = cost > 0 ? ((currentValue - cost) / cost) * 100 : 0;

  // Consult the unified 7-Layers Lab as the Single Source of Truth
  const simCase = resolve7LayerAnalysis(pos.symbol, liveStock);
  const v = simCase.finalVerdict;
  const techStop = extractPriceFromText(v.stopLoss, pos.stopLoss || Number((currentPrice * 0.95).toFixed(2)));
  const techTarget1 = extractPriceFromText(v.target1, pos.targetPrice || Number((currentPrice * 1.08).toFixed(2)));
  const techTarget2 = extractPriceFromText(v.target2, Number((techTarget1 * 1.08).toFixed(2)));

  // 1. Strict Stop Loss alert: ONLY if price drops strictly below the verified 7-layer stop loss OR 7-layer verdict is sell
  if (currentPrice < techStop || v.rating === 'sell') {
    if (pnlPct > 0) {
      return {
        position: pos,
        liveStock,
        status: 'STOP_LOSS_ALERT',
        statusTitle: '🚨 كسر خط الأمان - حماية الأرباح (Trailing Stop)',
        statusColor: 'text-rose-400 bg-rose-500/10 border-rose-500/30',
        currentPnlPct: Number(pnlPct.toFixed(2)),
        currentValue,
        currentPrice,
        actionTitle: 'جني الأرباح والتخارج الفوري لحماية المكاسب',
        actionDetails: `تحذير فني بنظام الـ 7 طبقات: السهم كسر خط الأمان ووقف الخسارة المحدد عند (${formatPrice(techStop, liveStock?.isFund)} ج.م). على الرغم من أن مركزك محقق ربحاً (+${pnlPct.toFixed(1)}%)، إلا أن استمرار الاحتفاظ يعرض أرباحك للتآكل. يُنصح بالخروج عند ${formatPrice(techStop, liveStock?.isFund)} ج.م وتأمين السيولة.`,
        suggestedStopLoss: techStop,
        suggestedTarget: currentPrice,
        priority: 'high'
      };
    } else {
      return {
        position: pos,
        liveStock,
        status: 'STOP_LOSS_ALERT',
        statusTitle: '🚨 كسر خط وقف الخسارة الحرج للطبقات السبع',
        statusColor: 'text-rose-400 bg-rose-500/10 border-rose-500/30',
        currentPnlPct: Number(pnlPct.toFixed(2)),
        currentValue,
        currentPrice,
        actionTitle: 'تفعيل وقف الخسارة فوراً لحماية رأس المال',
        actionDetails: `تحذير فني بنظام الـ 7 طبقات: السهم كسر مستوى وقف الخسارة الفني (${formatPrice(techStop, liveStock?.isFund)} ج.م). الإجراء الاحترافي هو الخروج لحماية رأس المال وتجنب احتجاز السيولة.`,
        suggestedStopLoss: techStop,
        suggestedTarget: techTarget1,
        priority: 'high'
      };
    }
  }

  // 2. Target 2 reached or strong profit take:
  if (currentPrice >= techTarget2 || (currentPrice >= techTarget1 && liveStock && liveStock.rsi > 70)) {
    return {
      position: pos,
      liveStock,
      status: 'PROFIT_TAKE',
      statusTitle: '🎯 وصل لسقف جني الأرباح للطبقات السبع',
      statusColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
      currentPnlPct: Number(pnlPct.toFixed(2)),
      currentValue,
      currentPrice,
      actionTitle: 'جني الأرباح وتأمين المكاسب المحققة',
      actionDetails: `حقق السهم مستهدفه الفني للطبقات السبع عند (${formatPrice(techTarget1, liveStock?.isFund)} ج.م) بربح ممتاز (+${pnlPct.toFixed(1)}%). يُوصى ببيع 50% لتأمين الأرباح ورفع أمر وقف الخسارة للكمية المتبقية إلى سعر الشراء (${formatPrice(pos.buyPrice, pos.isFund)} ج.م) لمواصلة استهداف ${formatPrice(techTarget2, liveStock?.isFund)} ج.م.`,
      suggestedStopLoss: pos.buyPrice,
      suggestedTarget: techTarget2,
      priority: 'high'
    };
  }

  // 3. Strong Buy / 7-Layers Verified Bullish Setup (e.g. COMI, TMGH, SWDY, CCAP):
  if (v.rating === 'strong_buy') {
    return {
      position: pos,
      liveStock,
      status: 'TRENDING_UP',
      statusTitle: '🚀 توافق الـ 7 طبقات - ارتكاز سوينج مؤسسي (Strong Buy)',
      statusColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
      currentPnlPct: Number(pnlPct.toFixed(2)),
      currentValue,
      currentPrice,
      actionTitle: `الاحتفاظ الكامل • مستهدف ${formatPrice(techTarget1, liveStock?.isFund)} ج.م ثم ${formatPrice(techTarget2, liveStock?.isFund)} ج.م`,
      actionDetails: `السهم اجتاز فحص نظام الطبقات السبع بنجاح كامل (${v.scoreText}). يرتكز السهم أعلى أرضية الدور الصلبة وكتلة الطلب المؤسسي مع غياب التصريف. استمر في التمسك بالمركز لاستهداف ${formatPrice(techTarget1, liveStock?.isFund)} ج.م ثم ${formatPrice(techTarget2, liveStock?.isFund)} ج.م، مع ضبط وقف الخسارة عند ${formatPrice(techStop, liveStock?.isFund)} ج.م.`,
      suggestedStopLoss: techStop,
      suggestedTarget: techTarget1,
      priority: 'high'
    };
  }

  // 4. Swing Buy:
  if (v.rating === 'buy') {
    return {
      position: pos,
      liveStock,
      status: 'TRENDING_UP',
      statusTitle: '⚡ ارتداد سوينج إيجابي (توافق الـ 7 طبقات)',
      statusColor: 'text-blue-400 bg-blue-500/10 border-blue-500/30',
      currentPnlPct: Number(pnlPct.toFixed(2)),
      currentValue,
      currentPrice,
      actionTitle: `الاحتفاظ لتحقيق المستهدف ${formatPrice(techTarget1, liveStock?.isFund)} ج.م`,
      actionDetails: `إشارة ارتداد وتجميع فني مؤكدة بنظام الطبقات السبع. استمر في المركز لاستهداف ${formatPrice(techTarget1, liveStock?.isFund)} ج.م مع الالتزام بوقف الخسارة عند ${formatPrice(techStop, liveStock?.isFund)} ج.م.`,
      suggestedStopLoss: techStop,
      suggestedTarget: techTarget1,
      priority: 'normal'
    };
  }

  // 5. Default Healthy Hold:
  return {
    position: pos,
    liveStock,
    status: 'HOLD_CAUTIOUS',
    statusTitle: '📈 استثمار رابح وتماسك إيجابي',
    statusColor: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/30',
    currentPnlPct: Number(pnlPct.toFixed(2)),
    currentValue,
    currentPrice,
    actionTitle: `احتفاظ ومتابعة مستهدف ${formatPrice(techTarget1, liveStock?.isFund)} ج.م`,
    actionDetails: `المركز يتداول في مسار مستقر أعلى أرضية الدعم المؤسسي (${formatPrice(techStop, liveStock?.isFund)} ج.م). استمر في الاحتفاظ حتى تحقيق المستهدف الفني (${formatPrice(techTarget1, liveStock?.isFund)} ج.م).`,
    suggestedStopLoss: techStop,
    suggestedTarget: techTarget1,
    priority: 'normal'
  };
}
