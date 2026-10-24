import React, { useState, useMemo } from 'react';
import { 
  Search, ArrowUpDown, TrendingUp, TrendingDown, 
  ChevronDown, ChevronRight, ChevronLeft, SlidersHorizontal,
  Briefcase, Coins, ShieldCheck, Sparkles, Filter, X
} from 'lucide-react';
import { StockData, PortfolioPosition } from '../types';
import { formatPrice } from '../services/egxService';

interface Props {
  stocks: StockData[];
  selectedSymbol: string;
  onSelectStock: (symbol: string) => void;
  portfolio?: PortfolioPosition[];
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export const MarketWatchSidebar: React.FC<Props> = ({
  stocks = [],
  selectedSymbol,
  onSelectStock,
  portfolio = [],
  isCollapsed = false,
  onToggleCollapse
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'egx30' | 'egx70' | 'egx100' | 'owned' | 'funds'>('all');
  const [sortBy, setSortBy] = useState<'turnover' | 'gainers' | 'losers' | 'az'>('turnover');
  const [showSearchInput, setShowSearchInput] = useState(true);

  // Portfolio set for quick lookup
  const ownedSet = useMemo(() => {
    return new Set(portfolio.map(p => p.symbol.toUpperCase()));
  }, [portfolio]);

  // Filter and sort stocks
  const displayedStocks = useMemo(() => {
    let list = stocks.filter(stock => {
      const sym = stock.symbol.toUpperCase();
      if (activeFilter === 'egx30' && !stock.isEGX30) return false;
      if (activeFilter === 'egx70' && !stock.isEGX70) return false;
      if (activeFilter === 'egx100' && !stock.isEGX100) return false;
      if (activeFilter === 'owned' && !ownedSet.has(sym)) return false;
      if (activeFilter === 'funds' && !stock.isFund && !stock.isGold) return false;

      if (searchTerm.trim()) {
        const q = searchTerm.trim().toLowerCase();
        return (
          stock.symbol.toLowerCase().includes(q) ||
          (stock.nameAr && stock.nameAr.toLowerCase().includes(q)) ||
          (stock.nameEn && stock.nameEn.toLowerCase().includes(q))
        );
      }
      return true;
    });

    list.sort((a, b) => {
      if (sortBy === 'gainers') return b.changePercent - a.changePercent;
      if (sortBy === 'losers') return a.changePercent - b.changePercent;
      if (sortBy === 'az') return (a.symbol || '').localeCompare(b.symbol || '');
      // default: turnover / liquidity
      const tA = a.turnover || (a.volume * a.close);
      const tB = b.turnover || (b.volume * b.close);
      return tB - tA;
    });

    return list;
  }, [stocks, activeFilter, searchTerm, sortBy, ownedSet]);

  // Generate deterministic stock initial badge color
  const getAvatarBg = (symbol: string) => {
    const colors = [
      'bg-blue-500/20 text-blue-600 dark:text-blue-400 border-blue-500/30',
      'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
      'bg-purple-500/20 text-purple-600 dark:text-purple-400 border-purple-500/30',
      'bg-amber-500/20 text-amber-600 dark:text-amber-400 border-amber-500/30',
      'bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 border-cyan-500/30',
      'bg-rose-500/20 text-rose-600 dark:text-rose-400 border-rose-500/30',
      'bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 border-indigo-500/30'
    ];
    let hash = 0;
    for (let i = 0; i < symbol.length; i++) {
      hash = symbol.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  if (isCollapsed) {
    return (
      <div className="w-12 bg-md-surface-container-low border-l border-md-outline-variant/60 flex flex-col items-center py-4 gap-3 shrink-0 select-none shadow-sm transition-all duration-200">
        <button
          onClick={onToggleCollapse}
          title="فتح قائمة مراقبة السوق الجانبية"
          className="w-9 h-9 rounded-xl bg-md-primary text-md-on-primary flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-sm"
        >
          <ChevronLeft size={18} />
        </button>
        <div 
          onClick={onToggleCollapse}
          className="text-xs font-bold text-md-on-surface-variant [writing-mode:vertical-rl] rotate-180 cursor-pointer hover:text-md-primary tracking-wider py-4 select-none"
        >
          مراقبة السوق ({displayedStocks.length})
        </div>
      </div>
    );
  }

  return (
    <aside 
      className="w-72 sm:w-80 lg:w-[310px] xl:w-[330px] bg-md-surface border-l border-md-outline-variant/60 flex flex-col shrink-0 h-full max-h-[calc(100vh-110px)] sticky top-[70px] z-30 shadow-md-1 rounded-[24px] overflow-hidden my-2 mx-1 select-none transition-all duration-200"
      dir="rtl"
    >
      {/* 1. Header Toolbar (Identical to Thndr Market Watch Bar) */}
      <div className="p-3 border-b border-md-outline-variant/40 bg-md-surface-container-low/90 backdrop-blur-md space-y-2.5">
        <div className="flex items-center justify-between gap-1.5">
          {/* Title & Dropdown */}
          <div className="flex items-center gap-1.5 cursor-pointer group">
            <span className="font-extrabold text-sm text-md-on-surface flex items-center gap-1">
              <span>مراقبة السوق</span>
              <span className="font-mono text-[10px] bg-md-surface-container-high text-md-primary px-1.5 py-0.5 rounded-full border border-md-outline-variant/40 font-bold">
                {displayedStocks.length}
              </span>
            </span>
          </div>

          {/* Quick Action Icons */}
          <div className="flex items-center gap-1 text-md-on-surface-variant">
            {/* Toggle Search */}
            <button
              onClick={() => setShowSearchInput(prev => !prev)}
              className={`p-1.5 rounded-lg hover:bg-md-surface-container transition-colors ${showSearchInput ? 'text-md-primary' : ''}`}
              title="بحث في الأسهم"
            >
              <Search size={15} />
            </button>

            {/* Cycle Sort */}
            <button
              onClick={() => {
                setSortBy(prev => 
                  prev === 'turnover' ? 'gainers' :
                  prev === 'gainers' ? 'losers' :
                  prev === 'losers' ? 'az' : 'turnover'
                );
              }}
              className="p-1.5 rounded-lg hover:bg-md-surface-container transition-colors text-md-on-surface-variant hover:text-md-primary"
              title={`الترتيب الحالي: ${
                sortBy === 'turnover' ? 'الأعلى سيولة (ج.م)' :
                sortBy === 'gainers' ? 'الأكثر صعوداً %' :
                sortBy === 'losers' ? 'الأكثر هبوطاً %' : 'أبجدي A-Z'
              }`}
            >
              <ArrowUpDown size={15} />
            </button>

            {/* Collapse Sidebar Button */}
            {onToggleCollapse && (
              <button
                onClick={onToggleCollapse}
                className="p-1.5 rounded-lg hover:bg-md-surface-container transition-colors text-md-on-surface-variant hover:text-md-primary"
                title="تصغير القائمة الجانبية"
              >
                <ChevronRight size={17} />
              </button>
            )}
          </div>
        </div>

        {/* Search Bar Input */}
        {showSearchInput && (
          <div className="relative animate-fadeIn">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="ابحث بالرمز أو الاسم (COMI, فوري, بلتون...)"
              className="w-full bg-md-surface border border-md-outline-variant rounded-xl px-3 py-1.5 pr-8 text-xs font-semibold text-md-on-surface placeholder:text-md-on-surface-variant/60 focus:outline-none focus:border-md-primary focus:ring-1 focus:ring-md-primary transition-all font-sans"
            />
            <Search size={14} className="absolute right-2.5 top-2.5 text-md-on-surface-variant/70" />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute left-2.5 top-2 text-md-on-surface-variant hover:text-md-primary text-xs"
              >
                <X size={13} />
              </button>
            )}
          </div>
        )}

        {/* Index & Category Filters Chips Bar */}
        <div className="flex items-center gap-1 overflow-x-auto pb-0.5 text-[11px] scrollbar-none font-medium">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-2.5 py-1 rounded-full whitespace-nowrap transition-all ${
              activeFilter === 'all'
                ? 'bg-md-primary text-md-on-primary font-bold shadow-xs'
                : 'bg-md-surface-container hover:bg-md-surface-container-high text-md-on-surface-variant'
            }`}
          >
            الكل
          </button>
          <button
            onClick={() => setActiveFilter('egx30')}
            className={`px-2.5 py-1 rounded-full whitespace-nowrap transition-all ${
              activeFilter === 'egx30'
                ? 'bg-blue-600 text-white font-bold shadow-xs'
                : 'bg-md-surface-container hover:bg-md-surface-container-high text-md-on-surface-variant'
            }`}
          >
            EGX30
          </button>
          <button
            onClick={() => setActiveFilter('egx70')}
            className={`px-2.5 py-1 rounded-full whitespace-nowrap transition-all ${
              activeFilter === 'egx70'
                ? 'bg-teal-600 text-white font-bold shadow-xs'
                : 'bg-md-surface-container hover:bg-md-surface-container-high text-md-on-surface-variant'
            }`}
          >
            EGX70
          </button>
          <button
            onClick={() => setActiveFilter('egx100')}
            className={`px-2.5 py-1 rounded-full whitespace-nowrap transition-all ${
              activeFilter === 'egx100'
                ? 'bg-purple-600 text-white font-bold shadow-xs'
                : 'bg-md-surface-container hover:bg-md-surface-container-high text-md-on-surface-variant'
            }`}
          >
            EGX100
          </button>
          {portfolio.length > 0 && (
            <button
              onClick={() => setActiveFilter('owned')}
              className={`px-2.5 py-1 rounded-full whitespace-nowrap transition-all ${
                activeFilter === 'owned'
                  ? 'bg-emerald-600 text-white font-bold shadow-xs'
                  : 'bg-md-surface-container hover:bg-md-surface-container-high text-md-on-surface-variant'
              }`}
            >
              محفظتي ({portfolio.length})
            </button>
          )}
          <button
            onClick={() => setActiveFilter('funds')}
            className={`px-2.5 py-1 rounded-full whitespace-nowrap transition-all ${
              activeFilter === 'funds'
                ? 'bg-amber-600 text-white font-bold shadow-xs'
                : 'bg-md-surface-container hover:bg-md-surface-container-high text-md-on-surface-variant'
            }`}
          >
            صناديق ودهب
          </button>
        </div>
      </div>

      {/* 2. Scrollable Stocks Watchlist (Vertical list styled exactly like Thndr) */}
      <div className="flex-1 overflow-y-auto divide-y divide-md-outline-variant/30 scrollbar-thin">
        {displayedStocks.length === 0 ? (
          <div className="p-8 text-center text-xs text-md-on-surface-variant space-y-2">
            <Search size={22} className="mx-auto text-md-outline-variant" />
            <p className="font-bold">لا توجد أسهم مطابقة للبحث</p>
            <button
              onClick={() => { setSearchTerm(''); setActiveFilter('all'); }}
              className="text-md-primary font-bold hover:underline block mx-auto text-[11px]"
            >
              إعادة تعيين الفلاتر
            </button>
          </div>
        ) : (
          displayedStocks.map(stock => {
            const sym = stock.symbol.toUpperCase();
            const isSelected = selectedSymbol.toUpperCase() === sym;
            const isPositive = stock.changePercent >= 0;
            const isOwned = ownedSet.has(sym);
            const initialLetter = sym.slice(0, 2);

            return (
              <div
                key={stock.symbol}
                onClick={() => onSelectStock(stock.symbol)}
                className={`p-2.5 sm:px-3 flex items-center justify-between cursor-pointer transition-all duration-150 group relative ${
                  isSelected
                    ? 'bg-md-primary/10 border-r-4 border-md-primary shadow-xs'
                    : 'hover:bg-md-surface-container-high/60'
                }`}
              >
                {/* Right Side: Avatar Icon + Ticker + Arabic Company Name */}
                <div className="flex items-center gap-2.5 min-w-0 pr-0.5">
                  {/* Stock Avatar / Icon */}
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-mono font-extrabold text-[11px] shrink-0 border shadow-xs ${getAvatarBg(sym)}`}>
                    {initialLetter}
                  </div>

                  <div className="min-w-0 leading-tight">
                    <div className="flex items-center gap-1.5">
                      <span className={`font-mono font-extrabold text-xs tracking-wider transition-colors ${
                        isSelected ? 'text-md-primary' : 'text-md-on-surface group-hover:text-md-primary'
                      }`}>
                        {stock.symbol}
                      </span>
                      {isOwned && (
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" title="مملوك بالمحفظة" />
                      )}
                    </div>
                    <div 
                      className="text-[11px] text-md-on-surface-variant truncate max-w-[125px] sm:max-w-[140px] font-sans mt-0.5"
                      title={stock.nameAr}
                    >
                      {stock.nameAr || stock.symbol}
                    </div>
                  </div>
                </div>

                {/* Left Side: Price + Change % and Absolute Change */}
                <div className="text-left font-mono shrink-0 pl-1">
                  <div className="font-extrabold text-xs text-md-on-surface tracking-tight">
                    {formatPrice(stock.close, stock.isFund)}
                    <span className="text-[10px] font-normal text-md-on-surface-variant mr-0.5 font-sans">
                      {stock.isGold ? 'ج.م' : 'ج'}
                    </span>
                  </div>

                  <div className={`text-[10px] font-bold flex items-center justify-end gap-0.5 mt-0.5 ${
                    isPositive 
                      ? 'text-emerald-600 dark:text-emerald-400' 
                      : 'text-rose-600 dark:text-rose-400'
                  }`}>
                    <span>({isPositive ? '+' : ''}{stock.changePercent.toFixed(2)}%)</span>
                    <span>{isPositive ? '+' : ''}{stock.change.toFixed(2)}</span>
                  </div>
                </div>

                {/* Active Indicator Glow */}
                {isSelected && (
                  <div className="absolute inset-y-0 right-0 w-1 bg-md-primary rounded-l-full shadow-[0_0_8px_rgba(var(--md-primary-rgb),0.6)]" />
                )}
              </div>
            );
          })
        )}
      </div>

      {/* 3. Footer Stats Pill */}
      <div className="p-2 border-t border-md-outline-variant/40 bg-md-surface-container-low text-[10px] text-md-on-surface-variant flex items-center justify-between font-mono px-3">
        <span>الترتيب: {
          sortBy === 'turnover' ? 'السيولة' :
          sortBy === 'gainers' ? 'الأكثر صعوداً' :
          sortBy === 'losers' ? 'الأكثر هبوطاً' : 'A-Z'
        }</span>
        <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
          <ShieldCheck size={11} />
          <span>لحظي مباشر</span>
        </span>
      </div>
    </aside>
  );
};
