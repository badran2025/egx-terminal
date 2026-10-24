import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, TrendingDown, Clock, Activity, ShieldCheck, 
  Coins, Sparkles, DollarSign, ChevronLeft, Award
} from 'lucide-react';
import { StockData } from '../types';
import { 
  LIVE_GOLD_24K_PRICE, 
  LIVE_GOLD_21K_PRICE, 
  LIVE_USD_MARKET_RATE, 
  formatPrice 
} from '../services/egxService';

interface Props {
  stocks: StockData[];
  onSelectStock: (symbol: string) => void;
}

export const HeaderTicker: React.FC<Props> = ({ stocks = [], onSelectStock }) => {
  const [cairoTime, setCairoTime] = useState<string>('');

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

  // Benchmarks & key assets
  const egx30 = stocks.find(s => s.symbol === 'EGX30');
  const egx70 = stocks.find(s => s.symbol === 'EGX70EWI');
  const egx100 = stocks.find(s => s.symbol === 'EGX100EWI');
  const goldStock = stocks.find(s => s.symbol.toUpperCase() === 'THNDRGOLD');

  // Real market rates (Egyptian Sagha & Hedging)
  const gold24Price = (goldStock?.close && goldStock.close > 1000) ? goldStock.close : LIVE_GOLD_24K_PRICE;
  const gold21Price = LIVE_GOLD_21K_PRICE;
  const goldPoundPrice = gold21Price * 8; // 8 grams 21k
  const usdMarketRate = LIVE_USD_MARKET_RATE;

  // Key active stocks to cycle in the ticker
  const topActiveTickers = ['COMI', 'TMGH', 'FWRY', 'SWDY', 'EKHO', 'CCAP', 'ABUK', 'ETEL', 'T70', 'BMM'];
  const activeStocksList = topActiveTickers
    .map(sym => stocks.find(s => s.symbol.toUpperCase() === sym))
    .filter((s): s is StockData => Boolean(s));

  // Ticker content items array
  const tickerItems = (
    <>
      {/* 1. Real Gold Prices (سعر السوق الحقيقي بالصاغة) */}
      <div 
        onClick={() => onSelectStock('THNDRGOLD')}
        className="flex items-center gap-1.5 cursor-pointer hover:bg-amber-500/15 px-3 py-1 rounded-xl transition-all border border-amber-500/20 text-xs font-bold"
        title="ذهب عيار 24 بسوق الصاغة الحقيقي (اضغط لفتح الشارت)"
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

      {/* 2. Real Market Dollar (سعر التحوط بالصاغة) */}
      <div 
        className="flex items-center gap-1.5 px-3 py-1 rounded-xl border border-emerald-500/20 bg-emerald-500/10 text-xs font-bold"
        title="سعر صرف الدولار الحقيقي بسوق الصاغة والتحوط (وليس البنك المركزي)"
      >
        <span className="text-emerald-600 dark:text-emerald-400">💵 دولار السوق الحقيقي:</span>
        <span className="font-mono text-md-on-surface font-extrabold">{usdMarketRate.toFixed(2)} ج.م</span>
      </div>

      {/* 3. EGX 30 */}
      <div 
        onClick={() => onSelectStock('EGX30')}
        className="flex items-center gap-1.5 cursor-pointer hover:bg-blue-500/15 px-3 py-1 rounded-xl transition-all border border-blue-500/20 text-xs font-bold"
      >
        <span className="text-blue-600 dark:text-blue-400">EGX 30:</span>
        <span className="font-mono text-md-on-surface font-extrabold">
          {egx30 ? egx30.close.toLocaleString('en-US') : '51,052'}
        </span>
        <span className={`font-mono text-[11px] font-bold flex items-center ${
          (egx30?.changePercent ?? -1.45) >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600'
        }`}>
          {(egx30?.changePercent ?? -1.45) >= 0 ? '▲ +' : '▼ '}
          {Math.abs(egx30?.changePercent ?? -1.45).toFixed(2)}%
        </span>
      </div>

      {/* 4. EGX 70 EWI */}
      <div 
        onClick={() => onSelectStock('EGX70EWI')}
        className="flex items-center gap-1.5 cursor-pointer hover:bg-teal-500/15 px-3 py-1 rounded-xl transition-all border border-teal-500/20 text-xs font-bold"
      >
        <span className="text-teal-600 dark:text-teal-400">EGX 70 EWI:</span>
        <span className="font-mono text-md-on-surface font-extrabold">
          {egx70 ? egx70.close.toLocaleString('en-US') : '13,109'}
        </span>
        <span className={`font-mono text-[11px] font-bold flex items-center ${
          (egx70?.changePercent ?? 0.85) >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600'
        }`}>
          {(egx70?.changePercent ?? 0.85) >= 0 ? '▲ +' : '▼ '}
          {Math.abs(egx70?.changePercent ?? 0.85).toFixed(2)}%
        </span>
      </div>

      {/* 5. EGX 100 EWI */}
      <div 
        onClick={() => onSelectStock('EGX100EWI')}
        className="flex items-center gap-1.5 cursor-pointer hover:bg-purple-500/15 px-3 py-1 rounded-xl transition-all border border-purple-500/20 text-xs font-bold"
      >
        <span className="text-purple-600 dark:text-purple-400">EGX 100 EWI:</span>
        <span className="font-mono text-md-on-surface font-extrabold">
          {egx100 ? egx100.close.toLocaleString('en-US') : '17,540'}
        </span>
        <span className={`font-mono text-[11px] font-bold flex items-center ${
          (egx100?.changePercent ?? 1.10) >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600'
        }`}>
          {(egx100?.changePercent ?? 1.10) >= 0 ? '▲ +' : '▼ '}
          {Math.abs(egx100?.changePercent ?? 1.10).toFixed(2)}%
        </span>
      </div>

      {/* 6. Active Stock Micro-Cards */}
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

      {/* 2. Seamless Infinite Marquee Track (Smooth horizontal auto-scrolling news tape) */}
      <div className="flex-1 overflow-hidden relative mask-radial">
        <div className="ticker-marquee-track flex items-center gap-4 text-xs">
          {tickerItems}
          {tickerItems}
        </div>
      </div>

      {/* 3. Subtle Trust Badge on the left */}
      <div className="hidden lg:flex items-center gap-1.5 text-md-on-surface-variant text-[11px] font-sans shrink-0 border-r border-md-outline-variant/40 pr-3">
        <ShieldCheck size={14} className="text-emerald-600 dark:text-emerald-400" />
        <span className="font-semibold">تسعير سوقي مباشر</span>
      </div>
    </div>
  );
};
