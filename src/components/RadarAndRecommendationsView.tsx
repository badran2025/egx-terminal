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
  macroRiskModifier?: number;
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
  initialLabSymbol,
  macroRiskModifier = 0
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

      {/* Sleek Compact Header Bar & SubTab Switcher (No Clutter, Direct Action) */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-md-surface-container-low border border-md-outline-variant/60 rounded-[20px] p-2.5 sm:p-3 shadow-xs">
        {/* SubTab Navigation Switcher */}
        <div className="flex items-center gap-1.5 bg-md-surface p-1 rounded-full border border-md-outline-variant/50 shadow-xs text-xs">
          {/* Sub-tab 1: المعمل والشارت المباشر */}
          <button
            onClick={() => setActiveSubTab('lab')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full font-bold transition-all duration-200 select-none whitespace-nowrap ${
              activeSubTab === 'lab'
                ? 'bg-md-primary text-md-on-primary shadow-xs ring-1 ring-md-primary/30'
                : 'text-md-on-surface-variant hover:text-md-on-surface hover:bg-md-surface-container-high'
            }`}
          >
            <FlaskConical size={14} className={activeSubTab === 'lab' ? 'text-md-on-primary' : 'text-amber-500'} />
            <span>🔬 شارت المعمل والطبقات السبع (BADRAN)</span>
          </button>

          {/* Sub-tab 2: توصيات وخطة الجلسة القادمة */}
          <button
            onClick={() => setActiveSubTab('radar_table')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full font-bold transition-all duration-200 select-none whitespace-nowrap ${
              activeSubTab === 'radar_table'
                ? 'bg-emerald-600 text-white shadow-xs ring-1 ring-emerald-600/30'
                : 'text-md-on-surface-variant hover:text-md-on-surface hover:bg-md-surface-container-high'
            }`}
          >
            <BarChart3 size={14} className={activeSubTab === 'radar_table' ? 'text-white' : 'text-emerald-500'} />
            <span>📋 توصيات وخطة الجلسة القادمة (تجهيز السوق)</span>
          </button>
        </div>

        {/* Quick Compact Badge */}
        <div className="flex items-center gap-2 text-xs self-end sm:self-center">
          <span className="text-[11px] text-md-on-surface-variant font-medium bg-md-surface px-2.5 py-1 rounded-full border border-md-outline-variant/40">
            فحص مالي استبعادي Gate 0 + الـ 7 طبقات الفنية 🎯
          </span>
        </div>
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
          macroRiskModifier={macroRiskModifier}
        />
      )}
    </div>
  );
};
