import React, { useState } from 'react';
import { 
  Coins, TrendingUp, TrendingDown, Search, ShieldCheck, Plus, Check,
  Wallet, Calculator, Info, Sparkles, Clock, AlertCircle
} from 'lucide-react';
import { MutualFund, PortfolioPosition } from '../types';
import { 
  EGYPTIAN_MUTUAL_FUNDS, 
  THNDR_SAVING_POTS, 
  LIVE_GOLD_24K_PRICE, 
  formatPrice 
} from '../services/egxService';
import { MdCard, MdChip, MdTextField, MdBadge, MdButton } from './material';
import { LastUpdatedBanner } from './LastUpdatedBanner';

interface Props {
  lastUpdated?: Date;
  onRefresh?: () => void;
  isLoading?: boolean;
  onAddToPortfolio?: (position: Omit<PortfolioPosition, 'id'>) => void;
}

export const FundsView: React.FC<Props> = ({
  lastUpdated,
  onRefresh,
  isLoading = false,
  onAddToPortfolio
}) => {
  const [filter, setFilter] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [addedFundId, setAddedFundId] = useState<string | null>(null);
  const [simulatedDeposit, setSimulatedDeposit] = useState<number>(10000);

  const filtered = EGYPTIAN_MUTUAL_FUNDS.filter(f => {
    const matchesFilter = filter === 'all' || f.category === filter;
    const matchesSearch = 
      f.name.includes(search) || 
      f.code.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const categories = [
    { key: 'all', label: `جميع الصناديق (${EGYPTIAN_MUTUAL_FUNDS.length})` },
    { key: 'ذهب وفضة', label: 'الذهب والفضة (8)' },
    { key: 'كلاودز', label: 'كلاودز (أوعية كاش) (2)' },
    { key: 'أسهم نشطة', label: 'الأسهم النشطة (28)' },
    { key: 'أسهم مؤشرات (سلبية)', label: 'المؤشرات والأسهم السلبية (12)' },
    { key: 'دخل ثابت ونقدي', label: 'الدخل الثابت والسيولة (23)' },
  ];

  const handleQuickAdd = (fund: MutualFund) => {
    if (!onAddToPortfolio) return;
    const isGold = fund.code.toUpperCase() === 'THNDRGOLD' || fund.category === 'ذهب وفضة';
    
    if (isGold && fund.code.toUpperCase() === 'THNDRGOLD') {
      const goldPrice = fund.nav || LIVE_GOLD_24K_PRICE;
      onAddToPortfolio({
        symbol: 'THNDRGOLD',
        assetType: 'gold',
        shares: 0.1,
        grams: 0.1,
        isGold: true,
        buyPrice: goldPrice,
        buyDate: new Date().toISOString().split('T')[0],
        stopLoss: Number((goldPrice * 0.95).toFixed(2)),
        targetPrice: Number((goldPrice * 1.05).toFixed(2)),
        breakEvenPrice: Number((goldPrice * 1.0202).toFixed(2)),
        notes: 'صندوق دهب ثاندر عيار 24'
      });
    } else if (fund.isSavingPot) {
      onAddToPortfolio({
        symbol: fund.code.toUpperCase(),
        assetType: 'fund',
        shares: simulatedDeposit || 1000,
        buyPrice: 1,
        buyDate: new Date().toISOString().split('T')[0],
        stopLoss: 1,
        targetPrice: Number((1 * 1.20).toFixed(2)),
        notes: `وعاء ادخار ${fund.name} • عائد دوري مركب`
      });
    } else {
      onAddToPortfolio({
        symbol: fund.code.toUpperCase(),
        assetType: 'fund',
        shares: 100,
        buyPrice: fund.nav || 10,
        buyDate: new Date().toISOString().split('T')[0],
        stopLoss: Number(((fund.nav || 10) * 0.95).toFixed(5)),
        targetPrice: Number(((fund.nav || 10) * 1.10).toFixed(5)),
        notes: `${fund.name} • تصنيف ${fund.category}`
      });
    }

    setAddedFundId(fund.id);
    setTimeout(() => setAddedFundId(null), 2500);
  };

  return (
    <div className="space-y-6 text-md-on-surface" dir="rtl">
      {/* Date of Last Update Banner */}
      <LastUpdatedBanner
        lastUpdated={lastUpdated}
        onRefresh={onRefresh}
        isLoading={isLoading}
        tabTitle="دليل وثائق وصناديق الاستثمار وأوعية كلاودز (73 خياراً)"
      />

      {/* Top Banner (M3 Elevated Card - Compact) */}
      <MdCard variant="elevated" className="p-4 sm:p-5 flex flex-col lg:flex-row items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-md-primary font-bold text-base">
            <div className="w-8 h-8 rounded-md-md bg-md-primary-container text-md-on-primary-container flex items-center justify-center">
              <Coins size={18} />
            </div>
            <span>دليل وثائق الاستثمار وأوعية كلاودز الادخارية على منصة ثاندر</span>
          </div>
          <p className="text-xs text-md-on-surface-variant max-w-3xl leading-relaxed">
            بيانات يومية لجميع وثائق الاستثمار المتاحة عبر منصة ثاندر: صناديق الذهب والفضة، الأسهم النشطة، صناديق تتبع المؤشرات، وصناديق الدخل الثابت بأسعار صافي قيمة الوثيقة (NAV) المحدثة، بالإضافة لحسابات كلاودز للادخار النقدي اليومي والشهري.
          </p>
        </div>

        {/* Search Input using MdTextField */}
        <div className="w-full lg:w-80">
          <MdTextField
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="ابحث بكود أو اسم الصندوق (AZG, T70, ABR, بلتون...)"
            leadingIcon={<Search size={16} />}
          />
        </div>
      </MdCard>

      {/* ☁️ DEDICATED SECTION: أوعية كلاودز الادخارية في ثاندر (حسابات عوائد كاش وليست وثائق استثمار) */}
      <div className="bg-gradient-to-r from-sky-500/10 via-cyan-500/10 to-indigo-500/10 border border-sky-500/30 rounded-[24px] p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-sky-500/20 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-sky-500 text-white flex items-center justify-center shadow-md">
              <Wallet size={20} />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-extrabold text-md-on-surface flex items-center gap-2">
                <span>أوعية كلاودز الادخارية في ثاندر (Thndr Clouds)</span>
                <span className="text-[11px] font-bold bg-sky-500/20 text-sky-700 dark:text-sky-300 px-2.5 py-0.5 rounded-full border border-sky-500/30">
                  كاش مباشر • ملوش سعر وثيقة
                </span>
              </h3>
              <p className="text-xs text-md-on-surface-variant mt-0.5">
                كلاودز مش صندوق بوثيقة (NAV) بتطلع وتنزل؛ دي حسابات كاش ادخارية بعائد مركب يومي أو شهري، فلوسك متأمنة في أذون خزانة منخفضة المخاطر مع سحب فوري 0% رسوم.
              </p>
            </div>
          </div>

          {/* Quick Simulation Input */}
          <div className="flex items-center gap-2 bg-md-surface/80 p-2 rounded-xl border border-sky-500/30 text-xs">
            <Calculator size={15} className="text-sky-500" />
            <span className="text-md-on-surface-variant whitespace-nowrap">جرب مبلغ:</span>
            <input 
              type="number" 
              value={simulatedDeposit} 
              onChange={(e) => setSimulatedDeposit(Math.max(100, Number(e.target.value)))}
              className="w-24 bg-transparent font-mono font-bold text-md-primary focus:outline-none border-b border-sky-400 text-center"
            />
            <span className="text-md-on-surface-variant font-bold">ج.م</span>
          </div>
        </div>

        {/* 2 Clouds Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {THNDR_SAVING_POTS.map(pot => {
            const isDaily = pot.type === 'daily';
            const annualRate = isDaily ? 0.1925 : 0.2150;
            const estimatedDaily = (simulatedDeposit * annualRate) / 365;
            const estimatedMonthly = (simulatedDeposit * annualRate) / 12;

            return (
              <div 
                key={pot.id}
                className="bg-md-surface border border-sky-500/25 hover:border-sky-500/60 rounded-[20px] p-4 sm:p-5 transition-all shadow-sm space-y-3 relative overflow-hidden"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-sky-600 dark:text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded-md border border-sky-500/20">
                      {pot.code}
                    </span>
                    <h4 className="text-base font-extrabold text-md-on-surface mt-1">
                      {pot.name}
                    </h4>
                    <span className="text-xs text-md-on-surface-variant block mt-0.5">
                      {pot.payoutFrequency}
                    </span>
                  </div>

                  <div className="text-left bg-sky-500/10 border border-sky-500/30 px-3 py-1.5 rounded-xl">
                    <span className="text-[10px] text-sky-600 dark:text-sky-400 font-bold block">العائد التقديري</span>
                    <span className="text-base font-mono font-extrabold text-sky-700 dark:text-sky-300">{pot.expectedAnnualRate}</span>
                  </div>
                </div>

                <p className="text-xs text-md-on-surface-variant leading-relaxed">
                  {pot.description}
                </p>

                {/* Calculation breakdown */}
                <div className="bg-sky-500/5 p-3 rounded-xl border border-sky-500/15 flex items-center justify-between text-xs">
                  <span className="text-md-on-surface-variant flex items-center gap-1">
                    <Sparkles size={13} className="text-sky-500" />
                    <span>العائد المتوقع على ({formatPrice(simulatedDeposit)} ج.م):</span>
                  </span>
                  <span className="font-mono font-extrabold text-sky-700 dark:text-sky-300 text-sm">
                    {isDaily 
                      ? `~${estimatedDaily.toFixed(2)} ج.م / يومياً` 
                      : `~${estimatedMonthly.toFixed(2)} ج.م / شهرياً`}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-1 text-[11px] text-md-on-surface-variant font-medium">
                  <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold">
                    <ShieldCheck size={14} />
                    <span>{pot.fee}</span>
                  </span>
                  <span className="font-mono text-xs text-sky-600 dark:text-sky-400 font-bold">
                    {pot.navPriceText}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Official NAV Update Notice Banner */}
      <div className="bg-amber-500/10 border border-amber-500/30 rounded-[18px] p-3.5 flex items-center gap-3 text-xs text-md-on-surface">
        <Info size={18} className="text-amber-500 shrink-0" />
        <div className="leading-relaxed">
          <strong className="text-amber-700 dark:text-amber-300 font-bold">تنبيه هام حول أسعار وثائق صناديق الاستثمار (NAV):</strong> يتم احتساب وتحديث صافي قيمة الأصول (NAV) رسميًا بنهاية جلسات التداول يومياً أو أسبوعياً من قِبل مديري الاستثمار (أزيموت، بلتون، سي آي كابيتال، العربي الإفريقي، الأهلي، إلخ) وفق إفصاحات الهيئة العامة للرقابة المالية والبورصة المصرية.
        </div>
      </div>

      {/* Category Chips using MdChip */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs scrollbar-none">
        {categories.map(cat => (
          <MdChip
            key={cat.key}
            label={cat.label}
            selected={filter === cat.key}
            onClick={() => setFilter(cat.key)}
          />
        ))}
      </div>

      {/* Modern Material 3 Data Table for Funds */}
      <div className="bg-md-surface border border-md-outline-variant/60 rounded-[24px] overflow-hidden shadow-md-1">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-md-surface-container-high text-md-on-surface-variant font-bold border-b border-md-outline-variant/60">
              <tr>
                <th className="p-4">كود الصندوق</th>
                <th className="p-4">اسم الصندوق</th>
                <th className="p-4">التصنيف الاستثماري</th>
                <th className="p-4">سعر الوثيقة (NAV)</th>
                <th className="p-4">التغير اليومي %</th>
                <th className="p-4">الحالة على ثاندر</th>
                <th className="p-4 text-center">إضافة للمحفظة</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-md-outline-variant/40">
              {filtered.map(fund => {
                const isGain = fund.dailyChange > 0;
                const isLoss = fund.dailyChange < 0;
                const isAdded = addedFundId === fund.id;

                return (
                  <tr 
                    key={fund.id}
                    className="hover:bg-md-surface-container-highest/60 transition-colors duration-150 group"
                  >
                    {/* Code */}
                    <td className="p-4 font-mono font-bold text-md-on-surface text-sm">
                      <span className="bg-md-surface-container-high px-2.5 py-1 rounded-md-sm border border-md-outline-variant/60 text-amber-500 font-extrabold">
                        {fund.code}
                      </span>
                    </td>

                    {/* Name */}
                    <td className="p-4">
                      <div className="font-bold text-sm text-md-on-surface group-hover:text-md-primary transition-colors">
                        {fund.name}
                      </div>
                      <div className="text-[11px] text-md-on-surface-variant mt-0.5">
                        {fund.isSavingPot 
                          ? 'وعاء ادخار كاش مباشر عبر ثاندر' 
                          : fund.thndrAvailable 
                          ? 'وثيقة متاحة للتداول الفوري عبر ثاندر' 
                          : 'صندوق خارج ثاندر'}
                      </div>
                    </td>

                    {/* Category */}
                    <td className="p-4">
                      <MdBadge variant={
                        fund.category === 'ذهب وفضة' ? 'secondary' :
                        fund.category === 'كلاودز' ? 'tertiary' :
                        fund.category === 'أسهم نشطة' ? 'primary' :
                        'secondary'
                      }>
                        {fund.category}
                      </MdBadge>
                    </td>

                    {/* NAV / Certificate Price */}
                    <td className="p-4">
                      {fund.isSavingPot ? (
                        <div>
                          <span className="text-xs font-bold text-sky-600 dark:text-sky-400 bg-sky-500/10 border border-sky-500/25 px-2.5 py-0.5 rounded-full inline-block">
                            لا يوجد وثيقة (ادخار كاش)
                          </span>
                          <span className="text-[10px] text-md-on-surface-variant font-sans block mt-1">
                            {fund.code === 'اليومي' ? 'عائد سنوي ~19.25% يومي' : 'عائد سنوي ~21.50% شهري'}
                          </span>
                        </div>
                      ) : (
                        <>
                          <div className="font-mono font-extrabold text-md-on-surface text-sm">
                            {fund.nav !== undefined ? (
                              <>
                                <span>{formatPrice(fund.nav, true)}</span>
                                <span className="text-[11px] text-md-on-surface-variant mr-1 font-sans font-normal">ج.م</span>
                              </>
                            ) : (
                              <span className="text-md-on-surface-variant font-normal text-xs">—</span>
                            )}
                          </div>
                          {fund.code.toUpperCase() === 'THNDRGOLD' ? (
                            <span className="text-[10px] text-amber-500 font-sans block font-semibold">
                              سعر بيع الجرام عيار 24
                            </span>
                          ) : (
                            <span className="text-[10px] text-md-on-surface-variant font-sans block">
                              صافي قيمة الوثيقة (NAV)
                            </span>
                          )}
                        </>
                      )}
                    </td>

                    {/* Daily Change */}
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1 font-mono font-bold text-xs px-2.5 py-1 rounded-md-full ${
                        isGain ? 'bg-md-primary-container text-md-on-primary-container' : 
                        isLoss ? 'bg-md-error-container text-md-on-error-container' : 
                        'bg-md-surface-container-highest text-md-on-surface'
                      }`}>
                        {isGain && <TrendingUp size={13} />}
                        {isLoss && <TrendingDown size={13} />}
                        <span>{isGain ? '+' : ''}{fund.dailyChange.toFixed(2)}%</span>
                      </span>
                    </td>

                    {/* Thndr Available Pill */}
                    <td className="p-4">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-md-primary">
                        <ShieldCheck size={16} />
                        <span>متاح وموثق على ثاندر</span>
                      </div>
                    </td>

                    {/* Add to Portfolio Action */}
                    <td className="p-4 text-center">
                      {onAddToPortfolio && (
                        <button
                          type="button"
                          onClick={() => handleQuickAdd(fund)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full font-bold text-xs transition-all ${
                            isAdded
                              ? 'bg-emerald-500 text-white'
                              : 'bg-md-surface-container hover:bg-md-primary hover:text-md-on-primary text-md-on-surface border border-md-outline-variant/60 shadow-sm'
                          }`}
                        >
                          {isAdded ? <Check size={13} /> : <Plus size={13} />}
                          <span>{isAdded ? 'تمت الإضافة' : 'إضافة'}</span>
                        </button>
                      )}
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
