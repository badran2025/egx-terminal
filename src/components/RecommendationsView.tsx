import React, { useState, useMemo } from 'react';
import { 
  Sparkles, Target, ShieldAlert, TrendingUp, TrendingDown, 
  Briefcase, Activity, BarChart2, CheckCircle2, ChevronRight, 
  Search, ArrowUpRight, Zap, AlertTriangle, Filter, Plus, ExternalLink
} from 'lucide-react';
import { StockData, PortfolioPosition } from '../types';
import { 
  analyzeStock, 
  diagnosePortfolioPosition, 
  StockRecommendation, 
  PortfolioStockDiagnosis,
  RecommendationType 
} from '../services/recommendationEngine';
import { EGYPTIAN_FUNDS_MAP, formatPrice, getEGXSessionDates } from '../services/egxService';
import { MdCard, MdButton, MdChip, MdBadge, MdTextField } from './material';
import { LastUpdatedBanner } from './LastUpdatedBanner';

interface Props {
  stocks: StockData[];
  portfolio: PortfolioPosition[];
  onSelectStock: (symbol: string) => void;
  onAddToPortfolio: (position: Omit<PortfolioPosition, 'id'>) => void;
  onOpenLabWithStock?: (symbol: string) => void;
  lastUpdated?: Date;
  onRefresh?: () => void;
  isLoading?: boolean;
}

export const RecommendationsView: React.FC<Props> = ({
  stocks,
  portfolio,
  onSelectStock,
  onAddToPortfolio,
  onOpenLabWithStock,
  lastUpdated,
  onRefresh,
  isLoading = false
}) => {
  const [filterType, setFilterType] = useState<string>('ALL');
  const [indexFilter, setIndexFilter] = useState<'ALL' | 'EGX30' | 'EGX70' | 'EGX100'>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'gain' | 'score' | 'risk_reward' | 'volume'>('score');
  const [expandedRationale, setExpandedRationale] = useState<Record<string, boolean>>({});
  const [addedSuccessSymbol, setAddedSuccessSymbol] = useState<string | null>(null);

  const sessionDates = useMemo(() => getEGXSessionDates(lastUpdated || new Date()), [lastUpdated]);

  // Map stocks by symbol for fast lookup
  const stockMap = useMemo(() => {
    const map = new Map<string, StockData>();
    stocks.forEach(s => map.set(s.symbol.toUpperCase(), s));
    return map;
  }, [stocks]);

  // Analyze all stocks
  const allRecommendations = useMemo(() => {
    return stocks.map(stock => analyzeStock(stock));
  }, [stocks]);

  // Diagnose user's portfolio positions (stocks, mutual funds, and gold)
  const portfolioDiagnoses: PortfolioStockDiagnosis[] = useMemo(() => {
    return portfolio.map(pos => {
      const sym = pos.symbol.toUpperCase();
      const live = stockMap.get(sym);
      const liveFund = EGYPTIAN_FUNDS_MAP.get(sym) || EGYPTIAN_FUNDS_MAP.get(sym.toLowerCase());
      return diagnosePortfolioPosition(pos, live, liveFund);
    });
  }, [portfolio, stockMap]);

  // Counts by recommendation type
  const counts = useMemo(() => {
    const strongBuy = allRecommendations.filter(r => r.type === 'STRONG_BUY').length;
    const swingBuy = allRecommendations.filter(r => r.type === 'SWING_BUY').length;
    const accumulate = allRecommendations.filter(r => r.type === 'ACCUMULATE').length;
    const takeProfit = allRecommendations.filter(r => r.type === 'TAKE_PROFIT').length;
    const stopLoss = allRecommendations.filter(r => r.type === 'STOP_LOSS').length;
    return { strongBuy, swingBuy, accumulate, takeProfit, stopLoss };
  }, [allRecommendations]);

  // Filter recommendations
  const filteredRecommendations = useMemo(() => {
    return allRecommendations.filter(rec => {
      // Type filter
      if (filterType === 'STRONG_BUY' && rec.type !== 'STRONG_BUY') return false;
      if (filterType === 'SWING_BUY' && rec.type !== 'SWING_BUY') return false;
      if (filterType === 'ACCUMULATE' && rec.type !== 'ACCUMULATE') return false;
      if (filterType === 'TAKE_PROFIT' && rec.type !== 'TAKE_PROFIT') return false;
      if (filterType === 'STOP_LOSS' && rec.type !== 'STOP_LOSS') return false;
      if (filterType === 'PORTFOLIO') {
        const isOwned = portfolio.some(p => p.symbol.toUpperCase() === rec.stock.symbol.toUpperCase());
        if (!isOwned) return false;
      }

      // Index filter
      if (indexFilter === 'EGX30' && !rec.stock.isEGX30) return false;
      if (indexFilter === 'EGX70' && !rec.stock.isEGX70) return false;
      if (indexFilter === 'EGX100' && !rec.stock.isEGX100) return false;

      // Search query with Arabic normalization & English matching
      if (searchQuery.trim()) {
        const norm = (s: string) => s.toLowerCase().replace(/[أإآ]/g, 'ا').replace(/ة/g, 'ه').replace(/ى/g, 'ي').trim();
        const qNorm = norm(searchQuery);
        const sym = rec.stock.symbol.toLowerCase();
        const nameArNorm = norm(rec.stock.nameAr);
        const nameEn = (rec.stock.nameEn || '').toLowerCase();
        if (!sym.includes(qNorm) && !nameArNorm.includes(qNorm) && !nameEn.includes(qNorm)) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'gain') return b.target1Pct - a.target1Pct;
      if (sortBy === 'risk_reward') return b.riskRewardRatio - a.riskRewardRatio;
      if (sortBy === 'volume') return b.stock.volume - a.stock.volume;
      return b.technicalScore - a.technicalScore;
    });
  }, [allRecommendations, filterType, indexFilter, searchQuery, sortBy, portfolio]);

  const toggleRationale = (symbol: string) => {
    setExpandedRationale(prev => ({ ...prev, [symbol]: !prev[symbol] }));
  };

  const handleQuickAdd = (rec: StockRecommendation) => {
    onAddToPortfolio({
      symbol: rec.stock.symbol,
      assetType: 'stock',
      buyPrice: rec.stock.close,
      shares: 100,
      buyDate: new Date().toISOString().split('T')[0],
      stopLoss: rec.stopLoss,
      targetPrice: rec.target1,
      notes: `توصية ${rec.badgeLabel} • دخول ${rec.stock.close} ج.م • مستهدف ${rec.target1} ج.م`
    });
    setAddedSuccessSymbol(rec.stock.symbol);
    setTimeout(() => setAddedSuccessSymbol(null), 2500);
  };

  return (
    <div className="space-y-8 animate-fadeIn text-md-on-surface" dir="rtl">
      {/* Date of Last Update Banner */}
      <LastUpdatedBanner
        lastUpdated={lastUpdated}
        onRefresh={onRefresh}
        isLoading={isLoading}
        tabTitle="رادار التوصيات والتحليل اليومي"
      />

      {/* 1. M3 Hero Banner (Material Primary Container - Compact) */}
      <div className="bg-md-primary-container text-md-on-primary-container rounded-[22px] p-4 sm:p-5 shadow-sm relative overflow-hidden">
        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-9 h-9 rounded-[12px] bg-md-surface text-md-primary flex items-center justify-center shadow-sm">
                <Sparkles size={20} />
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">
                محرك التوصيات والتحليل الفني اليومي للبورصة المصرية
              </h2>
            </div>
            <p className="text-xs opacity-90 max-w-3xl leading-relaxed font-medium">
              نظام تحليلي مبني وفق معايير Google Material Design 3، يدمج مؤشرات RSI، المتوسطات المتحركة (20, 50, 200 يوم)، نقاط الارتكاز Pivot، وحسابات العائد والمخاطرة لتوليد إشارات تداول لحظية موثوقة.
            </p>
          </div>

          {/* Quick Metrics in M3 Elevated Surface Cards */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="bg-md-surface text-md-on-surface rounded-[16px] px-3.5 py-2 text-center min-w-[95px] shadow-sm border border-md-outline-variant/40">
              <div className="text-[10px] text-md-on-surface-variant font-semibold mb-0.5">شراء قوي</div>
              <div className="text-lg font-mono font-extrabold text-md-primary">{counts.strongBuy}</div>
            </div>
            <div className="bg-md-surface text-md-on-surface rounded-[16px] px-3.5 py-2 text-center min-w-[95px] shadow-sm border border-md-outline-variant/40">
              <div className="text-[10px] text-md-on-surface-variant font-semibold mb-0.5">مضاربات سريعة</div>
              <div className="text-lg font-mono font-extrabold text-md-tertiary">{counts.swingBuy}</div>
            </div>
            <div className="bg-md-surface text-md-on-surface rounded-[16px] px-3.5 py-2 text-center min-w-[95px] shadow-sm border border-md-outline-variant/40">
              <div className="text-[10px] text-md-on-surface-variant font-semibold mb-0.5">جني أرباح</div>
              <div className="text-lg font-mono font-extrabold text-amber-500">{counts.takeProfit}</div>
            </div>
            <div className="bg-md-surface text-md-on-surface rounded-[16px] px-3.5 py-2 text-center min-w-[95px] shadow-sm border border-md-outline-variant/40">
              <div className="text-[10px] text-md-on-surface-variant font-semibold mb-0.5">وقف خسارة</div>
              <div className="text-lg font-mono font-extrabold text-md-error">{counts.stopLoss}</div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Personalized Portfolio Action Plan in M3 Elevated Card */}
      {portfolio.length > 0 && (
        <MdCard variant="elevated" className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-3 pb-3 border-b border-md-outline-variant/50">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-md-md bg-md-secondary-container text-md-on-secondary-container flex items-center justify-center">
                <Briefcase size={20} />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-md-on-surface">
                  تشخيص مراكز محفظتك والإجراءات المقترحة للجلسة القادمة
                </h3>
                <span className="text-xs text-md-on-surface-variant font-medium">
                  تحليل لحظي يحدد لك أسعار جني الأرباح ونقاط الخروج الصارمة • بناءً على إغلاق <strong className="font-mono text-md-primary font-bold">({sessionDates.latestSessionName})</strong> مقارنة بـ <strong className="font-mono text-md-tertiary font-bold">({sessionDates.prevSessionName})</strong>
                </span>
              </div>
            </div>
            <MdBadge variant="secondary">
              {portfolio.length} مراكز مسجلة
            </MdBadge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-1">
            {portfolioDiagnoses.map((diag, idx) => (
              <div 
                key={diag.position.id || idx}
                className="bg-md-surface-container border border-md-outline-variant/60 rounded-[20px] p-4 flex flex-col justify-between hover:border-md-outline transition-all duration-200 shadow-sm"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-base text-md-on-surface">
                        {diag.position.symbol}
                      </span>
                      {diag.position.isGold ? (
                        <span className="text-[10px] font-bold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                          🥇 دهب ثاندر عيار 24
                        </span>
                      ) : (diag.position.isFund || diag.position.assetType === 'fund') ? (
                        <span className="text-[10px] font-bold text-md-tertiary bg-md-tertiary-container/30 px-2 py-0.5 rounded-full border border-md-tertiary/20">
                          صندوق استثمار
                        </span>
                      ) : (
                        diag.liveStock && (
                          <span className="text-xs text-md-on-surface-variant truncate max-w-[130px]">
                            {diag.liveStock.nameAr}
                          </span>
                        )
                      )}
                    </div>
                    <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-md-full border ${diag.statusColor}`}>
                      {diag.statusTitle}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs py-2 border-y border-md-outline-variant/40 font-mono mb-3">
                    <div>
                      <span className="text-md-on-surface-variant block text-[10px]">
                        {diag.position.isGold ? 'تكلفة شراء الجرام' : 'متوسط الشراء'}
                      </span>
                      <span className="font-bold text-md-on-surface">
                        {formatPrice(diag.position.buyPrice, diag.position.isFund)} ج.م
                      </span>
                    </div>
                    <div>
                      <span className="text-md-on-surface-variant block text-[10px]">
                        {diag.position.isGold ? 'سعر بيع الجرام الآن' : (diag.position.isFund || diag.position.assetType === 'fund' ? 'قيمة الوثيقة (NAV)' : 'السعر الحالي')}
                      </span>
                      <span className="font-bold text-md-on-surface">
                        {formatPrice(diag.currentPrice, diag.position.isFund)} ج.م
                      </span>
                    </div>
                    <div>
                      <span className="text-md-on-surface-variant block text-[10px]">الربح / الخسارة</span>
                      <span className={`font-bold ${diag.currentPnlPct >= 0 ? 'text-md-primary' : 'text-md-error'}`}>
                        {diag.currentPnlPct >= 0 ? '+' : ''}{diag.currentPnlPct.toFixed(2)}%
                      </span>
                    </div>
                  </div>

                  {/* Action Box in M3 Surface Container High */}
                  <div className="p-3 bg-md-surface-container-high rounded-[14px] border border-md-outline-variant/40 space-y-1 mb-3">
                    <div className="text-xs font-bold text-md-on-surface flex items-center gap-1.5">
                      <Zap size={14} className="text-amber-500" />
                      <span>{diag.actionTitle}</span>
                    </div>
                    <p className="text-[11px] text-md-on-surface-variant leading-relaxed">
                      {diag.actionDetails}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-md-outline-variant/40 text-xs">
                  <div className="flex items-center gap-3 font-mono text-[11px] text-md-on-surface-variant">
                    <span>وقف: <strong className="text-md-error">{formatPrice(diag.suggestedStopLoss, diag.position.isFund)}</strong></span>
                    <span>مستهدف: <strong className="text-md-primary">{formatPrice(diag.suggestedTarget, diag.position.isFund)}</strong></span>
                  </div>

                  <div className="flex items-center gap-2">
                    {onOpenLabWithStock && (
                      <button
                        onClick={() => onOpenLabWithStock(diag.position.symbol)}
                        className="flex items-center gap-1 text-[11px] text-md-primary font-bold bg-md-primary/10 hover:bg-md-primary/20 px-2 py-0.5 rounded-md-full border border-md-primary/20"
                        title="فحص في معمل الـ 7 طبقات"
                      >
                        <Sparkles size={11} />
                        <span>فحص بالمعمل</span>
                      </button>
                    )}

                    {diag.liveStock && (
                      <button
                        onClick={() => onSelectStock(diag.position.symbol)}
                        className="flex items-center gap-1 text-xs text-md-on-surface-variant hover:text-md-on-surface hover:underline font-bold"
                      >
                        <span>الشارت</span>
                        <ArrowUpRight size={13} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </MdCard>
      )}

      {/* 3. M3 Filter Controls & Search (Outlined Card) */}
      <MdCard variant="outlined" className="space-y-4">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          {/* Main Filter Chips using MdChip */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none text-xs">
            <MdChip
              label={`جميع التوصيات (${allRecommendations.length})`}
              selected={filterType === 'ALL'}
              onClick={() => setFilterType('ALL')}
            />

            {portfolio.length > 0 && (
              <MdChip
                label="محفظتي فقط"
                icon={<Briefcase size={14} />}
                selected={filterType === 'PORTFOLIO'}
                onClick={() => setFilterType('PORTFOLIO')}
              />
            )}

            <MdChip
              label={`🟢 شراء قوي (${counts.strongBuy})`}
              selected={filterType === 'STRONG_BUY'}
              onClick={() => setFilterType('STRONG_BUY')}
            />

            <MdChip
              label={`⚡ مضاربات (${counts.swingBuy})`}
              selected={filterType === 'SWING_BUY'}
              onClick={() => setFilterType('SWING_BUY')}
            />

            <MdChip
              label={`🟡 جني أرباح (${counts.takeProfit})`}
              selected={filterType === 'TAKE_PROFIT'}
              onClick={() => setFilterType('TAKE_PROFIT')}
            />

            <MdChip
              label={`🔴 وقف خسارة (${counts.stopLoss})`}
              selected={filterType === 'STOP_LOSS'}
              onClick={() => setFilterType('STOP_LOSS')}
            />
          </div>

          {/* Index Segmented Filter */}
          <div className="flex items-center gap-1 bg-md-surface-container p-1 rounded-md-full border border-md-outline-variant/60 text-xs self-start lg:self-auto">
            <button
              onClick={() => setIndexFilter('ALL')}
              className={`px-3 py-1.5 rounded-md-full font-medium transition-all ${
                indexFilter === 'ALL' ? 'bg-md-secondary-container text-md-on-secondary-container shadow-sm font-bold' : 'text-md-on-surface-variant hover:text-md-on-surface'
              }`}
            >
              كل المؤشرات
            </button>
            <button
              onClick={() => setIndexFilter('EGX30')}
              className={`px-3 py-1.5 rounded-md-full font-medium transition-all ${
                indexFilter === 'EGX30' ? 'bg-md-primary text-md-on-primary shadow-sm font-bold' : 'text-md-on-surface-variant hover:text-md-on-surface'
              }`}
            >
              EGX 30
            </button>
            <button
              onClick={() => setIndexFilter('EGX70')}
              className={`px-3 py-1.5 rounded-md-full font-medium transition-all ${
                indexFilter === 'EGX70' ? 'bg-md-primary text-md-on-primary shadow-sm font-bold' : 'text-md-on-surface-variant hover:text-md-on-surface'
              }`}
            >
              EGX 70
            </button>
            <button
              onClick={() => setIndexFilter('EGX100')}
              className={`px-3 py-1.5 rounded-md-full font-medium transition-all ${
                indexFilter === 'EGX100' ? 'bg-md-primary text-md-on-primary shadow-sm font-bold' : 'text-md-on-surface-variant hover:text-md-on-surface'
              }`}
            >
              EGX 100
            </button>
          </div>
        </div>

        {/* Search & Sort Sub-Row */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-3 border-t border-md-outline-variant/40 text-xs">
          <div className="w-full sm:max-w-md">
            <MdTextField
              placeholder="ابحث بالرمز أو اسم الشركة في البورصة المصرية (مثال: COMI, طلعت مصطفى)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leadingIcon={<Search size={16} />}
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-md-on-surface-variant font-semibold whitespace-nowrap">الترتيب حسب:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-md-surface-container-high border border-md-outline rounded-md-md px-3 py-2 text-md-on-surface font-semibold focus:outline-none focus:border-md-primary"
            >
              <option value="score">الدرجة الفنية الإجمالية (الأقوى تحليلياً)</option>
              <option value="gain">أعلى عائد متوقع لمستهدف 1</option>
              <option value="risk_reward">أفضل نسبة عائد إلى مخاطرة</option>
              <option value="volume">الأعلى تداولاً وسيولة</option>
            </select>
          </div>
        </div>
      </MdCard>

      {/* 4. Recommendation Cards Grid */}
      <div className="space-y-4">
        {filteredRecommendations.length === 0 ? (
          <MdCard variant="outlined" className="p-16 text-center text-md-on-surface-variant space-y-3">
            <Filter size={36} className="mx-auto text-md-on-surface-variant opacity-60" />
            <h4 className="text-base font-bold text-md-on-surface">لا توجد توصيات مطابقة لمعايير البحث الحالية</h4>
            <p className="text-xs">جرب تغيير الفلتر أو مسح كلمة البحث لرؤية كافة التوصيات</p>
          </MdCard>
        ) : (
          filteredRecommendations.map((rec) => {
            const isOwned = portfolio.some(p => p.symbol.toUpperCase() === rec.stock.symbol.toUpperCase());
            const isExpanded = Boolean(expandedRationale[rec.stock.symbol]);
            const isAddedSuccess = addedSuccessSymbol === rec.stock.symbol;

            return (
              <div 
                key={rec.stock.symbol}
                className="bg-md-surface-container-low border border-md-outline-variant/60 hover:border-md-outline rounded-[24px] p-5 sm:p-6 transition-all duration-200 shadow-md-1 space-y-4"
              >
                {/* Card Top Row */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-[16px] bg-md-surface-container-highest border border-md-outline-variant/60 flex items-center justify-center font-mono font-extrabold text-base text-md-on-surface shadow-sm">
                      {rec.stock.symbol}
                    </div>

                    <div>
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <h3 className="text-lg font-bold text-md-on-surface">
                          {rec.stock.nameAr}
                        </h3>
                        <span className="text-xs text-md-on-surface-variant font-mono">({rec.stock.ticker})</span>

                        {isOwned && (
                          <MdBadge variant="primary">
                            <Briefcase size={12} />
                            <span>مملوك في محفظتك</span>
                          </MdBadge>
                        )}

                        {rec.stock.isEGX30 && (
                          <span className="text-[10px] bg-md-secondary-container text-md-on-secondary-container border border-md-secondary/30 px-2 py-0.5 rounded-md-full font-bold">
                            EGX 30
                          </span>
                        )}
                        {rec.stock.isEGX70 && (
                          <span className="text-[10px] bg-md-tertiary-container text-md-on-tertiary-container border border-md-tertiary/30 px-2 py-0.5 rounded-md-full font-bold">
                            EGX 70
                          </span>
                        )}
                        {rec.stock.isEGX100 && (
                          <span className="text-[10px] bg-md-surface-container-highest text-md-on-surface border border-md-outline-variant px-2 py-0.5 rounded-md-full font-bold">
                            EGX 100
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-3 text-xs mt-1">
                        <span className="font-mono font-extrabold text-md-on-surface text-base">
                          {formatPrice(rec.stock.close, rec.stock.isFund)} ج.م
                        </span>
                        <span className={`font-mono font-bold flex items-center gap-0.5 ${
                          rec.stock.changePercent >= 0 ? 'text-md-primary' : 'text-md-error'
                        }`}>
                          {rec.stock.changePercent >= 0 ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
                          {rec.stock.changePercent >= 0 ? '+' : ''}{rec.stock.changePercent.toFixed(2)}%
                        </span>
                        <span className="text-md-on-surface-variant">
                          حجم: <strong className="font-mono text-md-on-surface">{(rec.stock.volume / 1000).toFixed(0)}K</strong>
                        </span>
                        <span className="text-md-outline-variant">•</span>
                        <span className="text-md-on-surface-variant">
                          أفق الصفقة: <strong className="text-md-on-surface font-sans">{rec.horizon}</strong>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Recommendation Badge & Action Buttons */}
                  <div className="flex items-center gap-2.5 flex-wrap self-end sm:self-auto">
                    <span className={`px-3.5 py-1.5 rounded-md-full text-xs font-bold border ${rec.badgeColor}`}>
                      {rec.badgeLabel}
                    </span>

                    {onOpenLabWithStock && (
                      <button
                        onClick={() => onOpenLabWithStock(rec.stock.symbol)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-md-full bg-md-primary text-md-on-primary hover:opacity-90 font-bold text-xs transition-all shadow-sm"
                        title="فحص وتحليل السهم بالـ 7 طبقات في المعمل العملي"
                      >
                        <Sparkles size={14} />
                        <span>فحص بالـ 7 طبقات في المعمل 🧪</span>
                      </button>
                    )}

                    <MdButton
                      variant="tonal"
                      size="sm"
                      icon={<BarChart2 size={15} />}
                      onClick={() => onSelectStock(rec.stock.symbol)}
                    >
                      الشارت التفاعلي
                    </MdButton>

                    <MdButton
                      variant="filled"
                      size="sm"
                      icon={isAddedSuccess ? <CheckCircle2 size={15} /> : <Plus size={15} />}
                      onClick={() => handleQuickAdd(rec)}
                      disabled={isAddedSuccess}
                    >
                      {isAddedSuccess ? 'تمت الإضافة للمحفظة!' : 'إضافة للمحفظة'}
                    </MdButton>
                  </div>
                </div>

                {/* Card Numeric Trading Levels Grid in M3 Container */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-md-surface-container p-4 rounded-[18px] border border-md-outline-variant/50 text-xs font-mono">
                  {/* Entry Zone */}
                  <div className="space-y-1">
                    <span className="text-md-on-surface-variant font-sans block text-[11px]">نطاق الدخول المقترح:</span>
                    <div className="font-extrabold text-md-on-surface text-sm">
                      {formatPrice(rec.entryPrice, rec.stock.isFund)} ج.م
                    </div>
                    <div className="text-[10px] text-md-on-surface-variant font-sans">
                      ({rec.entryZoneMin} - {rec.entryZoneMax} ج.م)
                    </div>
                  </div>

                  {/* Target 1 */}
                  <div className="space-y-1">
                    <span className="text-md-primary font-sans block text-[11px] font-bold">
                      المستهدف الأول (R1):
                    </span>
                    <div className="font-extrabold text-md-primary text-sm">
                      {formatPrice(rec.target1, rec.stock.isFund)} ج.م
                    </div>
                    <div className="text-[10px] text-md-primary font-bold font-sans">
                      عائد متوقع: +{rec.target1Pct}%
                    </div>
                  </div>

                  {/* Target 2 */}
                  <div className="space-y-1">
                    <span className="text-md-tertiary font-sans block text-[11px] font-bold">
                      المستهدف الثاني (R2):
                    </span>
                    <div className="font-extrabold text-md-tertiary text-sm">
                      {formatPrice(rec.target2, rec.stock.isFund)} ج.م
                    </div>
                    <div className="text-[10px] text-md-tertiary font-bold font-sans">
                      عائد أقصى: +{rec.target2Pct}%
                    </div>
                  </div>

                  {/* Stop Loss */}
                  <div className="space-y-1">
                    <span className="text-md-error font-sans block text-[11px] font-bold">
                      وقف الخسارة الصارم (S1):
                    </span>
                    <div className="font-extrabold text-md-error text-sm">
                      {formatPrice(rec.stopLoss, rec.stock.isFund)} ج.م
                    </div>
                    <div className="text-[10px] text-md-on-surface-variant font-sans">
                      مخاطرة: -{rec.stopLossPct}% • R:R (1 : {rec.riskRewardRatio})
                    </div>
                  </div>
                </div>

                {/* Executive Summary Rationale */}
                <div className="bg-md-surface-container/60 rounded-[16px] p-4 border border-md-outline-variant/40 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-md-on-surface flex items-center gap-1.5">
                      <Zap size={14} className="text-amber-500" />
                      <span>الخلاصة الفنية والتنفيذية:</span>
                    </span>
                    <button
                      onClick={() => toggleRationale(rec.stock.symbol)}
                      className="text-xs text-md-primary hover:underline font-bold flex items-center gap-1"
                    >
                      <span>{isExpanded ? 'إخفاء الحيثيات التفصيلية' : 'عرض تحليل المؤشرات (RSI, المتوسطات, البيفوت)'}</span>
                      <ChevronRight size={13} className={`transition-transform duration-200 ${isExpanded ? 'rotate-90' : '-rotate-90'}`} />
                    </button>
                  </div>

                  <p className="text-xs text-md-on-surface-variant leading-relaxed font-sans">
                    {rec.rationale.summary}
                  </p>

                  {/* Detailed Indicator Breakdown (Accordion) */}
                  {isExpanded && (
                    <div className="pt-3 border-t border-md-outline-variant/40 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs animate-fadeIn">
                      <div className="p-3 bg-md-surface rounded-[12px] border border-md-outline-variant/50 space-y-1">
                        <span className="font-bold text-md-on-surface block">مؤشر القوة النسبية (RSI 14):</span>
                        <p className="text-md-on-surface-variant text-[11px] leading-relaxed">
                          {rec.rationale.rsiReason}
                        </p>
                      </div>

                      <div className="p-3 bg-md-surface rounded-[12px] border border-md-outline-variant/50 space-y-1">
                        <span className="font-bold text-md-on-surface block">المتوسطات المتحركة (EMA 20, 50, 200):</span>
                        <p className="text-md-on-surface-variant text-[11px] leading-relaxed">
                          {rec.rationale.emaReason}
                        </p>
                      </div>

                      <div className="p-3 bg-md-surface rounded-[12px] border border-md-outline-variant/50 space-y-1">
                        <span className="font-bold text-md-on-surface block">السيولة وأحجام التداول:</span>
                        <p className="text-md-on-surface-variant text-[11px] leading-relaxed">
                          {rec.rationale.volumeReason}
                        </p>
                      </div>

                      <div className="p-3 bg-md-surface rounded-[12px] border border-md-outline-variant/50 space-y-1">
                        <span className="font-bold text-md-on-surface block">نقاط الدعم والمقاومة والارتكاز:</span>
                        <p className="text-md-on-surface-variant text-[11px] leading-relaxed">
                          {rec.rationale.pivotsReason}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
