import React, { useState, useEffect } from 'react';
import { 
  BarChart3, Briefcase, Coins, Newspaper, RefreshCw, 
  Search, Sun, Moon, Sparkles, Zap, GraduationCap, Compass
} from 'lucide-react';
import { StockData, PortfolioPosition } from './types';
import { fetchEGXStocks, getFallbackStocks } from './services/egxService';
import { HeaderTicker } from './components/HeaderTicker';
import { RadarAndRecommendationsView } from './components/RadarAndRecommendationsView';
import { BadranStrategyView } from './components/BadranStrategyView';
import { PortfolioView } from './components/PortfolioView';
import { FundsView } from './components/FundsView';
import { NewsView } from './components/NewsView';
import { EducationView } from './components/EducationView';
import { StockDetailModal } from './components/StockDetailModal';

export function App() {
  const [activeTab, setActiveTab] = useState<'radar' | 'badran_strategy' | 'portfolio' | 'education' | 'funds' | 'news'>('radar');
  const [stocks, setStocks] = useState<StockData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [selectedSymbol, setSelectedSymbol] = useState<string | null>(null);
  const [labRequestedSymbol, setLabRequestedSymbol] = useState<string | null>(null);

  const handleOpenLabWithStock = (symbol: string) => {
    setLabRequestedSymbol(symbol.toUpperCase());
    setActiveTab('radar');
    setSelectedSymbol(null);
    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  // Theme Management (Light / Dark Mode in Material 3)
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    try {
      const savedTheme = localStorage.getItem('egx_terminal_theme');
      if (savedTheme === 'light' || savedTheme === 'dark') return savedTheme;
    } catch (e) {
      console.error(e);
    }
    return 'dark';
  });

  useEffect(() => {
    try {
      localStorage.setItem('egx_terminal_theme', theme);
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } catch (e) {
      console.error(e);
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };
  
  // Real Portfolio State
  const [portfolio, setPortfolio] = useState<PortfolioPosition[]>(() => {
    try {
      const saved = localStorage.getItem('egx_smart_portfolio_user');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return [];
  });

  const loadData = async () => {
    setIsLoading(true);
    try {
      const data = await fetchEGXStocks();
      setStocks(data);
      setLastUpdated(new Date());
    } catch (err) {
      console.error(err);
      setStocks(getFallbackStocks());
      setLastUpdated(new Date());
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 60000);
    return () => clearInterval(interval);
  }, []);

  // Sync portfolio changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('egx_smart_portfolio_user', JSON.stringify(portfolio));
    } catch (e) {
      console.error(e);
    }
  }, [portfolio]);

  const handleAddPosition = (pos: Omit<PortfolioPosition, 'id'>) => {
    const newPos: PortfolioPosition = {
      ...pos,
      id: `pos-${Date.now()}`
    };
    setPortfolio(prev => [newPos, ...prev]);
  };

  const handleUpdatePosition = (updatedPos: PortfolioPosition) => {
    setPortfolio(prev => prev.map(p => p.id === updatedPos.id ? updatedPos : p));
  };

  const handleDeletePosition = (id: string) => {
    setPortfolio(prev => prev.filter(p => p.id !== id));
  };

  const selectedStockData = stocks.find(s => s.symbol.toUpperCase() === selectedSymbol?.toUpperCase()) || 
    getFallbackStocks().find(s => s.symbol.toUpperCase() === selectedSymbol?.toUpperCase());

  return (
    <div className="min-h-screen bg-md-surface text-md-on-surface flex flex-col selection:bg-md-primary-container selection:text-md-on-primary-container transition-colors duration-200" dir="rtl">
      {/* Top Benchmark & Macro Ticker Tape */}
      <HeaderTicker stocks={stocks} onSelectStock={(sym) => setSelectedSymbol(sym)} />

      {/* Material 3 Top App Bar */}
      <header className="bg-md-surface-container-low border-b border-md-outline-variant/60 sticky top-0 z-40 backdrop-blur-md bg-opacity-95 shadow-md-1">
        <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-8 xl:px-12 py-3 flex flex-wrap items-center justify-between gap-4">
          {/* Logo & Platform Name */}
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-[16px] bg-md-primary-container text-md-on-primary-container flex items-center justify-center shadow-md-1">
              <BarChart3 size={22} className="text-md-primary" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-extrabold text-base sm:text-lg text-md-on-surface tracking-tight">
                  EGX <span className="text-md-primary">RADAR</span>
                </h1>
                <span className="text-[10px] bg-md-secondary-container text-md-on-secondary-container px-2.5 py-0.5 rounded-md-full font-bold">
                  MATERIAL M3 TERMINAL
                </span>
              </div>
              <p className="text-xs text-md-on-surface-variant font-medium">
                نظام التحليل الفني الذكي والتوصيات اليومية للبورصة المصرية
              </p>
            </div>
          </div>

          {/* Material 3 Navigation Bar (Pill Active Indicator) */}
          <nav className="flex items-center gap-1 bg-md-surface-container p-1 rounded-md-full border border-md-outline-variant/50 text-xs shadow-sm overflow-x-auto scrollbar-none">
            {/* 1. الرادار الفني والمعمل (يشمل شارت المعمل + 7 طبقات + مسح السوق) */}
            <button
              onClick={() => setActiveTab('radar')}
              className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-md-full font-semibold transition-all duration-200 select-none whitespace-nowrap ${
                activeTab === 'radar' 
                  ? 'bg-md-secondary-container text-md-on-secondary-container shadow-sm ring-1 ring-md-primary/20' 
                  : 'text-md-on-surface-variant hover:text-md-on-surface hover:bg-md-surface-container-high'
              }`}
            >
              <BarChart3 size={16} className={activeTab === 'radar' ? 'text-md-primary' : ''} />
              <span>المعمل ورادار الأسهم 🎯</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </button>

            {/* 2. استراتيجية BADRAN (دليل وخريطة طريق التحليل والتنفيذ المعتمدة) */}
            <button
              onClick={() => setActiveTab('badran_strategy')}
              className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-md-full font-semibold transition-all duration-200 select-none whitespace-nowrap ${
                activeTab === 'badran_strategy' 
                  ? 'bg-blue-600 text-white shadow-sm ring-1 ring-blue-500/40 font-bold' 
                  : 'text-md-on-surface-variant hover:text-md-on-surface hover:bg-md-surface-container-high'
              }`}
            >
              <Compass size={16} className={activeTab === 'badran_strategy' ? 'text-white' : 'text-blue-500'} />
              <span>استراتيجية BADRAN 🧭</span>
              <span className="text-[10px] bg-blue-500/20 text-blue-300 border border-blue-400/30 px-1.5 py-0.2 rounded-full font-bold hidden sm:inline-block">
                قالب معتمد
              </span>
            </button>

            {/* 3. محفظة ثاندر الذكية */}
            <button
              onClick={() => setActiveTab('portfolio')}
              className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-md-full font-semibold transition-all duration-200 select-none whitespace-nowrap relative ${
                activeTab === 'portfolio' 
                  ? 'bg-md-secondary-container text-md-on-secondary-container shadow-sm' 
                  : 'text-md-on-surface-variant hover:text-md-on-surface hover:bg-md-surface-container-high'
              }`}
            >
              <Briefcase size={16} className={activeTab === 'portfolio' ? 'text-md-primary' : ''} />
              <span>محفظة ثاندر الذكية 💼</span>
              {portfolio.length > 0 && (
                <span className="w-5 h-5 rounded-full bg-md-primary text-md-on-primary font-mono font-bold text-[10px] flex items-center justify-center">
                  {portfolio.length}
                </span>
              )}
            </button>

            {/* 4. أكاديمية المؤشرات (الموسوعة بالبلدي + نظام الـ 7 طبقات) */}
            <button
              onClick={() => setActiveTab('education')}
              className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-md-full font-semibold transition-all duration-200 select-none whitespace-nowrap ${
                activeTab === 'education'
                  ? 'bg-md-secondary-container text-md-on-secondary-container shadow-sm' 
                  : 'text-md-on-surface-variant hover:text-md-on-surface hover:bg-md-surface-container-high'
              }`}
            >
              <GraduationCap size={16} className={activeTab === 'education' ? 'text-amber-500' : ''} />
              <span>أكاديمية المؤشرات 🎓</span>
            </button>

            {/* 5. صناديق الاستثمار (73) */}
            <button
              onClick={() => setActiveTab('funds')}
              className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-md-full font-semibold transition-all duration-200 select-none whitespace-nowrap ${
                activeTab === 'funds' 
                  ? 'bg-md-secondary-container text-md-on-secondary-container shadow-sm' 
                  : 'text-md-on-surface-variant hover:text-md-on-surface hover:bg-md-surface-container-high'
              }`}
            >
              <Coins size={16} className={activeTab === 'funds' ? 'text-md-tertiary' : ''} />
              <span>صناديق الاستثمار (73) 🪙</span>
            </button>

            {/* 6. الإفصاحات والأخبار */}
            <button
              onClick={() => setActiveTab('news')}
              className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-md-full font-semibold transition-all duration-200 select-none whitespace-nowrap ${
                activeTab === 'news' 
                  ? 'bg-md-secondary-container text-md-on-secondary-container shadow-sm' 
                  : 'text-md-on-surface-variant hover:text-md-on-surface hover:bg-md-surface-container-high'
              }`}
            >
              <Newspaper size={16} className={activeTab === 'news' ? 'text-md-tertiary' : ''} />
              <span>الإفصاحات والأخبار 📰</span>
            </button>
          </nav>

          {/* M3 Actions: Theme Switcher & Refresh */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              title={theme === 'dark' ? 'التبديل إلى الوضع النهاري (Material Light)' : 'التبديل إلى الوضع الليلي (Material Dark)'}
              className="flex items-center gap-2 px-4 py-2 bg-md-surface-container hover:bg-md-surface-container-high border border-md-outline-variant/60 text-md-on-surface text-xs rounded-md-full font-medium transition-all shadow-sm"
            >
              {theme === 'dark' ? (
                <>
                  <Sun size={15} className="text-amber-400" />
                  <span className="hidden sm:inline">الوضع النهاري</span>
                </>
              ) : (
                <>
                  <Moon size={15} className="text-md-primary" />
                  <span className="hidden sm:inline">الوضع الليلي</span>
                </>
              )}
            </button>

            <button
              onClick={loadData}
              disabled={isLoading}
              title="تحديث البيانات لحظياً"
              className="flex items-center gap-2 px-4 py-2 bg-md-surface-container hover:bg-md-surface-container-high border border-md-outline-variant/60 text-md-on-surface text-xs rounded-md-full font-medium transition-colors shadow-sm"
            >
              <RefreshCw size={15} className={isLoading ? 'animate-spin text-md-primary' : ''} />
              <span className="hidden sm:inline">تحديث السوق</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Material 3 Content Area */}
      <main className="flex-1 w-full max-w-[1920px] mx-auto px-4 sm:px-8 xl:px-12 py-6">
        {activeTab === 'radar' && (
          <RadarAndRecommendationsView 
            stocks={stocks} 
            portfolio={portfolio}
            onSelectStock={(sym) => setSelectedSymbol(sym)}
            onAddToPortfolio={handleAddPosition}
            theme={theme}
            isLoading={isLoading}
            lastUpdated={lastUpdated}
            onRefresh={loadData}
            initialLabSymbol={labRequestedSymbol || undefined}
          />
        )}

        {activeTab === 'badran_strategy' && (
          <BadranStrategyView 
            onNavigateToLab={(sym) => handleOpenLabWithStock(sym || 'COMI')}
            lastUpdated={lastUpdated}
            onRefresh={loadData}
            isLoading={isLoading}
          />
        )}

        {activeTab === 'portfolio' && (
          <PortfolioView 
            stocks={stocks}
            portfolio={portfolio}
            onAddPosition={handleAddPosition}
            onUpdatePosition={handleUpdatePosition}
            onDeletePosition={handleDeletePosition}
            onSelectStock={(sym) => setSelectedSymbol(sym)}
            onOpenLabWithStock={handleOpenLabWithStock}
            lastUpdated={lastUpdated}
            onRefresh={loadData}
            isLoading={isLoading}
          />
        )}

        {activeTab === 'education' && (
          <EducationView 
            lastUpdated={lastUpdated}
            onRefresh={loadData}
            isLoading={isLoading}
            onNavigateToLab={() => setActiveTab('radar')}
            onNavigateToBadranStrategy={() => setActiveTab('badran_strategy')}
          />
        )}

        {activeTab === 'funds' && (
          <FundsView 
            lastUpdated={lastUpdated}
            onRefresh={loadData}
            isLoading={isLoading}
            onAddToPortfolio={handleAddPosition}
          />
        )}

        {activeTab === 'news' && (
          <NewsView 
            onSelectStock={(sym) => setSelectedSymbol(sym)} 
            lastUpdated={lastUpdated}
            onRefresh={loadData}
            isLoading={isLoading}
          />
        )}
      </main>

      {/* Interactive Huge TradingView Stock Detail Modal (MD3 Fullscreen Sheet) */}
      {selectedStockData && (
        <StockDetailModal
          stock={selectedStockData}
          portfolio={portfolio}
          theme={theme}
          onClose={() => setSelectedSymbol(null)}
          onAddToPortfolio={handleAddPosition}
          onOpenLabWithStock={handleOpenLabWithStock}
          lastUpdated={lastUpdated}
        />
      )}

      {/* Material 3 Footer */}
      <footer className="bg-md-surface-container-low border-t border-md-outline-variant/60 py-6 text-center text-xs text-md-on-surface-variant">
        <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-8 xl:px-12 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>
            EGX Radar Terminal • تطبيق متكامل مبني بنظام التصميم Material Design 3 (Google Material Components)
          </p>
          <div className="flex items-center gap-4 text-xs text-md-on-surface-variant">
            <span>تحديث لحظي لأسعار البورصة المصرية ومستويات الدعم والمقاومة</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
