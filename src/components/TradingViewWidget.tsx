import React, { useEffect, useRef } from 'react';

interface Props {
  symbol: string; // e.g. "EGX:COMI" or "COMI"
  theme?: 'dark' | 'light';
  interval?: string;
  height?: number | string;
  studies?: string[];
}

export const TradingViewWidget: React.FC<Props> = ({
  symbol,
  theme = 'dark',
  interval = 'D',
  height = 700, // Generous default height
  studies = [
    'RSI@tv-basicstudies',
    'MASimple@tv-basicstudies',
    'MAExp@tv-basicstudies'
  ]
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Normalize symbol: if user passed "COMI", make it "EGX:COMI"
  const formattedSymbol = symbol.startsWith('EGX:') ? symbol : `EGX:${symbol}`;

  useEffect(() => {
    if (!containerRef.current) return;

    // Clear previous widget
    containerRef.current.innerHTML = '';

    const widgetContainer = document.createElement('div');
    widgetContainer.className = 'tradingview-widget-container__widget';
    widgetContainer.style.height = '100%';
    widgetContainer.style.width = '100%';
    containerRef.current.appendChild(widgetContainer);

    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js';
    script.type = 'text/javascript';
    script.async = true;
    script.innerHTML = JSON.stringify({
      autosize: true,
      symbol: formattedSymbol,
      interval: interval,
      timezone: 'Africa/Cairo',
      theme: theme,
      style: '1', // Candlesticks
      locale: 'ar_AE',
      enable_publishing: false,
      allow_symbol_change: true,
      hide_side_toolbar: false,
      details: false, // Turn off sidebar widget to give maximum width to the candlestick chart
      hotlist: false,
      calendar: false,
      studies: studies,
      support_host: 'https://www.tradingview.com'
    });

    containerRef.current.appendChild(script);

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, [formattedSymbol, theme, interval, JSON.stringify(studies)]);

  // Compute CSS height: ensure explicit pixel minimum so TradingView iframe never collapses
  const styleHeight = typeof height === 'number' ? `${height}px` : height;

  return (
    <div 
      className="relative w-full h-full rounded-2xl overflow-hidden border border-egx-border bg-egx-card shadow-2xl"
      style={{ height: styleHeight, minHeight: styleHeight === '100%' ? '100%' : '650px' }}
    >
      <div 
        ref={containerRef} 
        style={{ height: '100%', width: '100%' }}
        className="tradingview-widget-container"
      />
    </div>
  );
};
