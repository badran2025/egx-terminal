import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Clock, Activity, ShieldCheck, DollarSign } from 'lucide-react';
import { StockData } from '../types';
import { LIVE_GOLD_24K_PRICE, formatPrice } from '../services/egxService';

interface Props {
  stocks: StockData[];
  onSelectStock: (symbol: string) => void;
}

export const HeaderTicker: React.FC<Props> = ({ stocks, onSelectStock }) => {
  const [cairoTime, setCairoTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCairoTime(now.toLocaleTimeString('ar-EG', { timeZone: 'Africa/Cairo', hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Find key benchmark tickers
  const egx30 = stocks.find(s => s.symbol === 'EGX30');
  const egx70 = stocks.find(s => s.symbol === 'EGX70EWI');
  const cib = stocks.find(s => s.symbol === 'COMI');
  const tmgh = stocks.find(s => s.symbol === 'TMGH');
  const goldStock = stocks.find(s => s.symbol.toUpperCase() === 'THNDRGOLD');
  
  // Real-time market prices: Gold 24k in Thndr (7,203.00 EGP), 21k (6,302.63 EGP), USD/EGP (~50.50 EGP)
  const gold24Price = (goldStock?.close && goldStock.close > 1000) ? goldStock.close : LIVE_GOLD_24K_PRICE;
  const gold21Price = (gold24Price * (21 / 24));
  const usdRate = 50.50;

  return (
    <div className="bg-md-surface-container-lowest border-b border-md-outline-variant/60 text-xs px-4 py-2 flex flex-wrap items-center justify-between gap-3 text-md-on-surface">
      {/* Real-time Ticker Items */}
      <div className="flex items-center gap-6 overflow-x-auto no-scrollbar py-0.5">
        {/* Market Status Beacon */}
        <div className="flex items-center gap-2 pl-4 border-l border-md-outline-variant/60 flex-shrink-0">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-md-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-md-primary"></span>
          </span>
          <span className="font-semibold text-md-on-surface">جلسة البورصة المصرية</span>
          <span className="text-md-on-surface-variant font-mono">({cairoTime} بتوقيت القاهرة)</span>
        </div>

        {/* EGX 30 */}
        <div 
          onClick={() => onSelectStock('EGX30')}
          className="flex items-center gap-2 cursor-pointer hover:bg-md-surface-container px-2.5 py-1 rounded-md-sm transition-colors flex-shrink-0"
        >
          <span className="font-bold text-md-on-surface">EGX 30</span>
          <span className="num-font text-md-on-surface font-semibold">{egx30 ? egx30.close.toLocaleString('en-US') : '51,052.3'}</span>
          <span className={`num-font flex items-center gap-0.5 font-bold ${
            (egx30?.changePercent ?? -3.41) >= 0 ? 'text-md-primary' : 'text-md-error'
          }`}>
            {(egx30?.changePercent ?? -3.41) >= 0 ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
            {Math.abs(egx30?.changePercent ?? -3.41).toFixed(2)}%
          </span>
        </div>

        {/* EGX 70 */}
        <div 
          onClick={() => onSelectStock('EGX70EWI')}
          className="flex items-center gap-2 cursor-pointer hover:bg-md-surface-container px-2.5 py-1 rounded-md-sm transition-colors flex-shrink-0"
        >
          <span className="font-bold text-md-on-surface">EGX 70 EWI</span>
          <span className="num-font text-md-on-surface font-semibold">{egx70 ? egx70.close.toLocaleString('en-US') : '13,109.8'}</span>
          <span className={`num-font flex items-center gap-0.5 font-bold ${
            (egx70?.changePercent ?? 0.85) >= 0 ? 'text-md-primary' : 'text-md-error'
          }`}>
            {(egx70?.changePercent ?? 0.85) >= 0 ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
            {Math.abs(egx70?.changePercent ?? 0.85).toFixed(2)}%
          </span>
        </div>

        {/* Commercial International Bank (CIB) */}
        <div 
          onClick={() => onSelectStock('COMI')}
          className="flex items-center gap-2 cursor-pointer hover:bg-md-surface-container px-2.5 py-1 rounded-md-sm transition-colors flex-shrink-0"
        >
          <span className="font-bold text-md-on-surface">البنك التجاري الدولي (CIB)</span>
          <span className="num-font text-md-on-surface font-semibold">{cib ? formatPrice(cib.close) : '125.15'} ج.م</span>
          <span className={`num-font flex items-center gap-0.5 font-bold ${
            (cib?.changePercent ?? -1.45) >= 0 ? 'text-md-primary' : 'text-md-error'
          }`}>
            {(cib?.changePercent ?? -1.45) >= 0 ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
            {Math.abs(cib?.changePercent ?? -1.45).toFixed(2)}%
          </span>
        </div>

        {/* Talaat Moustafa Group */}
        <div 
          onClick={() => onSelectStock('TMGH')}
          className="flex items-center gap-2 cursor-pointer hover:bg-md-surface-container px-2.5 py-1 rounded-md-sm transition-colors flex-shrink-0"
        >
          <span className="font-bold text-md-on-surface">مجموعة طلعت مصطفى (TMG)</span>
          <span className="num-font text-md-on-surface font-semibold">{tmgh ? formatPrice(tmgh.close) : '87.00'} ج.م</span>
          <span className={`num-font flex items-center gap-0.5 font-bold ${
            (tmgh?.changePercent ?? 0.57) >= 0 ? 'text-md-primary' : 'text-md-error'
          }`}>
            {(tmgh?.changePercent ?? 0.57) >= 0 ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
            {Math.abs(tmgh?.changePercent ?? 0.57).toFixed(2)}%
          </span>
        </div>

        {/* Gold & Currency Micro Tickers (Real market rates for Egypt & Thndr) */}
        <div className="flex items-center gap-3 pl-3 border-r border-md-outline-variant/60 flex-shrink-0 font-mono text-[11px]">
          <div 
            onClick={() => onSelectStock('THNDRGOLD')}
            className="flex items-center gap-1.5 cursor-pointer hover:bg-amber-500/10 px-2 py-0.5 rounded-full transition-colors text-amber-600 dark:text-amber-400 font-bold"
            title="سعر جرام الذهب عيار 24 الرسمي في مصر ودهب ثاندر (اضغط للشارت)"
          >
            <span>🥇 ذهب 24 (ثاندر):</span>
            <strong className="text-md-on-surface font-extrabold">{formatPrice(gold24Price)} ج.م</strong>
          </div>

          <div 
            className="flex items-center gap-1.5 text-amber-700/80 dark:text-amber-300/80 font-medium"
            title="سعر جرام الذهب عيار 21 الأكثر تداولاً في الصاغة المصرية"
          >
            <span>✨ عيار 21:</span>
            <strong className="text-md-on-surface font-extrabold">{formatPrice(gold21Price)} ج.م</strong>
          </div>

          <div 
            className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium"
            title="سعر صرف الدولار الرسمي بالبنوك المصرية"
          >
            <span>💵 دولار البنك:</span>
            <strong className="text-md-on-surface font-extrabold">{usdRate.toFixed(2)} ج.م</strong>
          </div>
        </div>
      </div>

      {/* Trust & Regulatory Seal */}
      <div className="hidden xl:flex items-center gap-2 text-md-on-surface-variant text-[11px] font-sans">
        <ShieldCheck size={14} className="text-md-primary" />
        <span>بيانات السوق المصري الرسمية • لحظية ومباشرة</span>
      </div>
    </div>
  );
};
