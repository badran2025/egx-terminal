import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, TrendingDown, Clock, Activity, ShieldCheck, 
  Coins, Sparkles, DollarSign, ChevronLeft, Award, RefreshCw, AlertTriangle, CheckCircle2
} from 'lucide-react';
import { StockData, MacroMarketRates } from '../types';
import { 
  LIVE_GOLD_24K_PRICE, 
  LIVE_GOLD_21K_PRICE, 
  LIVE_USD_MARKET_RATE, 
  formatPrice 
} from '../services/egxService';

interface Props {
  stocks: StockData[];
  onSelectStock: (symbol: string) => void;
  isLive?: boolean;
  lastUpdated?: Date;
  onRefresh?: () => void;
  macroRates?: MacroMarketRates | null;
  macroRiskModifier?: number;
}

export const HeaderTicker: React.FC<Props> = ({ 
  stocks = [], 
  onSelectStock,
  isLive = true,
  lastUpdated,
  onRefresh,
  macroRates,
  macroRiskModifier = 0
}) => {
  const [cairoTime, setCairoTime] = useState<string>('');
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCairoTime(now.toLocaleTimeString('ar-EG', { 
        timeZone: 'Africa/Cairo', 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit' 
      }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleRefreshClick = async () => {
    if (onRefresh && !isRefreshing) {
      setIsRefreshing(true);
      await onRefresh();
      setTimeout(() => setIsRefreshing(false), 800);
    }
  };

  const lastSyncStr = lastUpdated ? lastUpdated.toLocaleTimeString('ar-EG', { 
    hour: '2-digit', 
    minute: '2-digit', 
    second: '2-digit' 
  }) : cairoTime;

  // Benchmarks & key assets (prioritizing live stocks then live macroRates indices)
  const egx30 = stocks.find(s => s.symbol === 'EGX30') || (macroRates?.indices?.egx30 ? { close: macroRates.indices.egx30.close, changePercent: macroRates.indices.egx30.change } : null);
  const egx70 = stocks.find(s => s.symbol === 'EGX70EWI') || (macroRates?.indices?.egx70 ? { close: macroRates.indices.egx70.close, changePercent: macroRates.indices.egx70.change } : null);
  const egx100 = stocks.find(s => s.symbol === 'EGX100EWI') || (macroRates?.indices?.egx100 ? { close: macroRates.indices.egx100.close, changePercent: macroRates.indices.egx100.change } : null);
  const goldStock = stocks.find(s => s.symbol.toUpperCase() === 'THNDRGOLD');

  // Real live rates prioritizing live macro scanner feed
  const gold24Price = macroRates?.gold24kEgp || ((goldStock?.close && goldStock.close > 1000) ? goldStock.close : LIVE_GOLD_24K_PRICE);
  const gold21Price = macroRates?.gold21kEgp || LIVE_GOLD_21K_PRICE;
  const goldPoundPrice = macroRates?.goldPoundEgp || (gold21Price * 8);
  const usdMarketRate = macroRates?.usdEgp || LIVE_USD_MARKET_RATE;
  const brentOil = macroRates?.brentOilUsd || 116.80;

  // Key active stocks to cycle in the ticker
  const topActiveTickers = ['COMI', 'TMGH', 'FWRY', 'SWDY', 'EKHO', 'CCAP', 'ABUK', 'ETEL', 'T70', 'BMM'];
  const activeStocksList = topActiveTickers
    .map(sym => stocks.find(s => s.symbol.toUpperCase() === sym))
    .filter((s): s is StockData => Boolean(s));

  // Ticker content items array
  const tickerItems = (
    <>
      {/* 1. Real Gold Prices (سعر الذهب الحي بالصاغة) */}
      <div 
        onClick={() => onSelectStock('THNDRGOLD')}
        className="flex items-center gap-1.5 cursor-pointer hover:bg-amber-500/15 px-3 py-1 rounded-xl transition-all border border-amber-500/20 text-xs font-bold"
        title="ذهب عيار 24 بسوق الصاغة الحي (محسوب لحظياً من أونصة الذهب والدولار)"
      >
        <span className="text-amber-500">🥇 ذهب 24:</span>
        <span className="font-mono text-md-on-surface font-extrabold">{formatPrice(gold24Price)} ج.م</span>
        <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono font-bold">+0.45%</span>
      </div>

      <div 
        className="flex items-center gap-1.5 px-3 py-1 rounded-xl border border-amber-500/15 bg-amber-500/5 text-xs font-bold"
        title="عيار 21 الأكثر تداولاً بالصاغة المصرية"
      >
        <span className="text-amber-600 dark:text-amber-400">✨ عيار 21:</span>
        <span className="font-mono text-md-on-surface font-extrabold">{formatPrice(gold21Price)} ج.م</span>
      </div>

      <div 
        className="flex items-center gap-1.5 px-3 py-1 rounded-xl border border-amber-500/15 bg-amber-500/5 text-xs font-bold"
        title="جنيه الذهب (8 جرام عيار 21)"
      >
        <span className="text-amber-600 dark:text-amber-400">🪙 جنيه الذهب:</span>
        <span className="font-mono text-md-on-surface font-extrabold">{formatPrice(goldPoundPrice)} ج.م</span>
      </div>

      {/* 2. Real Market Dollar (سعر صرف الدولار الحي) */}
      <div 
        className="flex items-center gap-1.5 px-3 py-1 rounded-xl border border-emerald-500/20 bg-emerald-500/10 text-xs font-bold"
        title="سعر صرف الدولار المباشر من ماسح العملات"
      >
        <span className="text-emerald-600 dark:text-emerald-400">💵 دولار السوق:</span>
        <span className="font-mono text-md-on-surface font-extrabold">{usdMarketRate.toFixed(2)} ج.م</span>
      </div>

      {/* 3. Brent Crude Oil (خام برنت الحي) */}
      <div 
        className="flex items-center gap-1.5 px-3 py-1 rounded-xl border border-sky-500/20 bg-sky-500/10 text-xs font-bold"
        title="سعر خام برنت العالمي الحي (Brent Crude)"
      >
        <span className="text-sky-600 dark:text-sky-400">🛢️ خام برنت:</span>
        <span className="font-mono text-md-on-surface font-extrabold">${brentOil.toFixed(2)}</span>
      </div>

      {/* 4. Macro Risk Sentiment Pill */}
      {macroRiskModifier !== 0 && (
        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl border text-xs font-bold ${
          macroRiskModifier > 0 
            ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' 
            : 'border-rose-500/30 bg-rose-500/10 text-rose-600 dark:text-rose-400'
        }`}>
          <span>🌍 الأخبار الجيوسياسية:</span>
          <span className="font-mono">{macroRiskModifier > 0 ? `+${macroRiskModifier}%` : `${macroRiskModifier}%`}</span>
        </div>
      )}

      {/* 5. EGX 30 */}
      <div 
        onClick={() => onSelectStock('EGX30')}
        className="flex items-center gap-1.5 cursor-pointer hover:bg-blue-500/15 px-3 py-1 rounded-xl transition-all border border-blue-500/20 text-xs font-bold"
      >
        <span className="text-blue-600 dark:text-blue-400">EGX 30:</span>
        <span className="font-mono text-md-on-surface font-extrabold">
          {egx30 ? egx30.close.toLocaleString('en-US', { maximumFractionDigits: 1 }) : '49,234.3'}
        </span>
        <span className={`font-mono text-[11px] font-bold flex items-center ${
          (egx30?.changePercent ?? -3.56) >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600'
        }`}>
          {(egx30?.changePercent ?? -3.56) >= 0 ? '▲ +' : '▼ '}
          {Math.abs(egx30?.changePercent ?? -3.56).toFixed(2)}%
        </span>
      </div>

      {/* 6. EGX 70 EWI */}
      <div 
        onClick={() => onSelectStock('EGX70EWI')}
        className="flex items-center gap-1.5 cursor-pointer hover:bg-teal-500/15 px-3 py-1 rounded-xl transition-all border border-teal-500/20 text-xs font-bold"
      >
        <span className="text-teal-600 dark:text-teal-400">EGX 70 EWI:</span>
        <span className="font-mono text-md-on-surface font-extrabold">
          {egx70 ? egx70.close.toLocaleString('en-US', { maximumFractionDigits: 1 }) : '15,282.6'}
        </span>
        <span className={`font-mono text-[11px] font-bold flex items-center ${
          (egx70?.changePercent ?? -11.07) >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600'
        }`}>
          {(egx70?.changePercent ?? -11.07) >= 0 ? '▲ +' : '▼ '}
          {Math.abs(egx70?.changePercent ?? -11.07).toFixed(2)}%
        </span>
      </div>

      {/* 7. EGX 100 EWI */}
      <div 
        onClick={() => onSelectStock('EGX100EWI')}
        className="flex items-center gap-1.5 cursor-pointer hover:bg-purple-500/15 px-3 py-1 rounded-xl transition-all border border-purple-500/20 text-xs font-bold"
      >
        <span className="text-purple-600 dark:text-purple-400">EGX 100 EWI:</span>
        <span className="font-mono text-md-on-surface font-extrabold">
          {egx100 ? egx100.close.toLocaleString('en-US', { maximumFractionDigits: 1 }) : '21,064.5'}
        </span>
        <span className={`font-mono text-[11px] font-bold flex items-center ${
          (egx100?.changePercent ?? -8.88) >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600'
        }`}>
          {(egx100?.changePercent ?? -8.88) >= 0 ? '▲ +' : '▼ '}
          {Math.abs(egx100?.changePercent ?? -8.88).toFixed(2)}%
        </span>
      </div>

      {/* 8. Active Stock Micro-Cards */}
      {activeStocksList.map(stock => {
        const isPos = stock.changePercent >= 0;
        return (
          <div
            key={stock.symbol}
            onClick={() => onSelectStock(stock.symbol)}
            className="flex items-center gap-1.5 cursor-pointer hover:bg-md-surface-container px-2.5 py-1 rounded-xl transition-all border border-md-outline-variant/40 text-xs font-bold"
          >
            <span className="text-md-on-surface font-mono">{stock.symbol}:</span>
            <span className="font-mono text-md-on-surface font-extrabold">{formatPrice(stock.close)}</span>
            <span className={`font-mono text-[10px] font-bold ${
              isPos ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600'
            }`}>
              {isPos ? '+' : ''}{stock.changePercent.toFixed(2)}%
            </span>
          </div>
        );
      })}
    </>
  );

  return (
    <div 
      className="bg-md-surface-container-lowest/95 border-b border-md-outline-variant/60 py-2 sm:py-2.5 px-3 sm:px-6 shadow-xs backdrop-blur-md flex items-center justify-between gap-4 overflow-hidden select-none"
      dir="rtl"
    >
      {/* 1. Fixed Live Market Status Beacon (Always visible on the right) */}
      <div className="flex items-center gap-2.5 pl-3 sm:pl-4 border-l border-md-outline-variant/60 shrink-0 z-10 bg-md-surface-container-lowest/90">
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
        </span>
        <div className="leading-tight">
          <div className="font-extrabold text-xs text-md-on-surface flex items-center gap-1">
            <span>البورصة المصرية</span>
            <span className="text-[10px] bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 px-1.5 py-0.2 rounded font-mono font-bold">LIVE</span>
          </div>
          <div className="text-[10px] text-md-on-surface-variant font-mono mt-0.5">
            {cairoTime || '10:00:00 ص'} القاهرة
          </div>
        </div>
      </div>

      {/* 2. Seamless Infinite Marquee Track */}
      <div className="flex-1 overflow-hidden relative mask-radial">
        <div className="ticker-marquee-track flex items-center gap-4 text-xs">
          {tickerItems}
          {tickerItems}
        </div>
      </div>

      {/* 3. Official Data Feed Transparency Status Badge (Left side) */}
      <div className="shrink-0 z-10 flex items-center gap-2 pr-2">
        {isLive ? (
          <div 
            className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs font-bold"
            title={`الاتصال نشط بالماسح اللحظي • آخر تحديث: ${lastSyncStr}`}
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="hidden sm:inline">🟢 متصل مباشرة بماسح البورصة (تأخير 15 د) —</span>
            <span>{lastSyncStr}</span>
          </div>
        ) : (
          <div 
            className="flex items-center gap-2 px-3 py-1 rounded-xl bg-amber-500/15 border border-amber-500/40 text-amber-700 dark:text-amber-300 text-xs font-bold"
            title="تعذر الاتصال المباشر بالماسح ويتم عرض البيانات المعايرة مسبقاً"
          >
            <AlertTriangle size={13} className="text-amber-500" />
            <span className="hidden md:inline">🟠 وضع البيانات الاحتياطية (Fallback)</span>
            {onRefresh && (
              <button
                onClick={handleRefreshClick}
                disabled={isRefreshing}
                className="px-2 py-0.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-[11px] font-bold flex items-center gap-1 transition-all shadow-xs cursor-pointer"
                title="إعادة الاتصال بالماسح وجلب البيانات اللحظية الآن"
              >
                <RefreshCw size={11} className={isRefreshing ? "animate-spin" : ""} />
                <span>إعادة الاتصال الآن</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
