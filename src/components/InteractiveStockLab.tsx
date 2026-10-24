import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  CheckCircle2, AlertTriangle, ArrowRight, ArrowLeft, 
  HelpCircle, Sparkles, ShieldCheck, Compass, Eye,
  Building, Gauge, Car, Zap, Layers, BarChart2, TrendingUp, TrendingDown, Play,
  Search, Maximize2, Minimize2, BookOpen, ExternalLink, Info, Check, X, ShieldAlert,
  Flame, Filter, Smartphone
} from 'lucide-react';
import { StockData } from '../types';
import { GROWTHX_SIMULATOR_CASES, StockSimulationCase, SimulatorLayerStep, resolve7LayerAnalysis } from '../services/growthxSimulatorData';
import { EGX_ARABIC_NAMES, StockMeta } from '../services/egxArabicNames';
import { getFallbackStocks, formatPrice } from '../services/egxService';
import { THNDR_SEVEN_LAYERS_MAPPING } from '../services/thndrIndicatorsData';
import { TradingViewWidget } from './TradingViewWidget';
import { McdxHeatmapVisualizer } from './McdxHeatmapVisualizer';

interface Props {
  stocks?: StockData[];
  theme?: 'dark' | 'light';
  initialSymbol?: string;
  onSelectStockForChart?: (symbol: string) => void;
  onNavigateToRecommendations?: () => void;
}

export const InteractiveStockLab: React.FC<Props> = ({ 
  stocks = [],
  theme = 'dark',
  initialSymbol = 'COMI',
  onSelectStockForChart,
  onNavigateToRecommendations
}) => {
  const [selectedSymbol, setSelectedSymbol] = useState<string>(initialSymbol || 'COMI');
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0); // 0 to 6 (layers), 7 (verdict)
  const [chartHeight, setChartHeight] = useState<'normal' | 'tall'>('normal'); // 760px vs 880px
  const [chartViewMode, setChartViewMode] = useState<'split' | 'chart' | 'mcdx'>('split'); // View mode switcher for chart area
  
  // Stock Search state
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Sync if initialSymbol prop changes from parent (e.g. clicked from recommendations)
  useEffect(() => {
    if (initialSymbol && initialSymbol.toUpperCase() !== selectedSymbol.toUpperCase()) {
      setSelectedSymbol(initialSymbol.toUpperCase());
      setActiveStepIndex(0);
    }
  }, [initialSymbol]);

  // Close search dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 1. Build authoritative unified catalog for ALL EGX stocks (294+ stocks)
  const allAvailableStocks = useMemo(() => {
    const catalog = new Map<string, {
      symbol: string;
      nameAr: string;
      nameEn: string;
      sector?: string;
      price?: number;
      changePercent?: number;
      isEGX30?: boolean;
      isEGX70?: boolean;
      isEGX100?: boolean;
    }>();

    // Add all stocks from live/scanner market data (294 EGX stocks)
    if (stocks && stocks.length > 0) {
      stocks.forEach(s => {
        const sym = s.symbol.toUpperCase();
        catalog.set(sym, {
          symbol: sym,
          nameAr: s.nameAr || sym,
          nameEn: s.nameEn || sym,
          sector: s.sector || 'بورصة مصر',
          price: s.close,
          changePercent: s.changePercent,
          isEGX30: s.isEGX30,
          isEGX70: s.isEGX70,
          isEGX100: s.isEGX100
        });
      });
    }

    // Add from fallback stocks list
    getFallbackStocks().forEach(s => {
      const sym = s.symbol.toUpperCase();
      if (!catalog.has(sym)) {
        catalog.set(sym, {
          symbol: sym,
          nameAr: s.nameAr,
          nameEn: s.nameEn,
          sector: s.sector || 'بورصة مصر',
          price: s.close,
          changePercent: s.changePercent,
          isEGX30: s.isEGX30,
          isEGX70: s.isEGX70,
          isEGX100: s.isEGX100
        });
      }
    });

    // Add / Enrich from EGX_ARABIC_NAMES dictionary
    Object.entries(EGX_ARABIC_NAMES).forEach(([sym, meta]) => {
      const upperSym = sym.toUpperCase();
      const existing = catalog.get(upperSym);
      if (existing) {
        if ((existing.nameAr === existing.symbol || !existing.nameAr) && meta.nameAr) {
          existing.nameAr = meta.nameAr;
        }
        if (meta.sector && !existing.sector) existing.sector = meta.sector;
        if (meta.isEGX30) existing.isEGX30 = true;
        if (meta.isEGX70) existing.isEGX70 = true;
        if (meta.isEGX100) existing.isEGX100 = true;
      } else {
        catalog.set(upperSym, {
          symbol: upperSym,
          nameAr: meta.nameAr,
          nameEn: meta.nameEn,
          sector: meta.sector || 'بورصة مصر',
          isEGX30: meta.isEGX30,
          isEGX70: meta.isEGX70,
          isEGX100: meta.isEGX100
        });
      }
    });

    return Array.from(catalog.values());
  }, [stocks]);

  // 2. High-performance Arabic & English fuzzy search matching across all stocks
  const searchResults = useMemo(() => {
    if (!searchTerm.trim()) return [];
    const q = searchTerm.toLowerCase().trim();

    // Arabic normalization (أ, إ, آ -> ا | ة -> ه | ى -> ي)
    const normalizeAr = (s: string) => 
      s.toLowerCase()
       .replace(/[أإآ]/g, 'ا')
       .replace(/ة/g, 'ه')
       .replace(/ى/g, 'ي')
       .trim();

    const qNorm = normalizeAr(q);

    return allAvailableStocks
      .filter(item => {
        const symMatch = item.symbol.toLowerCase().includes(q);
        const nameArNorm = normalizeAr(item.nameAr);
        const nameEnMatch = item.nameEn.toLowerCase().includes(q);
        return symMatch || nameArNorm.includes(qNorm) || nameEnMatch;
      })
      .slice(0, 15);
  }, [searchTerm, allAvailableStocks]);

  // Top daily hot recommendations from market data
  const hotRecommendations = useMemo(() => {
    if (!stocks || stocks.length === 0) {
      return ['COMI', 'SWDY', 'TMGH', 'FWRY', 'SKPC', 'ESRS', 'CCAP', 'BTFH'];
    }
    // Pick top stocks with strong buy or swing buy and positive momentum
    const topPicks = stocks
      .filter(s => s.recommendationScore >= 0.15 || s.changePercent > 0.5)
      .slice(0, 8)
      .map(s => s.symbol.toUpperCase());
    
    return topPicks.length > 0 ? topPicks : ['COMI', 'SWDY', 'TMGH', 'FWRY', 'SKPC', 'ESRS'];
  }, [stocks]);

  // 3. Resolve simulation case for any chosen stock using unified 7-layer engine
  const currentCase: StockSimulationCase = useMemo(() => {
    const liveStock = stocks.find(s => s.symbol.toUpperCase() === selectedSymbol.toUpperCase());
    return resolve7LayerAnalysis(selectedSymbol, liveStock);
  }, [selectedSymbol, stocks]);

  const currentLayer: SimulatorLayerStep | undefined = currentCase.layers[activeStepIndex];
  const isVerdictStep = activeStepIndex === 7;

  // Handle stock selection
  const handleSelectStock = (sym: string) => {
    const cleanSym = sym.trim().toUpperCase();
    setSelectedSymbol(cleanSym);
    setActiveStepIndex(0); // reset to step 1
    setIsSearchOpen(false);
    setSearchTerm('');
    if (onSelectStockForChart) {
      onSelectStockForChart(cleanSym);
    }
  };

  // Keyboard navigation for search input (Enter key selects stock)
  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (searchResults.length > 0) {
        handleSelectStock(searchResults[0].symbol);
      } else if (searchTerm.trim()) {
        handleSelectStock(searchTerm.trim().toUpperCase());
      }
    }
  };

  // Get active TradingView studies based on current step
  const activeStudies = isVerdictStep 
    ? ['MASimple@tv-basicstudies', 'MAExp@tv-basicstudies', 'RSI@tv-basicstudies']
    : currentLayer?.tvStudies || ['MASimple@tv-basicstudies'];

  const containerHeightClass = chartHeight === 'tall' ? 'h-[880px]' : 'h-[760px]';

  return (
    <div className="space-y-6 text-md-on-surface w-full max-w-[1920px] mx-auto" dir="rtl">
      
      {/* 1. Header Banner: كلام صحاب بالبلدي */}
      <div className="bg-gradient-to-r from-md-primary/10 via-md-primary-container/40 to-md-secondary-container/30 border border-md-primary/30 rounded-[28px] p-6 shadow-sm relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md-full bg-md-primary text-md-on-primary text-xs font-bold shadow-sm">
                <Sparkles size={14} />
                <span>المحاكي العملي المباشر • فحص أي سهم بالـ 7 طبقات</span>
              </div>

              {onNavigateToRecommendations && (
                <button
                  onClick={onNavigateToRecommendations}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md-full bg-md-surface hover:bg-md-surface-container-high border border-md-outline-variant/60 text-xs font-bold text-md-primary transition-all shadow-sm"
                >
                  <span>🎯 الذهاب لرادار التوصيات اليومية (294 سهم)</span>
                  <ArrowLeft size={12} />
                </button>
              )}
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-md-on-surface">
              إزاي بنقرر نشتري السهم ولا لأ خطوة بخطوة على الشارت؟
            </h2>
            <p className="text-sm text-md-on-surface-variant font-medium max-w-3xl leading-relaxed">
              هنا مش بنقولك كلام نظري؛ الشارت الحي مفتوح قدامك على الشمال، وبنشغل المؤشرات طبقة ورا طبقة، ونحلل بالأرقام هل السهم اجتاز الخطوة ولا فشل، ونطلع بنقاط الدخول والوقف الصريحة!
            </p>
          </div>

          {/* Quick concept pill */}
          <div className="bg-md-surface/90 backdrop-blur-sm border border-md-outline-variant/60 rounded-[20px] p-4 text-center min-w-[220px] shadow-sm">
            <span className="text-[11px] text-md-primary font-bold block mb-1">فلسفة التداول الذكي</span>
            <div className="text-xs font-extrabold text-md-on-surface">
              المؤشرات "تأكيد" وليست "قراراً"
            </div>
            <div className="text-[10px] text-md-on-surface-variant mt-1">
              4 مرايات + 3 طبقات = قرار مؤسسي صارم
            </div>
          </div>
        </div>
      </div>

      {/* 2. Unified Universal Stock Search & Benchmark Chips Bar (يدعم كافة أسهم البورصة المصرية بالكامل) */}
      <div className="bg-md-surface-container-low border border-md-outline-variant/50 rounded-[24px] p-4 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Live Search Input with Full 294-Stock Autocomplete Dropdown */}
          <div className="relative flex-1 max-w-lg" ref={searchContainerRef}>
            <div className="flex items-center justify-between mb-1 px-1">
              <span className="text-[11px] font-bold text-md-primary flex items-center gap-1">
                <span>ابحث عن أي سهم بالرمز أو الاسم:</span>
              </span>
              <span className="text-[10px] text-md-on-surface-variant font-mono bg-md-surface px-2 py-0.5 rounded-full border border-md-outline-variant/40">
                ✨ يدعم {allAvailableStocks.length} سهماً بالبورصة المصرية
              </span>
            </div>

            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setIsSearchOpen(true);
                }}
                onFocus={() => setIsSearchOpen(true)}
                onKeyDown={handleSearchKeyDown}
                placeholder="🔍 اكتب رمز السهم أو اسمه بالعربي (مثال: CCAP, بلتون, طلعت مصطفى, فوري, حديد عز)..."
                className="w-full bg-md-surface border border-md-outline rounded-md-full px-4 py-2.5 text-xs font-bold text-md-on-surface placeholder:text-md-on-surface-variant/60 focus:outline-none focus:border-md-primary focus:ring-2 focus:ring-md-primary/20 transition-all pr-10"
              />
              <Search size={16} className="absolute right-3.5 top-3 text-md-on-surface-variant" />
            </div>

            {/* Dropdown Results */}
            {isSearchOpen && (
              <div className="absolute z-50 mt-1.5 w-full bg-md-surface-container-high border border-md-outline-variant rounded-[20px] shadow-lg overflow-hidden max-h-72 overflow-y-auto">
                {/* Fallback direct action for any typed ticker */}
                {searchTerm.trim() && (
                  <button
                    onClick={() => handleSelectStock(searchTerm.trim().toUpperCase())}
                    className="w-full px-4 py-2.5 text-right bg-md-primary/10 hover:bg-md-primary/20 text-xs font-bold text-md-primary flex items-center justify-between border-b border-md-outline-variant/40"
                  >
                    <div className="flex items-center gap-2">
                      <Sparkles size={14} />
                      <span>فحص وتحليل السهم المكتوب: "{searchTerm.trim().toUpperCase()}" على الشارت</span>
                    </div>
                    <span className="text-[10px] bg-md-primary text-md-on-primary px-2 py-0.5 rounded-full font-mono">
                      اضغط Enter ↵
                    </span>
                  </button>
                )}

                {searchResults.length > 0 ? (
                  searchResults.map((item) => (
                    <button
                      key={item.symbol}
                      onClick={() => handleSelectStock(item.symbol)}
                      className="w-full px-4 py-2.5 text-right flex items-center justify-between hover:bg-md-primary/10 transition-colors border-b border-md-outline-variant/30 last:border-none text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-extrabold text-md-primary bg-md-surface px-2 py-0.5 rounded-full border border-md-outline-variant/40">
                          {item.symbol}
                        </span>
                        <div>
                          <span className="font-bold text-md-on-surface block">{item.nameAr}</span>
                          <span className="text-[10px] text-md-on-surface-variant">{item.sector || 'بورصة مصر'}</span>
                        </div>
                      </div>

                      <div className="text-left font-mono">
                        {item.price && item.price > 0 && (
                          <span className="font-bold text-md-on-surface text-xs block">
                            {formatPrice(item.price)} ج.م
                          </span>
                        )}
                        {item.changePercent !== undefined && (
                          <span className={`text-[10px] font-bold ${item.changePercent >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600'}`}>
                            {item.changePercent >= 0 ? '+' : ''}{item.changePercent.toFixed(2)}%
                          </span>
                        )}
                      </div>
                    </button>
                  ))
                ) : (
                  !searchTerm.trim() && (
                    <div className="p-3 text-center text-xs text-md-on-surface-variant">
                      اكتب رمز أو اسم أي سهم بالبورصة المصرية لاختياره
                    </div>
                  )
                )}
              </div>
            )}
          </div>

          {/* Quick Active Hot Recommendations Bar */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none text-xs">
            <span className="text-[11px] text-md-on-surface-variant font-bold shrink-0 ml-1 flex items-center gap-1">
              <Flame size={14} className="text-rose-500" />
              <span>فرص نشطة اليوم:</span>
            </span>
            {hotRecommendations.map((sym) => {
              const meta = EGX_ARABIC_NAMES[sym];
              const isSelected = selectedSymbol === sym;
              return (
                <button
                  key={sym}
                  onClick={() => handleSelectStock(sym)}
                  className={`px-3 py-1.5 rounded-md-full text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-md-primary text-md-on-primary shadow-sm ring-2 ring-md-primary/30'
                      : 'bg-md-surface text-md-on-surface border border-md-outline-variant/50 hover:bg-md-surface-container-high'
                  }`}
                >
                  <span>{meta?.nameAr.split(' ')[0] || sym}</span>
                  <span className="font-mono text-[10px] opacity-80">({sym})</span>
                </button>
              );
            })}
          </div>

        </div>

        {/* Stock Intro Banner */}
        <div className="pt-2 border-t border-md-outline-variant/30 flex items-start gap-2 text-xs text-md-on-surface-variant">
          <span className="text-base shrink-0">💬</span>
          <p className="leading-relaxed font-medium">
            {currentCase.storyIntro}
          </p>
        </div>
      </div>

      {/* 3. Seven Layers Stepper Navigation (الشريط التفاعلي للخطوات 1 إلى 7 + التوصية) */}
      <div className="bg-md-surface-container-low border border-md-outline-variant/60 rounded-[24px] p-3 shadow-sm">
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1 text-xs">
          {currentCase.layers.map((layer, idx) => {
            const isCurrent = activeStepIndex === idx;
            const isCompleted = activeStepIndex > idx;
            return (
              <button
                key={layer.layerNumber}
                onClick={() => setActiveStepIndex(idx)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-md-full font-bold transition-all duration-150 whitespace-nowrap ${
                  isCurrent
                    ? 'bg-md-primary text-md-on-primary shadow-sm'
                    : isCompleted
                    ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30'
                    : 'bg-md-surface-container text-md-on-surface-variant hover:bg-md-surface-container-high'
                }`}
              >
                <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono bg-black/10">
                  {isCompleted ? '✓' : idx + 1}
                </span>
                <span>{layer.title}</span>
              </button>
            );
          })}

          {/* Final Verdict Button */}
          <button
            onClick={() => setActiveStepIndex(7)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-md-full font-extrabold transition-all duration-150 whitespace-nowrap ${
              isVerdictStep
                ? 'bg-amber-500 text-black shadow-sm ring-2 ring-amber-400'
                : 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30 hover:bg-amber-500/25'
            }`}
          >
            <span>🏆 النتيجة والتوصية الصريحة</span>
          </button>
        </div>
      </div>

      {/* 4. Controls Header: Indicator name & Height Adjuster */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-2">
        <div className="flex items-center gap-2 text-xs">
          <span className="font-bold text-md-on-surface flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>شارت مباشر لـ {currentCase.nameAr} ({selectedSymbol})</span>
          </span>
          <span className="text-[11px] text-md-primary font-bold bg-md-primary/10 px-2.5 py-0.5 rounded-full border border-md-primary/30">
            {isVerdictStep ? 'الشارت الشامل للتنفيذ الميداني' : currentLayer?.actualChartIndicatorName}
          </span>
        </div>

        {/* Chart Size Controls */}
        <div className="flex items-center gap-1.5 bg-md-surface-container p-1 rounded-md-full border border-md-outline-variant/40 text-xs">
          <span className="text-[11px] text-md-on-surface-variant font-bold px-2">ارتفاع الشارت:</span>
          <button
            onClick={() => setChartHeight('normal')}
            className={`px-3 py-1 rounded-md-full font-bold transition-all ${
              chartHeight === 'normal'
                ? 'bg-md-primary text-md-on-primary shadow-sm'
                : 'text-md-on-surface-variant hover:text-md-on-surface'
            }`}
          >
            قياسي (760px)
          </button>
          <button
            onClick={() => setChartHeight('tall')}
            className={`px-3 py-1 rounded-md-full font-bold transition-all ${
              chartHeight === 'tall'
                ? 'bg-md-primary text-md-on-primary shadow-sm'
                : 'text-md-on-surface-variant hover:text-md-on-surface'
            }`}
          >
            عملاق (880px)
          </button>
        </div>
      </div>

      {/* 5. Main Area: SIDE-BY-SIDE (التحليل والشرح على اليمين • والشارت على الشمال) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* COLUMN 1 (RIGHT SIDE in RTL): التحليل الفني والخطوات التفاعلية الـ 7 */}
        <div className={`lg:col-span-5 space-y-4 ${containerHeightClass} overflow-y-auto pr-1 pl-1 scrollbar-thin`}>
          
          {/* STEP 1 to 7 DETAILS CARD */}
          {!isVerdictStep && currentLayer && (
            <div className="bg-md-surface-container-low border border-md-outline-variant/60 rounded-[28px] p-5 sm:p-6 shadow-md-1 space-y-4">
              
              {/* Step Header */}
              <div className="flex items-center justify-between gap-3 pb-3 border-b border-md-outline-variant/40">
                <div className="flex items-center gap-2.5">
                  <span className="w-9 h-9 rounded-full bg-md-primary text-md-on-primary font-mono font-bold flex items-center justify-center text-sm shadow-sm">
                    {currentLayer.layerNumber}
                  </span>
                  <div>
                    <span className="text-[11px] font-bold text-md-primary block">
                      {currentLayer.mirrorName}
                    </span>
                    <h3 className="text-lg font-bold text-md-on-surface">
                      {currentLayer.title}
                    </h3>
                  </div>
                </div>

                <div className="px-3 py-1 rounded-md-full bg-md-surface-container-high border border-md-outline-variant/50 text-[11px] font-semibold text-md-on-surface-variant">
                  خطوة {currentLayer.layerNumber} من 7
                </div>
              </div>

              {/* CRITICAL VERDICT BANNER: نوع الإشارة + هل اجتاز الطبقة؟ + السبب والتحليل المباشر بالأرقام */}
              <div className={`p-4 rounded-[22px] border ${
                currentLayer.layerStatus === 'pass' 
                  ? 'bg-emerald-500/10 border-emerald-500/30' 
                  : currentLayer.layerStatus === 'warning'
                  ? 'bg-amber-500/10 border-amber-500/30'
                  : 'bg-rose-500/10 border-rose-500/30'
              } space-y-3 shadow-sm`}>
                
                <div className="flex flex-wrap items-center justify-between gap-2">
                  {/* Signal Type Pill */}
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] font-bold text-md-on-surface-variant">نوع الإشارة:</span>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-black shadow-sm ${
                      currentLayer.signalType.includes('إيجابية')
                        ? 'bg-emerald-600 text-white'
                        : currentLayer.signalType.includes('سلبية')
                        ? 'bg-rose-600 text-white'
                        : 'bg-amber-500 text-black'
                    }`}>
                      {currentLayer.signalType}
                    </span>
                  </div>

                  {/* Pass/Fail Status */}
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] font-bold text-md-on-surface-variant">نتيجة الفحص:</span>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-black shadow-sm ${
                      currentLayer.layerResult.includes('اجتاز')
                        ? 'bg-emerald-500/20 text-emerald-800 dark:text-emerald-200 border border-emerald-500/40'
                        : currentLayer.layerResult.includes('فشل')
                        ? 'bg-rose-500/20 text-rose-800 dark:text-rose-200 border border-rose-500/40'
                        : 'bg-amber-500/20 text-amber-800 dark:text-amber-200 border border-amber-500/40'
                    }`}>
                      {currentLayer.layerResult}
                    </span>
                  </div>
                </div>

                {/* Direct Chart Reason & Analysis */}
                <div className="pt-2 border-t border-black/10 dark:border-white/10 flex items-start gap-2.5">
                  <span className="text-base shrink-0">🎯</span>
                  <div className="space-y-0.5">
                    <span className="text-xs font-extrabold text-md-on-surface block">
                      التحليل والسبب المباشر من الشارت:
                    </span>
                    <p className="text-xs text-md-on-surface leading-relaxed font-semibold">
                      {currentLayer.verdictReason}
                    </p>
                  </div>
                </div>
              </div>

              {/* Exact Indicator Name On Chart (التطابق التام مع ما يظهر على الشارت) */}
              <div className="p-3 bg-md-primary/10 rounded-[16px] border border-md-primary/30 flex items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2">
                  <Eye size={16} className="text-md-primary shrink-0" />
                  <span className="font-bold text-md-on-surface">
                    المؤشر المعروض على الشارت قدامك دلوقتي:
                  </span>
                </div>
                <span className="font-bold text-md-primary font-mono text-[11px] bg-md-surface px-2.5 py-1 rounded-full border border-md-primary/30">
                  {currentLayer.actualChartIndicatorName}
                </span>
              </div>

              {/* Thndr Indicator Match Box */}
              {(() => {
                const thndrMap = THNDR_SEVEN_LAYERS_MAPPING.find(m => m.layerNumber === currentLayer.layerNumber);
                if (!thndrMap) return null;
                return (
                  <div className="p-3 bg-emerald-500/10 rounded-[16px] border border-emerald-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-2">
                      <Smartphone size={16} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                      <span className="font-bold text-md-on-surface">
                        المؤشر المقابل في تطبيق ثاندر (Thndr):
                      </span>
                    </div>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono text-[11px] bg-md-surface px-2.5 py-1 rounded-full border border-emerald-500/30">
                      {thndrMap.thndrPrimaryIndicator}
                    </span>
                  </div>
                );
              })()}

              {/* Analogy Box: التشبيه البلدي */}
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-[18px] p-3 flex items-start gap-2.5 text-xs">
                <span className="text-lg shrink-0">💡</span>
                <div>
                  <span className="font-bold text-amber-700 dark:text-amber-300 block mb-0.5">
                    التشبيه البلدي (عشان تفهمها على طول):
                  </span>
                  <p className="text-md-on-surface font-medium leading-relaxed">
                    {currentLayer.analogyTitle}
                  </p>
                </div>
              </div>

              {/* Friend's Chat: كلام الصديق بالعامية المصرية الصريحة */}
              <div className="bg-md-surface rounded-[20px] p-4 border border-md-outline-variant/50 space-y-2 relative">
                <div className="flex items-center gap-2 text-xs font-bold text-md-primary">
                  <span className="text-base">☕</span>
                  <span>كلام صديقك وهو بيشرحلك على الشارت:</span>
                </div>
                <p className="text-xs text-md-on-surface leading-relaxed font-medium">
                  "{currentLayer.friendExplanation}"
                </p>
              </div>

              {/* Step 1 Special Visual Box: فحص الطريق السريع المزدوج (مؤشر EGX30 + اتجاه السهم) */}
              {currentLayer.layerNumber === 1 && (
                <div className="p-4 bg-blue-500/10 rounded-[20px] border border-blue-500/30 space-y-2.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-blue-800 dark:text-blue-300 flex items-center gap-1.5">
                      <Gauge size={16} />
                      <span>فحص الطريق السريع المزدوج: مؤشر السوق العام (EGX30) + اتجاه السهم</span>
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 font-bold text-[10px] border border-emerald-500/40 font-mono">
                      EGX30 صاعد 🟢
                    </span>
                  </div>

                  <p className="text-[11px] text-md-on-surface leading-relaxed">
                    🛣️ <strong>ليه بنقيس المؤشر العام EGX30 والسهم معاً؟</strong> مقولة "مينفعش تسوق عكس اتجاه الطريق السريع" بتشمل <strong>حركة البورصة ككل كطريق رئيسي</strong> وحركة السهم كعربيتك! لو مؤشر EGX30 كله هابط وبيكسر دعومه، 75% من أسهم السوق بتغرق معاه حتى لو السهم ممتاز؛ أما لو EGX30 صاعد والسهم صاعد فوق متوسطاته، فنسبة نجاح الصفقة تتجاوز 85%!
                  </p>

                  <div className="grid grid-cols-2 gap-2 text-[10px] pt-1 font-mono">
                    <div className="p-2.5 rounded-xl bg-md-surface border border-md-outline-variant/40 space-y-0.5">
                      <span className="text-md-on-surface-variant font-sans block">1. نبض مؤشر البورصة العام (EGX30):</span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400 block text-[11px]">صاعد (+0.85%) فوق 31,500</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-md-surface border border-md-outline-variant/40 space-y-0.5">
                      <span className="text-md-on-surface-variant font-sans block">2. توافق السهم مع المؤشر العام:</span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400 block text-[11px]">متطابق 100% (السوق في صفك)</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3 Special Visual Box: فك شفرة الفوليوم و MCDX Plus والفرق بينهم */}
              {currentLayer.layerNumber === 3 && (
                <div className="space-y-4">
                  
                  {/* Alert banner highlighting that MCDX is integrated */}
                  <div className="p-3 bg-gradient-to-r from-orange-500/20 via-orange-500/10 to-amber-500/10 border border-orange-500/40 rounded-[18px] text-xs flex items-center justify-between gap-2 shadow-sm">
                    <div className="flex items-center gap-2">
                      <Flame size={16} className="text-orange-500 animate-pulse shrink-0" />
                      <span className="font-bold text-orange-950 dark:text-orange-200 text-[11px]">
                        🔥 مؤشر MCDX Heatmap المفتوح المصدر مدمج ومفعل في الشارت الحي (على اليسار) وبالأسفل!
                      </span>
                    </div>
                    <button
                      onClick={() => setChartViewMode('mcdx')}
                      className="px-2.5 py-1 rounded-full bg-orange-500 hover:bg-orange-600 text-black font-extrabold text-[10px] shrink-0 transition-all shadow-sm"
                    >
                      عرضه بالشارت ⚡
                    </button>
                  </div>

                  {/* Keep Institutional Ratio Simulation Intact */}
                  <div className="p-4 bg-emerald-500/10 rounded-[20px] border border-emerald-500/30 space-y-3 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                        <BarChart2 size={16} />
                        <span>محاكاة نسب تملك المؤسسات (مؤشر MCDX Plus)</span>
                      </span>
                      <a
                        href="https://ar.tradingview.com/scripts/mcdx/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] text-md-primary font-bold hover:underline flex items-center gap-1"
                      >
                        <span>رابط المؤشر على TV</span>
                        <ExternalLink size={10} />
                      </a>
                    </div>

                    {/* Multi-colored ratio bar */}
                    <div className="space-y-1">
                      <div className="h-4 w-full rounded-full overflow-hidden flex shadow-inner bg-gray-200 dark:bg-gray-800">
                        <div style={{ width: '64%' }} className="bg-rose-500 h-full flex items-center justify-center text-[9px] font-bold text-white" title="سيولة الحيتان والمؤسسات 64%">
                          بانكرز 64%
                        </div>
                        <div style={{ width: '18%' }} className="bg-amber-400 h-full flex items-center justify-center text-[9px] font-bold text-black" title="مضاربين لحظيين 18%">
                          18%
                        </div>
                        <div style={{ width: '18%' }} className="bg-emerald-500 h-full flex items-center justify-center text-[9px] font-bold text-white" title="أفراد 18%">
                          أفراد 18%
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-[10px] text-md-on-surface-variant pt-0.5">
                        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-rose-500" /> أحمر = مؤسسات وبنوك (Bankers)</span>
                        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-400" /> أصفر = مضاربين ساخنين</span>
                        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500" /> أخضر = أفراد عاديين</span>
                      </div>
                    </div>

                    <p className="text-[11px] text-md-on-surface-variant leading-relaxed">
                      💡 <strong>توضيح مهم:</strong> الأعمدة اللي تحت الشارت في تريدنج فيو هي فوليوم عادي (الأحمر = جلسة سعرها نزل، والأخضر = جلسة سعرها طلع). أما مؤشر MCDX Plus فهو سكربت إضافي بيقسم الفوليوم ده للنسب الثلاثة دي، والنسبة هنا محسوبة ومطمئنة جداً.
                    </p>
                  </div>

                  {/* Live Pine Script MCDX Heatmap Visualizer */}
                  <McdxHeatmapVisualizer symbol={selectedSymbol} />
                </div>
              )}

              {/* Terms Dictionary Box (شرح المصطلحات بالبلدي) */}
              {currentLayer.termsDictionary && currentLayer.termsDictionary.length > 0 && (
                <div className="p-3.5 bg-md-surface-container-high/60 rounded-[18px] border border-md-outline-variant/40 space-y-2 text-xs">
                  <div className="flex items-center gap-1.5 font-bold text-md-on-surface text-xs">
                    <BookOpen size={14} className="text-md-primary" />
                    <span>قاموس مصطلحات الخطوة دي بالبلدي (عشان متتوهش):</span>
                  </div>
                  <div className="space-y-1.5">
                    {currentLayer.termsDictionary.map((td, idx) => (
                      <div key={idx} className="p-2.5 bg-md-surface rounded-[12px] border border-md-outline-variant/30 space-y-0.5">
                        <span className="font-bold text-md-primary block text-[11px]">{td.term}</span>
                        <p className="text-md-on-surface-variant text-[11px] leading-relaxed">{td.meaning}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Extracted Metrics Table */}
              <div className="space-y-2 pt-1">
                <span className="text-xs font-bold text-md-on-surface block">
                  📊 البيانات والأرقام اللي طلعنا بيها من الشارت:
                </span>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {currentLayer.extractedMetrics.map((m, idx) => (
                    <div key={idx} className="p-2.5 bg-md-surface rounded-[14px] border border-md-outline-variant/40">
                      <div className="text-[11px] text-md-on-surface-variant mb-0.5">{m.label}</div>
                      <div className={`font-bold font-mono text-xs ${m.isPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-md-on-surface'}`}>
                        {m.value}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Navigation Buttons (السابق والتالي) */}
              <div className="flex items-center justify-between gap-3 pt-2">
                <button
                  disabled={activeStepIndex === 0}
                  onClick={() => setActiveStepIndex(prev => prev - 1)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-md-full text-xs font-bold transition-all ${
                    activeStepIndex === 0
                      ? 'opacity-40 cursor-not-allowed text-md-on-surface-variant'
                      : 'bg-md-surface-container text-md-on-surface hover:bg-md-surface-container-high'
                  }`}
                >
                  <ArrowRight size={14} />
                  <span>الطبقة السابقة</span>
                </button>

                <button
                  onClick={() => setActiveStepIndex(prev => prev + 1)}
                  className="flex items-center gap-1.5 px-5 py-2.5 rounded-md-full bg-md-primary text-md-on-primary text-xs font-bold shadow-sm hover:opacity-95 transition-all"
                >
                  <span>{activeStepIndex === 6 ? 'عرض التوصية والقرار النهائي 🏆' : 'الطبقة التالية'}</span>
                  <ArrowLeft size={14} />
                </button>
              </div>

            </div>
          )}

          {/* FINAL VERDICT CARD: كارت النتيجة والتوصية الشاملة */}
          {isVerdictStep && (
            <div className="bg-md-surface-container-low border border-amber-500/40 rounded-[28px] p-5 sm:p-6 shadow-md-2 space-y-4 animate-fadeIn">
              
              {/* Verdict Header */}
              <div className="flex items-center justify-between gap-3 pb-3 border-b border-md-outline-variant/40">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-amber-500 text-black font-extrabold flex items-center justify-center text-lg shadow-sm">
                    🏆
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400 block">
                      خلاصة الفحص المؤسسي الشامل
                    </span>
                    <h3 className="text-xl font-extrabold text-md-on-surface">
                      قرار التداول وخطة التنفيذ في ثاندر
                    </h3>
                  </div>
                </div>

                <span className="px-3 py-1 rounded-md-full bg-emerald-500/20 text-emerald-800 dark:text-emerald-200 text-xs font-bold font-mono">
                  {currentCase.finalVerdict.scoreText}
                </span>
              </div>

              {/* OVERALL 7-LAYER ANALYSIS SYNTHESIS (خلاصة تحليل الـ 7 طبقات مجتمعة) */}
              <div className="p-4 bg-md-primary/10 border border-md-primary/30 rounded-[20px] space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-bold text-md-primary">
                  <Sparkles size={16} />
                  <span>خلاصة تحليل الـ 7 طبقات مجتمعة (التحليل المؤسسي التراكمي):</span>
                </div>
                <p className="text-xs font-medium text-md-on-surface leading-relaxed">
                  {currentCase.finalVerdict.overallAnalysisSummary}
                </p>
              </div>

              {/* MARKET REGIME CONFLUENCE CHECK CARD (فحص حالة السوق العام ومؤشر EGX30) */}
              <div className="p-3.5 bg-gradient-to-r from-blue-500/15 via-blue-500/10 to-emerald-500/10 rounded-[20px] border border-blue-500/30 flex items-center justify-between gap-3 text-xs shadow-sm">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-700 dark:text-blue-300 flex items-center justify-center font-bold text-sm shrink-0">
                    🏛️
                  </div>
                  <div>
                    <span className="font-bold text-blue-900 dark:text-blue-200 block text-xs">
                      نقطة التحقق الذهبية: توافق مؤشر البورصة العام (EGX30)
                    </span>
                    <span className="text-[11px] text-md-on-surface-variant">
                      مؤشر EGX30 في مسار صاعد ويدعم الصفقة؛ لا يوجد أي تعارض بين اتجاه السهم واتجاه السوق العام.
                    </span>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-800 dark:text-emerald-200 font-bold text-xs shrink-0 font-mono border border-emerald-500/40">
                  السوق في صفك ✅
                </span>
              </div>

              {/* Action Decision Pill - Dynamic Colors based on decision */}
              <div className={`border rounded-[20px] p-4 text-center space-y-1 ${
                currentCase.finalVerdict.rating === 'strong_buy' || currentCase.finalVerdict.rating === 'buy'
                  ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-800 dark:text-emerald-200'
                  : currentCase.finalVerdict.rating === 'take_profit'
                  ? 'bg-amber-500/15 border-amber-500/40 text-amber-800 dark:text-amber-200'
                  : currentCase.finalVerdict.rating === 'avoid_risk' || currentCase.finalVerdict.rating === 'sell'
                  ? 'bg-rose-500/15 border-rose-500/40 text-rose-800 dark:text-rose-200'
                  : 'bg-blue-500/15 border-blue-500/40 text-blue-800 dark:text-blue-200'
              }`}>
                <span className="text-xs font-semibold block opacity-80">
                  القرار الاستثماري النهائي:
                </span>
                <div className="text-lg sm:text-xl font-extrabold">
                  {currentCase.finalVerdict.ratingLabel}
                </div>
              </div>

              {/* Fundamental Health Card */}
              {currentCase.finalVerdict.fundamentalHealth && (
                <div className={`p-3.5 rounded-[18px] border text-xs space-y-1 ${
                  currentCase.finalVerdict.fundamentalHealth.grade === 'HIGH_RISK_DISTRESSED'
                    ? 'bg-rose-500/10 border-rose-500/30 text-rose-900 dark:text-rose-200'
                    : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-900 dark:text-emerald-200'
                }`}>
                  <div className="flex items-center justify-between font-bold">
                    <span className="flex items-center gap-1.5">
                      <span>📊 الفحص المالي والأساسي للشركة:</span>
                    </span>
                    <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-md-surface border border-md-outline-variant/40">
                      {currentCase.finalVerdict.fundamentalHealth.peRatio > 0 
                        ? `مضاعف الربحية P/E: ${currentCase.finalVerdict.fundamentalHealth.peRatio}x` 
                        : 'خسائر مرحلة (P/E سالب)'}
                    </span>
                  </div>
                  <div className="text-[11px] font-semibold">
                    {currentCase.finalVerdict.fundamentalHealth.status}
                  </div>
                  <p className="text-[11px] text-md-on-surface-variant leading-relaxed">
                    💡 {currentCase.finalVerdict.fundamentalHealth.summary}
                  </p>
                </div>
              )}

              {/* Action Plan Table (أرقام الدخول والوقف والأهداف) */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-md-on-surface block">
                  🎯 خطة التداول الميدانية بالأرقام (سهم {currentCase.nameAr}):
                </span>
                <div className="grid grid-cols-2 gap-2.5 text-xs">
                  
                  <div className="p-3 bg-md-surface rounded-[16px] border border-md-outline-variant/40 space-y-0.5">
                    <span className="text-[11px] text-md-on-surface-variant block">سعر الدخول المقترح</span>
                    <span className="text-sm font-bold font-mono text-md-primary block">
                      {currentCase.finalVerdict.entryRange}
                    </span>
                  </div>

                  <div className="p-3 bg-rose-500/10 rounded-[16px] border border-rose-500/30 space-y-0.5">
                    <span className="text-[11px] text-rose-600 dark:text-rose-400 block font-bold">وقف الخسارة الصارم (Stop Loss)</span>
                    <span className="text-sm font-bold font-mono text-rose-700 dark:text-rose-300 block">
                      {currentCase.finalVerdict.stopLoss}
                    </span>
                  </div>

                  <div className="p-3 bg-emerald-500/10 rounded-[16px] border border-emerald-500/30 space-y-0.5">
                    <span className="text-[11px] text-emerald-600 dark:text-emerald-400 block font-bold">الهدف الأول (جني ربح 50%)</span>
                    <span className="text-sm font-bold font-mono text-emerald-700 dark:text-emerald-300 block">
                      {currentCase.finalVerdict.target1}
                    </span>
                  </div>

                  <div className="p-3 bg-emerald-500/10 rounded-[16px] border border-emerald-500/30 space-y-0.5">
                    <span className="text-[11px] text-emerald-600 dark:text-emerald-400 block font-bold">الهدف الثاني (سقف العمارة)</span>
                    <span className="text-sm font-bold font-mono text-emerald-700 dark:text-emerald-300 block">
                      {currentCase.finalVerdict.target2}
                    </span>
                  </div>
                </div>
              </div>

              {/* Risk Reward Ratio Box */}
              <div className="p-3 bg-md-surface rounded-[16px] border border-md-outline-variant/40 flex items-center justify-between gap-3 text-xs">
                <span className="font-bold text-md-on-surface-variant">نسبة العائد إلى المخاطرة (R:R):</span>
                <span className="font-mono font-extrabold text-md-primary text-sm bg-md-primary/10 px-2.5 py-1 rounded-md-full">
                  {currentCase.finalVerdict.riskRewardRatio}
                </span>
              </div>

              {/* Building Concept Summary */}
              <div className="p-3.5 bg-blue-500/10 rounded-[18px] border border-blue-500/25 space-y-1.5 text-xs">
                <span className="font-bold text-blue-700 dark:text-blue-300 block flex items-center gap-1.5">
                  <Building size={14} />
                  <span>تطبيق مفهوم "عمارة الأدوار" على السهم:</span>
                </span>
                <div className="text-[11px] text-md-on-surface space-y-1">
                  <div>🏢 {currentCase.finalVerdict.buildingFloorsSummary.floorSupport}</div>
                  <div>🏠 {currentCase.finalVerdict.buildingFloorsSummary.ceilingResistance}</div>
                  <div className="text-md-on-surface-variant font-medium pt-0.5">
                    💡 {currentCase.finalVerdict.buildingFloorsSummary.floorStrengthNotes}
                  </div>
                </div>
              </div>

              {/* Friend's Final Advice */}
              <div className="bg-amber-500/15 border border-amber-500/30 rounded-[20px] p-4 text-xs space-y-2">
                <div className="flex items-center gap-2 font-bold text-amber-800 dark:text-amber-200">
                  <span className="text-lg">🤝</span>
                  <span>نصيحة صديقك الأخيرة بالأمانة:</span>
                </div>
                <p className="text-md-on-surface leading-relaxed font-medium">
                  "{currentCase.finalVerdict.friendFinalAdvice}"
                </p>
              </div>

              {/* Reset / Go back to Step 1 */}
              <button
                onClick={() => setActiveStepIndex(0)}
                className="w-full py-2.5 rounded-md-full bg-md-surface-container text-md-on-surface font-bold text-xs hover:bg-md-surface-container-high transition-all"
              >
                🔄 إعادة مراجعة الخطوات من الطبقة الأولى
              </button>

            </div>
          )}

        </div>

        {/* COLUMN 2 (LEFT SIDE in RTL): شارت TradingView المباشر ومؤشر MCDX Heatmap المتزامن */}
        <div className={`lg:col-span-7 space-y-3 ${containerHeightClass} overflow-y-auto pr-1 pl-1 scrollbar-thin flex flex-col`}>
          
          {/* Chart Header Bar: Stock Name + 3-Mode View Switcher */}
          <div className="flex flex-wrap items-center justify-between gap-2 px-1 shrink-0 bg-md-surface-container-low p-2.5 rounded-[22px] border border-md-outline-variant/50 shadow-sm">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-md-on-surface flex items-center gap-1.5">
                <span>شارت التداول الحي</span>
                <span className="text-md-primary font-mono font-black">({selectedSymbol})</span>
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-md-surface border border-md-outline-variant/40 text-md-on-surface-variant font-mono">
                TradingView + MCDX
              </span>
            </div>

            {/* 3-View Mode Segmented Control */}
            <div className="flex items-center gap-1 bg-md-surface p-1 rounded-full border border-md-outline-variant/50 text-xs">
              <button
                onClick={() => setChartViewMode('split')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold transition-all ${
                  chartViewMode === 'split'
                    ? 'bg-orange-500 text-black shadow-sm font-extrabold'
                    : 'text-md-on-surface-variant hover:text-md-on-surface'
                }`}
                title="عرض شارت الشموع وخريطة السيولة الحرارية معاً في نفس الشاشة"
              >
                <Zap size={12} />
                <span>عرض مزدوج (شارت + MCDX)</span>
              </button>

              <button
                onClick={() => setChartViewMode('chart')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold transition-all ${
                  chartViewMode === 'chart'
                    ? 'bg-md-primary text-md-on-primary shadow-sm font-extrabold'
                    : 'text-md-on-surface-variant hover:text-md-on-surface'
                }`}
                title="عرض شارت TradingView فقط بالحجم الكامل"
              >
                <span>شارت فقط</span>
              </button>

              <button
                onClick={() => setChartViewMode('mcdx')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold transition-all ${
                  chartViewMode === 'mcdx'
                    ? 'bg-orange-500 text-black shadow-sm font-extrabold'
                    : 'text-md-on-surface-variant hover:text-md-on-surface'
                }`}
                title="عرض مؤشر خريطة سيولة المؤسسات MCDX بالحجم الكامل"
              >
                <Flame size={12} />
                <span>مؤشر MCDX فقط</span>
              </button>
            </div>
          </div>

          {/* VIEW MODE 1: SPLIT (Single Seamless TradingView Terminal Window: Candlesticks + MCDX Heatmap + MCDX+ Chips Panes) */}
          {chartViewMode === 'split' && (
            <div className="w-full rounded-[24px] overflow-hidden border border-[#2a2e39] bg-[#131722] shadow-2xl flex flex-col shrink-0">
              {/* TOP PANE: TRADINGVIEW CANDLESTICKS */}
              <div className="w-full h-[430px] relative">
                <TradingViewWidget
                  symbol={selectedSymbol}
                  theme={theme}
                  height="100%"
                  studies={activeStudies}
                  borderless={true}
                />
              </div>

              {/* DOCKED BOTTOM PANES: MCDX HEATMAP TIMELINE + MCDX+ VOLUME CHIPS (0 GAP ATTACHED AS IN IMAGE 1) */}
              <div className="w-full border-t border-[#2a2e39]">
                <McdxHeatmapVisualizer symbol={selectedSymbol} compact={true} />
              </div>
            </div>
          )}

          {/* VIEW MODE 2: FULL TRADINGVIEW CHART */}
          {chartViewMode === 'chart' && (
            <div className="w-full rounded-[28px] overflow-hidden border border-md-outline-variant/60 shadow-md-2 bg-md-surface relative min-h-[560px] flex-1">
              <TradingViewWidget
                symbol={selectedSymbol}
                theme={theme}
                height="100%"
                studies={activeStudies}
              />
            </div>
          )}

          {/* VIEW MODE 3: FULL MCDX HEATMAP */}
          {chartViewMode === 'mcdx' && (
            <div className="w-full rounded-[28px] overflow-hidden border border-orange-500/40 shadow-md-2 bg-md-surface relative flex-1">
              <McdxHeatmapVisualizer symbol={selectedSymbol} compact={false} />
            </div>
          )}

          <div className="p-3 bg-md-surface-container-low rounded-[18px] border border-md-outline-variant/40 text-[11px] text-md-on-surface-variant flex items-center justify-between gap-2 shrink-0">
            <span>
              💡 يمكنك التبديل بين الشارت المباشر ومؤشر MCDX Heatmap أو عرضهما معاً من الأزرار بالأعلى.
            </span>
            <span className="font-bold text-orange-500 dark:text-orange-400 shrink-0 flex items-center gap-1 font-mono">
              <Flame size={12} />
              MCDX Live
            </span>
          </div>
        </div>

      </div>

      {/* 6. Concept Story Section: حكاية العمارة والمرايا الأربع بالبلدي */}
      <div className="bg-md-surface-container-low border border-md-outline-variant/60 rounded-[28px] p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-3 pb-3 border-b border-md-outline-variant/40">
          <div className="w-10 h-10 rounded-[14px] bg-md-secondary-container text-md-on-secondary-container flex items-center justify-center">
            <Building size={22} className="text-md-primary" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-md-on-surface">
              حكاية البورصة بالبلدي: ليه المؤشرات لوحدها بتخسرك؟ وإزاي تفهم عمارة الأدوار؟
            </h3>
            <span className="text-xs text-md-on-surface-variant">
              ملخص المفاهيم الذكية التي تحولك من متداول هاوي بيخمن لمتداول محترف عنده Checklist صارمة
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          
          {/* Card 1: قصة التطور والـ RSI */}
          <div className="p-4 bg-md-surface rounded-[20px] border border-md-outline-variant/40 space-y-2">
            <div className="flex items-center gap-2 font-bold text-md-primary">
              <span className="text-base">⏳</span>
              <span>1. قصة التطور: مصيدة الـ RSI</span>
            </div>
            <p className="text-md-on-surface-variant leading-relaxed">
              أغلب الناس بتبدأ التداول بمؤشرات تقليدية زي الـ RSI والدعوم العادية، ويكتشفوا إنها بتخسرهم! ليه؟ لأن المؤشر ده مجرد <strong>«تأكيد متأخر»</strong> لحاجة حصلت خلاص، ومش <strong>«قرار»</strong>. مينفعش تعتمد عليه لوحده دون معرفة أين تكمن سيولة صناع السوق الحقيقية.
            </p>
          </div>

          {/* Card 2: عمارة الأدوار */}
          <div className="p-4 bg-md-surface rounded-[20px] border border-md-outline-variant/40 space-y-2">
            <div className="flex items-center gap-2 font-bold text-amber-600 dark:text-amber-400">
              <span className="text-base">🏢</span>
              <span>2. السوق زي عمارة سكنية</span>
            </div>
            <p className="text-md-on-surface-variant leading-relaxed">
              الدعم هو <strong>«أرضية الدور»</strong> المتينة، والمقاومة هي <strong>«السقف الخرساني»</strong>. قوة أي أرضية أو سقف بتعتمد على 5 حاجات: عدد المرات اللي السعر خبط فيها، حجم التداول (الفوليوم)، الفريم الزمني، حداثة المستوى، وكمية الارتدادات السابقة منه.
            </p>
          </div>

          {/* Card 3: مرايا العربية الأربعة */}
          <div className="p-4 bg-md-surface rounded-[20px] border border-md-outline-variant/40 space-y-2">
            <div className="flex items-center gap-2 font-bold text-emerald-600 dark:text-emerald-400">
              <span className="text-base">🚗</span>
              <span>3. مرايا السيارة الأربعة</span>
            </div>
            <p className="text-md-on-surface-variant leading-relaxed">
              ينفع تسوق عربيتك وتبص من شباك واحد؟ لازم تبص في 4 زوايا: 
              <strong>الاتجاه (EMA)</strong> عشان متمشيش عكس السير، 
              <strong>الزخم</strong> عشان تقيس قوة الدوسة، 
              <strong>الفوليوم</strong> كوقود وبنزين حقيقي، و
              <strong>التذبذب (ATR)</strong> عشان تظبط حزام الأمان (وقف الخسارة).
            </p>
          </div>

        </div>
      </div>

    </div>
  );
};
