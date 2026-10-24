import React, { useState } from 'react';
import { 
  BarChart3, FlaskConical, Target, Layers
} from 'lucide-react';
import { StockData, PortfolioPosition } from '../types';
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
  initialSubTab?: 'lab' | 'radar_table';
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
    <div className="space-y-4 animate-fadeIn text-md-on-surface" dir="rtl">
      {/* Date of Last Update Banner */}
      <LastUpdatedBanner
        lastUpdated={lastUpdated}
        onRefresh={onRefresh}
        isLoading={isLoading}
        tabTitle="المعمل المباشر ورادار السوق الكامل (EGX BADRAN Lab & Market Radar)"
      />

      {/* Sleek 3D Overview Bar */}
      <div className="bg-gradient-to-r from-md-primary/15 via-md-primary-container/30 to-md-secondary-container/20 border border-md-outline-variant/60 rounded-[22px] p-3.5 sm:p-4 shadow-md-1 backdrop-blur-md relative overflow-hidden group hover:shadow-lg transition-all">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 relative z-10">
          <div className="flex items-center gap-3">
            <span className="w-9 h-9 rounded-xl bg-md-primary text-md-on-primary flex items-center justify-center shadow-xs shrink-0 group-hover:scale-105 transition-transform">
              <FlaskConical size={19} />
            </span>
            <div>
              <h2 className="text-base sm:text-lg font-extrabold tracking-tight text-md-on-surface flex items-center gap-2">
                <span>قمرة المعمل والتحليل الفني لقالب BADRAN</span>
                <span className="text-[10px] font-bold bg-md-secondary-container text-md-on-secondary-container px-2 py-0.5 rounded-full border border-md-secondary/20">
                  Gate 0 + 7 طبقات
                </span>
              </h2>
              <p className="text-[11px] text-md-on-surface-variant font-medium mt-0.5">
                فحص مالي استبعادي Gate 0 + الـ 7 طبقات الفنية لقالب BADRAN المعتمد بشارت ثاندر لتحديد نقطة الدخول والهدف ووقف الخسارة.
              </p>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-2 flex-wrap self-end md:self-center text-xs">
            <div className="bg-md-surface/90 rounded-xl px-3 py-1 text-center min-w-[75px] shadow-xs border border-md-outline-variant/40">
              <div className="text-[9px] text-md-on-surface-variant font-semibold">أسهم السوق</div>
              <div className="text-sm font-mono font-extrabold text-md-primary">{stocks.length || 294}</div>
            </div>
            <div className="bg-md-surface/90 rounded-xl px-3 py-1 text-center min-w-[75px] shadow-xs border border-md-outline-variant/40">
              <div className="text-[9px] text-md-on-surface-variant font-semibold">المحفظة</div>
              <div className="text-sm font-mono font-extrabold text-md-tertiary">{portfolio.length}</div>
            </div>
            <div className="bg-md-surface/90 rounded-xl px-3 py-1 text-center min-w-[90px] shadow-xs border border-md-outline-variant/40">
              <div className="text-[9px] text-md-on-surface-variant font-semibold">تطابق القرار</div>
              <div className="text-[11px] font-mono font-extrabold text-emerald-600 dark:text-emerald-400">100% موحد 🎯</div>
            </div>
          </div>
        </div>
      </div>

      {/* 2-SubTab Segmented Navigation (Lab vs Full Table - Clean & Direct) */}
      <div className="flex items-center gap-2 bg-md-surface-container p-1 rounded-full border border-md-outline-variant/60 shadow-sm text-xs w-fit">
        {/* Sub-tab 1: المعمل والشارت المباشر */}
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

        {/* Sub-tab 2: جدول مسح السوق الشامل */}
        <button
          onClick={() => setActiveSubTab('radar_table')}
          className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold transition-all duration-200 select-none whitespace-nowrap ${
            activeSubTab === 'radar_table'
              ? 'bg-md-primary text-md-on-primary shadow-sm ring-1 ring-md-primary/30'
              : 'text-md-on-surface-variant hover:text-md-on-surface hover:bg-md-surface-container-high'
          }`}
        >
          <BarChart3 size={15} className={activeSubTab === 'radar_table' ? 'text-md-on-primary' : 'text-emerald-500'} />
          <span>📊 جدول مسح السوق الكامل ({stocks.length || 294} سهماً)</span>
        </button>
      </div>

      {/* Sub-tab 1 Content: Interactive Lab & Chart */}
      {activeSubTab === 'lab' && (
        <InteractiveStockLab
          stocks={stocks}
          theme={theme}
          initialSymbol={labSymbol}
          onSelectStockForChart={onSelectStock}
        />
      )}

      {/* Sub-tab 2 Content: Full Radar Table */}
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
