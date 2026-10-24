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
  initialSubTab = 'recommendations',
  initialLabSymbol
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'recommendations' | 'radar_table' | 'lab'>(initialSubTab);
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
    <div className="space-y-6 animate-fadeIn text-md-on-surface" dir="rtl">
      {/* Date of Last Update Banner */}
      <LastUpdatedBanner
        lastUpdated={lastUpdated}
        onRefresh={onRefresh}
        isLoading={isLoading}
        tabTitle="الرادار الفني والتوصيات (EGX Radar & Recommendations)"
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
                  الرادار الفني والتوصيات الذكية
                </h2>
                <span className="text-xs font-semibold text-md-primary block">
                  تشخيص المحفظة اللحظي • رادار الـ 294 سهماً • المعمل العملي المباشر على الشارت
                </span>
              </div>
            </div>
            <p className="text-xs text-md-on-surface-variant max-w-3xl leading-relaxed font-medium">
              محرك تحليلي متكامل يدمج إشارات الشراء ووقف الخسارة اليومية مع جدول المؤشرات الفنية المتقدمة والمعمل التفاعلي لفحص أي سهم عبر الشارت المباشر ونظام الـ 7 طبقات.
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
              <div className="text-[10px] text-md-on-surface-variant font-semibold mb-0.5">المعمل العملي</div>
              <div className="text-lg font-mono font-extrabold text-amber-500">حي 🔬</div>
            </div>
          </div>
        </div>
      </div>

      {/* Sub-tab Navigation (Segmented M3 Control) */}
      <div className="flex items-center justify-center sm:justify-start">
        <div className="flex items-center gap-1.5 bg-md-surface-container p-1.5 rounded-md-full border border-md-outline-variant/60 shadow-sm text-xs overflow-x-auto scrollbar-none">
          {/* Sub-tab 1: التوصيات والتشخيص اليومي */}
          <button
            onClick={() => setActiveSubTab('recommendations')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md-full font-bold transition-all duration-200 select-none whitespace-nowrap ${
              activeSubTab === 'recommendations'
                ? 'bg-md-primary text-md-on-primary shadow-sm'
                : 'text-md-on-surface-variant hover:text-md-on-surface hover:bg-md-surface-container-high'
            }`}
          >
            <Sparkles size={15} className={activeSubTab === 'recommendations' ? 'text-md-on-primary' : 'text-md-primary'} />
            <span>🎯 التوصيات والتشخيص اليومي ({stocks.length || 294})</span>
          </button>

          {/* Sub-tab 2: جدول الرادار الفني */}
          <button
            onClick={() => setActiveSubTab('radar_table')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md-full font-bold transition-all duration-200 select-none whitespace-nowrap ${
              activeSubTab === 'radar_table'
                ? 'bg-md-primary text-md-on-primary shadow-sm'
                : 'text-md-on-surface-variant hover:text-md-on-surface hover:bg-md-surface-container-high'
            }`}
          >
            <BarChart3 size={15} className={activeSubTab === 'radar_table' ? 'text-md-on-primary' : 'text-md-primary'} />
            <span>📊 جدول الرادار الفني (EGX Radar)</span>
          </button>

          {/* Sub-tab 3: المعمل العملي التفاعلي */}
          <button
            onClick={() => setActiveSubTab('lab')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md-full font-bold transition-all duration-200 select-none whitespace-nowrap ${
              activeSubTab === 'lab'
                ? 'bg-md-primary text-md-on-primary shadow-sm'
                : 'text-md-on-surface-variant hover:text-md-on-surface hover:bg-md-surface-container-high'
            }`}
          >
            <FlaskConical size={15} className={activeSubTab === 'lab' ? 'text-md-on-primary' : 'text-amber-500'} />
            <span>🔬 المعمل العملي: فحص سهم بالشارت المباشر والـ 7 طبقات</span>
          </button>
        </div>
      </div>

      {/* Sub-tab Content */}
      {activeSubTab === 'recommendations' && (
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
      )}

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

      {activeSubTab === 'lab' && (
        <InteractiveStockLab
          stocks={stocks}
          theme={theme}
          initialSymbol={labSymbol}
          onSelectStockForChart={onSelectStock}
          onNavigateToRecommendations={() => setActiveSubTab('recommendations')}
        />
      )}
    </div>
  );
};
