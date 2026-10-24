import React, { useState } from 'react';
import { 
  ArrowUpDown, Search, TrendingUp, TrendingDown, 
  BarChart2, Filter, Briefcase
} from 'lucide-react';
import { StockData, PortfolioPosition } from '../types';
import { formatPrice } from '../services/egxService';
import { MdCard, MdChip, MdTextField, MdBadge, MdButton } from './material';
import { LastUpdatedBanner } from './LastUpdatedBanner';

interface Props {
  stocks: StockData[];
  portfolio?: PortfolioPosition[];
  onSelectStock: (symbol: string) => void;
  isLoading?: boolean;
  lastUpdated?: Date;
  onRefresh?: () => void;
}

export const TechnicalRadarView: React.FC<Props> = ({ 
  stocks, 
  portfolio = [],
  onSelectStock,
  isLoading = false,
  lastUpdated,
  onRefresh
}) => {
  const [filter, setFilter] = useState<'all' | 'owned' | 'egx30' | 'egx70' | 'egx100' | 'funds' | 'strong_buy' | 'oversold' | 'sell'>('all');
  const [search, setSearch] = useState<string>('');
  const [sortBy, setSortBy] = useState<'volume' | 'change' | 'rsi' | 'score'>('volume');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Fast set of user owned tickers
  const ownedMap = new Map<string, PortfolioPosition>();
  portfolio.forEach(p => ownedMap.set(p.symbol.toUpperCase(), p));
  const ownedCount = portfolio.length;

  // Filter stocks
  const filtered = stocks.filter(stock => {
    const sym = stock.symbol.toUpperCase();
    const isOwned = ownedMap.has(sym);

    if (filter === 'owned' && !isOwned) return false;
    if (filter === 'funds' && !stock.isFund && !stock.isGold) return false;
    if (filter === 'egx30' && !stock.isEGX30) return false;
    if (filter === 'egx70' && !stock.isEGX70) return false;
    if (filter === 'egx100' && !stock.isEGX100) return false;
    if (filter === 'strong_buy' && stock.recommendationScore < 0.25) return false;
    if (filter === 'oversold' && stock.rsi >= 40) return false;
    if (filter === 'sell' && stock.recommendationScore > -0.15) return false;

    if (search) {
      const q = search.toLowerCase();
      return stock.symbol.toLowerCase().includes(q) || 
             stock.nameAr.toLowerCase().includes(q) || 
             stock.nameEn.toLowerCase().includes(q);
    }

    return true;
  });

  // Sort logic
  filtered.sort((a, b) => {
    let valA = 0;
    let valB = 0;
    if (sortBy === 'volume') { valA = a.volume; valB = b.volume; }
    else if (sortBy === 'change') { valA = a.changePercent; valB = b.changePercent; }
    else if (sortBy === 'rsi') { valA = a.rsi; valB = b.rsi; }
    else if (sortBy === 'score') { valA = a.recommendationScore; valB = b.recommendationScore; }

    return sortOrder === 'desc' ? valB - valA : valA - valB;
  });

  const toggleSort = (field: 'volume' | 'change' | 'rsi' | 'score') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const getTimeframeBadge = (val?: number) => {
    if (val === undefined) return <span className="text-md-on-surface-variant/40">-</span>;
    if (val >= 0.2) return <span className="text-md-primary font-bold">▲ شراء</span>;
    if (val <= -0.2) return <span className="text-md-error font-bold">▼ بيع</span>;
    return <span className="text-md-on-surface-variant font-medium">● محايد</span>;
  };

  return (
    <div className="space-y-6 w-full text-md-on-surface" dir="rtl">
      {/* Date of Last Update Banner */}
      <LastUpdatedBanner
        lastUpdated={lastUpdated}
        onRefresh={onRefresh}
        isLoading={isLoading}
        tabTitle="الرادار الفني للأسهم وصناديق الاستثمار (EGX Radar)"
      />

      {/* Top Filter and Search Bar using M3 Outlined Card - Compact */}
      <MdCard variant="outlined" className="p-3.5 sm:p-4 flex flex-col lg:flex-row items-center justify-between gap-4">
        {/* Search Input using MdTextField */}
        <div className="w-full lg:w-96">
          <MdTextField
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="ابحث بالرمز أو الاسم (COMI, فوري، طلعت، دهب ثاندر، T70...)"
            leadingIcon={<Search size={18} />}
          />
        </div>

        {/* M3 Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto w-full lg:w-auto pb-1 lg:pb-0 text-xs scrollbar-none">
          <MdChip
            label={`جميع الأصول (${stocks.length})`}
            selected={filter === 'all'}
            onClick={() => setFilter('all')}
          />

          {ownedCount > 0 && (
            <MdChip
              label={`أصول ومحفظتي (${ownedCount})`}
              icon={<Briefcase size={14} />}
              selected={filter === 'owned'}
              onClick={() => setFilter('owned')}
            />
          )}

          <MdChip
            label="صناديق الاستثمار والذهب"
            selected={filter === 'funds'}
            onClick={() => setFilter('funds')}
          />

          <MdChip
            label="مؤشر (30) EGX 30"
            selected={filter === 'egx30'}
            onClick={() => setFilter('egx30')}
          />

          <MdChip
            label="مؤشر (70) EGX 70"
            selected={filter === 'egx70'}
            onClick={() => setFilter('egx70')}
          />

          <MdChip
            label="مؤشر (100) EGX 100"
            selected={filter === 'egx100'}
            onClick={() => setFilter('egx100')}
          />

          <MdChip
            label="إشارات شراء قوي"
            selected={filter === 'strong_buy'}
            onClick={() => setFilter('strong_buy')}
          />

          <MdChip
            label="تشبع بيعي (RSI < 40)"
            selected={filter === 'oversold'}
            onClick={() => setFilter('oversold')}
          />

          <MdChip
            label="إشارات بيع وتصحيح"
            selected={filter === 'sell'}
            onClick={() => setFilter('sell')}
          />
        </div>
      </MdCard>

      {/* Main Radar Table: M3 Surface Container */}
      <div className="bg-md-surface border border-md-outline-variant/60 rounded-[24px] overflow-hidden shadow-md-1">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs table-auto">
            <thead className="bg-md-surface-container-high text-md-on-surface-variant font-bold border-b border-md-outline-variant/60">
              <tr>
                <th className="p-4 text-center min-w-[90px] w-24 border-l border-md-outline-variant/40">الرمز</th>
                <th className="p-4 text-right min-w-[260px]">اسم السهم والشركة</th>
                <th className="p-4 text-right cursor-pointer hover:text-md-on-surface min-w-[130px]" onClick={() => toggleSort('change')}>
                  <div className="flex items-center gap-1.5">
                    <span>السعر والتغير</span>
                    <ArrowUpDown size={13} />
                  </div>
                </th>
                <th className="p-4 text-right cursor-pointer hover:text-md-on-surface min-w-[120px]" onClick={() => toggleSort('volume')}>
                  <div className="flex items-center gap-1.5">
                    <span>حجم التداول</span>
                    <ArrowUpDown size={13} />
                  </div>
                </th>
                <th className="p-4 text-right cursor-pointer hover:text-md-on-surface min-w-[150px]" onClick={() => toggleSort('score')}>
                  <div className="flex items-center gap-1.5">
                    <span>تقييم الخوارزمية</span>
                    <ArrowUpDown size={13} />
                  </div>
                </th>
                <th className="p-4 text-right min-w-[200px]">توافق الفريمات (1H • 4H • 1D • 1W)</th>
                <th className="p-4 text-right cursor-pointer hover:text-md-on-surface min-w-[130px]" onClick={() => toggleSort('rsi')}>
                  <div className="flex items-center gap-1.5">
                    <span>مؤشر RSI (14)</span>
                    <ArrowUpDown size={13} />
                  </div>
                </th>
                <th className="p-4 text-right min-w-[110px]">الدعم الأول (S1)</th>
                <th className="p-4 text-right min-w-[110px]">المقاومة الأولى (R1)</th>
                <th className="p-4 text-center min-w-[100px]">الشارت</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-md-outline-variant/40">
              {filtered.map(stock => {
                const sym = stock.symbol.toUpperCase();
                const owned = ownedMap.get(sym);
                const isGain = stock.changePercent >= 0;
                const isStrongBuy = stock.recommendationScore >= 0.25;
                const isSell = stock.recommendationScore <= -0.15;

                return (
                  <tr 
                    key={stock.symbol}
                    className="hover:bg-md-surface-container-highest/60 transition-colors duration-150 group cursor-pointer"
                    onClick={() => onSelectStock(stock.symbol)}
                  >
                    {/* 1. DEDICATED TICKER COLUMN */}
                    <td className="p-4 text-center border-l border-md-outline-variant/40">
                      <span className="inline-block px-2.5 py-1.5 rounded-md-md bg-md-surface-container-high font-mono font-extrabold text-sm tracking-wider text-md-on-surface border border-md-outline-variant/60 shadow-sm group-hover:border-md-primary transition-colors">
                        {stock.symbol}
                      </span>
                    </td>

                    {/* 2. STOCK NAME & METADATA COLUMN */}
                    <td className="p-4 text-right">
                      <div>
                        <div className="font-bold text-sm flex items-center gap-2 flex-wrap group-hover:text-md-primary transition-colors">
                          <span className="text-md-on-surface">{stock.nameAr}</span>
                          
                          {/* Owned Badge */}
                          {owned && (
                            <MdBadge variant="primary">
                              <Briefcase size={10} />
                              <span>مملوك بالمحفظة</span>
                            </MdBadge>
                          )}
                        </div>
                        <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                          {stock.isEGX30 && (
                            <span className="text-[9px] bg-md-secondary-container text-md-on-secondary-container px-2 py-0.5 rounded-md-full font-bold">
                              EGX 30
                            </span>
                          )}
                          {stock.isEGX70 && (
                            <span className="text-[9px] bg-md-tertiary-container text-md-on-tertiary-container px-2 py-0.5 rounded-md-full font-bold">
                              EGX 70
                            </span>
                          )}
                          {stock.isEGX100 && (
                            <span className="text-[9px] bg-md-surface-container-highest text-md-on-surface px-2 py-0.5 rounded-md-full font-bold">
                              EGX 100
                            </span>
                          )}
                          <span className="text-[11px] text-md-on-surface-variant font-mono">
                            {stock.nameEn}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* 3. Price & Change */}
                    <td className="p-4 text-right">
                      <div className="font-mono font-bold text-base text-md-on-surface">
                        {formatPrice(stock.close, stock.isFund)} ج.م
                      </div>
                      <div className={`font-mono text-xs font-semibold flex items-center gap-1 mt-0.5 ${isGain ? 'text-md-primary' : 'text-md-error'}`}>
                        {isGain ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
                        <span>{isGain ? '+' : ''}{stock.changePercent.toFixed(2)}%</span>
                      </div>
                    </td>

                    {/* 4. Volume */}
                    <td className="p-4 text-right font-mono text-md-on-surface-variant font-semibold text-sm">
                      {stock.volume.toLocaleString('en-US')}
                    </td>

                    {/* 5. Technical Rating */}
                    <td className="p-4 text-right">
                      <span className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-md-full text-xs font-bold border ${
                        isStrongBuy 
                          ? 'bg-md-primary-container text-md-on-primary-container border-md-primary/30' 
                          : isSell 
                            ? 'bg-md-error-container text-md-on-error-container border-md-error/30' 
                            : 'bg-md-surface-container-highest text-md-on-surface border-md-outline-variant/60'
                      }`}>
                        {stock.recommendationText}
                      </span>
                    </td>

                    {/* 6. Multi-Timeframe Matrix */}
                    <td className="p-4 text-right">
                      <div className="flex items-center gap-2 text-xs bg-md-surface-container-highest/80 px-3 py-1.5 rounded-md-md border border-md-outline-variant/40 w-fit font-mono">
                        <span title="فريم الساعة">{getTimeframeBadge(stock.rec1h)}</span>
                        <span className="text-md-outline-variant">|</span>
                        <span title="فريم 4 ساعات">{getTimeframeBadge(stock.rec4h)}</span>
                        <span className="text-md-outline-variant">|</span>
                        <span title="فريم اليوم">{getTimeframeBadge(stock.recommendationScore)}</span>
                        <span className="text-md-outline-variant">|</span>
                        <span title="فريم الأسبوع">{getTimeframeBadge(stock.rec1w)}</span>
                      </div>
                    </td>

                    {/* 7. RSI */}
                    <td className="p-4 text-right">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-md-on-surface text-sm w-9">
                          {stock.rsi.toFixed(1)}
                        </span>
                        <div className="w-16 bg-md-surface-container-highest h-2 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${
                              stock.rsi < 35 ? 'bg-md-tertiary' :
                              stock.rsi > 70 ? 'bg-md-error' :
                              'bg-md-primary'
                            }`}
                            style={{ width: `${Math.min(100, Math.max(0, stock.rsi))}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    {/* 8. Support 1 (S1) */}
                    <td className="p-4 text-right">
                      <span className="font-mono text-amber-500 font-bold text-sm">
                        {formatPrice(stock.support1, stock.isFund)} ج.م
                      </span>
                    </td>

                    {/* 9. Resistance 1 (R1) */}
                    <td className="p-4 text-right">
                      <span className="font-mono text-md-primary font-bold text-sm">
                        {formatPrice(stock.resistance1, stock.isFund)} ج.م
                      </span>
                    </td>

                    {/* 10. Actions / Chart Button */}
                    <td className="p-4 text-center" onClick={(e) => { e.stopPropagation(); onSelectStock(stock.symbol); }}>
                      <MdButton
                        variant="tonal"
                        size="sm"
                        icon={<BarChart2 size={14} />}
                        onClick={() => onSelectStock(stock.symbol)}
                      >
                        الشارت
                      </MdButton>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
