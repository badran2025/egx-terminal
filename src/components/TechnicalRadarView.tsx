import React, { useState, useMemo } from 'react';
import { 
  ArrowUpDown, Search, TrendingUp, TrendingDown, 
  BarChart2, Filter, Briefcase, FlaskConical, Download, 
  Printer, CheckCircle2, AlertTriangle, ShieldAlert, Sparkles,
  ExternalLink, Layers, Eye, RefreshCw, X, Star, Flame
} from 'lucide-react';
import { StockData, PortfolioPosition } from '../types';
import { formatPrice, formatTurnover, formatVolumeShares } from '../services/egxService';
import { 
  buildStockNextSessionPlan, 
  rankAndEnrichTop10SessionPlans, 
  NextSessionStockPlan 
} from '../services/nextSessionPlannerService';
import { MdCard, MdChip, MdBadge, MdButton } from './material';
import { LastUpdatedBanner } from './LastUpdatedBanner';

interface Props {
  stocks: StockData[];
  portfolio?: PortfolioPosition[];
  onSelectStock: (symbol: string) => void;
  onOpenLabWithStock?: (symbol: string) => void;
  isLoading?: boolean;
  lastUpdated?: Date;
  onRefresh?: () => void;
}

export const TechnicalRadarView: React.FC<Props> = ({ 
  stocks, 
  portfolio = [],
  onSelectStock,
  onOpenLabWithStock,
  isLoading = false,
  lastUpdated,
  onRefresh
}) => {
  const [filter, setFilter] = useState<'all' | 'top10' | 'strong_buy' | 'entry_zone' | 'egx30' | 'egx70' | 'egx100' | 'owned' | 'sell_alert'>('all');
  const [search, setSearch] = useState<string>('');
  const [sortBy, setSortBy] = useState<'score' | 'turnover' | 'volume' | 'change' | 'price' | 'target1'>('score');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedStockForModal, setSelectedStockForModal] = useState<NextSessionStockPlan | null>(null);

  // 1. STOCKS ONLY (Strictly exclude all mutual funds, gold funds, and cash pots)
  const pureStocks = useMemo(() => {
    return stocks.filter(s => {
      const isFund = Boolean(s.isFund || s.isGold || s.symbol.startsWith('FUND_') || s.symbol === 'THNDRGOLD' || s.sector?.includes('ذهب') || s.sector?.includes('صناديق'));
      return !isFund;
    });
  }, [stocks]);

  // Fast map of user owned tickers
  const ownedMap = useMemo(() => {
    const map = new Map<string, PortfolioPosition>();
    portfolio.forEach(p => map.set(p.symbol.toUpperCase(), p));
    return map;
  }, [portfolio]);

  // 2. Pre-calculate Next Session Plans for all stocks & Strictly prioritize Top 10 Strong Recommendations
  const stockPlans = useMemo(() => {
    const rawPlans = pureStocks.map(stock => buildStockNextSessionPlan(stock));
    return rankAndEnrichTop10SessionPlans(rawPlans);
  }, [pureStocks]);

  // Extract Top 10 Picks
  const top10Picks = useMemo(() => {
    return stockPlans.filter(p => p.isTopPick).sort((a, b) => (a.topPickRank || 99) - (b.topPickRank || 99));
  }, [stockPlans]);

  // 3. Filter stocks
  const filtered = useMemo(() => {
    return stockPlans.filter(plan => {
      const sym = plan.symbol.toUpperCase();
      const isOwned = ownedMap.has(sym);

      if (filter === 'top10' && !plan.isTopPick) return false;
      if (filter === 'owned' && !isOwned) return false;
      if (filter === 'strong_buy' && plan.confluenceScore < 75) return false;
      if (filter === 'entry_zone' && (plan.currentPrice < plan.entryRangeMin || plan.currentPrice > plan.entryRangeMax * 1.015)) return false;
      if (filter === 'egx30' && plan.indexAffiliation !== 'EGX30') return false;
      if (filter === 'egx70' && plan.indexAffiliation !== 'EGX70') return false;
      if (filter === 'egx100' && plan.indexAffiliation !== 'EGX100') return false;
      if (filter === 'sell_alert' && plan.finalActionVerdict !== 'STOP_LOSS' && plan.finalActionVerdict !== 'TAKE_PROFIT') return false;

      if (search.trim()) {
        const q = search.trim().toLowerCase();
        return plan.symbol.toLowerCase().includes(q) || 
               plan.nameAr.toLowerCase().includes(q) || 
               plan.nameEn.toLowerCase().includes(q) ||
               plan.sector.toLowerCase().includes(q);
      }

      return true;
    });
  }, [stockPlans, filter, search, ownedMap]);

  // 4. Sort logic: By default (or when sortBy === 'score'), Top 10 are ALWAYS strictly at the beginning of the table
  const sortedStocks = useMemo(() => {
    if (sortBy === 'score' && sortOrder === 'desc') {
      // Top 10 Strong Recommendations strictly stay in positions 1 to 10!
      const topPicks = filtered.filter(p => p.isTopPick).sort((a, b) => (a.topPickRank || 99) - (b.topPickRank || 99));
      const others = filtered.filter(p => !p.isTopPick).sort((a, b) => b.confluenceScore - a.confluenceScore);
      return [...topPicks, ...others];
    }

    return [...filtered].sort((a, b) => {
      let valA = 0;
      let valB = 0;
      if (sortBy === 'score') { valA = a.confluenceScore; valB = b.confluenceScore; }
      else if (sortBy === 'turnover') { valA = a.turnover; valB = b.turnover; }
      else if (sortBy === 'volume') { valA = a.volume; valB = b.volume; }
      else if (sortBy === 'change') { valA = a.changePercent; valB = b.changePercent; }
      else if (sortBy === 'price') { valA = a.currentPrice; valB = b.currentPrice; }
      else if (sortBy === 'target1') { valA = a.target1Pct; valB = b.target1Pct; }

      return sortOrder === 'desc' ? valB - valA : valA - valB;
    });
  }, [filtered, sortBy, sortOrder]);

  const toggleSort = (field: 'score' | 'turnover' | 'volume' | 'change' | 'price' | 'target1') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  // Export CSV Handler
  const handleExportCSV = () => {
    const headers = [
      'الترتيب / التميز', 'الرمز', 'اسم الشركة', 'المؤشر', 'السعر الحالي (ج.م)', 'التغير (ج.م)', '% التغير', 
      'حجم التداول (سهم)', 'قيمة التداول (ج.م)', 'ارتكاز (Pivot)', 
      'الدعم 1 (S1)', 'الدعم 2 (S2)', 'الدعم 3 (S3)', 
      'المقاومة 1 (R1)', 'المقاومة 2 (R2)', 'المقاومة 3 (R3)', 
      'نطاق الدخول المقترح', 'المستهدف 1', 'المستهدف 2', 'وقف الخسارة', 
      'التحليل المالي Gate 0', 'مكرر الربحية P/E', 'سكور المراحل السبعة', 
      'م1 الاتجاه العام', 'م2 كتل السيولة', 'م3 كسر الافتتاح ORB', 'م4 الزخم النسبي RMI', 
      'م5 التقلب وبولنجر', 'م6 سيولة الحيتان MCDX', 'م7 توافق الفريمات', 
      'التوصية الميدانية للجلسة القادمة', 'تاريخ نتائج الأرباح المقبل', 'محفزات وأخبار السهم'
    ];

    const rows = sortedStocks.map(p => [
      p.isTopPick ? `توب ${p.topPickRank}` : '-',
      p.symbol,
      `"${p.nameAr.replace(/"/g, '""')}"`,
      p.indexAffiliation,
      p.currentPrice.toFixed(2),
      p.change.toFixed(2),
      `${p.changePercent.toFixed(2)}%`,
      p.volume,
      p.turnover.toFixed(0),
      p.pivot.toFixed(2),
      p.support1.toFixed(2),
      p.support2.toFixed(2),
      p.support3.toFixed(2),
      p.resistance1.toFixed(2),
      p.resistance2.toFixed(2),
      p.resistance3.toFixed(2),
      `"${p.entryRangeText}"`,
      `${p.target1.toFixed(2)} (+${p.target1Pct}%)`,
      `${p.target2.toFixed(2)} (+${p.target2Pct}%)`,
      `${p.stopLoss.toFixed(2)} (-${p.stopLossPct}%)`,
      `"${p.gate0.gradeBadge}"`,
      p.gate0.peRatio > 0 ? p.gate0.peRatio : 'خاسرة',
      `${p.confluenceScore}% (${p.passedLayersCount}/7)`,
      `"${p.layer1Trend.resultText}"`,
      `"${p.layer2Liquidity.resultText}"`,
      `"${p.layer3ORB.resultText}"`,
      `"${p.layer4RMI.resultText}"`,
      `"${p.layer5Bollinger.resultText}"`,
      `"${p.layer6MCDX.resultText}"`,
      `"${p.layer7MultiTF.resultText}"`,
      `"${p.actionVerdictText}"`,
      `"${p.nextEarningsDate}"`,
      `"${p.catalystsAndNews.replace(/"/g, '""')}"`
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `EGX_Trading_Plan_Session_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleOpenLab = (symbol: string) => {
    if (onOpenLabWithStock) {
      onOpenLabWithStock(symbol);
    } else {
      onSelectStock(symbol);
    }
  };

  // Quick Stats
  const strongBuyCount = stockPlans.filter(p => p.confluenceScore >= 75).length;
  const inEntryZoneCount = stockPlans.filter(p => p.currentPrice >= p.entryRangeMin && p.currentPrice <= p.entryRangeMax * 1.015).length;
  const excellentFundCount = stockPlans.filter(p => p.gate0.grade === 'EXCELLENT').length;
  const sellAlertCount = stockPlans.filter(p => p.finalActionVerdict === 'STOP_LOSS').length;

  return (
    <div className="space-y-4 w-full text-md-on-surface" dir="rtl">
      
      {/* 1. Sleek Compact Header Bar */}
      <div className="bg-gradient-to-r from-emerald-600/15 via-teal-600/10 to-blue-600/10 border border-emerald-500/30 rounded-[22px] p-3.5 sm:p-4 shadow-sm flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-xs">
              📋
            </span>
            <h2 className="text-base sm:text-lg font-black tracking-tight text-md-on-surface flex items-center gap-2">
              <span>خطة وتوصيات الجلسة القادمة (تجهيز السوق المباشر)</span>
              <span className="text-[10px] font-bold bg-amber-500/20 text-amber-600 dark:text-amber-400 px-2.5 py-0.5 rounded-full border border-amber-500/30 flex items-center gap-1">
                <Star size={11} className="fill-amber-500 text-amber-500" />
                <span>أول 10 توصيات مثبتة بالصدارة</span>
              </span>
            </h2>
          </div>
          <p className="text-xs text-md-on-surface-variant font-medium">
            جدول العمليات الميداني لتجهيزك لجلسة الغد: نقاط الدخول، المستهدف 1 و 2، ارتكاز ودعوم ومقاومات البورصة، والـ 7 طبقات لكل أسهم البورصة المصرية ({pureStocks.length} سهماً - استبعاد الصناديق).
          </p>
        </div>

        {/* Quick Tactical Metrics & Export Actions */}
        <div className="flex items-center gap-2 flex-wrap self-end lg:self-center">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-md-surface-container-high hover:bg-md-surface-container-highest border border-md-outline-variant/60 text-xs font-bold text-md-on-surface shadow-xs transition-colors"
            title="تحميل جدول الخطة بصيغة Excel / CSV"
          >
            <Download size={14} className="text-emerald-500" />
            <span>تصدير إكسل</span>
          </button>

          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-md-surface-container-high hover:bg-md-surface-container-highest border border-md-outline-variant/60 text-xs font-bold text-md-on-surface shadow-xs transition-colors"
            title="طباعة خطة التداول الميدانية"
          >
            <Printer size={14} className="text-blue-500" />
            <span>طباعة</span>
          </button>

          {onRefresh && (
            <button
              onClick={onRefresh}
              disabled={isLoading}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-colors disabled:opacity-50"
              title="تحديث الأرقام لحظياً"
            >
              <RefreshCw size={13} className={isLoading ? 'animate-spin' : ''} />
              <span>تحديث</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. Top 10 Strongest Session Recommendations Quick Strip */}
      <div className="bg-gradient-to-r from-amber-500/10 via-emerald-500/10 to-teal-500/10 border border-amber-500/30 rounded-[20px] p-3 shadow-xs space-y-2">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-amber-500 text-white flex items-center justify-center font-black text-xs shadow-xs">
              ⭐
            </span>
            <span className="font-black text-xs sm:text-sm text-md-on-surface">
              أقوى 10 توصيات مؤكدة لجلسة الغد (مثبتة في صدارة الجدول بالترتيب):
            </span>
          </div>
          <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/30">
            أعلى توافق فني (BADRAN) ومؤسسي وسلامة مالية Gate 0
          </span>
        </div>

        {/* Quick Jump Pills for the Top 10 */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-0.5 text-xs">
          {top10Picks.map((plan) => (
            <button
              key={plan.symbol}
              onClick={() => setSelectedStockForModal(plan)}
              className="px-2.5 py-1.5 rounded-xl bg-md-surface hover:bg-md-surface-container-high border border-amber-500/40 text-xs font-bold text-md-on-surface shadow-xs transition-all flex items-center gap-1.5 shrink-0 hover:scale-105 active:scale-95"
              title={`انقر لفتح بطاقة توصية ${plan.nameAr} كاملة`}
            >
              <span className="w-4 h-4 rounded-full bg-amber-500 text-white text-[10px] font-black flex items-center justify-center shrink-0">
                {plan.topPickRank}
              </span>
              <span className="font-mono text-md-primary font-black">{plan.symbol}</span>
              <span className="font-mono text-xs font-bold">{plan.currentPrice.toFixed(2)} ج.م</span>
              <span className="text-emerald-500 text-[10px] font-mono font-bold">+{plan.target1Pct}%</span>
            </button>
          ))}
        </div>
      </div>

      {/* 3. Filter Chips and Instant Search */}
      <div className="bg-md-surface-container-low border border-md-outline-variant/60 rounded-[20px] p-2.5 sm:p-3 flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Fast Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 text-xs scrollbar-none">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-full font-bold transition-all whitespace-nowrap text-xs ${
              filter === 'all' 
                ? 'bg-md-primary text-md-on-primary shadow-xs' 
                : 'bg-md-surface text-md-on-surface-variant hover:bg-md-surface-container-high'
            }`}
          >
            جميع الأسهم ({pureStocks.length})
          </button>

          <button
            onClick={() => setFilter('top10')}
            className={`px-3 py-1.5 rounded-full font-black transition-all whitespace-nowrap text-xs flex items-center gap-1 ${
              filter === 'top10' 
                ? 'bg-amber-600 text-white shadow-xs' 
                : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30 hover:bg-amber-500/20'
            }`}
          >
            <Star size={12} className="fill-current" />
            <span>أفضل 10 فرص ({top10Picks.length})</span>
          </button>

          <button
            onClick={() => setFilter('strong_buy')}
            className={`px-3 py-1.5 rounded-full font-bold transition-all whitespace-nowrap text-xs flex items-center gap-1 ${
              filter === 'strong_buy' 
                ? 'bg-emerald-600 text-white shadow-xs' 
                : 'bg-md-surface text-md-on-surface-variant hover:bg-md-surface-container-high'
            }`}
          >
            <span>🔥 فرص شراء قوية ({strongBuyCount})</span>
          </button>

          <button
            onClick={() => setFilter('entry_zone')}
            className={`px-3 py-1.5 rounded-full font-bold transition-all whitespace-nowrap text-xs flex items-center gap-1 ${
              filter === 'entry_zone' 
                ? 'bg-teal-600 text-white shadow-xs' 
                : 'bg-md-surface text-md-on-surface-variant hover:bg-md-surface-container-high'
            }`}
          >
            <span>🎯 نطاق الشراء المباشر ({inEntryZoneCount})</span>
          </button>

          <button
            onClick={() => setFilter('egx30')}
            className={`px-3 py-1.5 rounded-full font-bold transition-all whitespace-nowrap text-xs ${
              filter === 'egx30' 
                ? 'bg-blue-600 text-white shadow-xs' 
                : 'bg-md-surface text-md-on-surface-variant hover:bg-md-surface-container-high'
            }`}
          >
            EGX 30
          </button>

          <button
            onClick={() => setFilter('egx70')}
            className={`px-3 py-1.5 rounded-full font-bold transition-all whitespace-nowrap text-xs ${
              filter === 'egx70' 
                ? 'bg-purple-600 text-white shadow-xs' 
                : 'bg-md-surface text-md-on-surface-variant hover:bg-md-surface-container-high'
            }`}
          >
            EGX 70
          </button>

          <button
            onClick={() => setFilter('egx100')}
            className={`px-3 py-1.5 rounded-full font-bold transition-all whitespace-nowrap text-xs ${
              filter === 'egx100' 
                ? 'bg-indigo-600 text-white shadow-xs' 
                : 'bg-md-surface text-md-on-surface-variant hover:bg-md-surface-container-high'
            }`}
          >
            EGX 100
          </button>

          {ownedMap.size > 0 && (
            <button
              onClick={() => setFilter('owned')}
              className={`px-3 py-1.5 rounded-full font-bold transition-all whitespace-nowrap text-xs flex items-center gap-1 ${
                filter === 'owned' 
                  ? 'bg-amber-600 text-white shadow-xs' 
                  : 'bg-md-surface text-md-on-surface-variant hover:bg-md-surface-container-high'
              }`}
            >
              <Briefcase size={12} />
              <span>محفظتي ({ownedMap.size})</span>
            </button>
          )}

          <button
            onClick={() => setFilter('sell_alert')}
            className={`px-3 py-1.5 rounded-full font-bold transition-all whitespace-nowrap text-xs flex items-center gap-1 ${
              filter === 'sell_alert' 
                ? 'bg-rose-600 text-white shadow-xs' 
                : 'bg-md-surface text-md-on-surface-variant hover:bg-md-surface-container-high'
            }`}
          >
            <span>🛑 تحذير ووقف خسارة</span>
          </button>
        </div>

        {/* Compact Search Box */}
        <div className="relative w-full md:w-72">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="ابحث بالرمز أو الاسم (COMI, طلعت, فوري)..."
            className="w-full bg-md-surface border border-md-outline-variant/80 rounded-full px-3.5 py-1.5 text-xs font-bold text-md-on-surface placeholder:text-md-on-surface-variant/50 focus:outline-none focus:border-md-primary transition-all pr-8"
          />
          <Search size={14} className="absolute right-2.5 top-2.5 text-md-on-surface-variant/70" />
          {search && (
            <button 
              onClick={() => setSearch('')}
              className="absolute left-2.5 top-2 text-md-on-surface-variant hover:text-md-on-surface text-xs"
            >
              <X size={13} />
            </button>
          )}
        </div>
      </div>

      {/* 4. The Master Next Session Preparatory Matrix (Table with sticky ticker column) */}
      <div className="bg-md-surface border border-md-outline-variant/60 rounded-[22px] overflow-hidden shadow-sm relative">
        <div className="overflow-x-auto max-h-[720px] overflow-y-auto scrollbar-thin">
          <table className="w-full text-right text-xs table-auto border-collapse">
            
            {/* Table Header */}
            <thead className="bg-md-surface-container-high text-md-on-surface-variant font-bold border-b border-md-outline-variant/60 sticky top-0 z-20 backdrop-blur-md">
              <tr>
                {/* 1. Sticky Ticker & Company */}
                <th className="p-3 text-center min-w-[100px] w-28 sticky right-0 z-30 bg-md-surface-container-high border-l border-md-outline-variant/60 shadow-xs">
                  الرمز / الترتيب
                </th>
                <th className="p-3 text-right min-w-[190px]">
                  اسم الشركة والمؤشر
                </th>

                {/* 2. Last Session Market Numbers */}
                <th className="p-3 text-right cursor-pointer hover:text-md-on-surface min-w-[110px]" onClick={() => toggleSort('price')}>
                  <div className="flex items-center gap-1">
                    <span>السعر الحالي</span>
                    <ArrowUpDown size={12} className={sortBy === 'price' ? 'text-md-primary' : ''} />
                  </div>
                </th>
                <th className="p-3 text-right cursor-pointer hover:text-md-on-surface min-w-[105px]" onClick={() => toggleSort('change')}>
                  <div className="flex items-center gap-1">
                    <span>التغير اليومي</span>
                    <ArrowUpDown size={12} className={sortBy === 'change' ? 'text-md-primary' : ''} />
                  </div>
                </th>
                <th className="p-3 text-right min-w-[145px]">
                  <div className="flex items-center gap-1">
                    <button 
                      onClick={() => toggleSort('turnover')}
                      className={`inline-flex items-center gap-0.5 px-1 rounded hover:bg-md-surface-container ${sortBy === 'turnover' ? 'text-md-primary font-bold' : ''}`}
                      title="فرز حسب سيولة وقيمة التداول بالجنيه المصري (Turnover EGP)"
                    >
                      <span>قيمة التداول</span>
                      <ArrowUpDown size={11} />
                    </button>
                    <span>/</span>
                    <button 
                      onClick={() => toggleSort('volume')}
                      className={`inline-flex items-center gap-0.5 px-1 rounded hover:bg-md-surface-container ${sortBy === 'volume' ? 'text-md-primary font-bold' : ''}`}
                      title="فرز حسب عدد الأسهم المتداولة (Shares Volume)"
                    >
                      <span>الأسهم</span>
                      <ArrowUpDown size={11} />
                    </button>
                  </div>
                </th>

                {/* 3. Tactical Plan for Tomorrow */}
                <th className="p-3 text-right min-w-[130px] bg-teal-500/5 border-l border-r border-teal-500/20">
                  نطاق الدخول المقترح
                </th>
                <th className="p-3 text-right cursor-pointer hover:text-md-on-surface min-w-[130px]" onClick={() => toggleSort('target1')}>
                  <div className="flex items-center gap-1">
                    <span>المستهدف 1 و 2</span>
                    <ArrowUpDown size={12} className={sortBy === 'target1' ? 'text-md-primary' : ''} />
                  </div>
                </th>
                <th className="p-3 text-right min-w-[105px]">
                  وقف الخسارة
                </th>

                {/* 4. Floor Trader Pivots, Supports, Resistances (Egyptian Brokerage Sheet Standard) */}
                <th className="p-3 text-center min-w-[90px] bg-amber-500/5">ارتكاز (Pivot)</th>
                <th className="p-3 text-center min-w-[80px]">دعم 1 (S1)</th>
                <th className="p-3 text-center min-w-[80px]">دعم 2 (S2)</th>
                <th className="p-3 text-center min-w-[80px]">دعم 3 (S3)</th>
                <th className="p-3 text-center min-w-[85px]">مقاومة 1 (R1)</th>
                <th className="p-3 text-center min-w-[85px]">مقاومة 2 (R2)</th>
                <th className="p-3 text-center min-w-[85px]">مقاومة 3 (R3)</th>

                {/* 5. Gate 0 Fundamental Health */}
                <th className="p-3 text-right min-w-[140px] bg-blue-500/5">
                  التحليل المالي Gate 0
                </th>

                {/* 6. Dedicated 7 Stages of BADRAN Template */}
                <th className="p-3 text-center min-w-[110px]" title="المرحلة 1: الاتجاه العام والمتوسطات EMA 20/50/200 ومؤشر البورصة">م1 الاتجاه</th>
                <th className="p-3 text-center min-w-[115px]" title="المرحلة 2: كتل السيولة والأوردر بلوك المؤسسي">م2 الأوردر بلوك</th>
                <th className="p-3 text-center min-w-[110px]" title="المرحلة 3: كسر نطاق الافتتاح Opening Range Breakout">م3 كسر ORB</th>
                <th className="p-3 text-center min-w-[110px]" title="المرحلة 4: الزخم النسبي الاتجاهي RMI Trend">م4 الزخم RMI</th>
                <th className="p-3 text-center min-w-[110px]" title="المرحلة 5: التقلب والانفجار Bollinger Bands & ATR">م5 التقلب BB</th>
                <th className="p-3 text-center min-w-[115px]" title="المرحلة 6: سيولة الحيتان والمؤسسات MCDX">م6 سيولة MCDX</th>
                <th className="p-3 text-center min-w-[110px]" title="المرحلة 7: توافق الفريمات المتعددة وتأكيد الحجم">م7 الفريمات</th>

                {/* 7. Total Confluence Score */}
                <th className="p-3 text-center cursor-pointer hover:text-md-on-surface min-w-[110px] bg-emerald-500/10" onClick={() => toggleSort('score')}>
                  <div className="flex items-center justify-center gap-1">
                    <span>سكور المراحل</span>
                    <ArrowUpDown size={12} className={sortBy === 'score' ? 'text-emerald-500' : ''} />
                  </div>
                </th>

                {/* 8. Next Session Verdict */}
                <th className="p-3 text-right min-w-[160px] bg-emerald-500/5">
                  التوصية الميدانية للجلسة
                </th>

                {/* 9. Next Earnings Date & Corporate Catalysts */}
                <th className="p-3 text-right min-w-[125px]">
                  نتائج الأرباح المقبلة
                </th>
                <th className="p-3 text-right min-w-[220px]">
                  أخبار ومحفزات السهم
                </th>

                {/* 10. Operational Action */}
                <th className="p-3 text-center min-w-[85px] sticky left-0 z-20 bg-md-surface-container-high border-r border-md-outline-variant/60 shadow-xs">
                  المعمل 🔬
                </th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="divide-y divide-md-outline-variant/30">
              {sortedStocks.map((plan) => {
                const isOwned = ownedMap.has(plan.symbol);
                const isGain = plan.changePercent >= 0;

                return (
                  <tr 
                    key={plan.symbol}
                    className={`transition-colors group cursor-pointer text-xs ${
                      plan.isTopPick 
                        ? 'bg-amber-500/5 hover:bg-amber-500/15 border-r-4 border-r-amber-500 font-medium' 
                        : 'hover:bg-md-surface-container-highest/60'
                    }`}
                    onClick={() => setSelectedStockForModal(plan)}
                  >
                    {/* 1. Sticky Ticker Column with Top 10 Badge */}
                    <td className="p-2.5 text-center sticky right-0 z-10 bg-md-surface group-hover:bg-md-surface-container-highest border-l border-md-outline-variant/40 shadow-xs">
                      <div className="flex items-center justify-center gap-1">
                        <span className="font-mono font-black text-xs px-2 py-1 rounded-md bg-md-surface-container-high text-md-on-surface border border-md-outline-variant/60 group-hover:border-md-primary transition-colors">
                          {plan.symbol}
                        </span>
                        {plan.isTopPick && (
                          <span 
                            className="px-1.5 py-0.2 rounded-full text-[9px] font-black bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/40 shadow-2xs" 
                            title={`المركز رقم ${plan.topPickRank} في أقوى 10 فرص للجلسة القادمة`}
                          >
                            ⭐ {plan.topPickRank}
                          </span>
                        )}
                        {isOwned && (
                          <span title="مملوك في محفظتك">💼</span>
                        )}
                      </div>
                    </td>

                    {/* Company Name & Index */}
                    <td className="p-2.5">
                      <div className="flex items-center gap-2">
                        <div>
                          <div className="font-bold text-md-on-surface leading-tight hover:text-md-primary">
                            {plan.nameAr}
                          </div>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="text-[10px] text-md-on-surface-variant font-medium">
                              {plan.sector}
                            </span>
                            {plan.indexAffiliation === 'EGX30' && (
                              <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-blue-500/15 text-blue-500 border border-blue-500/30">
                                EGX30
                              </span>
                            )}
                            {plan.indexAffiliation === 'EGX70' && (
                              <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-purple-500/15 text-purple-500 border border-purple-500/30">
                                EGX70
                              </span>
                            )}
                            {plan.indexAffiliation === 'EGX100' && (
                              <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-indigo-500/15 text-indigo-500 border border-indigo-500/30">
                                EGX100
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Current Price */}
                    <td className="p-2.5 font-mono font-black text-xs text-md-on-surface">
                      {plan.currentPrice.toFixed(2)} ج.م
                    </td>

                    {/* Daily Change & % */}
                    <td className="p-2.5">
                      <span className={`inline-flex items-center gap-1 font-mono font-bold px-2 py-0.5 rounded-full text-[11px] ${
                        isGain ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400' : 'bg-rose-500/15 text-rose-600 dark:text-rose-400'
                      }`}>
                        {isGain ? '+' : ''}{plan.changePercent.toFixed(2)}%
                      </span>
                    </td>

                    {/* Turnover & Volume */}
                    <td className="p-2.5 font-mono text-[11px] text-md-on-surface-variant">
                      <div className="font-bold text-md-on-surface">{formatTurnover(plan.turnover)}</div>
                      <div className="text-[10px] opacity-75">{formatVolumeShares(plan.volume)} سهم</div>
                    </td>

                    {/* Suggested Entry Range */}
                    <td className="p-2.5 font-mono text-xs bg-teal-500/5 border-l border-r border-teal-500/15 font-bold text-teal-600 dark:text-teal-400">
                      {plan.entryRangeText}
                    </td>

                    {/* Target 1 & 2 */}
                    <td className="p-2.5 font-mono text-xs">
                      <div className="text-emerald-600 dark:text-emerald-400 font-bold">
                        1: {plan.target1.toFixed(2)} <span className="text-[10px]">(+{plan.target1Pct}%)</span>
                      </div>
                      <div className="text-teal-600 dark:text-teal-400 font-medium text-[11px]">
                        2: {plan.target2.toFixed(2)} <span className="text-[10px]">(+{plan.target2Pct}%)</span>
                      </div>
                    </td>

                    {/* Stop Loss */}
                    <td className="p-2.5 font-mono text-xs text-rose-600 dark:text-rose-400 font-bold">
                      {plan.stopLoss.toFixed(2)} <span className="text-[10px]">(-{plan.stopLossPct}%)</span>
                    </td>

                    {/* Floor Trader Pivots, Supports & Resistances */}
                    <td className="p-2.5 text-center font-mono font-bold text-xs bg-amber-500/5 text-amber-600 dark:text-amber-400">
                      {plan.pivot.toFixed(2)}
                    </td>
                    <td className="p-2.5 text-center font-mono text-xs text-md-on-surface font-semibold">
                      {plan.support1.toFixed(2)}
                    </td>
                    <td className="p-2.5 text-center font-mono text-xs text-md-on-surface-variant">
                      {plan.support2.toFixed(2)}
                    </td>
                    <td className="p-2.5 text-center font-mono text-xs text-md-on-surface-variant/80">
                      {plan.support3.toFixed(2)}
                    </td>
                    <td className="p-2.5 text-center font-mono text-xs text-md-on-surface font-semibold">
                      {plan.resistance1.toFixed(2)}
                    </td>
                    <td className="p-2.5 text-center font-mono text-xs text-md-on-surface-variant">
                      {plan.resistance2.toFixed(2)}
                    </td>
                    <td className="p-2.5 text-center font-mono text-xs text-md-on-surface-variant/80">
                      {plan.resistance3.toFixed(2)}
                    </td>

                    {/* Gate 0 Fundamental Health */}
                    <td className="p-2.5 bg-blue-500/5">
                      <div className="font-bold text-[11px] text-md-on-surface">
                        {plan.gate0.gradeBadge}
                      </div>
                      <div className="text-[10px] text-md-on-surface-variant font-mono">
                        P/E: {plan.gate0.peRatio > 0 ? `${plan.gate0.peRatio}x` : 'خاسرة'} 
                        {plan.gate0.dividendYieldPct > 0 && ` • عائد: ${plan.gate0.dividendYieldPct}%`}
                      </div>
                    </td>

                    {/* Dedicated 7 Stages of BADRAN Template */}
                    <td className="p-2 text-center" title={plan.layer1Trend.detail}>
                      <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-bold ${
                        plan.layer1Trend.status === 'pass' ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400' : 'bg-rose-500/15 text-rose-600'
                      }`}>
                        {plan.layer1Trend.status === 'pass' ? 'صاعد ✅' : 'هابط ❌'}
                      </span>
                    </td>

                    <td className="p-2 text-center" title={plan.layer2Liquidity.detail}>
                      <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-bold ${
                        plan.layer2Liquidity.status === 'pass' ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400' : 'bg-amber-500/15 text-amber-600'
                      }`}>
                        {plan.layer2Liquidity.status === 'pass' ? 'ارتكاز طلب ✅' : 'قرب عرض ⚠️'}
                      </span>
                    </td>

                    <td className="p-2 text-center" title={plan.layer3ORB.detail}>
                      <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-bold ${
                        plan.layer3ORB.status === 'pass' ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400' : 'bg-md-surface-container text-md-on-surface-variant'
                      }`}>
                        {plan.layer3ORB.status === 'pass' ? 'اختراق صاعد ✅' : 'داخل النطاق'}
                      </span>
                    </td>

                    <td className="p-2 text-center" title={plan.layer4RMI.detail}>
                      <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-bold ${
                        plan.layer4RMI.status === 'pass' ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400' : 'bg-amber-500/15 text-amber-600'
                      }`}>
                        {plan.layer4RMI.status === 'pass' ? 'زخم شراء ✅' : 'تشبع/هدوء ⚠️'}
                      </span>
                    </td>

                    <td className="p-2 text-center" title={plan.layer5Bollinger.detail}>
                      <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-bold ${
                        plan.layer5Bollinger.status === 'pass' ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400' : 'bg-md-surface-container text-md-on-surface-variant'
                      }`}>
                        {plan.layer5Bollinger.status === 'pass' ? 'توسع باند ✅' : 'انضغاط نطاق'}
                      </span>
                    </td>

                    <td className="p-2 text-center" title={plan.layer6MCDX.detail}>
                      <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-bold ${
                        plan.layer6MCDX.status === 'pass' ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400' : 'bg-amber-500/15 text-amber-600'
                      }`}>
                        {plan.layer6MCDX.status === 'pass' ? 'حيتان 75%+ ✅' : 'سيولة أفراد ⚠️'}
                      </span>
                    </td>

                    <td className="p-2 text-center" title={plan.layer7MultiTF.detail}>
                      <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-bold ${
                        plan.layer7MultiTF.status === 'pass' ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400' : 'bg-amber-500/15 text-amber-600'
                      }`}>
                        {plan.layer7MultiTF.status === 'pass' ? 'توافق 4/4 ✅' : 'تعارض ساعة ⚠️'}
                      </span>
                    </td>

                    {/* Total Confluence Score */}
                    <td className="p-2.5 text-center bg-emerald-500/10">
                      <div className="font-mono font-black text-xs text-emerald-600 dark:text-emerald-400">
                        {plan.confluenceScore}%
                      </div>
                      <div className="text-[10px] text-md-on-surface-variant font-mono">
                        {plan.passedLayersCount}/7 مراحل
                      </div>
                    </td>

                    {/* Final Action Verdict for Next Session */}
                    <td className="p-2.5 bg-emerald-500/5">
                      <span className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-bold border ${plan.actionBadgeColor}`}>
                        {plan.actionVerdictText}
                      </span>
                    </td>

                    {/* Next Earnings Date */}
                    <td className="p-2.5 font-mono text-[11px] font-bold text-md-on-surface whitespace-nowrap">
                      {plan.nextEarningsDate}
                    </td>

                    {/* Corporate & Macro Catalysts */}
                    <td className="p-2.5 text-[11px] text-md-on-surface-variant leading-relaxed max-w-xs">
                      {plan.catalystsAndNews}
                    </td>

                    {/* Sticky Action Button */}
                    <td className="p-2.5 text-center sticky left-0 z-10 bg-md-surface group-hover:bg-md-surface-container-highest border-r border-md-outline-variant/40 shadow-xs">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenLab(plan.symbol);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] shadow-xs transition-transform active:scale-95 whitespace-nowrap"
                        title="فتح شارت السهم وفحص الـ 7 طبقات في المعمل"
                      >
                        المعمل 🔬
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. Stock Detail Modal (When user clicks any row) */}
      {selectedStockForModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 animate-fadeIn">
          <div className="bg-md-surface border border-md-outline-variant rounded-[24px] max-w-3xl w-full max-h-[90vh] overflow-y-auto p-5 sm:p-6 shadow-2xl space-y-4" dir="rtl">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-3 border-b border-md-outline-variant/40 pb-3">
              <div className="flex items-center gap-3">
                <span className="font-mono font-black text-xl px-3 py-1.5 rounded-xl bg-md-primary text-md-on-primary shadow-sm">
                  {selectedStockForModal.symbol}
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-black text-md-on-surface">
                      {selectedStockForModal.nameAr}
                    </h3>
                    {selectedStockForModal.isTopPick && (
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/40 shadow-xs">
                        ⭐ التوصية رقم {selectedStockForModal.topPickRank} بالجلسة
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-md-on-surface-variant font-medium flex items-center gap-2 mt-0.5">
                    <span>{selectedStockForModal.sector}</span>
                    <span>•</span>
                    <span className="font-bold text-md-primary">{selectedStockForModal.indexStatusText}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setSelectedStockForModal(null)}
                className="w-8 h-8 rounded-full bg-md-surface-container hover:bg-md-surface-container-high flex items-center justify-center text-md-on-surface transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Price & Action Badge */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 bg-md-surface-container rounded-2xl">
              <div>
                <span className="text-[11px] text-md-on-surface-variant font-bold block">السعر الحالي والتغير:</span>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-mono font-black text-md-on-surface">
                    {selectedStockForModal.currentPrice.toFixed(2)} ج.م
                  </span>
                  <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded-full ${
                    selectedStockForModal.changePercent >= 0 ? 'bg-emerald-500/15 text-emerald-500' : 'bg-rose-500/15 text-rose-500'
                  }`}>
                    {selectedStockForModal.changePercent >= 0 ? '+' : ''}{selectedStockForModal.changePercent.toFixed(2)}%
                  </span>
                </div>
              </div>

              <div>
                <span className="text-[11px] text-md-on-surface-variant font-bold block">التوصية الميدانية للجلسة القادمة:</span>
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold border mt-0.5 ${selectedStockForModal.actionBadgeColor}`}>
                  {selectedStockForModal.actionVerdictText}
                </span>
              </div>
            </div>

            {/* Tactical Battle Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs font-mono">
              <div className="bg-teal-500/10 border border-teal-500/30 rounded-xl p-2.5 text-center">
                <div className="text-[10px] text-teal-600 dark:text-teal-400 font-bold font-sans">نطاق الدخول المقترح</div>
                <div className="text-sm font-black text-md-on-surface mt-0.5">{selectedStockForModal.entryRangeText}</div>
              </div>

              <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-2.5 text-center">
                <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold font-sans">المستهدف 1</div>
                <div className="text-sm font-black text-md-on-surface mt-0.5">
                  {selectedStockForModal.target1.toFixed(2)} (+{selectedStockForModal.target1Pct}%)
                </div>
              </div>

              <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-2.5 text-center">
                <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold font-sans">المستهدف 2</div>
                <div className="text-sm font-black text-md-on-surface mt-0.5">
                  {selectedStockForModal.target2.toFixed(2)} (+{selectedStockForModal.target2Pct}%)
                </div>
              </div>

              <div className="bg-rose-500/10 border border-rose-500/30 rounded-xl p-2.5 text-center">
                <div className="text-[10px] text-rose-600 dark:text-rose-400 font-bold font-sans">وقف الخسارة الصارم</div>
                <div className="text-sm font-black text-md-on-surface mt-0.5">
                  {selectedStockForModal.stopLoss.toFixed(2)} (-{selectedStockForModal.stopLossPct}%)
                </div>
              </div>
            </div>

            {/* Pivots, S1, S2, S3, R1, R2, R3 */}
            <div className="bg-md-surface-container-low border border-md-outline-variant/60 rounded-2xl p-3 space-y-2">
              <h4 className="text-xs font-bold text-md-on-surface flex items-center gap-1.5">
                <span>مستويات الارتكاز والدعوم والمقاومات لجلسة الغد (حسب نشرة البورصة):</span>
              </h4>
              <div className="grid grid-cols-7 gap-1.5 text-center font-mono text-xs">
                <div className="bg-md-surface p-1.5 rounded-lg border border-md-outline-variant/40">
                  <div className="text-[9px] text-md-on-surface-variant">S3</div>
                  <div className="font-bold">{selectedStockForModal.support3.toFixed(2)}</div>
                </div>
                <div className="bg-md-surface p-1.5 rounded-lg border border-md-outline-variant/40">
                  <div className="text-[9px] text-md-on-surface-variant">S2</div>
                  <div className="font-bold">{selectedStockForModal.support2.toFixed(2)}</div>
                </div>
                <div className="bg-md-surface p-1.5 rounded-lg border border-md-outline-variant/40">
                  <div className="text-[9px] text-md-on-surface-variant">S1</div>
                  <div className="font-bold">{selectedStockForModal.support1.toFixed(2)}</div>
                </div>
                <div className="bg-amber-500/15 p-1.5 rounded-lg border border-amber-500/30 text-amber-600 dark:text-amber-400 font-black">
                  <div className="text-[9px]">الارتكاز</div>
                  <div>{selectedStockForModal.pivot.toFixed(2)}</div>
                </div>
                <div className="bg-md-surface p-1.5 rounded-lg border border-md-outline-variant/40">
                  <div className="text-[9px] text-md-on-surface-variant">R1</div>
                  <div className="font-bold">{selectedStockForModal.resistance1.toFixed(2)}</div>
                </div>
                <div className="bg-md-surface p-1.5 rounded-lg border border-md-outline-variant/40">
                  <div className="text-[9px] text-md-on-surface-variant">R2</div>
                  <div className="font-bold">{selectedStockForModal.resistance2.toFixed(2)}</div>
                </div>
                <div className="bg-md-surface p-1.5 rounded-lg border border-md-outline-variant/40">
                  <div className="text-[9px] text-md-on-surface-variant">R3</div>
                  <div className="font-bold">{selectedStockForModal.resistance3.toFixed(2)}</div>
                </div>
              </div>
            </div>

            {/* 7 Stages Breakdown */}
            <div className="bg-md-surface-container-low border border-md-outline-variant/60 rounded-2xl p-3 space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-md-on-surface flex items-center gap-1.5">
                  <Layers size={14} className="text-emerald-500" />
                  <span>نتائج المراحل السبعة لقالب BADRAN:</span>
                </h4>
                <span className="font-mono font-black text-xs px-2.5 py-0.5 rounded-full bg-emerald-600/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                  سكور التوافق: {selectedStockForModal.confluenceScore}% ({selectedStockForModal.passedLayersCount}/7 مراحل)
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div className="p-2 rounded-xl bg-md-surface border border-md-outline-variant/40">
                  <span className="font-bold text-md-primary block text-[11px]">م1: الاتجاه العام والمتوسطات</span>
                  <span className="text-[11px] font-medium text-md-on-surface">{selectedStockForModal.layer1Trend.resultText}</span>
                </div>
                <div className="p-2 rounded-xl bg-md-surface border border-md-outline-variant/40">
                  <span className="font-bold text-md-primary block text-[11px]">م2: مناطق السيولة والأوردر بلوك</span>
                  <span className="text-[11px] font-medium text-md-on-surface">{selectedStockForModal.layer2Liquidity.resultText}</span>
                </div>
                <div className="p-2 rounded-xl bg-md-surface border border-md-outline-variant/40">
                  <span className="font-bold text-md-primary block text-[11px]">م3: كسر نطاق الافتتاح ORB</span>
                  <span className="text-[11px] font-medium text-md-on-surface">{selectedStockForModal.layer3ORB.resultText}</span>
                </div>
                <div className="p-2 rounded-xl bg-md-surface border border-md-outline-variant/40">
                  <span className="font-bold text-md-primary block text-[11px]">م4: الزخم النسبي الاتجاهي RMI</span>
                  <span className="text-[11px] font-medium text-md-on-surface">{selectedStockForModal.layer4RMI.resultText}</span>
                </div>
                <div className="p-2 rounded-xl bg-md-surface border border-md-outline-variant/40">
                  <span className="font-bold text-md-primary block text-[11px]">م5: التقلب والانفجار Bollinger</span>
                  <span className="text-[11px] font-medium text-md-on-surface">{selectedStockForModal.layer5Bollinger.resultText}</span>
                </div>
                <div className="p-2 rounded-xl bg-md-surface border border-md-outline-variant/40">
                  <span className="font-bold text-md-primary block text-[11px]">م6: سيولة الحيتان MCDX</span>
                  <span className="text-[11px] font-medium text-md-on-surface">{selectedStockForModal.layer6MCDX.resultText}</span>
                </div>
                <div className="p-2 rounded-xl bg-md-surface border border-md-outline-variant/40 sm:col-span-2">
                  <span className="font-bold text-md-primary block text-[11px]">م7: توافق الفريمات المتعددة وتأكيد الحجم</span>
                  <span className="text-[11px] font-medium text-md-on-surface">{selectedStockForModal.layer7MultiTF.resultText}</span>
                </div>
              </div>
            </div>

            {/* Catalysts & Next Earnings */}
            <div className="bg-md-surface-container-low border border-md-outline-variant/60 rounded-2xl p-3 text-xs space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-md-on-surface">تاريخ نتائج الأرباح المقبلة:</span>
                <span className="font-mono font-bold text-md-primary">{selectedStockForModal.nextEarningsDate}</span>
              </div>
              <div>
                <span className="font-bold text-md-on-surface block mb-0.5">المحفزات والأحداث الاقتصادية المؤثرة:</span>
                <p className="text-md-on-surface-variant leading-relaxed font-medium">
                  {selectedStockForModal.catalystsAndNews}
                </p>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-md-outline-variant/40">
              <button
                onClick={() => setSelectedStockForModal(null)}
                className="px-4 py-2 rounded-full bg-md-surface-container hover:bg-md-surface-container-high text-xs font-bold text-md-on-surface"
              >
                إغلاق
              </button>

              <button
                onClick={() => {
                  const sym = selectedStockForModal.symbol;
                  setSelectedStockForModal(null);
                  handleOpenLab(sym);
                }}
                className="px-5 py-2 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black flex items-center gap-2 shadow-sm"
              >
                <FlaskConical size={15} />
                <span>فتح شارت السهم وفحص الـ 7 طبقات في المعمل 🔬</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
