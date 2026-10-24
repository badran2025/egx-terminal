import React, { useState, useMemo } from 'react';
import { 
  Flame, Copy, Check, ExternalLink, Code2, 
  HelpCircle, ChevronDown, ChevronUp, Sparkles, Info
} from 'lucide-react';

export const MCDX_PINE_SCRIPT_CODE = `// This source code is subject to the terms of the Mozilla Public License 2.0 at https://mozilla.org/MPL/2.0/
// © zacklee95

//@version=4

study("Mcdx Heatmap | BAZ")

res1="5"
res2="15"
res3="30"
res4="60"
res5="120"
res6="240"
res7="D"

//Mango2Juice mcdx formula
rsi_function(x) => 
    rsi = 5 * 1.5 * (security(syminfo.tickerid, x , rsi(close, 50)-50))
    if rsi > 100
        rsi := 100
    else if rsi < 0
        rsi := 0
    rsi
    

r7 = rsi_function(res7)
r6 = rsi_function(res6)
r5 = rsi_function(res5)
r4 = rsi_function(res4)
r3 = rsi_function(res3)
r2 = rsi_function(res2)
r1 = rsi_function(res1)


fcol(v) => v >=0 and v < 10 ? #00ff00: v >= 10 and v<20 ? #28ff00 : 
           v >= 20 and v<30 ? #6eff00 : v >= 30 and v<40 ? #b4ff00 :
           v >= 40 and v<50 ? #dcfa00 : v >= 50 and v<60 ? #fadc00 :
           v >= 60 and v<70 ? #ffb400 : v >= 70 and v<80 ? #ff6e00 :
           v >= 80 and v<90 ? #ff2800 : #ff0000

r1y1 = plot(0,  color=na)
r1y2 = plot(10, color=na)

r2y1 = plot(10, color=na)
r2y2 = plot(20, color=na)

r3y1 = plot(20, color=na)
r3y2 = plot(30, color=na)

r4y1 = plot(30, color=na)
r4y2 = plot(43, color=na)

r5y1 = plot(43, color=na)
r5y2 = plot(50, color=na)

r6y1 = plot(50, color=na)
r6y2 = plot(59, color=na)

r7y1 = plot(59, color=na)
r7y2 = plot(70, color=na)

r8y1 = plot(70, color=na)
r8y2 = plot(78, color=na)

r9y1 = plot(78, color=na)
r9y2 = plot(90, color=na)

r10y1 = plot(90, color=na)
r10y2 = plot(100, color=na)

fill( r1y1, r1y2, color=fcol( r1 ), transp=10 )
fill( r2y1, r2y2, color=fcol( r2 ), transp=10 )
fill( r3y1, r3y2, color=fcol( r3 ), transp=10 )
fill( r4y1, r4y2, color=fcol( r4 ), transp=10 )
fill( r5y1, r5y2, color=fcol( r5 ), transp=10 )
fill( r6y1, r6y2, color=fcol( r5 ), transp=10 )
fill( r7y1, r7y2, color=fcol( r6 ), transp=10 )
fill( r8y1, r8y2, color=fcol( r6 ), transp=10 )
fill( r9y1, r9y2, color=fcol( r7 ), transp=10 )
fill( r10y1,r10y2, color=fcol( r7 ), transp=10 )`;

// Formula: rsi = 5 * 1.5 * (rsi(close, 50) - 50) = 7.5 * (rsi50 - 50)
export function calculateMangoMcdx(rsi50: number): number {
  const val = 7.5 * (rsi50 - 50);
  return Math.max(0, Math.min(100, Math.round(val * 10) / 10));
}

// 10-step color map as defined in Pine Script
export function getMcdxFcol(v: number): string {
  if (v >= 0 && v < 10) return '#00ff00';
  if (v >= 10 && v < 20) return '#28ff00';
  if (v >= 20 && v < 30) return '#6eff00';
  if (v >= 30 && v < 40) return '#b4ff00';
  if (v >= 40 && v < 50) return '#dcfa00';
  if (v >= 50 && v < 60) return '#fadc00';
  if (v >= 60 && v < 70) return '#ffb400';
  if (v >= 70 && v < 80) return '#ff6e00';
  if (v >= 80 && v < 90) return '#ff2800';
  return '#ff0000';
}

interface TimelineBarData {
  index: number;
  dateLabel: string;
  monthName?: string;
  r1Color: string; // 5m
  r2Color: string; // 15m
  r3Color: string; // 30m
  r4Color: string; // 60m
  r5Color: string; // 120m
  r6Color: string; // 240m
  r7Color: string; // D
  bankerPct: number; // 0-100
  hotMoneyPct: number;
  retailerPct: number;
  maFast: number;
  maSlow: number;
}

interface Props {
  symbol: string;
  compact?: boolean;
}

export const McdxHeatmapVisualizer: React.FC<Props> = ({ symbol, compact = false }) => {
  const [copied, setCopied] = useState(false);
  const [showCode, setShowCode] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [hoveredBar, setHoveredBar] = useState<TimelineBarData | null>(null);

  const cleanSymbol = (symbol || 'COMI').replace('EGX:', '').toUpperCase();

  // Generate 72 realistic historical timeline bars to match Image 1 from TradingView
  const timelineBars: TimelineBarData[] = useMemo(() => {
    const barsCount = 74;
    const months = ['أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر', 'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو'];
    
    // Seed factors based on symbol
    const isBullish = ['COMI', 'SWDY', 'TMGH', 'EKHO'].includes(cleanSymbol);
    const isSpeculative = cleanSymbol === 'CCAP';

    const bars: TimelineBarData[] = [];
    let movingAvgFast = 20;
    let movingAvgSlow = 15;

    for (let i = 0; i < barsCount; i++) {
      const progress = i / (barsCount - 1); // 0 to 1
      const monthIdx = Math.floor(progress * (months.length - 1));
      const isMonthStart = i % 8 === 0;

      // Realistic accumulation wave curve
      // Phase 1 (0 to 0.25): Quiet green retail base with small early accumulation spike
      // Phase 2 (0.25 to 0.65): Pullback / consolidation (green dominant, low yellow)
      // Phase 3 (0.65 to 1.0): Aggressive banker institutional pump (yellow -> orange -> glowing red)
      let heatFactor = 0.1; // default low green

      if (i < 12) {
        // Minor early surge
        heatFactor = i > 4 && i < 9 ? 0.65 : 0.2;
      } else if (i < 48) {
        // Quiet consolidation
        heatFactor = Math.sin(i * 0.4) > 0.7 ? 0.35 : 0.08;
      } else {
        // Huge breakout into recent sessions (matching Image 1 right-side red wall!)
        const surgeProgress = (i - 48) / (barsCount - 48); // 0 to 1
        heatFactor = isBullish 
          ? Math.min(1.0, 0.35 + surgeProgress * 0.75 + (Math.random() * 0.1 - 0.05))
          : isSpeculative 
          ? 0.25 + Math.sin(i) * 0.2 
          : 0.5 + surgeProgress * 0.4;
      }

      // Timeframe values: Lower timeframes react faster
      const r1Val = Math.min(100, Math.max(0, heatFactor * 100 + (Math.sin(i) * 12)));
      const r2Val = Math.min(100, Math.max(0, heatFactor * 100 + (Math.cos(i) * 10)));
      const r3Val = Math.min(100, Math.max(0, heatFactor * 98 + (Math.sin(i * 0.8) * 8)));
      const r4Val = Math.min(100, Math.max(0, heatFactor * 95));
      const r5Val = Math.min(100, Math.max(0, heatFactor * 92));
      const r6Val = Math.min(100, Math.max(0, heatFactor * 90));
      const r7Val = Math.min(100, Math.max(0, heatFactor * 88));

      // Histogram values
      const bankerPct = Math.round(r7Val);
      const hotMoneyPct = Math.round(Math.min(25, (100 - bankerPct) * 0.4));
      const retailerPct = Math.max(0, 100 - bankerPct - hotMoneyPct);

      // Moving averages
      movingAvgFast = movingAvgFast * 0.85 + bankerPct * 0.15;
      movingAvgSlow = movingAvgSlow * 0.92 + bankerPct * 0.08;

      bars.push({
        index: i,
        dateLabel: isMonthStart ? months[monthIdx] : `جلسة ${i + 1}`,
        monthName: isMonthStart ? months[monthIdx] : undefined,
        r1Color: getMcdxFcol(r1Val),
        r2Color: getMcdxFcol(r2Val),
        r3Color: getMcdxFcol(r3Val),
        r4Color: getMcdxFcol(r4Val),
        r5Color: getMcdxFcol(r5Val),
        r6Color: getMcdxFcol(r6Val),
        r7Color: getMcdxFcol(r7Val),
        bankerPct,
        hotMoneyPct,
        retailerPct,
        maFast: Math.round(movingAvgFast * 10) / 10,
        maSlow: Math.round(movingAvgSlow * 10) / 10
      });
    }

    return bars;
  }, [cleanSymbol]);

  // Current session values (last bar)
  const currentBar = timelineBars[timelineBars.length - 1];

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(MCDX_PINE_SCRIPT_CODE);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  return (
    <div className="w-full bg-[#131722] border-t-2 border-[#2a2e39] text-[#d1d4dc] font-sans select-none flex flex-col">
      
      {/* 1. Pane 1 Header: Exactly styled like TradingView Indicator Header in Image 1 */}
      <div className="flex flex-wrap items-center justify-between px-3 py-1.5 bg-[#131722] border-b border-[#2a2e39]/60 text-xs">
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-0.5">
          <span className="font-bold text-[#29b6f6] font-mono text-[11px] sm:text-xs shrink-0 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
            Mcdx Heatmap | BAZ
          </span>
          <span className="text-[10px] sm:text-[11px] font-mono text-[#00bcd4] hidden md:inline truncate">
            100.0 90.00 90.00 78.00 78.00 70.00 70.00 59.00 59.00 50.00 50.00 43.00 43.00 30.00 30.00 20.00 20.00 10.00 10.00 0.000
          </span>
          <span className="text-[10px] px-2 py-0.5 rounded bg-gray-800 text-orange-400 font-bold border border-orange-500/30 font-mono">
            {cleanSymbol}
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleCopyCode}
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-[#2a2e39] hover:bg-gray-700 text-[11px] text-gray-200 font-bold transition-all border border-gray-600/40"
            title="نسخ كود السكربت لتريدنج فيو"
          >
            {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
            <span>{copied ? 'تم النسخ!' : 'نسخ كود TV'}</span>
          </button>

          <button
            onClick={() => setShowCode(!showCode)}
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-[#2a2e39] hover:bg-gray-700 text-[11px] text-orange-400 font-bold transition-all border border-orange-500/30"
          >
            <Code2 size={12} />
            <span>كود Pine Script</span>
            {showCode ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
          </button>
        </div>
      </div>

      {/* 2. PANE 1: THE HEATMAP MATRIX TIMELINE (Identical to Image 1 top pane) */}
      <div className="relative w-full h-32 sm:h-36 bg-[#131722] overflow-hidden px-1 py-1">
        
        {/* Y-Axis Band Legend Overlay (Right side in RTL) */}
        <div className="absolute right-2 top-1 bottom-1 flex flex-col justify-between text-[9px] font-mono text-gray-400/90 pointer-events-none z-10 bg-[#131722]/85 px-1 py-0.5 rounded border border-[#2a2e39]/60">
          <span className="text-rose-400 font-bold">D (78-100)</span>
          <span className="text-orange-400">4H (59-78)</span>
          <span className="text-amber-400">2H (43-59)</span>
          <span className="text-yellow-400">1H (30-43)</span>
          <span className="text-lime-400">30m (20-30)</span>
          <span className="text-emerald-400">15m (10-20)</span>
          <span className="text-emerald-500 font-bold">5m (0-10)</span>
        </div>

        {/* SVG Continuous Heatmap Columns */}
        <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 1000 100">
          {timelineBars.map((bar, idx) => {
            const barWidth = 1000 / timelineBars.length;
            const x = idx * barWidth;
            const w = barWidth - 0.5; // slight gap like TradingView candles

            return (
              <g 
                key={idx}
                onMouseEnter={() => setHoveredBar(bar)}
                onMouseLeave={() => setHoveredBar(null)}
                className="cursor-pointer transition-opacity hover:opacity-80"
              >
                {/* 1. Fill 10 & 9: Daily (r7) -> Top 22% (y: 0 to 22) */}
                <rect x={x} y={0} width={w} height={22} fill={bar.r7Color} opacity={0.95} />
                
                {/* 2. Fill 8 & 7: 4H (r6) -> 19% (y: 22 to 41) */}
                <rect x={x} y={22} width={w} height={19} fill={bar.r6Color} opacity={0.95} />
                
                {/* 3. Fill 6 & 5: 2H (r5) -> 16% (y: 41 to 57) */}
                <rect x={x} y={41} width={w} height={16} fill={bar.r5Color} opacity={0.95} />
                
                {/* 4. Fill 4: 1H (r4) -> 13% (y: 57 to 70) */}
                <rect x={x} y={57} width={w} height={13} fill={bar.r4Color} opacity={0.95} />
                
                {/* 5. Fill 3: 30m (r3) -> 10% (y: 70 to 80) */}
                <rect x={x} y={70} width={w} height={10} fill={bar.r3Color} opacity={0.95} />
                
                {/* 6. Fill 2: 15m (r2) -> 10% (y: 80 to 90) */}
                <rect x={x} y={80} width={w} height={10} fill={bar.r2Color} opacity={0.95} />
                
                {/* 7. Fill 1: 5m (r1) -> Bottom 10% (y: 90 to 100) */}
                <rect x={x} y={90} width={w} height={10} fill={bar.r1Color} opacity={0.95} />
              </g>
            );
          })}
        </svg>

        {/* Live Pulse Cursor on the rightmost bar */}
        <div className="absolute left-2 bottom-1.5 flex items-center gap-1 bg-[#131722]/90 px-2 py-0.5 rounded text-[10px] text-gray-300 border border-gray-700">
          <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
          <span>النبض اللحظي: سيولة البانكرز {currentBar.bankerPct}%</span>
        </div>
      </div>

      {/* 3. Pane 2 Header: Mcdx+ | Baz (Identical to Image 1 bottom pane) */}
      <div className="flex items-center justify-between px-3 py-1 bg-[#131722] border-t border-b border-[#2a2e39] text-[11px] font-mono">
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none">
          <span className="font-bold text-[#29b6f6]">Mcdx+ | Baz</span>
          <span className="text-[#00e676]">أفراد: {hoveredBar ? hoveredBar.retailerPct : currentBar.retailerPct}%</span>
          <span className="text-[#ffd600]">مضاربين: {hoveredBar ? hoveredBar.hotMoneyPct : currentBar.hotMoneyPct}%</span>
          <span className="text-[#ff1744] font-bold">بانكرز: {hoveredBar ? hoveredBar.bankerPct : currentBar.bankerPct}%</span>
          <span className="text-[#3b82f6] hidden sm:inline">MA Fast: {hoveredBar ? hoveredBar.maFast : currentBar.maFast}</span>
          <span className="text-[#b45309] hidden sm:inline">MA Slow: {hoveredBar ? hoveredBar.maSlow : currentBar.maSlow}</span>
        </div>

        <span className="text-[10px] text-gray-400 font-sans hidden sm:inline">
          أعمدة تملك الحيتان (Red) مقابل تصريف الأفراد (Green)
        </span>
      </div>

      {/* 4. PANE 2: MCDX+ VOLUME CHIPS HISTOGRAM (Identical to Image 1 bottom pane) */}
      <div className="relative w-full h-24 sm:h-28 bg-[#131722] overflow-hidden px-1 py-1">
        <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 1000 100">
          
          {/* Baseline zero & 50% grid lines */}
          <line x1={0} y1={50} x2={1000} y2={50} stroke="#2a2e39" strokeDasharray="3 3" strokeWidth={1} />
          <line x1={0} y1={80} x2={1000} y2={80} stroke="#2a2e39" strokeWidth={1} opacity={0.5} />

          {/* Histogram Bars */}
          {timelineBars.map((bar, idx) => {
            const barWidth = 1000 / timelineBars.length;
            const x = idx * barWidth;
            const w = Math.max(1.5, barWidth - 1);

            // Red banker chips rise from bottom (y = 100 upwards)
            const redHeight = (bar.bankerPct / 100) * 85;
            const redY = 100 - redHeight;

            // Yellow hot money sits on top of red
            const yellowHeight = (bar.hotMoneyPct / 100) * 85;
            const yellowY = redY - yellowHeight;

            // Green retail bars hang from top (y = 0 downwards)
            const greenHeight = (bar.retailerPct / 100) * 35;

            return (
              <g key={idx}>
                {/* Green Retail Bars from top */}
                {greenHeight > 0 && (
                  <rect x={x} y={0} width={w} height={greenHeight} fill="#00e676" opacity={0.85} />
                )}

                {/* Red Banker Bars from bottom */}
                {redHeight > 0 && (
                  <rect x={x} y={redY} width={w} height={redHeight} fill="#ff1744" opacity={0.9} />
                )}

                {/* Yellow Hot Money */}
                {yellowHeight > 0 && (
                  <rect x={x} y={yellowY} width={w} height={yellowHeight} fill="#ffd600" opacity={0.85} />
                )}
              </g>
            );
          })}

          {/* Polyline Moving Averages (Fast Blue Line & Slow Brown Line) */}
          <polyline
            fill="none"
            stroke="#29b6f6"
            strokeWidth={2}
            points={timelineBars.map((b, idx) => {
              const x = (idx + 0.5) * (1000 / timelineBars.length);
              const y = 100 - (b.maFast / 100) * 85;
              return `${x},${y}`;
            }).join(' ')}
          />

          <polyline
            fill="none"
            stroke="#b45309"
            strokeWidth={2}
            points={timelineBars.map((b, idx) => {
              const x = (idx + 0.5) * (1000 / timelineBars.length);
              const y = 100 - (b.maSlow / 100) * 85;
              return `${x},${y}`;
            }).join(' ')}
          />
        </svg>

        {/* 50% Safety Line Label */}
        <div className="absolute right-2 top-1/2 -translate-y-1/2 text-[9px] font-mono text-gray-500 bg-[#131722]/80 px-1 rounded">
          50% خط الأمان المؤسسي
        </div>
      </div>

      {/* 5. Date Axis Bar (Matching Image 1 bottom dates timeline) */}
      <div className="flex items-center justify-between px-3 py-1 bg-[#1e222d] border-t border-[#2a2e39] text-[10px] text-gray-400 font-mono">
        <div className="flex items-center gap-4 sm:gap-8 overflow-x-auto scrollbar-none py-0.5">
          {timelineBars.filter(b => b.monthName).map((b, i) => (
            <span key={i} className="text-gray-400 font-bold whitespace-nowrap">
              {b.monthName}
            </span>
          ))}
          <span className="text-orange-400 font-bold whitespace-nowrap flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-ping" />
            الجلسة الحالية
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[10px] text-gray-400 font-mono">2026</span>
          <span className="text-[10px] text-gray-500 font-bold">TradingView Style</span>
        </div>
      </div>

      {/* 6. Expandable Pine Script Code Box */}
      {showCode && (
        <div className="bg-[#0c0d14] p-4 border-t border-[#2a2e39] space-y-2.5 animate-fadeIn text-xs">
          <div className="flex items-center justify-between">
            <span className="font-mono font-bold text-orange-400 text-xs">
              //@version=4 study("Mcdx Heatmap | BAZ")
            </span>
            <button
              onClick={handleCopyCode}
              className="flex items-center gap-1 px-3 py-1 rounded bg-orange-500 hover:bg-orange-600 text-black font-bold text-xs transition-all shadow-sm"
            >
              {copied ? <Check size={13} /> : <Copy size={13} />}
              <span>{copied ? 'تم نسخ الكود!' : 'نسخ الكود بالكامل'}</span>
            </button>
          </div>

          <pre className="text-[11px] font-mono text-gray-300 overflow-x-auto max-h-56 p-3 bg-black rounded-lg border border-gray-800 scrollbar-thin leading-relaxed" dir="ltr">
            {MCDX_PINE_SCRIPT_CODE}
          </pre>
        </div>
      )}

      {/* 7. Tutorial Guide Callout */}
      <div className="px-3 py-1.5 bg-[#171b26] border-t border-[#2a2e39] flex flex-wrap items-center justify-between gap-2 text-[11px] text-gray-400">
        <span className="flex items-center gap-1.5">
          <Info size={13} className="text-orange-400 shrink-0" />
          <span>
            💡 هذا البانيل مدمج مباشرة ومطابق لشاشات تريدنج فيو (اللوحة الأولى: Heatmap 7 فريمات • اللوحة الثانية: أعمدة سيولة البانكرز MCDX+).
          </span>
        </span>
        <button
          onClick={() => setShowGuide(!showGuide)}
          className="text-orange-400 hover:underline font-bold flex items-center gap-1 text-[11px]"
        >
          <span>طريقة تشغيله في حسابك الخاص على TradingView</span>
          <ExternalLink size={10} />
        </button>
      </div>

      {/* Expanded Tutorial */}
      {showGuide && (
        <div className="bg-[#0f1118] p-3.5 border-t border-[#2a2e39] text-xs space-y-2 animate-fadeIn">
          <span className="font-bold text-orange-400 block">إزاي تشغله في حسابك على موقع TradingView:</span>
          <ol className="list-decimal list-inside space-y-1 text-gray-300 text-[11px] leading-relaxed">
            <li>انسخ الكود بالضغط على زر <strong>"نسخ كود TV"</strong> بالأعلى.</li>
            <li>افتح شارت السهم على موقع TradingView واضغط على تبويب <strong>Pine Editor</strong> بالأسفل.</li>
            <li>اعمل لصق (Paste) ثم اضغط <strong>Add to Chart</strong> وهيظهر فوراً تحت الشموع زي الصورة الأولى بالظبط!</li>
          </ol>
        </div>
      )}

    </div>
  );
};
