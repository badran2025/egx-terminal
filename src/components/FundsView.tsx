import React, { useState } from 'react';
import { 
  Coins, Search, ShieldCheck, Plus, Check,
  Wallet, Calculator, Info, Sparkles, Building2,
  TrendingUp, BarChart3, Landmark, ShieldAlert, Award,
  Layers, Compass, CheckCircle2
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

  const CATEGORY_TABS = [
    { key: 'all', label: 'جميع الصناديق والأوعية (73)', count: 73, desc: 'الدليل الكامل لكافة صناديق وأوعية ثاندر الرسمية بسياساتها الاستثمارية الحقيقية' },
    { key: 'أسهم نشطة', label: 'صناديق الأسهم النشطة (28)', count: 28, desc: 'إدارة بشرية محترفة منتقاة للقطاعات الواعدة (عقارات، تصدير، بنوك، تكنولوجيا، High Dividend)' },
    { key: 'أسهم مؤشرات (سلبية)', label: 'صناديق الأسهم السلبية (12)', count: 12, desc: 'تتبع حرفي دقيق لمؤشرات البورصة: السبعيني EGX70 (4 صناديق) • المئوي EGX100 (بلتون مية مية) • الثلاثيني EGX30 • مؤشرات الشريعة ومؤشرات التقلب المنخفض' },
    { key: 'دخل ثابت ونقدي', label: 'صناديق الدخل الثابت (23)', count: 23, desc: 'استثمار آمن في أذون وسندات الخزانة والودائع البنكية بعوائد دورية ويومية معفاة من الضرائب' },
    { key: 'كلاودز', label: 'الكلاودز (2)', count: 2, desc: 'أوعية كاش ادخار مباشر من ثاندر وأزيموت بعائد مركب دوري (يومي 19.25% وشهري 21.50%) وسحب فوري مجاني' },
    { key: 'ذهب وفضة', label: 'صناديق الذهب والفضة (8)', count: 8, desc: 'وثائق مدعومة بسبائك الذهب الخالص عيار 24 والفضة 999 بالخزائن المؤمنة للتحوط ضد التضخم' },
  ];

  const filtered = EGYPTIAN_MUTUAL_FUNDS.filter(f => {
    const matchesFilter = filter === 'all' || f.category === filter;
    const q = search.trim().toLowerCase();
    if (!q) return matchesFilter;

    const matchesSearch = 
      f.name.toLowerCase().includes(q) || 
      f.code.toLowerCase().includes(q) ||
      (f.benchmark && f.benchmark.toLowerCase().includes(q)) ||
      (f.strategy && f.strategy.toLowerCase().includes(q)) ||
      (f.sectorFocus && f.sectorFocus.toLowerCase().includes(q));

    return matchesFilter && matchesSearch;
  });

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
        currentPriceManual: goldPrice,
        buyDate: new Date().toISOString().split('T')[0],
        stopLoss: Number((goldPrice * 0.95).toFixed(2)),
        targetPrice: Number((goldPrice * 1.05).toFixed(2)),
        breakEvenPrice: Number((goldPrice * 1.0202).toFixed(2)),
        notes: 'صندوق ذهب ثاندر عيار 24 (سعر السوق الحقيقي)'
      });
    } else if (fund.isSavingPot) {
      onAddToPortfolio({
        symbol: fund.code.toUpperCase(),
        assetType: 'fund',
        shares: simulatedDeposit || 1000,
        buyPrice: 1,
        currentPriceManual: 1,
        buyDate: new Date().toISOString().split('T')[0],
        stopLoss: 1,
        targetPrice: Number((1 * 1.20).toFixed(2)),
        notes: `وعاء ادخار كاش: ${fund.name} • عائد دوري مركب`
      });
    } else {
      onAddToPortfolio({
        symbol: fund.code.toUpperCase(),
        assetType: 'fund',
        shares: 100,
        buyPrice: fund.nav || 10,
        currentPriceManual: fund.nav || 10,
        buyDate: new Date().toISOString().split('T')[0],
        notes: `${fund.name} • ${fund.benchmark || fund.category}`
      });
    }

    setAddedFundId(fund.id);
    setTimeout(() => setAddedFundId(null), 2500);
  };

  const getCategoryBadgeLabel = (category: string) => {
    switch (category) {
      case 'أسهم نشطة': return 'صناديق أسهم نشطة';
      case 'أسهم مؤشرات (سلبية)': return 'صناديق أسهم سلبية';
      case 'دخل ثابت ونقدي': return 'صناديق دخل ثابت';
      case 'كلاودز': return 'الكلاودز (كاش)';
      case 'ذهب وفضة': return 'صناديق الذهب والفضة';
      default: return category;
    }
  };

  const getBenchmarkBadgeClass = (benchmark?: string, code?: string) => {
    const b = (benchmark || '').toUpperCase();
    const c = (code || '').toUpperCase();

    if (b.includes('EGX100') || c === 'BMM') {
      return 'bg-purple-500/15 text-purple-700 dark:text-purple-300 border-purple-500/30';
    }
    if (b.includes('EGX70') || ['T70', 'B70', 'AK70', 'NCS'].includes(c)) {
      return 'bg-teal-500/15 text-teal-700 dark:text-teal-300 border-teal-500/30';
    }
    if (b.includes('EGX30') || c === 'CI30') {
      return 'bg-blue-500/15 text-blue-700 dark:text-blue-300 border-blue-500/30';
    }
    if (b.includes('شريعة') || b.includes('EGX33')) {
      return 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30';
    }
    if (b.includes('EGX35') || b.includes('VOLATILITY') || b.includes('تقلّب') || b.includes('تقلب')) {
      return 'bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 border-indigo-500/30';
    }
    if (b.includes('ذهب')) {
      return 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30';
    }
    if (b.includes('فضة')) {
      return 'bg-slate-500/15 text-slate-700 dark:text-slate-300 border-slate-500/30';
    }
    if (b.includes('أذون') || b.includes('خزانة') || b.includes('دخل ثابت')) {
      return 'bg-sky-500/15 text-sky-700 dark:text-sky-300 border-sky-500/30';
    }
    return 'bg-md-surface-container-high text-md-on-surface border-md-outline-variant/60';
  };

  return (
    <div className="space-y-6 text-md-on-surface" dir="rtl">
      {/* Date of Last Update Banner */}
      <LastUpdatedBanner
        lastUpdated={lastUpdated}
        onRefresh={onRefresh}
        isLoading={isLoading}
        tabTitle="دليل وثائق الاستثمار وأوعية كلاودز (السياسة الاستثمارية الدقيقة لـ 73 خياراً)"
      />

      {/* Top Header Card - Compact & Clean */}
      <MdCard variant="elevated" className="p-3.5 sm:p-4 shadow-xs relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-md-primary-container text-md-on-primary-container flex items-center justify-center shadow-xs shrink-0">
              <Coins size={19} />
            </div>
            <div>
              <h2 className="font-black text-base sm:text-lg tracking-tight text-md-on-surface">
                دليل صناديق الاستثمار ومؤشراتها وسياساتها الرسمية
              </h2>
              <p className="text-xs text-md-on-surface-variant font-medium mt-0.5">
                توثيق رسمي شامل لـ 73 خياراً: كل صندوق مربوط بمؤشره الحقيقي (EGX70, EGX100, EGX30) وسياسة إدارته المعتمدة.
              </p>
            </div>
          </div>

          {/* Search Box */}
          <div className="w-full lg:w-80">
            <MdTextField
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="ابحث بالمؤشر أو الكود (T70, مية مية, عقارات)..."
              leadingIcon={<Search size={16} />}
            />
          </div>
        </div>

        {/* 5 Official Categories Summary Grid (User Defined) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 mt-3 pt-3 border-t border-md-outline-variant/40">
          <button 
            onClick={() => setFilter('أسهم نشطة')}
            className={`p-3 rounded-2xl text-right transition-all border ${
              filter === 'أسهم نشطة' 
                ? 'bg-md-primary-container/60 border-md-primary shadow-sm ring-1 ring-md-primary/30' 
                : 'bg-md-surface-container-low hover:bg-md-surface-container border-md-outline-variant/50'
            }`}
          >
            <div className="text-[11px] font-bold text-md-primary">صناديق أسهم نشطة</div>
            <div className="text-lg font-mono font-extrabold text-md-on-surface mt-0.5">28 صندوق</div>
            <div className="text-[10px] text-md-on-surface-variant mt-0.5">انتقاء قطاعي (عقارات، تصدير، مدفوعات)</div>
          </button>

          <button 
            onClick={() => setFilter('أسهم مؤشرات (سلبية)')}
            className={`p-3 rounded-2xl text-right transition-all border ${
              filter === 'أسهم مؤشرات (سلبية)' 
                ? 'bg-md-primary-container/60 border-md-primary shadow-sm ring-1 ring-md-primary/30' 
                : 'bg-md-surface-container-low hover:bg-md-surface-container border-md-outline-variant/50'
            }`}
          >
            <div className="text-[11px] font-bold text-sky-600 dark:text-sky-400">صناديق أسهم سلبية</div>
            <div className="text-lg font-mono font-extrabold text-md-on-surface mt-0.5">12 صندوق</div>
            <div className="text-[10px] text-md-on-surface-variant mt-0.5">EGX70 (4) • EGX100 (1) • EGX30 • شريعة</div>
          </button>

          <button 
            onClick={() => setFilter('دخل ثابت ونقدي')}
            className={`p-3 rounded-2xl text-right transition-all border ${
              filter === 'دخل ثابت ونقدي' 
                ? 'bg-md-primary-container/60 border-md-primary shadow-sm ring-1 ring-md-primary/30' 
                : 'bg-md-surface-container-low hover:bg-md-surface-container border-md-outline-variant/50'
            }`}
          >
            <div className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">صناديق الدخل الثابت</div>
            <div className="text-lg font-mono font-extrabold text-md-on-surface mt-0.5">23 صندوق</div>
            <div className="text-[10px] text-md-on-surface-variant mt-0.5">أذون وسندات خزانة وعوائد يومية</div>
          </button>

          <button 
            onClick={() => setFilter('كلاودز')}
            className={`p-3 rounded-2xl text-right transition-all border ${
              filter === 'كلاودز' 
                ? 'bg-md-primary-container/60 border-md-primary shadow-sm ring-1 ring-md-primary/30' 
                : 'bg-md-surface-container-low hover:bg-md-surface-container border-md-outline-variant/50'
            }`}
          >
            <div className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400">الكلاودز (أوعية كاش)</div>
            <div className="text-lg font-mono font-extrabold text-md-on-surface mt-0.5">2 أوعية</div>
            <div className="text-[10px] text-md-on-surface-variant mt-0.5">عائد مركب دوري وسحب فوري مجاني</div>
          </button>

          <button 
            onClick={() => setFilter('ذهب وفضة')}
            className={`p-3 rounded-2xl text-right transition-all border ${
              filter === 'ذهب وفضة' 
                ? 'bg-md-primary-container/60 border-md-primary shadow-sm ring-1 ring-md-primary/30' 
                : 'bg-md-surface-container-low hover:bg-md-surface-container border-md-outline-variant/50'
            }`}
          >
            <div className="text-[11px] font-bold text-amber-600 dark:text-amber-400">صناديق الذهب والفضة</div>
            <div className="text-lg font-mono font-extrabold text-md-on-surface mt-0.5">8 صناديق</div>
            <div className="text-[10px] text-md-on-surface-variant mt-0.5">سبائك عيار 24 وفضة 999 وتحوط</div>
          </button>
        </div>
      </MdCard>

      {/* Quick Benchmark Filters for Fast Navigation */}
      <div className="bg-md-surface-container-low border border-md-outline-variant/50 rounded-[20px] p-3 flex items-center justify-between gap-3 overflow-x-auto text-xs">
        <span className="font-bold text-md-primary whitespace-nowrap flex items-center gap-1.5 shrink-0">
          <Compass size={15} />
          <span>مؤشرات سريعة:</span>
        </span>
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setSearch('')}
            className={`px-3 py-1 rounded-full font-bold whitespace-nowrap transition-colors ${!search ? 'bg-md-primary text-md-on-primary' : 'bg-md-surface hover:bg-md-surface-container-high text-md-on-surface'}`}
          >
            الكل ({filtered.length})
          </button>
          <button
            onClick={() => setSearch('EGX70')}
            className={`px-3 py-1 rounded-full font-bold whitespace-nowrap transition-colors border border-teal-500/30 ${search.includes('EGX70') ? 'bg-teal-600 text-white' : 'bg-teal-500/10 text-teal-700 dark:text-teal-300'}`}
          >
            مؤشر السبعيني EGX70 (4 صناديق: T70, B70, AK70, NCS)
          </button>
          <button
            onClick={() => setSearch('EGX100')}
            className={`px-3 py-1 rounded-full font-bold whitespace-nowrap transition-colors border border-purple-500/30 ${search.includes('EGX100') ? 'bg-purple-600 text-white' : 'bg-purple-500/10 text-purple-700 dark:text-purple-300'}`}
          >
            مؤشر المئوي EGX100 (بلتون مية مية BMM)
          </button>
          <button
            onClick={() => setSearch('EGX30')}
            className={`px-3 py-1 rounded-full font-bold whitespace-nowrap transition-colors border border-blue-500/30 ${search.includes('EGX30') ? 'bg-blue-600 text-white' : 'bg-blue-500/10 text-blue-700 dark:text-blue-300'}`}
          >
            مؤشر الثلاثيني EGX30 (CI30)
          </button>
          <button
            onClick={() => setSearch('شريعة')}
            className={`px-3 py-1 rounded-full font-bold whitespace-nowrap transition-colors border border-emerald-500/30 ${search.includes('شريعة') ? 'bg-emerald-600 text-white' : 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'}`}
          >
            متوافقة مع الشريعة (CMS, AKS, ASO, NHS, NMF)
          </button>
          <button
            onClick={() => setSearch('عقار')}
            className={`px-3 py-1 rounded-full font-bold whitespace-nowrap transition-colors border border-amber-500/30 ${search.includes('عقار') ? 'bg-amber-600 text-white' : 'bg-amber-500/10 text-amber-700 dark:text-amber-300'}`}
          >
            قطاع العقارات (BRE, CRE)
          </button>
          <button
            onClick={() => setSearch('تصدير')}
            className={`px-3 py-1 rounded-full font-bold whitespace-nowrap transition-colors border border-sky-500/30 ${search.includes('تصدير') ? 'bg-sky-600 text-white' : 'bg-sky-500/10 text-sky-700 dark:text-sky-300'}`}
          >
            شركات التصدير والدولار (CEX)
          </button>
        </div>
      </div>

      {/* ☁️ DEDICATED SECTION: أوعية كلاودز الادخارية في ثاندر */}
      {(filter === 'all' || filter === 'كلاودز') && (
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
      )}

      {/* Category Filter Chips Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs scrollbar-none">
        {CATEGORY_TABS.map(tab => (
          <MdChip
            key={tab.key}
            label={tab.label}
            selected={filter === tab.key}
            onClick={() => setFilter(tab.key)}
          />
        ))}
      </div>

      {/* Active Category Description Notice */}
      {filter !== 'all' && (
        <div className="bg-md-surface-container-high border border-md-outline-variant/60 rounded-[18px] p-3.5 flex items-center gap-3 text-xs text-md-on-surface">
          <Info size={18} className="text-md-primary shrink-0" />
          <div className="leading-relaxed">
            <strong className="text-md-primary font-bold">
              {CATEGORY_TABS.find(t => t.key === filter)?.label}:
            </strong>{' '}
            {CATEGORY_TABS.find(t => t.key === filter)?.desc}
          </div>
        </div>
      )}

      {/* Official NAV Notice */}
      <div className="bg-amber-500/10 border border-amber-500/30 rounded-[18px] p-3 flex items-center gap-3 text-xs text-md-on-surface">
        <Info size={16} className="text-amber-500 shrink-0" />
        <div className="leading-relaxed">
          <strong className="text-amber-700 dark:text-amber-300 font-bold">أسعار وثائق الاستثمار (NAV):</strong> يتم احتساب صافي قيمة أصول الوثيقة (NAV) بنهاية جلسات التداول دورياً من قِبل مديري الاستثمار (أزيموت، بلتون، سي آي، الأهلي، إلخ) وإفصاحات البورصة. يمكنك تحديث السعر الحالي يدوياً في محفظتك في أي وقت.
        </div>
      </div>

      {/* Modern Material 3 Data Table for Mutual Funds */}
      <div className="bg-md-surface border border-md-outline-variant/60 rounded-[24px] overflow-hidden shadow-md-1">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-md-surface-container-high text-md-on-surface-variant font-bold border-b border-md-outline-variant/60">
              <tr>
                <th className="p-4 text-center min-w-[85px] w-24">رمز الوثيقة</th>
                <th className="p-4 text-right min-w-[230px]">اسم الصندوق والجهة المصدرة</th>
                <th className="p-4 text-right min-w-[130px]">التصنيف الفعلي</th>
                <th className="p-4 text-right min-w-[190px]">المؤشر / الأصل المرجعي</th>
                <th className="p-4 text-right min-w-[130px]">سعر الوثيقة (NAV)</th>
                <th className="p-4 text-right min-w-[320px]">السياسة الاستثمارية والأصول المستهدفة</th>
                <th className="p-4 text-center min-w-[110px]">حالة الاعتماد</th>
                <th className="p-4 text-center min-w-[110px]">إضافة للمحفظة</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-md-outline-variant/40">
              {filtered.map(fund => {
                const isAdded = addedFundId === fund.id;

                return (
                  <tr 
                    key={fund.id}
                    className="hover:bg-md-surface-container-highest/60 transition-colors duration-150 group"
                  >
                    {/* Ticker / Code */}
                    <td className="p-4 text-center font-mono font-bold text-md-on-surface text-sm">
                      <span className="bg-md-surface-container-high px-2.5 py-1 rounded-md-sm border border-md-outline-variant/60 text-amber-500 font-extrabold inline-block">
                        {fund.code}
                      </span>
                    </td>

                    {/* Name & Issuer */}
                    <td className="p-4 text-right">
                      <div className="font-bold text-sm text-md-on-surface group-hover:text-md-primary transition-colors">
                        {fund.name}
                      </div>
                      <div className="text-[11px] text-md-on-surface-variant mt-0.5 font-sans">
                        {fund.isSavingPot 
                          ? 'وعاء ادخار كاش مباشر عبر ثاندر' 
                          : 'وثيقة استثمار جماعي رسمية'}
                      </div>
                    </td>

                    {/* Official Category */}
                    <td className="p-4 text-right">
                      <span className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-bold border ${
                        fund.category === 'ذهب وفضة' 
                          ? 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30' :
                        fund.category === 'كلاودز' 
                          ? 'bg-sky-500/15 text-sky-700 dark:text-sky-300 border-sky-500/30' :
                        fund.category === 'أسهم نشطة' 
                          ? 'bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 border-indigo-500/30' :
                        fund.category === 'أسهم مؤشرات (سلبية)' 
                          ? 'bg-blue-500/15 text-blue-700 dark:text-blue-300 border-blue-500/30' :
                        'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30'
                      }`}>
                        {getCategoryBadgeLabel(fund.category)}
                      </span>
                    </td>

                    {/* Exact Benchmark / Target Index */}
                    <td className="p-4 text-right">
                      <div className="space-y-1">
                        <span className={`inline-block px-2.5 py-1 rounded-lg text-xs font-bold border ${getBenchmarkBadgeClass(fund.benchmark, fund.code)}`}>
                          {fund.benchmark || 'سوق المال المصري'}
                        </span>
                        {fund.sectorFocus && (
                          <div className="text-[10px] text-md-on-surface-variant font-medium">
                            {fund.sectorFocus}
                          </div>
                        )}
                      </div>
                    </td>

                    {/* NAV / Price */}
                    <td className="p-4 text-right">
                      {fund.isSavingPot ? (
                        <div>
                          <span className="text-xs font-bold text-sky-600 dark:text-sky-400 bg-sky-500/10 border border-sky-500/25 px-2.5 py-0.5 rounded-full inline-block">
                            ادخار كاش (1.00 ج.م)
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
                              سعر بيع الجرام عيار 24 بالصاغة
                            </span>
                          ) : (
                            <span className="text-[10px] text-md-on-surface-variant font-sans block">
                              صافي قيمة الوثيقة (NAV)
                            </span>
                          )}
                        </>
                      )}
                    </td>

                    {/* Exact Policy / Strategy from Dataset */}
                    <td className="p-4 text-right text-xs text-md-on-surface-variant leading-relaxed">
                      {fund.strategy || 'صندوق استثمار مصري معتمد من الهيئة العامة للرقابة المالية'}
                    </td>

                    {/* Thndr Verified Badge */}
                    <td className="p-4 text-center">
                      <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                        <ShieldCheck size={14} />
                        <span>موثق على ثاندر</span>
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
                              ? 'bg-emerald-500 text-white shadow-sm'
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
