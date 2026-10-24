import React, { useState } from 'react';
import { 
  Sparkles, BarChart3, FlaskConical, Target, Layers, LayoutGrid
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
  initialSubTab?: 'lab' | 'cards' | 'radar_table';
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
  const [activeSubTab, setActiveSubTab] = useState<'lab' | 'cards' | 'radar_table'>(
    initialSubTab === 'radar_table' ? 'radar_table' : (initialSubTab === 'cards' ? 'cards' : 'lab')
  );
  const [labSymbol, setLabSymbol] = useState<string>(initialLabSymbol || 'COMI');

  // Sync if initialLabSymbol changes from parent
  React.useEffect(() => {
    if (initialLabSymbol) {
      setLabSymbol(initialLabSymbol);
      setActiveSubTab('lab');
    }
  }, [initialLabSymbol]);

  const handleOpenLab = (symbol: string) => {
    setLabSymbol(symbol);
    setActiveSubTab('lab');
    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  return (
    <div className="space-y-5 animate-fadeIn text-md-on-surface" dir="rtl">
      {/* Date of Last Update Banner */}
      <LastUpdatedBanner
        lastUpdated={lastUpdated}
        onRefresh={onRefresh}
        isLoading={isLoading}
        tabTitle="المعمل العملي ورادار التوصيات الموحد (EGX Confluence Lab & Radar)"
      />

      {/* Sleek, Clean M3 Overview Bar */}
      <div className="bg-gradient-to-r from-md-primary/15 via-md-primary-container/30 to-md-secondary-container/20 border border-md-outline-variant/60 rounded-[22px] p-4 sm:p-4.5 shadow-sm">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="w-9 h-9 rounded-xl bg-md-primary text-md-on-primary flex items-center justify-center shadow-xs">
              <Target size={20} />
            </span>
            <div>
              <h2 className="text-lg sm:text-xl font-extrabold tracking-tight text-md-on-surface flex items-center gap-2">
                <span>قمرة التحليل الفني والقرار الميداني الموحد</span>
                <span className="text-[10px] font-bold bg-md-secondary-container text-md-on-secondary-container px-2 py-0.5 rounded-full">
                  BADRAN ENGINE
                </span>
              </h2>
              <p className="text-xs text-md-on-surface-variant font-medium mt-0.5 max-w-2xl">
                محرك تحليلي موحد يربط بوابة الأمان المالي Gate 0 بالـ 7 طبقات الفنية والشارت المباشر ومؤشر السيولة MCDX لتقديم قرار واحد متماسك بدون أي تضارب.
              </p>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-2 flex-wrap self-end md:self-center">
            <div className="bg-md-surface text-md-on-surface rounded-xl px-3 py-1.5 text-center min-w-[85px] shadow-xs border border-md-outline-variant/40">
              <div className="text-[9px] text-md-on-surface-variant font-semibold">أسهم السوق</div>
              <div className="text-base font-mono font-extrabold text-md-primary">{stocks.length || 294}</div>
            </div>
            <div className="bg-md-surface text-md-on-surface rounded-xl px-3 py-1.5 text-center min-w-[85px] shadow-xs border border-md-outline-variant/40">
              <div className="text-[9px] text-md-on-surface-variant font-semibold">المحفظة</div>
              <div className="text-base font-mono font-extrabold text-md-tertiary">{portfolio.length}</div>
            </div>
            <div className="bg-md-surface text-md-on-surface rounded-xl px-3 py-1.5 text-center min-w-[95px] shadow-xs border border-md-outline-variant/40">
              <div className="text-[9px] text-md-on-surface-variant font-semibold">تطابق القرار</div>
              <div className="text-xs font-mono font-extrabold text-emerald-600 dark:text-emerald-400">100% موحد 🎯</div>
            </div>
          </div>
        </div>
      </div>

      {/* Clear 3-SubTab Segmented Navigation (No hidden toggles!) */}
      <div className="flex items-center gap-2 bg-md-surface-container p-1.5 rounded-full border border-md-outline-variant/60 shadow-sm text-xs overflow-x-auto scrollbar-none">
        {/* Sub-tab 1: المعمل العملي والشارت المباشر */}
        <button
          onClick={() => setActiveSubTab('lab')}
          className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold transition-all duration-200 select-none whitespace-nowrap ${
            activeSubTab === 'lab'
              ? 'bg-md-primary text-md-on-primary shadow-sm ring-1 ring-md-primary/30'
              : 'text-md-on-surface-variant hover:text-md-on-surface hover:bg-md-surface-container-high'
          }`}
        >
          <FlaskConical size={15} className={activeSubTab === 'lab' ? 'text-md-on-primary' : 'text-amber-500'} />
          <span>🔬 شارت المعمل والطبقات السبع (BADRAN)</span>
        </button>

        {/* Sub-tab 2: كروت التوصيات والقرار الميداني */}
        <button
          onClick={() => setActiveSubTab('cards')}
          className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold transition-all duration-200 select-none whitespace-nowrap ${
            activeSubTab === 'cards'
              ? 'bg-md-primary text-md-on-primary shadow-sm ring-1 ring-md-primary/30'
              : 'text-md-on-surface-variant hover:text-md-on-surface hover:bg-md-surface-container-high'
          }`}
        >
          <LayoutGrid size={15} className={activeSubTab === 'cards' ? 'text-md-on-primary' : 'text-md-primary'} />
          <span>📋 كروت التوصيات والقرار الميداني ({stocks.length || 294} سهم)</span>
        </button>

        {/* Sub-tab 3: جدول مسح السوق الشامل */}
        <button
          onClick={() => setActiveSubTab('radar_table')}
          className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold transition-all duration-200 select-none whitespace-nowrap ${
            activeSubTab === 'radar_table'
              ? 'bg-md-primary text-md-on-primary shadow-sm ring-1 ring-md-primary/30'
              : 'text-md-on-surface-variant hover:text-md-on-surface hover:bg-md-surface-container-high'
          }`}
        >
          <BarChart3 size={15} className={activeSubTab === 'radar_table' ? 'text-md-on-primary' : 'text-emerald-500'} />
          <span>📊 جدول مسح السوق الكامل (سيولة وأحجام)</span>
        </button>
      </div>

      {/* Sub-tab 1 Content: Interactive Lab & Chart */}
      {activeSubTab === 'lab' && (
        <InteractiveStockLab
          stocks={stocks}
          theme={theme}
          initialSymbol={labSymbol}
          onSelectStockForChart={onSelectStock}
          onNavigateToRecommendations={() => setActiveSubTab('cards')}
        />
      )}

      {/* Sub-tab 2 Content: Smart Recommendation Cards */}
      {activeSubTab === 'cards' && (
        <div className="space-y-4">
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
      )}

      {/* Sub-tab 3 Content: Full Radar Table */}
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
