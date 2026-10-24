import React, { useState } from 'react';
import { 
  X, TrendingUp, TrendingDown, Target, ShieldAlert, 
  BarChart2, CheckCircle2, Plus, Briefcase, Maximize2, Minimize2,
  Activity, ArrowUpRight, FlaskConical
} from 'lucide-react';
import { StockData, PortfolioPosition } from '../types';
import { formatPrice } from '../services/egxService';
import { getStockFundamentalProfile } from '../services/egxFundamentalData';
import { TradingViewWidget } from './TradingViewWidget';
import { MdButton, MdBadge } from './material';
import { LastUpdatedBanner } from './LastUpdatedBanner';

interface Props {
  stock: StockData;
  portfolio: PortfolioPosition[];
  theme?: 'dark' | 'light';
  onClose: () => void;
  onAddToPortfolio: (position: Omit<PortfolioPosition, 'id'>) => void;
  onOpenLabWithStock?: (symbol: string) => void;
  lastUpdated?: Date;
}

export const StockDetailModal: React.FC<Props> = ({ 
  stock, 
  portfolio, 
  theme = 'dark', 
  onClose, 
  onAddToPortfolio, 
  onOpenLabWithStock,
  lastUpdated 
}) => {
  const [sharesToAdd, setSharesToAdd] = useState<number>(100);
  const [showAddSuccess, setShowAddSuccess] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [modalMode, setModalMode] = useState<'fullscreen_chart' | 'chart_and_indicators'>('fullscreen_chart');

  // Fundamental Profile
  const fundamental = getStockFundamentalProfile(stock.symbol);

  // Check if stock is owned in portfolio
  const ownedPosition = portfolio.find(p => p.symbol.toUpperCase() === stock.symbol.toUpperCase());

  const isBullish = stock.recommendationScore > 0.08;
  const isBearish = stock.recommendationScore < -0.08;

  // System automatically calculates stop-loss and targets based on technical analysis
  const precision = stock.isFund ? 5 : 2;
  const autoStopLoss = Number(stock.support1.toFixed(precision));
  const autoTarget1 = Number(stock.resistance1.toFixed(precision));
  const autoTarget2 = Number(stock.resistance2.toFixed(precision));

  const handleAdd = () => {
    onAddToPortfolio({
      symbol: stock.symbol,
      assetType: stock.isFund ? 'fund' : 'stock',
      buyPrice: stock.close,
      shares: sharesToAdd,
      buyDate: new Date().toISOString().split('T')[0],
      stopLoss: autoStopLoss,
      targetPrice: autoTarget1,
      notes: `إضافة مباشرة بسعر ${stock.close} ج.م • مستهدف مقترح ${autoTarget1} ج.م`
    });
    setShowAddSuccess(true);
    setTimeout(() => setShowAddSuccess(false), 2500);
  };

  const tradingViewDirectUrl = `https://ar.tradingview.com/chart/?symbol=${encodeURIComponent(stock.ticker)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
      <div 
        className={`relative w-full ${
          isFullscreen ? 'w-screen h-screen rounded-none max-w-none' : 'max-w-[1900px] h-[96vh] rounded-[28px]'
        } bg-md-surface-container-high border border-md-outline-variant shadow-md-5 flex flex-col overflow-hidden text-right transition-all duration-300 text-md-on-surface`}
        dir="rtl"
      >
        {/* Modal Top Bar (M3 App Bar) */}
        <div className="flex items-center justify-between px-6 py-3.5 border-b border-md-outline-variant/60 bg-md-surface-container flex-shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-[16px] bg-md-surface-container-highest border border-md-outline-variant/60 flex items-center justify-center font-extrabold text-lg text-md-on-surface font-mono shadow-sm">
              {stock.symbol}
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h2 className="text-xl font-bold text-md-on-surface">{stock.nameAr}</h2>
                <span className="text-xs text-md-on-surface-variant font-mono">({stock.ticker})</span>
                
                {ownedPosition && (
                  <MdBadge variant="primary">
                    <Briefcase size={13} />
                    <span>مملوك في محفظتك ({ownedPosition.shares.toLocaleString('en-US')} سهم)</span>
                  </MdBadge>
                )}

                {stock.isEGX30 && (
                  <span className="text-[10px] bg-md-secondary-container text-md-on-secondary-container px-2.5 py-0.5 rounded-md-full font-bold">
                    EGX 30
                  </span>
                )}
                {stock.isEGX70 && (
                  <span className="text-[10px] bg-md-tertiary-container text-md-on-tertiary-container px-2.5 py-0.5 rounded-md-full font-bold">
                    EGX 70
                  </span>
                )}
                {stock.isEGX100 && (
                  <span className="text-[10px] bg-md-surface-container-highest text-md-on-surface border border-md-outline-variant px-2.5 py-0.5 rounded-md-full font-bold">
                    EGX 100
                  </span>
                )}
              </div>
              <div className="flex items-center gap-4 mt-1">
                <span className="font-mono text-2xl font-extrabold text-md-on-surface">{formatPrice(stock.close, stock.isFund)} ج.م</span>
                <span className={`font-mono font-bold text-sm flex items-center gap-1 ${
                  stock.changePercent >= 0 ? 'text-md-primary' : 'text-md-error'
                }`}>
                  {stock.changePercent >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                  {stock.changePercent >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                </span>
                <span className="text-xs text-md-on-surface-variant font-mono">
                  حجم التداول: <strong className="text-md-on-surface">{stock.volume.toLocaleString('en-US')}</strong> سهم
                </span>
              </div>

              {/* Fundamental Health Quick Badge */}
              <div className="flex items-center gap-2 mt-2 flex-wrap text-xs">
                <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] border flex items-center gap-1 ${
                  fundamental.financialHealthGrade === 'EXCELLENT' || fundamental.financialHealthGrade === 'GOOD'
                    ? 'bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 border-emerald-500/30'
                    : fundamental.financialHealthGrade === 'HIGH_RISK_DISTRESSED'
                    ? 'bg-rose-500/15 text-rose-800 dark:text-rose-300 border-rose-500/30'
                    : 'bg-amber-500/15 text-amber-800 dark:text-amber-300 border-amber-500/30'
                }`}>
                  <span>🏛️ {fundamental.headlineSummary}</span>
                  <span className="font-mono">({fundamental.peRatio > 0 ? `P/E: ${fundamental.peRatio}x` : 'خسائر مرحلة'})</span>
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            {/* View Mode Switcher (M3 Segmented Button) */}
            <div className="flex items-center bg-md-surface p-1 rounded-md-full border border-md-outline-variant/60 text-xs">
              <button
                onClick={() => setModalMode('fullscreen_chart')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-md-full font-bold transition-all ${
                  modalMode === 'fullscreen_chart' 
                    ? 'bg-md-secondary-container text-md-on-secondary-container shadow-sm' 
                    : 'text-md-on-surface-variant hover:text-md-on-surface'
                }`}
              >
                <Maximize2 size={13} />
                <span>شارت يملأ الشاشة</span>
              </button>

              <button
                onClick={() => setModalMode('chart_and_indicators')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-md-full font-bold transition-all ${
                  modalMode === 'chart_and_indicators' 
                    ? 'bg-md-secondary-container text-md-on-secondary-container shadow-sm' 
                    : 'text-md-on-surface-variant hover:text-md-on-surface'
                }`}
              >
                <Activity size={13} />
                <span>الشارت + التحليل الرقمي</span>
              </button>
            </div>

            <a
              href={tradingViewDirectUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 bg-md-surface hover:bg-md-surface-container border border-md-outline-variant text-md-on-surface rounded-md-full text-xs font-semibold transition-all shadow-sm"
              title="فتح الشارت في موقع TradingView الرسمي"
            >
              <span>TradingView الرسمي</span>
              <ArrowUpRight size={14} className="text-md-tertiary" />
            </a>

            {/* Direct Link to the 7-Layers Lab */}
            {onOpenLabWithStock && !stock.isFund && !stock.isGold && (
              <button
                onClick={() => {
                  onClose();
                  onOpenLabWithStock(stock.symbol);
                }}
                className="flex items-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-extrabold rounded-md-full text-xs shadow-md transition-all select-none"
                title="فتح السهم في المعمل العملي بالـ 7 طبقات والتحليل المالي"
              >
                <FlaskConical size={14} />
                <span>فحص بالمعمل (7 طبقات + ماليات) 🔬</span>
              </button>
            )}

            <div className={`px-3 py-1.5 rounded-md-full text-xs font-bold border ${
              isBullish 
                ? 'bg-md-primary-container text-md-on-primary-container border-md-primary/30' 
                : isBearish 
                  ? 'bg-md-error-container text-md-on-error-container border-md-error/30' 
                  : 'bg-md-surface-container-highest text-md-on-surface border-md-outline-variant/60'
            }`}>
              إشارة: {stock.recommendationText}
            </div>

            <button 
              onClick={() => setIsFullscreen(!isFullscreen)}
              title={isFullscreen ? 'تصغير' : 'ملء الشاشة بالكامل (100% Fullscreen)'}
              className="p-2 rounded-full text-md-on-surface-variant hover:text-md-on-surface hover:bg-md-surface-container transition-colors"
            >
              {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
            </button>

            <button 
              onClick={onClose}
              className="p-2 rounded-full text-md-on-surface-variant hover:text-md-on-surface hover:bg-md-surface-container transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Date of Last Update Banner */}
        <div className="px-6 pt-3">
          <LastUpdatedBanner
            lastUpdated={lastUpdated}
            tabTitle={`شارت وتحليل مباشر لـ ${stock.symbol} (${stock.nameAr})`}
          />
        </div>

        {/* Modal Body */}
        {modalMode === 'fullscreen_chart' ? (
          /* Pure Fullscreen Theater Chart Mode - 100% Height */
          <div className="flex-1 flex flex-col p-3 bg-md-surface overflow-hidden">
            <div className="flex-1 w-full h-full relative rounded-[20px] overflow-hidden border border-md-outline-variant/60">
              <TradingViewWidget 
                symbol={stock.ticker} 
                theme={theme} 
                height="100%" 
              />
            </div>

            {/* Bottom Quick-Action Info Ribbon in M3 Surface Container */}
            <div className="flex items-center justify-between px-5 py-2.5 bg-md-surface-container rounded-[16px] border border-md-outline-variant/60 mt-2.5 text-xs font-mono flex-wrap gap-3">
              <div className="flex items-center gap-4 flex-wrap">
                <span className="text-md-on-surface-variant font-sans">وقف الخسارة المقترح (S1): <strong className="text-amber-500">{autoStopLoss} ج.م</strong></span>
                <span className="text-md-on-surface-variant font-sans">المستهدف الأول (R1): <strong className="text-md-primary">{autoTarget1} ج.م</strong></span>
                <span className="text-md-on-surface-variant font-sans">المستهدف الثاني (R2): <strong className="text-md-tertiary">{autoTarget2} ج.م</strong></span>
                <span className="text-md-on-surface-variant font-sans">نقطة الارتكاز: <strong className="text-md-on-surface">{stock.pivot.toFixed(2)} ج.م</strong></span>
              </div>

              <div className="flex items-center gap-2">
                {onOpenLabWithStock && !stock.isFund && !stock.isGold && (
                  <button
                    onClick={() => {
                      onClose();
                      onOpenLabWithStock(stock.symbol);
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/15 hover:bg-amber-500/25 text-amber-800 dark:text-amber-300 border border-amber-500/40 rounded-md-full text-xs font-bold transition-all shadow-sm"
                  >
                    <FlaskConical size={14} className="text-amber-500" />
                    <span>فحص بالمعمل 🔬</span>
                  </button>
                )}
                <MdButton
                  variant="filled"
                  size="sm"
                  icon={showAddSuccess ? <CheckCircle2 size={15} /> : <Plus size={15} />}
                  onClick={handleAdd}
                  disabled={showAddSuccess}
                >
                  {showAddSuccess ? 'تمت الإضافة للمحفظة!' : 'إضافة السهم للمحفظة بالمستويات'}
                </MdButton>
              </div>
            </div>
          </div>
        ) : (
          /* Standard Multi-Panel Mode (Chart + Indicator Breakdown) */
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
            <div className="w-full">
              <TradingViewWidget 
                symbol={stock.ticker} 
                theme={theme} 
                height={720} 
              />
            </div>

            {/* Technical Pivots & Pro Recommendations Grid (M3 Elevated Cards) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Classic Pivots */}
              <div className="bg-md-surface border border-md-outline-variant/60 rounded-[20px] p-5 shadow-sm">
                <h3 className="text-sm font-bold text-md-on-surface mb-3 flex items-center gap-2">
                  <Target size={17} className="text-amber-500" />
                  <span>مستويات الدعم والمقاومة المقترحة آلياً</span>
                </h3>
                <div className="space-y-2.5 text-xs font-mono">
                  <div className="flex justify-between items-center py-1.5 border-b border-md-outline-variant/40">
                    <span className="text-md-on-surface-variant font-sans">مقاومة ثانية (مستهدف 2 - R2):</span>
                    <span className="font-bold text-md-tertiary text-sm">{formatPrice(autoTarget2, stock.isFund)} ج.م</span>
                  </div>
                  <div className="flex justify-between items-center py-1.5 border-b border-md-outline-variant/40">
                    <span className="text-md-on-surface-variant font-sans">مقاومة أولى (مستهدف 1 - R1):</span>
                    <span className="font-bold text-md-primary text-sm">{formatPrice(autoTarget1, stock.isFund)} ج.م</span>
                  </div>
                  <div className="flex justify-between items-center py-2 px-3 bg-md-surface-container rounded-[12px] border border-md-outline-variant/50">
                    <span className="text-md-on-surface font-sans font-bold">نقطة الارتكاز (Pivot Point):</span>
                    <span className="font-bold text-md-on-surface text-sm">{formatPrice(stock.pivot, stock.isFund)} ج.م</span>
                  </div>
                  <div className="flex justify-between items-center py-1.5 border-b border-md-outline-variant/40">
                    <span className="text-md-on-surface-variant font-sans">دعم أول (وقف خسارة مقترح - S1):</span>
                    <span className="font-bold text-amber-500 text-sm">{formatPrice(autoStopLoss, stock.isFund)} ج.م</span>
                  </div>
                  <div className="flex justify-between items-center py-1.5">
                    <span className="text-md-on-surface-variant font-sans">دعم ثانٍ (وقف خسارة صارم - S2):</span>
                    <span className="font-bold text-md-error text-sm">{formatPrice(stock.support2, stock.isFund)} ج.م</span>
                  </div>
                </div>
              </div>

              {/* Technical Indicators */}
              <div className="bg-md-surface border border-md-outline-variant/60 rounded-[20px] p-5 shadow-sm">
                <h3 className="text-sm font-bold text-md-on-surface mb-3 flex items-center gap-2">
                  <Activity size={17} className="text-md-tertiary" />
                  <span>المؤشرات الفنية والمتوسطات</span>
                </h3>
                <div className="space-y-2.5 text-xs font-mono">
                  <div className="flex justify-between items-center py-1.5 border-b border-md-outline-variant/40">
                    <span className="text-md-on-surface-variant font-sans">مؤشر القوة النسبية (RSI 14):</span>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-md-on-surface text-sm">{stock.rsi.toFixed(1)}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-md-full font-sans font-bold ${
                        stock.rsi < 35 ? 'bg-md-primary-container text-md-on-primary-container' :
                        stock.rsi > 70 ? 'bg-md-error-container text-md-on-error-container' :
                        'bg-md-surface-container-highest text-md-on-surface'
                      }`}>
                        {stock.rsi < 35 ? 'تشبع بيعي (شراء)' : stock.rsi > 70 ? 'تشبع شرائي' : 'منطقة متوازنة'}
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center py-1.5 border-b border-md-outline-variant/40">
                    <span className="text-md-on-surface-variant font-sans">متوسط 20 يوم (EMA 20):</span>
                    <span className="font-bold text-md-on-surface text-sm">{formatPrice(stock.ema20, stock.isFund)} ج.م</span>
                  </div>
                  <div className="flex justify-between items-center py-1.5 border-b border-md-outline-variant/40">
                    <span className="text-md-on-surface-variant font-sans">متوسط 50 يوم (EMA 50):</span>
                    <span className="font-bold text-md-on-surface text-sm">{formatPrice(stock.ema50, stock.isFund)} ج.م</span>
                  </div>
                  <div className="flex justify-between items-center py-1.5">
                    <span className="text-md-on-surface-variant font-sans">متوسط 200 يوم (الاتجاه العام):</span>
                    <span className={`font-bold text-sm ${stock.close >= stock.ema200 ? 'text-md-primary' : 'text-md-error'}`}>
                      {formatPrice(stock.ema200, stock.isFund)} ج.م
                    </span>
                  </div>
                </div>
              </div>

              {/* Auto Portfolio Link */}
              <div className="bg-md-surface border border-md-outline-variant/60 rounded-[20px] p-5 shadow-sm flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-bold text-md-on-surface mb-2 flex items-center gap-2">
                    <Briefcase size={17} className="text-md-primary" />
                    <span>إضافة السهم لمحفظتك</span>
                  </h3>
                  <p className="text-xs text-md-on-surface-variant leading-relaxed mb-4">
                    يقوم النظام آلياً بضبط وقف الخسارة عند <strong className="text-amber-500">{autoStopLoss} ج.م</strong> والمستهدف عند <strong className="text-md-primary">{autoTarget1} ج.م</strong> لتفعيل التنبيهات الذكية.
                  </p>

                  <div className="flex items-center gap-3 mb-4">
                    <label className="text-xs text-md-on-surface font-semibold">الكمية:</label>
                    <input 
                      type="number"
                      value={sharesToAdd}
                      onChange={(e) => setSharesToAdd(Math.max(1, parseInt(e.target.value) || 0))}
                      className="w-28 bg-md-surface-container-high border border-md-outline rounded-md-md px-3 py-2 text-sm font-mono text-center text-md-on-surface focus:outline-none focus:border-md-primary"
                    />
                    <span className="text-xs text-md-on-surface-variant font-mono">
                      = {(sharesToAdd * stock.close).toLocaleString('en-US')} ج.م
                    </span>
                  </div>
                </div>

                {showAddSuccess ? (
                  <div className="p-3 bg-md-primary-container text-md-on-primary-container rounded-md-md text-xs font-bold flex items-center justify-center gap-2">
                    <CheckCircle2 size={16} />
                    <span>تمت إضافة السهم لمحفظتك بنجاح!</span>
                  </div>
                ) : (
                  <MdButton
                    variant="filled"
                    icon={<Plus size={16} />}
                    onClick={handleAdd}
                    className="w-full"
                  >
                    إضافة السهم للمحفظة الآن
                  </MdButton>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
