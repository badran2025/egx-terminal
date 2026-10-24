import React, { useState, useRef } from 'react';
import { 
  Briefcase, Plus, Trash2, TrendingUp, TrendingDown, 
  CheckCircle, ShieldAlert, Sparkles, BarChart2,
  ExternalLink, DollarSign, Image as ImageIcon, 
  CheckCircle2, ArrowUpRight, Search, Upload, Pencil
} from 'lucide-react';
import { StockData, PortfolioPosition } from '../types';
import { EGYPTIAN_MUTUAL_FUNDS, LIVE_GOLD_24K_PRICE, formatPrice } from '../services/egxService';
import { EGX_ARABIC_NAMES } from '../services/egxArabicNames';
import { MdCard, MdButton, MdBadge, MdTextField } from './material';
import { LastUpdatedBanner } from './LastUpdatedBanner';

// Unified helper function to format prices without forced rounding on mutual funds or exact decimals
export const formatAssetPrice = formatPrice;

interface Props {
  stocks: StockData[];
  portfolio: PortfolioPosition[];
  onAddPosition: (position: Omit<PortfolioPosition, 'id'>) => void;
  onUpdatePosition?: (position: PortfolioPosition) => void;
  onDeletePosition: (id: string) => void;
  onSelectStock: (symbol: string) => void;
  lastUpdated?: Date;
  onRefresh?: () => void;
  isLoading?: boolean;
}

export const PortfolioView: React.FC<Props> = ({
  stocks,
  portfolio,
  onAddPosition,
  onUpdatePosition,
  onDeletePosition,
  onSelectStock,
  lastUpdated,
  onRefresh,
  isLoading = false
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingPosition, setEditingPosition] = useState<PortfolioPosition | null>(null);
  
  // Add Asset Form States
  const [symbol, setSymbol] = useState('');
  const [shares, setShares] = useState<string>('');
  const [buyPrice, setBuyPrice] = useState<string>('');
  const [assetType, setAssetType] = useState<'stock' | 'fund' | 'gold'>('stock');
  const [notes, setNotes] = useState('');
  const [iconUrl, setIconUrl] = useState<string>('');
  const iconInputRef = useRef<HTMLInputElement>(null);

  // Map stocks by symbol for quick lookup
  const stockMap = new Map<string, StockData>();
  stocks.forEach(s => stockMap.set(s.symbol.toUpperCase(), s));

  // Map funds by code for quick lookup
  const fundMap = new Map<string, any>();
  EGYPTIAN_MUTUAL_FUNDS.forEach(f => {
    fundMap.set(f.code.toUpperCase(), f);
    fundMap.set(f.code.toLowerCase(), f);
  });

  // Portfolio calculations
  let totalCost = 0;
  let totalCurrentValue = 0;
  let totalDailyChange = 0;
  let totalStocksValue = 0;
  let totalFundsValue = 0;
  let totalGoldValue = 0;
  let totalGoldGrams = 0;

  const positionsWithData = portfolio.map(pos => {
    const sym = pos.symbol.toUpperCase();
    const liveStock = stockMap.get(sym);
    const liveFund = fundMap.get(sym) || fundMap.get(pos.symbol.toLowerCase());
    
    const isGold = pos.assetType === 'gold' || 
                   sym === 'THNDRGOLD' || 
                   Boolean(pos.isGold) || 
                   sym.includes('GOLD') || 
                   (pos.notes && (pos.notes.includes('ذهب') || pos.notes.includes('gold')));

    const isFund = Boolean(!isGold && (liveFund || pos.assetType === 'fund'));
    
    let currentPrice = pos.buyPrice;
    let changeTodayPct = 0;
    let displayName = EGX_ARABIC_NAMES[sym]?.nameAr || pos.symbol;

    if (isFund && liveFund) {
      currentPrice = liveFund.nav || pos.buyPrice;
      changeTodayPct = liveFund.dailyChange;
      displayName = liveFund.name;
    } else if (liveStock) {
      currentPrice = liveStock.close;
      changeTodayPct = liveStock.changePercent;
      displayName = liveStock.nameAr;
    } else if (liveFund) {
      currentPrice = liveFund.nav || pos.buyPrice;
      changeTodayPct = liveFund.dailyChange;
      displayName = liveFund.name;
    }

    let grams = pos.shares;
    let cost = pos.buyPrice * pos.shares;
    let currentValue = currentPrice * pos.shares;
    let breakEvenPrice = 0;

    if (isGold) {
      displayName = "دهب ثاندر (عيار 24 بنقاء 99.99%)";
      grams = pos.grams || pos.shares;
      cost = pos.totalCostWithFees || (pos.buyPrice * grams);
      
      // Live 24k gold market sell price (Unified across entire terminal)
      const goldSellPricePerGram = (liveStock?.close && liveStock.close > 1000) 
        ? liveStock.close 
        : (liveFund?.nav && liveFund.nav > 1000 ? liveFund.nav : LIVE_GOLD_24K_PRICE);
      
      currentPrice = goldSellPricePerGram;
      // Net cash value upon liquidation after Thndr's 1% sell fee
      currentValue = Number((grams * goldSellPricePerGram * 0.99).toFixed(2));
      // Break-even price per gram required to cover both buy (1%) and sell (1%) fees:
      breakEvenPrice = grams > 0 ? Number((cost / (grams * 0.99)).toFixed(2)) : Number((pos.buyPrice * 1.0202).toFixed(2));
    }
    
    const pnl = currentValue - cost;
    const pnlPct = cost > 0 ? (pnl / cost) * 100 : 0;
    const dailyPnl = (currentValue * changeTodayPct) / 100;

    totalCost += cost;
    totalCurrentValue += currentValue;
    totalDailyChange += dailyPnl;

    if (isGold) {
      totalGoldValue += currentValue;
      totalGoldGrams += grams;
    } else if (isFund) {
      totalFundsValue += currentValue;
    } else {
      totalStocksValue += currentValue;
    }

    // Alerts
    let alertType: 'stop_loss' | 'take_profit' | 'rsi_warning' | 'normal' = 'normal';
    let alertMsg = '';

    let effectiveStop = pos.stopLoss || (liveStock ? liveStock.support1 : pos.buyPrice * 0.95);
    let effectiveTarget = pos.targetPrice || (liveStock ? liveStock.resistance1 : pos.buyPrice * 1.10);

    if (isGold) {
      effectiveStop = pos.stopLoss || Number((pos.buyPrice * 0.95).toFixed(2));
      effectiveTarget = pos.targetPrice || Number((breakEvenPrice * 1.05).toFixed(2)); // Target 5% net profit

      if (currentPrice >= breakEvenPrice) {
        alertType = 'take_profit';
        alertMsg = `🟢 الذهب في منطقة الربح الصافي بعد تغطية عمولتي الشراء والبيع (سعر الجرام الحالي ${currentPrice.toFixed(2)} ج.م / سعر التعادل ${breakEvenPrice.toFixed(2)} ج.م)`;
      } else {
        const diff = Number((breakEvenPrice - currentPrice).toFixed(2));
        alertMsg = `يحتاج الذهب للارتفاع بمقدار +${diff} ج.م/جرام للوصول لنقطة التعادل (${breakEvenPrice.toFixed(2)} ج.م) وبدء المكسب الصافي`;
      }
    } else {
      if (currentPrice <= effectiveStop) {
        alertType = 'stop_loss';
        alertMsg = `كسر وقف الخسارة عند ${currentPrice.toFixed(2)} ج.م (الحد: ${effectiveStop.toFixed(2)} ج.م)`;
      } else if (currentPrice >= effectiveTarget) {
        alertType = 'take_profit';
        alertMsg = `وصل لمستهدف جني الأرباح عند ${currentPrice.toFixed(2)} ج.م (المستهدف: ${effectiveTarget.toFixed(2)} ج.م)`;
      } else if (liveStock && liveStock.rsi > 72) {
        alertType = 'rsi_warning';
        alertMsg = `تشبع شرائي مفرط (RSI ${liveStock.rsi.toFixed(1)}) - يُنصح برفع الوقف`;
      }
    }

    return {
      ...pos,
      isGold,
      isFund,
      grams,
      breakEvenPrice,
      displayName,
      liveStock,
      liveFund,
      currentPrice,
      cost,
      currentValue,
      pnl,
      pnlPct,
      dailyPnl,
      changeTodayPct,
      alertType,
      alertMsg,
      effectiveStop,
      effectiveTarget
    };
  });

  const totalPnl = totalCurrentValue - totalCost;
  const totalPnlPct = totalCost > 0 ? (totalPnl / totalCost) * 100 : 0;
  const urgentAlerts = positionsWithData.filter(p => p.alertType === 'stop_loss' || p.alertType === 'take_profit');

  const handleIconUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setIconUrl(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Check if active asset is Gold (Thndr Gold / 24k Gold)
  const isGoldActive = assetType === 'gold' || 
                       symbol.toUpperCase() === 'THNDRGOLD' || 
                       symbol.toUpperCase() === 'AZG' || 
                       symbol.toUpperCase().includes('GOLD') ||
                       symbol.includes('ذهب') || symbol.includes('دهب');

  // Auto-calculated stop loss and targets based on technical analysis
  const currentSelectedStock = stockMap.get(symbol.toUpperCase());
  const parsedBuyPrice = parseFloat(buyPrice) || 0;
  const parsedShares = parseFloat(shares) || 0;
  const totalInvestment = Number((parsedBuyPrice * parsedShares).toFixed(2));
  
  // Dedicated Gold Calculations (Thndr Gold 24k official pricing & fees)
  const liveGoldSellPrice = (stockMap.get('THNDRGOLD')?.close && stockMap.get('THNDRGOLD')!.close > 1000)
    ? stockMap.get('THNDRGOLD')!.close 
    : (fundMap.get('thndrgold')?.nav && fundMap.get('thndrgold')!.nav > 1000 ? fundMap.get('thndrgold')!.nav : LIVE_GOLD_24K_PRICE);

  // Break-even price per gram required to cover 1% buy fee and 1% sell fee:
  // Net cash received upon sale = Grams * P_sell * 0.99
  // At break even: Net Cash = Total Investment => P_sell = Total Investment / (Grams * 0.99)
  const goldBreakEvenPrice = (parsedShares > 0 && totalInvestment > 0)
    ? Number((totalInvestment / (parsedShares * 0.99)).toFixed(2))
    : Number((parsedBuyPrice * 1.0202).toFixed(2));

  // Current liquid value in hand today
  const goldCurrentGross = Number((parsedShares * liveGoldSellPrice).toFixed(2));
  const goldSellFee1Pct = Number((goldCurrentGross * 0.01).toFixed(2));
  const goldCurrentNet = Number((goldCurrentGross - goldSellFee1Pct).toFixed(2));
  const goldPnl = Number((goldCurrentNet - totalInvestment).toFixed(2));
  const goldPnlPct = totalInvestment > 0 ? Number(((goldPnl / totalInvestment) * 100).toFixed(2)) : 0;
  
  // Distance to break even
  const goldDiffToBreakEven = Number((goldBreakEvenPrice - liveGoldSellPrice).toFixed(2));
  const goldPctToBreakEven = liveGoldSellPrice > 0 ? Number(((goldDiffToBreakEven / liveGoldSellPrice) * 100).toFixed(2)) : 0;

  // Gold Profit Milestones (after all buy & sell fees)
  const goldTarget5PctPrice = Number((goldBreakEvenPrice * 1.05).toFixed(2));
  const goldTarget5PctProfit = Number((totalInvestment * 0.05).toFixed(2));
  const goldTarget10PctPrice = Number((goldBreakEvenPrice * 1.10).toFixed(2));
  const goldTarget10PctProfit = Number((totalInvestment * 0.10).toFixed(2));
  const goldTarget20PctPrice = Number((goldBreakEvenPrice * 1.20).toFixed(2));
  const goldTarget20PctProfit = Number((totalInvestment * 0.20).toFixed(2));

  const numBuyPrice = parsedBuyPrice || (currentSelectedStock ? currentSelectedStock.close : 0);
  
  const isFundActive = assetType === 'fund' || fundMap.has(symbol.trim().toUpperCase());
  const precision = isFundActive ? 5 : 2;

  // S1: Stop Loss
  let computedStopLoss = numBuyPrice * 0.95;
  if (currentSelectedStock && currentSelectedStock.support1 > 0) {
    if (currentSelectedStock.support1 < numBuyPrice && currentSelectedStock.support1 >= numBuyPrice * 0.85) {
      computedStopLoss = currentSelectedStock.support1;
    } else {
      computedStopLoss = numBuyPrice * 0.95;
    }
  }
  computedStopLoss = Number(computedStopLoss.toFixed(precision));

  // R1: Target 1
  let computedTarget1 = numBuyPrice * 1.08;
  if (currentSelectedStock && currentSelectedStock.resistance1 > 0) {
    if (currentSelectedStock.resistance1 > numBuyPrice && currentSelectedStock.resistance1 <= numBuyPrice * 1.35) {
      computedTarget1 = currentSelectedStock.resistance1;
    } else {
      computedTarget1 = numBuyPrice * 1.08;
    }
  }
  computedTarget1 = Number(computedTarget1.toFixed(precision));

  // R2: Target 2
  let computedTarget2 = computedTarget1 * 1.10;
  if (currentSelectedStock && currentSelectedStock.resistance2 > 0) {
    if (currentSelectedStock.resistance2 > computedTarget1 && currentSelectedStock.resistance2 <= numBuyPrice * 1.60) {
      computedTarget2 = currentSelectedStock.resistance2;
    } else {
      computedTarget2 = Number((computedTarget1 * 1.10).toFixed(precision));
    }
  }
  computedTarget2 = Number(computedTarget2.toFixed(precision));

  // Filtered asset suggestions when typing symbol
  const assetSuggestions = React.useMemo(() => {
    const q = symbol.trim().toLowerCase();
    if (!q || q.length < 1) return [];

    const norm = (str: string) => str.toLowerCase().replace(/[أإآ]/g, 'ا').replace(/ة/g, 'ه').replace(/ى/g, 'ي').trim();
    const qNorm = norm(q);

    const results: Array<{ sym: string; nameAr: string; price?: number; isFund?: boolean; isGold?: boolean }> = [];
    const seen = new Set<string>();

    // 0. Quick Gold Match
    if (q.includes('دهب') || q.includes('ذهب') || q.includes('gold')) {
      seen.add('THNDRGOLD');
      results.push({ sym: 'THNDRGOLD', nameAr: 'صندوق ذهب ثاندر (عيار 24)', price: liveGoldSellPrice, isFund: true, isGold: true });
    }

    // 1. Check stocks
    stocks.forEach(s => {
      const sym = s.symbol.toUpperCase();
      if (seen.has(sym)) return;
      if (sym.toLowerCase().includes(q) || norm(s.nameAr).includes(qNorm) || (s.nameEn && s.nameEn.toLowerCase().includes(q))) {
        seen.add(sym);
        results.push({ sym, nameAr: s.nameAr, price: s.close, isFund: false });
      }
    });

    // 2. Check EGX_ARABIC_NAMES
    Object.entries(EGX_ARABIC_NAMES).forEach(([sym, meta]) => {
      const upperSym = sym.toUpperCase();
      if (seen.has(upperSym) || ['EGX30', 'EGX70EWI', 'EGX100EWI'].includes(upperSym)) return;
      if (upperSym.toLowerCase().includes(q) || norm(meta.nameAr).includes(qNorm) || norm(meta.nameEn).includes(qNorm)) {
        seen.add(upperSym);
        const st = stockMap.get(upperSym);
        const isG = upperSym === 'THNDRGOLD' || meta.sector?.includes('ذهب');
        results.push({ sym: upperSym, nameAr: meta.nameAr, price: isG ? liveGoldSellPrice : st?.close, isFund: meta.sector?.includes('ذهب') || meta.sector?.includes('صناديق'), isGold: isG });
      }
    });

    // 3. Check mutual funds
    EGYPTIAN_MUTUAL_FUNDS.forEach(f => {
      const code = f.code.toUpperCase();
      if (seen.has(code)) return;
      if (code.toLowerCase().includes(q) || norm(f.name).includes(qNorm)) {
        seen.add(code);
        const isG = code === 'THNDRGOLD' || f.category === 'ذهب وفضة';
        results.push({ sym: f.code, nameAr: f.name, price: isG ? liveGoldSellPrice : f.nav, isFund: true, isGold: isG });
      }
    });

    return results.slice(0, 6);
  }, [symbol, stocks, stockMap, liveGoldSellPrice]);

  const handleStartEdit = (pos: PortfolioPosition) => {
    setEditingPosition(pos);
    setSymbol(pos.symbol);
    const isG = Boolean(pos.isGold || pos.assetType === 'gold' || pos.symbol.toUpperCase() === 'THNDRGOLD');
    setAssetType(isG ? 'gold' : (pos.isFund ? 'fund' : (pos.assetType || 'stock')));
    setShares(String(pos.grams || pos.shares));
    setBuyPrice(String(pos.buyPrice));
    setNotes(pos.notes || '');
    setIconUrl(pos.iconUrl || '');
    setShowAddModal(true);
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setEditingPosition(null);
    setSymbol('');
    setShares('');
    setBuyPrice('');
    setNotes('');
    setIconUrl('');
    setAssetType('stock');
  };

  const handleSavePosition = (e: React.FormEvent) => {
    e.preventDefault();
    if (!symbol.trim() || !parsedShares || !parsedBuyPrice) return;

    if (editingPosition && onUpdatePosition) {
      if (isGoldActive) {
        onUpdatePosition({
          ...editingPosition,
          symbol: symbol.trim().toUpperCase() || 'THNDRGOLD',
          assetType: 'gold',
          shares: parsedShares,
          grams: parsedShares,
          buyPrice: parsedBuyPrice,
          stopLoss: Number((parsedBuyPrice * 0.95).toFixed(2)),
          targetPrice: goldBreakEvenPrice,
          breakEvenPrice: goldBreakEvenPrice,
          totalCostWithFees: totalInvestment,
          notes: notes || `دهب ثاندر عيار 24 • وزن ${parsedShares} جرام • سعر التعادل ${goldBreakEvenPrice.toFixed(2)} ج.م/جرام`,
          iconUrl: iconUrl || editingPosition.iconUrl,
          isGold: true
        });
      } else {
        onUpdatePosition({
          ...editingPosition,
          symbol: symbol.trim().toUpperCase(),
          assetType,
          isFund: assetType === 'fund' || fundMap.has(symbol.trim().toUpperCase()),
          shares: parsedShares,
          buyPrice: parsedBuyPrice,
          stopLoss: computedStopLoss,
          targetPrice: computedTarget1,
          notes: notes || `متوسط شراء ${parsedBuyPrice} ج.م • إجمالي تكلفة ${totalInvestment.toLocaleString('en-US')} ج.م`,
          iconUrl: iconUrl || editingPosition.iconUrl
        });
      }
    } else {
      if (isGoldActive) {
        onAddPosition({
          symbol: symbol.trim().toUpperCase() || 'THNDRGOLD',
          assetType: 'gold',
          shares: parsedShares,
          buyPrice: parsedBuyPrice,
          buyDate: new Date().toISOString().split('T')[0],
          stopLoss: Number((parsedBuyPrice * 0.95).toFixed(2)),
          targetPrice: goldBreakEvenPrice,
          notes: notes || `دهب ثاندر عيار 24 • وزن ${parsedShares} جرام • سعر التعادل ${goldBreakEvenPrice.toFixed(2)} ج.م/جرام`,
          iconUrl: iconUrl || undefined,
          isGold: true,
          grams: parsedShares,
          buyFeePercent: 1.0,
          sellFeePercent: 1.0,
          breakEvenPrice: goldBreakEvenPrice,
          totalCostWithFees: totalInvestment
        });
      } else {
        onAddPosition({
          symbol: symbol.trim().toUpperCase(),
          assetType,
          isFund: assetType === 'fund' || fundMap.has(symbol.trim().toUpperCase()),
          shares: parsedShares,
          buyPrice: parsedBuyPrice,
          buyDate: new Date().toISOString().split('T')[0],
          stopLoss: computedStopLoss,
          targetPrice: computedTarget1,
          notes: notes || `متوسط شراء ${parsedBuyPrice} ج.م • إجمالي تكلفة ${totalInvestment.toLocaleString('en-US')} ج.م`,
          iconUrl: iconUrl || undefined
        });
      }
    }

    handleCloseModal();
  };

  return (
    <div className="space-y-6 text-md-on-surface" dir="rtl">
      {/* Date of Last Update Banner */}
      <LastUpdatedBanner
        lastUpdated={lastUpdated}
        onRefresh={onRefresh}
        isLoading={isLoading}
        tabTitle="محفظة ثاندر الذكية ومتابعة الأرباح"
      />

      {/* Portfolio KPI Summary Bar (M3 Elevated Cards - Compact) */}
      {portfolio.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {/* Total Value */}
          <MdCard variant="elevated" className="p-4 sm:p-5 relative overflow-hidden">
            <div className="flex items-center justify-between text-md-on-surface-variant text-xs mb-1.5">
              <span className="font-medium">القيمة السوقية الإجمالية للمحفظة</span>
              <Briefcase size={18} className="text-md-on-surface-variant" />
            </div>
            <div className="font-mono text-2xl sm:text-3xl font-extrabold text-md-on-surface mb-1.5">
              {totalCurrentValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ج.م
            </div>
            <div className="flex items-center gap-2 text-xs text-md-on-surface-variant flex-wrap">
              <span>أسهم: <strong className="font-mono text-md-on-surface">{totalStocksValue.toLocaleString('en-US', { maximumFractionDigits: 0 })}</strong></span>
              <span>•</span>
              <span>صناديق: <strong className="font-mono text-md-on-surface">{totalFundsValue.toLocaleString('en-US', { maximumFractionDigits: 0 })}</strong></span>
              {totalGoldValue > 0 && (
                <>
                  <span>•</span>
                  <span className="text-amber-500 font-bold">🥇 دهب: <strong className="font-mono text-md-on-surface">{totalGoldValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ج.م</strong></span>
                </>
              )}
            </div>
          </MdCard>

          {/* Unrealized P&L */}
          <MdCard variant="elevated" className="p-4 sm:p-5 relative overflow-hidden">
            <div className="flex items-center justify-between text-md-on-surface-variant text-xs mb-1.5">
              <span className="font-medium">إجمالي العائد التراكمي (الربح / الخسارة)</span>
              {totalPnl >= 0 ? <TrendingUp size={18} className="text-md-primary" /> : <TrendingDown size={18} className="text-md-error" />}
            </div>
            <div className={`font-mono text-2xl sm:text-3xl font-extrabold mb-1 ${totalPnl >= 0 ? 'text-md-primary' : 'text-md-error'}`}>
              {totalPnl >= 0 ? '+' : ''}{totalPnl.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ج.م
            </div>
            <div className="flex items-center gap-1.5 text-xs">
              <span className={`font-mono font-bold px-2 py-0.5 rounded-md-sm ${
                totalPnlPct >= 0 ? 'bg-md-primary-container text-md-on-primary-container' : 'bg-md-error-container text-md-on-error-container'
              }`}>
                {totalPnlPct >= 0 ? '+' : ''}{totalPnlPct.toFixed(2)}%
              </span>
              <span className="text-md-on-surface-variant">من إجمالي التكلفة</span>
            </div>
          </MdCard>

          {/* Daily Change */}
          <MdCard variant="elevated" className="p-4 sm:p-5 relative overflow-hidden">
            <div className="flex items-center justify-between text-md-on-surface-variant text-xs mb-1.5">
              <span className="font-medium">تغير اليوم (عن إغلاق الأمس)</span>
              <DollarSign size={18} className="text-amber-500" />
            </div>
            <div className={`font-mono text-2xl sm:text-3xl font-extrabold mb-1 ${totalDailyChange >= 0 ? 'text-md-primary' : 'text-md-error'}`}>
              {totalDailyChange >= 0 ? '+' : ''}{totalDailyChange.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ج.م
            </div>
            <div className="flex items-center gap-1.5 text-xs">
              <span className={`font-mono font-bold px-2 py-0.5 rounded-md-sm ${
                totalDailyChange >= 0 ? 'bg-md-primary-container text-md-on-primary-container' : 'bg-md-error-container text-md-on-error-container'
              }`}>
                {totalCurrentValue > 0 ? (totalDailyChange >= 0 ? '+' : '') + ((totalDailyChange / Math.max(1, totalCurrentValue - totalDailyChange)) * 100).toFixed(2) + '%' : '0.00%'}
              </span>
              <span className="text-md-on-surface-variant">جلسة تداول اليوم</span>
            </div>
          </MdCard>

          {/* Quick Add Action Card */}
          <MdCard variant="elevated" className="p-4 sm:p-5 flex flex-col justify-between">
            <div className="flex items-center justify-between text-md-on-surface-variant text-xs mb-1.5">
              <span className="font-medium">إدارة محفظتك</span>
              <Sparkles size={18} className="text-md-tertiary" />
            </div>
            <MdButton
              variant="filled"
              icon={<Plus size={16} />}
              onClick={() => setShowAddModal(true)}
              className="w-full"
            >
              إضافة صفقة أو سهم جديد
            </MdButton>
            <div className="text-[10px] text-md-on-surface-variant text-center mt-1.5">
              بياناتك محفوظة محلياً ومحدثة لحظياً
            </div>
          </MdCard>
        </div>
      )}

      {/* Urgent Alerts Banner (M3 Containers) */}
      {urgentAlerts.length > 0 && (
        <div className="space-y-3">
          {urgentAlerts.map(alert => (
            <div 
              key={alert.id}
              className={`p-5 rounded-[20px] border flex items-center justify-between gap-4 shadow-sm ${
                alert.alertType === 'stop_loss'
                  ? 'bg-md-error-container text-md-on-error-container border-md-error/30'
                  : 'bg-md-primary-container text-md-on-primary-container border-md-primary/30'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-[12px] ${alert.alertType === 'stop_loss' ? 'bg-md-error text-md-on-error' : 'bg-md-primary text-md-on-primary'}`}>
                  {alert.alertType === 'stop_loss' ? <ShieldAlert size={22} /> : <CheckCircle size={22} />}
                </div>
                <div>
                  <div className="flex items-center gap-2 font-bold text-sm">
                    <span>{alert.alertType === 'stop_loss' ? '⚠️ تحذير وقف خسارة صارم:' : '🎯 إشعار تحقيق مستهدف أرباح:'}</span>
                    <span className="font-mono bg-md-surface/80 px-2.5 py-0.5 rounded-md-full text-md-on-surface">{alert.symbol}</span>
                    <span className="text-xs opacity-90">({alert.displayName})</span>
                  </div>
                  <p className="text-xs opacity-90 mt-1">
                    {alert.alertMsg}
                  </p>
                </div>
              </div>
              {!alert.isFund && (
                <MdButton
                  variant="tonal"
                  size="sm"
                  icon={<ExternalLink size={14} />}
                  onClick={() => onSelectStock(alert.symbol)}
                >
                  فحص الشارت
                </MdButton>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Portfolio Table: M3 Surface Container */}
      <div className="bg-md-surface border border-md-outline-variant/60 rounded-[24px] overflow-hidden shadow-md-1">
        <div className="p-5 border-b border-md-outline-variant/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-md-surface-container-low">
          <div className="flex items-center gap-2.5">
            <h3 className="font-bold text-base text-md-on-surface">الأسهم والصناديق المملوكة ({portfolio.length})</h3>
            <span className="text-xs text-md-on-surface-variant">تحديث لحظي لأسعار السوق وصافي قيمة الوثائق</span>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <MdButton
              variant="filled"
              size="sm"
              icon={<Plus size={15} />}
              onClick={() => setShowAddModal(true)}
            >
              إضافة مركز جديد (+)
            </MdButton>
          </div>
        </div>

        {portfolio.length === 0 ? (
          <div className="p-16 text-center text-md-on-surface-variant max-w-xl mx-auto space-y-5">
            <div className="w-16 h-16 rounded-[20px] bg-md-surface-container-high border border-md-outline-variant/60 flex items-center justify-center mx-auto text-md-on-surface-variant">
              <Briefcase size={32} />
            </div>
            <div>
              <h4 className="text-base font-bold text-md-on-surface mb-1.5">محفظتك خالية حالياً</h4>
              <p className="text-xs text-md-on-surface-variant leading-relaxed">
                أضف أسهمك أو صناديقك (الرمز، الكمية، وسعر الشراء) وسيقوم النظام آلياً بحساب وقف الخسارة والمستهدفات الفنية ومتابعة أرباحك وتنبيهك بالجلسات لحظياً:
              </p>
            </div>

            <div className="flex justify-center pt-2">
              <MdButton
                variant="filled"
                icon={<Plus size={18} />}
                onClick={() => setShowAddModal(true)}
              >
                إضافة سهم أو صندوق جديد الآن
              </MdButton>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs table-auto">
              <thead className="bg-md-surface-container-high text-md-on-surface-variant font-bold border-b border-md-outline-variant/60">
                <tr>
                  <th className="p-4 text-right min-w-[240px]">الأصل والرمز</th>
                  <th className="p-4 text-right min-w-[120px]">النوع والتصنيف</th>
                  <th className="p-4 text-right min-w-[110px]">الكمية</th>
                  <th className="p-4 text-right min-w-[130px]">متوسط سعر الشراء</th>
                  <th className="p-4 text-right min-w-[120px]">السعر الحالي</th>
                  <th className="p-4 text-right min-w-[130px]">القيمة السوقية</th>
                  <th className="p-4 text-right min-w-[140px]">تغير اليوم (عن الأمس)</th>
                  <th className="p-4 text-right min-w-[140px]">إجمالي الربح التراكمي</th>
                  <th className="p-4 text-right min-w-[110px]">وقف الخسارة</th>
                  <th className="p-4 text-right min-w-[110px]">المستهدف</th>
                  <th className="p-4 text-center min-w-[90px]">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-md-outline-variant/40">
                {positionsWithData.map(pos => {
                  const isProfit = pos.pnl >= 0;
                  const isAlerted = pos.alertType !== 'normal';

                  return (
                    <tr 
                      key={pos.id}
                      className={`hover:bg-md-surface-container-highest/60 transition-colors duration-150 ${
                        isAlerted ? (pos.alertType === 'stop_loss' ? 'bg-md-error-container/10' : 'bg-md-primary-container/10') : ''
                      }`}
                    >
                      {/* Asset & Ticker */}
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          {pos.iconUrl ? (
                            <img src={pos.iconUrl} alt={pos.symbol} className="w-9 h-9 rounded-md-md object-cover border border-md-outline-variant/60" />
                          ) : (
                            <div className="w-9 h-9 rounded-md-md bg-md-surface-container-highest flex items-center justify-center font-mono font-bold text-xs text-md-on-surface border border-md-outline-variant/60">
                              {pos.symbol.substring(0, 3)}
                            </div>
                          )}

                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-bold text-sm text-md-on-surface">{pos.symbol}</span>
                              <span className="font-sans text-xs text-md-on-surface-variant font-medium">{pos.displayName}</span>
                            </div>
                            <div className="text-[10px] text-md-on-surface-variant mt-0.5">
                              <span>تاريخ الشراء: {pos.buyDate}</span>
                              {pos.notes && <span className="mr-2 text-md-outline">• {pos.notes}</span>}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Type */}
                      <td className="p-4">
                        {pos.isGold ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-500/15 text-amber-500 border border-amber-500/30">
                            🥇 دهب ثاندر عيار 24
                          </span>
                        ) : (
                          <MdBadge variant={pos.isFund ? 'tertiary' : 'secondary'}>
                            {pos.isFund ? 'صندوق استثمار' : 'سهم مدرج'}
                          </MdBadge>
                        )}
                      </td>

                      {/* Shares */}
                      <td className="p-4">
                        <div className="font-mono font-semibold text-md-on-surface text-sm">
                          {pos.shares.toLocaleString('en-US', { maximumFractionDigits: 4 })}
                          <span className="text-[11px] font-sans text-md-on-surface-variant mr-1">
                            {pos.isGold ? 'جرام' : (pos.isFund ? 'وثيقة' : 'سهم')}
                          </span>
                        </div>
                      </td>

                      {/* Buy Price */}
                      <td className="p-4 font-mono font-semibold text-md-on-surface">
                        <div>{formatAssetPrice(pos.buyPrice, pos.isFund)} ج.م</div>
                        {pos.isGold && (
                          <span className="text-[10px] text-md-on-surface-variant block font-sans">
                            / جرام (شامل العمولة)
                          </span>
                        )}
                      </td>

                      {/* Current Price */}
                      <td className="p-4">
                        <div className="font-mono font-bold text-md-on-surface text-sm">
                          {formatAssetPrice(pos.currentPrice, pos.isFund)} ج.م
                        </div>
                        {pos.isGold ? (
                          <div className="font-mono text-[10px] text-amber-500 font-semibold">
                            سعر الجرام لحظياً
                          </div>
                        ) : (
                          <div className={`font-mono text-[11px] font-semibold ${pos.changeTodayPct >= 0 ? 'text-md-primary' : 'text-md-error'}`}>
                            {pos.changeTodayPct >= 0 ? '+' : ''}{pos.changeTodayPct.toFixed(2)}% اليوم
                          </div>
                        )}
                      </td>

                      {/* Current Value */}
                      <td className="p-4">
                        <div className="font-mono font-extrabold text-md-on-surface text-sm">
                          {pos.currentValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ج.م
                        </div>
                        {pos.isGold && (
                          <div className="text-[9px] text-md-on-surface-variant font-sans">
                            صافي بعد 1% عمولة بيع
                          </div>
                        )}
                      </td>

                      {/* Daily Change (Compared to Previous Day Close) */}
                      <td className="p-4">
                        <div className={`font-mono font-bold text-xs ${pos.dailyPnl >= 0 ? 'text-md-primary' : 'text-md-error'}`}>
                          {pos.dailyPnl >= 0 ? '+' : ''}{pos.dailyPnl.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ج.م
                        </div>
                        <div className={`font-mono text-[11px] font-semibold ${pos.changeTodayPct >= 0 ? 'text-md-primary' : 'text-md-error'}`}>
                          {pos.changeTodayPct >= 0 ? '+' : ''}{pos.changeTodayPct.toFixed(2)}% اليوم
                        </div>
                      </td>

                      {/* Total Cumulative P&L */}
                      <td className="p-4">
                        <div className={`font-mono font-extrabold text-sm ${isProfit ? 'text-md-primary' : 'text-md-error'}`}>
                          {isProfit ? '+' : ''}{pos.pnl.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ج.م
                        </div>
                        <div className={`font-mono text-[11px] font-bold ${isProfit ? 'text-md-primary' : 'text-md-error'}`}>
                          {isProfit ? '+' : ''}{pos.pnlPct.toFixed(2)}% كلي
                        </div>
                      </td>

                      {/* Stop Loss */}
                      <td className="p-4 font-mono text-md-error font-bold">
                        {formatAssetPrice(pos.effectiveStop, pos.isFund)} ج.م
                      </td>

                      {/* Target */}
                      <td className="p-4">
                        {pos.isGold ? (
                          <div>
                            <div className="font-mono text-amber-500 font-bold text-xs">
                              {formatAssetPrice(pos.breakEvenPrice || 0, false)} ج.م
                            </div>
                            <div className="text-[9px] text-md-on-surface-variant font-sans font-semibold">
                              سعر التعادل للربح
                            </div>
                            {pos.currentPrice < (pos.breakEvenPrice || 0) && (
                              <div className="text-[9px] text-amber-400 font-mono font-bold">
                                متبقي +{(pos.breakEvenPrice! - pos.currentPrice).toFixed(1)} ج.م
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="font-mono text-md-primary font-bold">
                            {formatAssetPrice(pos.effectiveTarget, pos.isFund)} ج.م
                          </div>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          {/* Edit Position Action */}
                          <button
                            onClick={() => handleStartEdit(pos)}
                            title="تعديل هذا المركز (الكمية، سعر الشراء، الملاحظات)"
                            className="p-1.5 hover:bg-md-primary-container text-md-on-surface-variant hover:text-md-primary rounded-md-sm transition-colors"
                          >
                            <Pencil size={15} />
                          </button>

                          {!pos.isFund && (
                            <button
                              onClick={() => onSelectStock(pos.symbol)}
                              title="عرض الشارت الفني"
                              className="p-1.5 hover:bg-md-surface-container-highest text-md-on-surface-variant hover:text-md-on-surface rounded-md-sm transition-colors"
                            >
                              <BarChart2 size={15} />
                            </button>
                          )}
                          <button
                            onClick={() => onDeletePosition(pos.id)}
                            title="حذف هذا المركز من المحفظة"
                            className="p-1.5 hover:bg-md-error-container text-md-on-surface-variant hover:text-md-error rounded-md-sm transition-colors"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Material 3 Modal: Add / Edit Position Dialog */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div 
            className="w-full max-w-lg bg-md-surface-container-high border border-md-outline-variant rounded-[28px] shadow-md-3 overflow-hidden text-right p-6 sm:p-7 space-y-5"
            dir="rtl"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-md-outline-variant/60">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-[14px] bg-md-primary-container text-md-on-primary-container flex items-center justify-center">
                  {editingPosition ? <Pencil size={20} className="text-md-primary" /> : <Briefcase size={20} className="text-md-primary" />}
                </div>
                <div>
                  <h3 className="text-base font-bold text-md-on-surface">
                    {editingPosition ? `تعديل مركز: ${editingPosition.symbol}` : 'إضافة مركز جديد للمحفظة'}
                  </h3>
                  <span className="text-xs text-md-on-surface-variant">
                    {editingPosition ? 'قم بتعديل الكمية أو سعر الشراء وسيتم تحديث الحسابات فوراً' : 'يتم حساب الوقف والمستهدفات الفنية تلقائياً'}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleCloseModal}
                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-md-surface-container-highest text-md-on-surface-variant hover:text-md-on-surface transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSavePosition} className="space-y-4 text-xs">
              {/* Asset Type Toggle (Segmented Button - 3 Options) */}
              <div className="grid grid-cols-3 gap-1 p-1 bg-md-surface-container rounded-md-full border border-md-outline-variant/60">
                <button
                  type="button"
                  onClick={() => {
                    setAssetType('stock');
                    if (symbol === 'THNDRGOLD' || symbol === 'AZG') setSymbol('');
                  }}
                  className={`py-2 px-1 text-center rounded-md-full font-bold text-xs transition-all ${
                    assetType === 'stock' && !isGoldActive ? 'bg-md-secondary-container text-md-on-secondary-container shadow-sm' : 'text-md-on-surface-variant hover:text-md-on-surface'
                  }`}
                >
                  سهم بالبورصة
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAssetType('fund');
                    if (symbol === 'THNDRGOLD' || symbol === 'AZG') setSymbol('');
                  }}
                  className={`py-2 px-1 text-center rounded-md-full font-bold text-xs transition-all ${
                    assetType === 'fund' && !isGoldActive ? 'bg-md-secondary-container text-md-on-secondary-container shadow-sm' : 'text-md-on-surface-variant hover:text-md-on-surface'
                  }`}
                >
                  صندوق استثمار
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAssetType('gold');
                    setSymbol('THNDRGOLD');
                    if (!buyPrice) setBuyPrice('7351.54');
                    if (!shares) setShares('0.0824');
                  }}
                  className={`py-2 px-1 text-center rounded-md-full font-bold text-xs transition-all flex items-center justify-center gap-1 ${
                    isGoldActive ? 'bg-amber-500 text-stone-900 shadow-sm' : 'text-amber-500 hover:text-amber-400'
                  }`}
                >
                  <span>🥇</span>
                  <span>دهب ثاندر (بالجرام)</span>
                </button>
              </div>

              {/* Symbol Input */}
              <div className="space-y-1.5">
                <MdTextField
                  label={isGoldActive ? "رمز صندوق الذهب:" : "رمز السهم أو الصندوق (Ticker):"}
                  required
                  value={symbol}
                  onChange={(e) => {
                    const sym = e.target.value.toUpperCase();
                    setSymbol(sym);
                    const f = fundMap.get(sym);
                    const s = stockMap.get(sym);
                    if (sym.includes('GOLD') || sym.includes('ذهب') || sym.includes('دهب') || sym === 'AZG') {
                      setAssetType('gold');
                      if (!buyPrice) setBuyPrice(String(liveGoldSellPrice));
                    } else if (f) {
                      if (!buyPrice) setBuyPrice(String(f.nav || 0));
                      setAssetType('fund');
                    } else if (s) {
                      if (!buyPrice) setBuyPrice(String(s.close));
                      setAssetType(s.isFund ? 'fund' : 'stock');
                    }
                  }}
                  placeholder={isGoldActive ? "صندوق دهب ثاندر (THNDRGOLD)" : "ابحث بالاسم أو الرمز: حديد عز، سوديك، فوري، دهب ثاندر، ESRS..."}
                />

                {/* Intelligent Quick Selection Suggestions */}
                {assetSuggestions.length > 0 && symbol.trim().length > 0 && !stockMap.has(symbol.toUpperCase()) && (
                  <div className="p-2 bg-md-surface-container rounded-[16px] border border-md-outline-variant/60 space-y-1.5 animate-fadeIn">
                    <div className="text-[10px] text-md-on-surface-variant font-semibold flex items-center gap-1 px-1">
                      <Search size={11} className="text-md-primary" />
                      <span>أسهم وصناديق مطابقة (اضغط للاختيار السريع):</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {assetSuggestions.map((item) => (
                        <button
                          key={item.sym}
                          type="button"
                          onClick={() => {
                            setSymbol(item.sym);
                            if (item.price && item.price > 0) {
                              setBuyPrice(String(item.price));
                            }
                            if (item.isGold) {
                              setAssetType('gold');
                            } else {
                              setAssetType(item.isFund ? 'fund' : 'stock');
                            }
                          }}
                          className={`px-2.5 py-1 rounded-full border text-[11px] font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
                            item.isGold 
                              ? 'bg-amber-500/10 border-amber-500/30 text-amber-500 hover:bg-amber-500/20' 
                              : 'bg-md-surface-container-high hover:bg-md-primary-container hover:text-md-on-primary-container border-md-outline-variant/40 text-md-on-surface'
                          }`}
                        >
                          <span className="font-bold font-mono">{item.sym}</span>
                          <span className="text-md-on-surface-variant text-[10px] truncate max-w-[130px]">{item.nameAr}</span>
                          {item.price && (
                            <span className="text-[10px] font-mono font-bold bg-md-surface/80 px-1.5 py-0.5 rounded-full">{item.price} ج.م</span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Shares & Buy Price */}
              <div className="grid grid-cols-2 gap-3">
                <MdTextField
                  label={isGoldActive ? "وزن الذهب بالجرام (عيار 24):" : (assetType === 'fund' ? "عدد وثائق الصندوق:" : "الكمية (عدد الأسهم):")}
                  type="text"
                  inputMode="decimal"
                  required
                  value={shares}
                  onChange={(e) => {
                    const val = e.target.value.replace(',', '.');
                    if (val === '' || /^\d*\.?\d*$/.test(val)) {
                      setShares(val);
                    }
                  }}
                  placeholder={isGoldActive ? "مثال: 0.0824 أو 1.5 جرام" : "مثال: 105 أو 500"}
                />
                <MdTextField
                  label={isGoldActive ? "متوسط تكلفة شراء الجرام (ج.م / جرام):" : "متوسط سعر الشراء (ج.م):"}
                  type="text"
                  inputMode="decimal"
                  required
                  value={buyPrice}
                  onChange={(e) => {
                    const val = e.target.value.replace(',', '.');
                    if (val === '' || /^\d*\.?\d*$/.test(val)) {
                      setBuyPrice(val);
                    }
                  }}
                  placeholder={isGoldActive ? "مثال: 7351.54" : "مثال: 153.06"}
                />
              </div>

              {/* Real-time Total Cost Display (حاصل ضرب الكمية في متوسط سعر الشراء) */}
              <div className="p-3 bg-md-surface rounded-[16px] border border-md-outline-variant/60 flex items-center justify-between gap-3 text-xs">
                <div className="space-y-0.5">
                  <span className="text-md-on-surface-variant text-[11px] font-semibold block">
                    {isGoldActive ? 'إجمالي تكلفة شراء الذهب (المبلغ المدفوع بالكامل):' : 'إجمالي تكلفة الشراء (متوسط التكلفة):'}
                  </span>
                  <div className="font-mono text-base font-extrabold text-md-primary">
                    {totalInvestment > 0 ? (
                      <span>{totalInvestment.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ج.م</span>
                    ) : (
                      <span className="text-md-on-surface-variant font-normal text-xs">
                        {isGoldActive ? 'أدخل الوزن بالجرام ومتوسط تكلفة الشراء' : 'أدخل الكمية وسعر الشراء لحساب التكلفة تلقائياً'}
                      </span>
                    )}
                  </div>
                </div>

                {parsedShares > 0 && parsedBuyPrice > 0 && (
                  <div className="text-left font-mono text-[11px] text-md-on-surface bg-md-surface-container px-3 py-1.5 rounded-full border border-md-outline-variant/40">
                    <span className="font-bold text-md-primary">{parsedShares}</span> {isGoldActive ? 'جرام' : 'سهم'} × <span className="font-bold text-md-primary">{parsedBuyPrice}</span> ج.م
                  </div>
                )}
              </div>

              {/* Dedicated Gold Break-Even & Profit Calculator (If Gold Active) */}
              {isGoldActive ? (
                <div className="p-4 bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent rounded-[20px] border border-amber-500/30 space-y-3.5">
                  {/* Card Header */}
                  <div className="flex items-center justify-between pb-2 border-b border-amber-500/20">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-amber-500/20 text-amber-500 flex items-center justify-center font-bold text-sm">
                        🥇
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-amber-400">حاسبة دهب ثاندر الذكية وحساب نقطة التعادل</h4>
                        <span className="text-[10px] text-md-on-surface-variant">مخصومة منها عمولة الشراء (1%) وعمولة البيع (1%)</span>
                      </div>
                    </div>
                    <span className="font-mono text-[11px] font-bold bg-amber-500/20 text-amber-400 px-2.5 py-1 rounded-full border border-amber-500/30">
                      عيار 24
                    </span>
                  </div>

                  {/* Primary Break-Even Highlight Box */}
                  <div className="p-3 bg-md-surface-container/90 rounded-[14px] border border-amber-500/40 text-center space-y-1">
                    <span className="text-[11px] text-md-on-surface-variant font-medium block">
                      🎯 لازم سعر بيع جرام الذهب يوصل لكام عشان تبيع بمكسب صافي؟
                    </span>
                    <div className="font-mono text-xl sm:text-2xl font-black text-amber-400">
                      {goldBreakEvenPrice > 0 ? `${goldBreakEvenPrice.toFixed(2)} ج.م / جرام` : '—'}
                    </div>
                    <div className="text-[10px] leading-relaxed text-md-on-surface-variant font-sans">
                      {goldDiffToBreakEven > 0 ? (
                        <span className="text-amber-300 font-semibold">
                          ⚡ متبقي صعود <strong className="font-mono font-bold text-amber-400">+{goldDiffToBreakEven.toFixed(2)} ج.م</strong> (+{goldPctToBreakEven.toFixed(2)}%) عن سعر الجرام الحالي ({liveGoldSellPrice.toFixed(2)} ج.م) لتغطية عمولة الشراء 1% وعمولة البيع 1% وبدء المكسب الصافي.
                        </span>
                      ) : (
                        <span className="text-md-primary font-bold">
                          ✅ مبروك! سعر الذهب الحالي أعلى من نقطة التعادل، وكل زيادة حالياً هي ربح صافي يدخل جيبك بعد خصم كل العمولات!
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Net Valuation Breakdown Tiles */}
                  <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
                    <div className="p-2.5 bg-md-surface rounded-[12px] border border-md-outline-variant/60">
                      <span className="text-[10px] text-md-on-surface-variant block font-sans">إجمالي ما دفعته (التكلفة)</span>
                      <span className="font-bold text-md-on-surface text-xs sm:text-sm">{totalInvestment.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ج.م</span>
                    </div>
                    <div className="p-2.5 bg-md-surface rounded-[12px] border border-md-outline-variant/60">
                      <span className="text-[10px] text-md-on-surface-variant block font-sans">صافي الكاش لو بعت الآن</span>
                      <span className="font-bold text-md-on-surface text-xs sm:text-sm">{goldCurrentNet.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ج.م</span>
                      <span className="text-[9px] text-md-on-surface-variant font-sans block">بعد 1% عمولة ثاندر</span>
                    </div>
                    <div className={`p-2.5 bg-md-surface rounded-[12px] border ${goldPnl >= 0 ? 'border-md-primary/40' : 'border-md-error/40'}`}>
                      <span className="text-[10px] text-md-on-surface-variant block font-sans">العائد الحالي بمحفظتك</span>
                      <span className={`font-black text-xs sm:text-sm ${goldPnl >= 0 ? 'text-md-primary' : 'text-md-error'}`}>
                        {goldPnl >= 0 ? '+' : ''}{goldPnl.toFixed(2)} ج.م
                      </span>
                      <span className={`text-[10px] font-bold block ${goldPnl >= 0 ? 'text-md-primary' : 'text-md-error'}`}>
                        ({goldPnlPct >= 0 ? '+' : ''}{goldPnlPct.toFixed(2)}%)
                      </span>
                    </div>
                  </div>

                  {/* Profit Milestones */}
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[11px] font-bold text-md-on-surface block flex items-center gap-1">
                      <span>📈 مستهدفات البيع لجني أرباح صافية (بعد خصم كل المصاريف والعمولات):</span>
                    </span>
                    <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
                      <div className="p-2 bg-md-surface/80 rounded-[10px] border border-amber-500/30">
                        <span className="text-[10px] text-amber-400 font-bold block font-sans">مكسب صافي +5%</span>
                        <span className="font-black text-amber-400 text-xs">{goldTarget5PctPrice.toFixed(2)} ج.م</span>
                        <span className="text-[9px] text-md-on-surface-variant block">صافي: +{goldTarget5PctProfit.toFixed(2)} ج.م</span>
                      </div>
                      <div className="p-2 bg-md-surface/80 rounded-[10px] border border-amber-500/40">
                        <span className="text-[10px] text-amber-400 font-bold block font-sans">مكسب صافي +10%</span>
                        <span className="font-black text-amber-400 text-xs">{goldTarget10PctPrice.toFixed(2)} ج.م</span>
                        <span className="text-[9px] text-md-on-surface-variant block">صافي: +{goldTarget10PctProfit.toFixed(2)} ج.م</span>
                      </div>
                      <div className="p-2 bg-md-surface/80 rounded-[10px] border border-amber-500/50">
                        <span className="text-[10px] text-amber-400 font-bold block font-sans">مكسب صافي +20%</span>
                        <span className="font-black text-amber-400 text-xs">{goldTarget20PctPrice.toFixed(2)} ج.م</span>
                        <span className="text-[9px] text-md-on-surface-variant block">صافي: +{goldTarget20PctProfit.toFixed(2)} ج.م</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}

              {/* Optional Custom Icon Upload */}
              <div className="p-3 bg-md-surface-container rounded-md-md border border-md-outline-variant/60 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-md-on-surface-variant font-semibold flex items-center gap-1.5">
                    <ImageIcon size={14} className="text-md-tertiary" />
                    <span>صورة أيقونة السهم أو الصندوق (اختياري):</span>
                  </span>
                  {iconUrl && (
                    <button
                      type="button"
                      onClick={() => setIconUrl('')}
                      className="text-[10px] text-md-error hover:underline"
                    >
                      إزالة الصورة
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  {iconUrl ? (
                    <img src={iconUrl} alt="Preview" className="w-10 h-10 rounded-md-md object-cover border border-md-outline-variant" />
                  ) : (
                    <div className="w-10 h-10 rounded-md-md bg-md-surface-container-high border border-md-outline-variant flex items-center justify-center text-md-on-surface-variant">
                      <ImageIcon size={18} />
                    </div>
                  )}

                  <input
                    type="file"
                    ref={iconInputRef}
                    accept="image/*"
                    onChange={handleIconUpload}
                    className="hidden"
                  />

                  <button
                    type="button"
                    onClick={() => iconInputRef.current?.click()}
                    className="flex-1 py-2 bg-md-surface-container-high hover:bg-md-surface-container-highest border border-md-outline-variant text-md-on-surface rounded-md-md text-xs transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Upload size={13} />
                    <span>{iconUrl ? 'تغيير الصورة' : 'رفع لوجو / أيقونة من جهازك'}</span>
                  </button>
                </div>
              </div>

              {/* Automated Technical Levels Display (For Stocks & Funds) */}
              {!isGoldActive && (
                numBuyPrice > 0 ? (
                  <div className="p-3.5 bg-md-surface-container rounded-[18px] border border-md-outline-variant/60 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-md-on-surface flex items-center gap-1.5">
                        <Sparkles size={14} className="text-md-primary" />
                        <span>مستويات وقف الخسارة والمستهدفات (محسوبة آلياً):</span>
                      </span>
                      <span className="text-[10px] text-md-on-primary-container bg-md-primary-container px-2 py-0.5 rounded-md-full font-bold">
                        حساب فني ذكي
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-xs font-mono text-center">
                      <div className="p-2.5 bg-md-surface rounded-[12px] border border-md-error/30">
                        <span className="text-[10px] text-md-error block font-sans font-bold">وقف الخسارة (S1)</span>
                        <span className="font-extrabold text-md-error text-sm">{computedStopLoss.toFixed(2)} ج.م</span>
                        <span className="text-[10px] text-md-on-surface-variant block">(-{Math.max(0, (((numBuyPrice - computedStopLoss) / numBuyPrice) * 100)).toFixed(1)}%)</span>
                      </div>
                      <div className="p-2.5 bg-md-surface rounded-[12px] border border-md-primary/30">
                        <span className="text-[10px] text-md-primary block font-sans font-bold">المستهدف الأول (R1)</span>
                        <span className="font-extrabold text-md-primary text-sm">{computedTarget1.toFixed(2)} ج.م</span>
                        <span className="text-[10px] text-md-primary font-bold block">(+{Math.max(0, (((computedTarget1 - numBuyPrice) / numBuyPrice) * 100)).toFixed(1)}%)</span>
                      </div>
                      <div className="p-2.5 bg-md-surface rounded-[12px] border border-md-tertiary/30">
                        <span className="text-[10px] text-md-tertiary block font-sans font-bold">المستهدف الثاني (R2)</span>
                        <span className="font-extrabold text-md-tertiary text-sm">{computedTarget2.toFixed(2)} ج.م</span>
                        <span className="text-[10px] text-md-tertiary font-bold block">(+{Math.max(0, (((computedTarget2 - numBuyPrice) / numBuyPrice) * 100)).toFixed(1)}%)</span>
                      </div>
                    </div>
                    <p className="text-[11px] text-md-on-surface-variant leading-relaxed font-sans">
                      ✓ يقوم النظام تلقائياً بربط هذه المستويات الفنية بالمحفظة لتنبيهك ومتابعة الأرباح وحماية رأس مالك دون الحاجة لكتابتها يدوياً.
                    </p>
                  </div>
                ) : (
                  <div className="p-3 bg-md-surface-container rounded-md-md border border-md-outline-variant/60 text-center text-xs text-md-on-surface-variant">
                    أدخل رمز السهم وسعر الشراء ليقوم النظام آلياً بحساب وقف الخسارة والمستهدفات الفنية.
                  </div>
                )
              )}

              <MdTextField
                label="ملاحظات:"
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="مثال: شراء من ثاندر، استثمار طويل الأجل..."
              />

              <div className="flex gap-2 pt-2">
                <MdButton
                  type="submit"
                  variant="filled"
                  className="flex-1"
                >
                  {editingPosition ? 'حفظ التعديلات في المحفظة' : 'حفظ المركز في المحفظة'}
                </MdButton>
                <MdButton
                  type="button"
                  variant="outlined"
                  onClick={handleCloseModal}
                >
                  إلغاء
                </MdButton>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
