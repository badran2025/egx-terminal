import React, { useState } from 'react';
import { 
  Sparkles, BarChart3, FlaskConical, Target, Layers
} from 'lucide-react';
import { StockData, PortfolioPosition } from '../types';
import { RecommendationsView } from './RecommendationsView';
import { TechnicalRadarView } from './TechnicalRadarView';
import { InteractiveStockLab } from './InteractiveStockLab';
import { LastUpdatedBanner } from './LastUpdatedBanner';

interface Props {
  stocks: StockData[];
  portfolio?: PortfolioPosition[];
  onSelectStock: (symbol: string) => void;
  onAddToPortfolio?: (position: Omit<PortfolioPosition, 'id'>) => void;
  theme?: 'dark' | 'light';
  isLoading?: boolean;
  lastUpdated?: Date;
  onRefresh?: () => void;
  initialSubTab?: 'recommendations' | 'radar_table' | 'lab';
  initialLabSymbol?: string;
}

export const RadarAndRecommendationsView: React.FC<Props> = ({
  stocks = [],
  portfolio = [],
  onSelectStock,
  onAddToPortfolio,
  theme = 'dark',
  isLoading = false,
  lastUpdated,
  onRefresh,
  initialSubTab = 'lab',
  initialLabSymbol
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'lab' | 'radar_table'>(
    initialSubTab === 'radar_table' ? 'radar_table' : 'lab'
  );
  const [labSymbol, setLabSymbol] = useState<string>(initialLabSymbol || 'COMI');
  const [showCardsView, setShowCardsView] = useState<boolean>(false);

  // Sync if initialLabSymbol changes from parent
  React.useEffect(() => {
    if (initialLabSymbol) {
      setLabSymbol(initialLabSymbol);
      setActiveSubTab('lab');
      setShowCardsView(false);
    }
  }, [initialLabSymbol]);

  const handleOpenLab = (symbol: string) => {
    setLabSymbol(symbol);
    setActiveSubTab('lab');
    setShowCardsView(false);
    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  return (
    <div className="space-y-6 animate-fadeIn text-md-on-surface" dir="rtl">
      {/* Date of Last Update Banner */}
      <LastUpdatedBanner
        lastUpdated={lastUpdated}
        onRefresh={onRefresh}
        isLoading={isLoading}
        tabTitle="المعمل العملي ورادار التوصيات الموحد (EGX Confluence Lab & Radar)"
      />

      {/* Compact M3 Hero Banner */}
      <div className="bg-gradient-to-r from-md-primary/15 via-md-primary-container/35 to-md-secondary-container/25 border border-md-outline-variant/60 rounded-[22px] p-4 sm:p-5 shadow-sm relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <span className="w-9 h-9 rounded-[14px] bg-md-primary text-md-on-primary flex items-center justify-center shadow-sm">
                <Target size={20} />
              </span>
              <div>
                <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">
                  قمرة المعمل العملي ورادار التوصيات الموحد
                </h2>
                <span className="text-xs font-semibold text-md-primary block">
                  دمج كامل: بوابة الأمان المالي Gate 0 + الـ 7 طبقات الفنية + رادار السوق الموحد بدون أي تعارض
                </span>
              </div>
            </div>
            <p className="text-xs text-md-on-surface-variant max-w-3xl leading-relaxed font-medium">
              محرك تحليلي موحد يدمج التحليل المالي والأساسي مع الـ 7 طبقات الفنية والشارت المباشر ومؤشر السيولة MCDX لتقديم قرار واحد متماسك وخطة تنفيذ صريحة بدون تضارب في النتائج.
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="bg-md-surface text-md-on-surface rounded-[16px] px-3.5 py-2 text-center min-w-[95px] shadow-sm border border-md-outline-variant/40">
              <div className="text-[10px] text-md-on-surface-variant font-semibold mb-0.5">أسهم الرادار</div>
              <div className="text-lg font-mono font-extrabold text-md-primary">{stocks.length || 294}</div>
            </div>
            <div className="bg-md-surface text-md-on-surface rounded-[16px] px-3.5 py-2 text-center min-w-[95px] shadow-sm border border-md-outline-variant/40">
              <div className="text-[10px] text-md-on-surface-variant font-semibold mb-0.5">مراكز المحفظة</div>
              <div className="text-lg font-mono font-extrabold text-md-tertiary">{portfolio.length}</div>
            </div>
            <div className="bg-md-surface text-md-on-surface rounded-[16px] px-3.5 py-2 text-center min-w-[95px] shadow-sm border border-md-outline-variant/40">
              <div className="text-[10px] text-md-on-surface-variant font-semibold mb-0.5">تطابق القرار</div>
              <div className="text-lg font-mono font-extrabold text-emerald-500">100% موحد 🎯</div>
            </div>
          </div>
        </div>
      </div>

      {/* Sub-tab Navigation (Unified 2-Tab M3 Segmented Control) */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 bg-md-surface-container p-1.5 rounded-md-full border border-md-outline-variant/60 shadow-sm text-xs overflow-x-auto scrollbar-none">
          {/* Unified Sub-tab 1: المعمل العملي ورادار التوصيات الموحد */}
          <button
            onClick={() => setActiveSubTab('lab')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md-full font-bold transition-all duration-200 select-none whitespace-nowrap ${
              activeSubTab === 'lab'
                ? 'bg-md-primary text-md-on-primary shadow-sm'
                : 'text-md-on-surface-variant hover:text-md-on-surface hover:bg-md-surface-container-high'
            }`}
          >
            <FlaskConical size={15} className={activeSubTab === 'lab' ? 'text-md-on-primary' : 'text-amber-500'} />
            <span>🔬 المعمل العملي ورادار التوصيات الموحد (شارت حي + 7 طبقات + ماليات)</span>
          </button>

          {/* Sub-tab 2: جدول مسح السوق الشامل */}
          <button
            onClick={() => setActiveSubTab('radar_table')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md-full font-bold transition-all duration-200 select-none whitespace-nowrap ${
              activeSubTab === 'radar_table'
                ? 'bg-md-primary text-md-on-primary shadow-sm'
                : 'text-md-on-surface-variant hover:text-md-on-surface hover:bg-md-surface-container-high'
            }`}
          >
            <BarChart3 size={15} className={activeSubTab === 'radar_table' ? 'text-md-on-primary' : 'text-md-primary'} />
            <span>📊 جدول مسح السوق الكامل ({stocks.length || 294} سهماً)</span>
          </button>
        </div>

        {/* Secondary View Toggle inside Lab Mode */}
        {activeSubTab === 'lab' && (
          <button
            onClick={() => setShowCardsView(prev => !prev)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-md-outline-variant/80 hover:bg-md-surface-container text-xs font-bold text-md-primary transition-all shadow-xs self-end sm:self-auto"
          >
            {showCardsView ? (
              <>
                <FlaskConical size={14} className="text-amber-500" />
                <span>العودة لشارت المعمل والطبقات السبع 🔬</span>
              </>
            ) : (
              <>
                <Sparkles size={14} />
                <span>عرض كروت التوصيات السريعة ({stocks.length || 294}) 📋</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* Sub-tab Content: Unified Lab / Cards */}
      {activeSubTab === 'lab' && (
        showCardsView ? (
          <div className="space-y-4">
            <div className="bg-md-primary-container/40 border border-md-primary/20 rounded-2xl p-3 flex items-center justify-between text-xs text-md-on-surface">
              <span className="font-semibold flex items-center gap-1.5">
                <Sparkles size={14} className="text-md-primary" />
                <span>أنت تتصفح الآن كروت التوصيات السريعة الموحدة مع الـ 7 طبقات وبوابة Gate 0. اضغط "فحص بالمعمل" لأي سهم للانتقال الفوري للشارت.</span>
              </span>
              <button 
                onClick={() => setShowCardsView(false)}
                className="font-bold text-md-primary hover:underline whitespace-nowrap"
              >
                العودة للشارت ↶
              </button>
            </div>

            <RecommendationsView
              stocks={stocks}
              portfolio={portfolio}
              lastUpdated={lastUpdated}
              onRefresh={onRefresh}
              isLoading={isLoading}
              onSelectStock={onSelectStock}
              onAddToPortfolio={onAddToPortfolio || (() => {})}
              onOpenLabWithStock={handleOpenLab}
            />
          </div>
        ) : (
          <InteractiveStockLab
            stocks={stocks}
            theme={theme}
            initialSymbol={labSymbol}
            onSelectStockForChart={onSelectStock}
            onNavigateToRecommendations={() => setShowCardsView(true)}
          />
        )
      )}

      {/* Sub-tab Content: Full Radar Table */}
      {activeSubTab === 'radar_table' && (
        <TechnicalRadarView
          stocks={stocks}
          portfolio={portfolio}
          onSelectStock={onSelectStock}
          onOpenLabWithStock={handleOpenLab}
          isLoading={isLoading}
          lastUpdated={lastUpdated}
          onRefresh={onRefresh}
        />
      )}
    </div>
  );
};
