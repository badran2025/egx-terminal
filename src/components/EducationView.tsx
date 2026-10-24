import React, { useState, useMemo } from 'react';
import { 
  GraduationCap, BookOpen, Layers, Search, 
  ExternalLink, ChevronDown, ChevronUp, ArrowRight,
  Smartphone, HelpCircle, CheckCircle2, Zap, Sparkles, Filter,
  Code2, Copy, Check
} from 'lucide-react';
import { INDICATORS_KNOWLEDGE_BASE, GROWTHX_SEVEN_LAYERS } from '../services/indicatorsEducationData';
import { 
  THNDR_ALL_INDICATORS, 
  THNDR_SEVEN_LAYERS_MAPPING, 
  EGX_FRIEND_GLOSSARY,
  ThndrIndicatorItem 
} from '../services/thndrIndicatorsData';
import { MdCard, MdButton, MdChip, MdTextField } from './material';
import { LastUpdatedBanner } from './LastUpdatedBanner';

interface Props {
  lastUpdated?: Date;
  onRefresh?: () => void;
  isLoading?: boolean;
  onNavigateToLab?: () => void;
}

export const EducationView: React.FC<Props> = ({ 
  lastUpdated,
  onRefresh,
  isLoading = false,
  onNavigateToLab
}) => {
  const [activeMainTab, setActiveMainTab] = useState<'thndr' | 'framework' | 'indicators'>('thndr');
  const [thndrSectionFilter, setThndrSectionFilter] = useState<'all' | 'mapping' | 'glossary' | 'tamer_zaky' | 'trend' | 'momentum' | 'volume' | 'volatility'>('all');
  const [thndrSearchQuery, setThndrSearchQuery] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({});
  const [copiedPineId, setCopiedPineId] = useState<string | null>(null);

  const copyPineScript = async (id: string, code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedPineId(id);
      setTimeout(() => setCopiedPineId(null), 3000);
    } catch {
      setCopiedPineId(id);
      setTimeout(() => setCopiedPineId(null), 3000);
    }
  };

  // Filter Thndr indicators
  const filteredThndrIndicators = useMemo(() => {
    return THNDR_ALL_INDICATORS.filter(item => {
      // Category / Section Filter
      if (thndrSectionFilter === 'tamer_zaky' && !item.isCustomScript) return false;
      if (thndrSectionFilter === 'trend' && item.category !== 'trend') return false;
      if (thndrSectionFilter === 'momentum' && item.category !== 'momentum') return false;
      if (thndrSectionFilter === 'volume' && item.category !== 'volume') return false;
      if (thndrSectionFilter === 'volatility' && item.category !== 'volatility') return false;

      // Search Query
      if (thndrSearchQuery.trim()) {
        const q = thndrSearchQuery.toLowerCase().trim();
        const matchName = item.nameEn.toLowerCase().includes(q) || item.nameAr.toLowerCase().includes(q);
        const matchOverview = item.overviewBaladi.toLowerCase().includes(q);
        const matchJob = item.jobOnThndr.toLowerCase().includes(q);
        const matchLayer = (item.layerName || '').toLowerCase().includes(q);
        return matchName || matchOverview || matchJob || matchLayer;
      }
      return true;
    });
  }, [thndrSectionFilter, thndrSearchQuery]);

  // Filter global indicators (GrowthX KB)
  const filteredIndicators = useMemo(() => {
    return INDICATORS_KNOWLEDGE_BASE.filter(item => {
      if (categoryFilter !== 'all' && item.category !== categoryFilter) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchName = item.nameEn.toLowerCase().includes(q) || item.nameAr.toLowerCase().includes(q);
        const matchOverview = item.overview.toLowerCase().includes(q);
        const matchAuthor = item.author?.toLowerCase().includes(q);
        const matchType = item.type.toLowerCase().includes(q);
        return matchName || matchOverview || matchAuthor || matchType;
      }
      return true;
    });
  }, [categoryFilter, searchQuery]);

  const toggleExpand = (id: string) => {
    setExpandedCards(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="space-y-6 animate-fadeIn text-md-on-surface" dir="rtl">
      {/* Date of Last Update Banner */}
      <LastUpdatedBanner
        lastUpdated={lastUpdated}
        onRefresh={onRefresh}
        isLoading={isLoading}
        tabTitle="أكاديمية المؤشرات الفنية وموسوعة مؤشرات ثاندر بالبلدي"
      />

      {/* 1. M3 Hero Banner */}
      <div className="bg-gradient-to-r from-md-primary/15 via-md-primary-container/35 to-md-secondary-container/25 text-md-on-surface border border-md-outline-variant/60 rounded-[22px] p-4 sm:p-5 shadow-sm relative overflow-hidden">
        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <span className="w-9 h-9 rounded-[14px] bg-md-primary text-md-on-primary flex items-center justify-center shadow-sm">
                <GraduationCap size={20} />
              </span>
              <div>
                <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">
                  أكاديمية المؤشرات الفنية
                </h2>
                <span className="text-xs font-semibold text-md-primary block">
                  موسوعة مؤشرات تطبيق ثاندر • نظام الطبقات السبع وعمارة الأدوار بالبلدي
                </span>
              </div>
            </div>
            <p className="text-xs text-md-on-surface-variant max-w-3xl leading-relaxed font-medium">
              مرجعك الشامل والمبسط بالعامية المصرية كأننا صحاب على القهوة؛ يشرح كل مؤشرات ثاندر وسكربتات تامر زكي، وكيف تطبق استراتيجية الـ 7 طبقات على شارت ثاندر خطوة بخطوة بدون أي مصطلحات مبهمة!
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="bg-md-surface text-md-on-surface rounded-[16px] px-3.5 py-2 text-center min-w-[95px] shadow-sm border border-md-outline-variant/40">
              <div className="text-[10px] text-md-on-surface-variant font-semibold mb-0.5">مؤشرات ثاندر</div>
              <div className="text-lg font-mono font-extrabold text-md-primary">{THNDR_ALL_INDICATORS.length}+ مؤشر</div>
            </div>
            <div className="bg-md-surface text-md-on-surface rounded-[16px] px-3.5 py-2 text-center min-w-[95px] shadow-sm border border-md-outline-variant/40">
              <div className="text-[10px] text-md-on-surface-variant font-semibold mb-0.5">طبقات القرار</div>
              <div className="text-lg font-mono font-extrabold text-md-tertiary">7 طبقات</div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Navigation Tabs: 3 Distinct Tabs */}
      <div className="flex items-center justify-center sm:justify-start">
        <div className="flex items-center gap-1.5 bg-md-surface-container p-1.5 rounded-md-full border border-md-outline-variant/60 shadow-sm text-xs overflow-x-auto scrollbar-none">
          {/* TAB 1: مؤشرات تطبيق ثاندر بالبلدي */}
          <button
            onClick={() => setActiveMainTab('thndr')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md-full font-bold transition-all duration-200 select-none whitespace-nowrap ${
              activeMainTab === 'thndr'
                ? 'bg-md-primary text-md-on-primary shadow-sm'
                : 'text-md-on-surface-variant hover:text-md-on-surface hover:bg-md-surface-container-high'
            }`}
          >
            <Smartphone size={15} className={activeMainTab === 'thndr' ? 'text-md-on-primary' : 'text-md-primary'} />
            <span>📱 مؤشرات تطبيق ثاندر بالبلدي ({THNDR_ALL_INDICATORS.length}+)</span>
          </button>

          {/* TAB 2: نظام الطبقات السبع وعمارة الأدوار */}
          <button
            onClick={() => setActiveMainTab('framework')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md-full font-bold transition-all duration-200 select-none whitespace-nowrap ${
              activeMainTab === 'framework'
                ? 'bg-md-primary text-md-on-primary shadow-sm'
                : 'text-md-on-surface-variant hover:text-md-on-surface hover:bg-md-surface-container-high'
            }`}
          >
            <Layers size={15} className={activeMainTab === 'framework' ? 'text-md-on-primary' : 'text-md-tertiary'} />
            <span>🏛️ نظام الطبقات السبع ومطابقتها في ثاندر</span>
          </button>

          {/* TAB 3: موسوعة المؤشرات العالمية */}
          <button
            onClick={() => setActiveMainTab('indicators')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md-full font-bold transition-all duration-200 select-none whitespace-nowrap ${
              activeMainTab === 'indicators'
                ? 'bg-md-primary text-md-on-primary shadow-sm'
                : 'text-md-on-surface-variant hover:text-md-on-surface hover:bg-md-surface-container-high'
            }`}
          >
            <BookOpen size={15} className={activeMainTab === 'indicators' ? 'text-md-on-primary' : 'text-md-primary'} />
            <span>📖 موسوعة المؤشرات العالمية ({INDICATORS_KNOWLEDGE_BASE.length})</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: مؤشرات تطبيق ثاندر بالبلدي (Thndr Comprehensive Center) */}
      {/* ========================================================================= */}
      {activeMainTab === 'thndr' && (
        <div className="space-y-6">
          {/* Quick Sub-Filter Chips */}
          <MdCard variant="outlined" className="space-y-4">
            <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
              <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none text-xs">
                <MdChip
                  label="جميع مؤشرات ثاندر"
                  selected={thndrSectionFilter === 'all'}
                  onClick={() => setThndrSectionFilter('all')}
                />
                <MdChip
                  label="🌟 مطابقة الـ 7 طبقات في ثاندر"
                  selected={thndrSectionFilter === 'mapping'}
                  onClick={() => setThndrSectionFilter('mapping')}
                />
                <MdChip
                  label="💡 قاموس مصطلحات البورصة بالبلدي"
                  selected={thndrSectionFilter === 'glossary'}
                  onClick={() => setThndrSectionFilter('glossary')}
                />
                <MdChip
                  label="⚡ سكربتات تامر زكي ومجتمع ثاندر"
                  selected={thndrSectionFilter === 'tamer_zaky'}
                  onClick={() => setThndrSectionFilter('tamer_zaky')}
                />
                <MdChip
                  label="مؤشرات الاتجاه والمتوسطات"
                  selected={thndrSectionFilter === 'trend'}
                  onClick={() => setThndrSectionFilter('trend')}
                />
                <MdChip
                  label="الزخم وقوة الحركة"
                  selected={thndrSectionFilter === 'momentum'}
                  onClick={() => setThndrSectionFilter('momentum')}
                />
                <MdChip
                  label="السيولة والحجم"
                  selected={thndrSectionFilter === 'volume'}
                  onClick={() => setThndrSectionFilter('volume')}
                />
                <MdChip
                  label="التقلب والانضغاط"
                  selected={thndrSectionFilter === 'volatility'}
                  onClick={() => setThndrSectionFilter('volatility')}
                />
              </div>
            </div>

            {/* Live Search Field */}
            <div className="pt-2 border-t border-md-outline-variant/40">
              <MdTextField
                placeholder="ابحث في مؤشرات ثاندر بالعربي أو الإنجليزي (مثال: Order Blocks, RSI, تامر زكي, Bollinger, MACD, سوينج)..."
                value={thndrSearchQuery}
                onChange={(e) => setThndrSearchQuery(e.target.value)}
                leadingIcon={<Search size={18} />}
              />
            </div>
          </MdCard>

          {/* SECTION A: خريطة مطابقة الـ 7 طبقات في شارت ثاندر (When mapping or all selected) */}
          {(thndrSectionFilter === 'mapping' || thndrSectionFilter === 'all') && !thndrSearchQuery && (
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-emerald-500/15 via-emerald-500/5 to-transparent border border-emerald-500/30 rounded-[20px] p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="w-10 h-10 rounded-[14px] bg-emerald-500 text-white flex items-center justify-center font-bold text-lg shadow-sm">
                    🏛️
                  </span>
                  <div>
                    <h3 className="text-base font-extrabold text-md-on-surface">
                      خريطة مطابقة الـ 7 طبقات على شارت ثاندر (Thndr 7-Layers Setup)
                    </h3>
                    <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                      كل طبقة من الـ 7 إيه اسم المؤشر بتاعها على ثاندر وإزاي تفتحه خطوة بخطوة!
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {THNDR_SEVEN_LAYERS_MAPPING.map((m) => (
                  <div 
                    key={m.layerNumber}
                    className="bg-md-surface-container-low border border-md-outline-variant/60 rounded-[20px] p-4.5 space-y-3 flex flex-col justify-between hover:border-md-outline transition-all duration-200 shadow-sm"
                  >
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="w-7 h-7 rounded-full bg-md-primary text-md-on-primary font-mono font-bold flex items-center justify-center text-xs shadow-sm">
                          {m.layerNumber}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                          {m.mirrorName}
                        </span>
                      </div>

                      <div>
                        <h4 className="text-sm font-extrabold text-md-on-surface">
                          {m.layerName}
                        </h4>
                        <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400 block mt-0.5">
                          💡 {m.analogyTitle}
                        </span>
                      </div>

                      {/* Thndr Indicator Badge */}
                      <div className="p-3 bg-emerald-500/10 rounded-[14px] border border-emerald-500/30 space-y-1">
                        <span className="font-bold text-emerald-700 dark:text-emerald-300 block text-[11px] flex items-center gap-1.5">
                          <Smartphone size={13} />
                          <span>المؤشر في تطبيق ثاندر:</span>
                        </span>
                        <p className="font-mono font-bold text-xs text-md-on-surface">
                          {m.thndrPrimaryIndicator}
                        </p>
                        {m.thndrSecondaryIndicator && (
                          <span className="text-[10px] text-md-on-surface-variant block">
                            بدائل أخرى: {m.thndrSecondaryIndicator}
                          </span>
                        )}
                      </div>

                      {/* Baladi Explanation */}
                      <p className="text-xs text-md-on-surface-variant leading-relaxed">
                        {m.explanationBaladi}
                      </p>

                      {/* Setup Steps */}
                      <div className="p-2.5 bg-md-surface rounded-[12px] border border-md-outline-variant/30 text-[11px] space-y-1">
                        <span className="font-bold text-md-primary block text-[10px]">⚙️ إزاي تفتحه في ثاندر:</span>
                        <p className="text-md-on-surface-variant leading-relaxed">
                          {m.howToApplyInThndr}
                        </p>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-md-outline-variant/30 text-[10px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                      <CheckCircle2 size={12} />
                      <span>{m.whatToLookFor}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION B: قاموس مصطلحات البورصة بالبلدي (When glossary or all selected) */}
          {(thndrSectionFilter === 'glossary' || thndrSectionFilter === 'all') && !thndrSearchQuery && (
            <div className="space-y-4 pt-2">
              <div className="bg-gradient-to-r from-amber-500/15 via-amber-500/5 to-transparent border border-amber-500/30 rounded-[20px] p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="w-10 h-10 rounded-[14px] bg-amber-500 text-white flex items-center justify-center font-bold text-lg shadow-sm">
                    💡
                  </span>
                  <div>
                    <h3 className="text-base font-extrabold text-md-on-surface">
                      قاموس مصطلحات البورصة بالبلدي (كلام صحاب بدون تعقيد ☕)
                    </h3>
                    <span className="text-xs text-amber-600 dark:text-amber-400 font-medium">
                      تفسير بسيط لكل المصطلحات اللي بتسمعها: يعني إيه سوينج، أرضية وسقف الدور، وقف الخسارة، والتجميع والتصريف!
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {EGX_FRIEND_GLOSSARY.map((g, idx) => (
                  <div 
                    key={idx}
                    className="bg-md-surface-container-low border border-md-outline-variant/60 rounded-[20px] p-4.5 space-y-2.5 flex flex-col justify-between hover:border-md-outline transition-all duration-200 shadow-sm"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-extrabold text-md-on-surface">
                          {g.term}
                        </h4>
                        {g.termEn && (
                          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-md-surface text-md-on-surface-variant border border-md-outline-variant/30">
                            {g.termEn}
                          </span>
                        )}
                      </div>

                      <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400 block">
                        🎯 {g.analogyTitle}
                      </span>

                      <p className="text-xs text-md-on-surface-variant leading-relaxed">
                        {g.meaningBaladi}
                      </p>
                    </div>

                    <div className="p-2.5 bg-md-surface rounded-[12px] border border-md-outline-variant/40 text-[11px] space-y-1">
                      <span className="font-bold text-md-primary block text-[10px]">قاعدتك العملية في ثاندر:</span>
                      <p className="text-md-on-surface-variant leading-relaxed">
                        {g.practicalRule}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION C: مكتبة وفهرس مؤشرات ثاندر الـ 95+ (All Indicators List) */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-[12px] bg-md-primary/10 text-md-primary flex items-center justify-center font-bold text-sm">
                  📚
                </span>
                <h3 className="text-base font-extrabold text-md-on-surface">
                  مكتبة مؤشرات تطبيق ثاندر ({filteredThndrIndicators.length} مؤشر)
                </h3>
              </div>
              <span className="text-xs text-md-on-surface-variant font-mono">
                مفهرسة ومشروحة بالعامية المصرية
              </span>
            </div>

            <div className="space-y-4">
              {filteredThndrIndicators.map((item) => {
                const isExpanded = !!expandedCards[item.id];

                return (
                  <div 
                    key={item.id}
                    className="bg-md-surface-container-low border border-md-outline-variant/60 rounded-[22px] p-4.5 space-y-3.5 transition-all duration-200 hover:border-md-outline shadow-sm"
                  >
                    {/* Top Row: Name, Category, Badge */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-md-outline-variant/40">
                      <div className="flex items-start sm:items-center gap-3">
                        <div className="w-10 h-10 rounded-[12px] bg-md-primary/10 text-md-primary flex items-center justify-center font-bold text-base shadow-sm border border-md-primary/20 shrink-0">
                          {item.isCustomScript ? '⚡' : '📈'}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="text-base font-extrabold text-md-on-surface">
                              {item.nameAr}
                            </h4>
                            <span className="font-mono text-xs text-md-on-surface-variant font-semibold">
                              ({item.nameEn})
                            </span>
                          </div>
                          <span className="text-[11px] font-bold text-md-primary block">
                            {item.categoryLabel}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 flex-wrap">
                        {item.layerName && (
                          <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                            {item.layerName}
                          </span>
                        )}
                        <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${item.badgeColor}`}>
                          {item.isCustomScript ? 'سكربت ثاندر مخصص' : 'مؤشر قياسي في ثاندر'}
                        </span>
                      </div>
                    </div>

                    {/* Quick Baladi Summary */}
                    <p className="text-xs text-md-on-surface leading-relaxed font-medium">
                      {item.overviewBaladi}
                    </p>

                    {/* How to setup in Thndr */}
                    <div className="p-3 bg-md-surface rounded-[14px] border border-md-outline-variant/40 text-xs space-y-1">
                      <div className="flex items-center gap-1.5 font-bold text-md-primary text-[11px]">
                        <Smartphone size={13} />
                        <span>طريقة تفعيله وضبطه في ثاندر:</span>
                      </div>
                      <p className="text-md-on-surface-variant leading-relaxed text-[11px]">
                        {item.howToSetupInThndr}
                      </p>
                    </div>

                    {/* Expand/Collapse Button */}
                    <div className="pt-2 flex items-center justify-between border-t border-md-outline-variant/40 text-xs">
                      <button
                        onClick={() => toggleExpand(item.id)}
                        className="flex items-center gap-1 text-md-primary font-bold hover:underline"
                      >
                        <span>{isExpanded ? 'إخفاء إشارات التداول والنصائح' : 'عرض إشارات الدخول والخروج والنصيحة العملية'}</span>
                        {isExpanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                      </button>

                      <span className="text-[11px] font-mono text-md-on-surface-variant">
                        اسم المؤشر في البحث: <strong>{item.nameEn}</strong>
                      </span>
                    </div>

                    {/* Expanded Content */}
                    {isExpanded && (
                      <div className="pt-3 border-t border-md-outline-variant/30 space-y-3 animate-fadeIn text-xs">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-[14px] space-y-1">
                            <span className="font-bold text-emerald-600 dark:text-emerald-400 block text-xs">🟢 إشارة الشراء والدخول بالبلدي:</span>
                            <p className="text-md-on-surface-variant leading-relaxed text-[11px]">
                              {item.buySignalBaladi}
                            </p>
                          </div>

                          <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-[14px] space-y-1">
                            <span className="font-bold text-rose-600 dark:text-rose-400 block text-xs">🔴 إشارة الخروج وتفعيل الوقف:</span>
                            <p className="text-md-on-surface-variant leading-relaxed text-[11px]">
                              {item.exitSignalBaladi}
                            </p>
                          </div>
                        </div>

                        <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-[14px] space-y-1">
                          <span className="font-bold text-amber-700 dark:text-amber-300 block text-xs">💡 نصيحة صاحبك للمؤشر ده:</span>
                          <p className="text-md-on-surface-variant leading-relaxed text-[11px]">
                            {item.friendAdvice}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: نظام الطبقات السبع وعمارة الأدوار ومرايا التداول */}
      {/* ========================================================================= */}
      {activeMainTab === 'framework' && (
        <div className="space-y-6">
          {/* Framework Intro Header */}
          <div className="bg-md-surface-container-low border border-md-outline-variant/60 rounded-[22px] p-5 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-[14px] bg-md-tertiary text-md-on-tertiary flex items-center justify-center font-bold text-base">
                🏛️
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-md-on-surface">
                  نظام الـ 7 طبقات وعمارة الأدوار: الدليل الشامل لصناع السوق
                </h3>
                <span className="text-xs text-md-on-surface-variant">
                  المنظومة التي نقلت المتداولين من الاعتماد على المؤشرات الفردية إلى فحص مؤسسي شامل ومطابق لتطبيق ثاندر
                </span>
              </div>
            </div>

            <p className="text-xs text-md-on-surface-variant leading-relaxed">
              تعتمد هذه الاستراتيجية على فكرة بديهية: لا تشتري سهماً أبداً بناءً على مؤشر واحد فقط (مثل RSI أو خط دعم عادي)، لأن المؤشرات مجرد <strong>تأكيد</strong> لحدث تم بالفعل، وليست <strong>قراراً</strong>. قرار الشراء الاحترافي يتطلب اجتياز السهم لـ 7 طبقات فنية متتالية، بدءاً من الاتجاه العام، وصولاً إلى سيولة الأموال الذكية ومناطق الـ Order Blocks في ثاندر.
            </p>
          </div>

          {/* 7 Layers Cards Grid with Thndr Mapping Built-in */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {GROWTHX_SEVEN_LAYERS.map((layer) => {
              const thndrMap = THNDR_SEVEN_LAYERS_MAPPING.find(m => m.layerNumber === layer.layerNumber);

              return (
                <div 
                  key={layer.layerNumber}
                  className="bg-md-surface-container-low border border-md-outline-variant/60 rounded-[22px] p-4.5 shadow-sm space-y-3.5 flex flex-col justify-between hover:border-md-outline transition-all duration-200"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="w-7 h-7 rounded-full bg-md-primary text-md-on-primary font-mono font-bold flex items-center justify-center text-xs shadow-sm">
                        {layer.layerNumber}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-md-surface text-md-primary border border-md-outline-variant/40">
                        الطبقة {layer.layerNumber}
                      </span>
                    </div>

                    <div>
                      <h4 className="text-base font-bold text-md-on-surface">
                        {layer.title}
                      </h4>
                      <span className="text-xs font-bold text-amber-600 dark:text-amber-400 block mt-0.5">
                        💡 {layer.subtitle}
                      </span>
                    </div>

                    <p className="text-xs text-md-on-surface-variant leading-relaxed font-medium">
                      {layer.purpose}
                    </p>

                    {/* Thndr Indicator Callout */}
                    {thndrMap && (
                      <div className="p-3 bg-emerald-500/10 rounded-[14px] border border-emerald-500/30 text-xs space-y-1">
                        <span className="font-bold text-emerald-700 dark:text-emerald-300 block text-[11px] flex items-center gap-1">
                          <Smartphone size={13} />
                          <span>المؤشر المناظر في تطبيق ثاندر:</span>
                        </span>
                        <p className="text-md-on-surface font-mono font-bold text-xs">
                          {thndrMap.thndrPrimaryIndicator}
                        </p>
                        <p className="text-md-on-surface-variant text-[10px] leading-relaxed pt-0.5">
                          {thndrMap.howToApplyInThndr}
                        </p>
                      </div>
                    )}

                    <div className="p-3 bg-md-surface rounded-[14px] border border-md-outline-variant/40 text-xs space-y-1">
                      <span className="font-bold text-md-primary block text-[11px]">قاعدة اتخاذ القرار:</span>
                      <p className="text-md-on-surface-variant leading-relaxed text-[11px]">
                        {layer.actionRule}
                      </p>
                    </div>

                    <div className="p-2.5 bg-md-surface-container rounded-[12px] border border-md-outline-variant/30 text-xs space-y-1">
                      <span className="font-bold text-md-on-surface block text-[10px]">المؤشرات العالمية المستخدمة:</span>
                      <p className="text-md-on-surface-variant leading-relaxed font-mono text-[10px]">
                        {layer.indicatorsUsed.join(' • ')}
                      </p>
                    </div>
                  </div>

                  {onNavigateToLab && (
                    <div className="pt-2.5 border-t border-md-outline-variant/40 flex items-center justify-between text-xs">
                      <button
                        onClick={onNavigateToLab}
                        className="text-md-primary font-bold hover:underline flex items-center gap-1"
                      >
                        <span>فحص السهم بالمعمل في الرادار الفني 🧪</span>
                        <ArrowRight size={12} />
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: موسوعة المؤشرات الفنية العالمية (GrowthX Framework) */}
      {/* ========================================================================= */}
      {activeMainTab === 'indicators' && (
        <div className="space-y-6">
          {/* Filter Bar & Search Card */}
          <MdCard variant="outlined" className="space-y-4">
            <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
              <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none text-xs">
                <MdChip
                  label="جميع المؤشرات"
                  selected={categoryFilter === 'all'}
                  onClick={() => setCategoryFilter('all')}
                />
                <MdChip
                  label="مؤشرات الأموال الذكية ومدرسة GrowthX"
                  selected={categoryFilter === 'smart_money'}
                  onClick={() => setCategoryFilter('smart_money')}
                />
                <MdChip
                  label="سكربتات البورصة المصرية ومجتمع التداول"
                  selected={categoryFilter === 'egx_custom'}
                  onClick={() => setCategoryFilter('egx_custom')}
                />
                <MdChip
                  label="المتوسطات والتقاطع الذهبي"
                  selected={categoryFilter === 'moving_averages'}
                  onClick={() => setCategoryFilter('moving_averages')}
                />
                <MdChip
                  label="السيولة وبنزين الفوليوم (Volume Profile)"
                  selected={categoryFilter === 'volume_liquidity'}
                  onClick={() => setCategoryFilter('volume_liquidity')}
                />
                <MdChip
                  label="الزخم ومرايا التذبذب والضغط"
                  selected={categoryFilter === 'momentum_volatility'}
                  onClick={() => setCategoryFilter('momentum_volatility')}
                />
              </div>
            </div>

            {/* Live Search Field */}
            <div className="pt-2 border-t border-md-outline-variant/40">
              <MdTextField
                placeholder="ابحث عن مؤشر بالاسم الإنجليزي أو العربي (مثال: L3 Gemini, Golden Cross, Order Blocks, MCDX)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                leadingIcon={<Search size={18} />}
              />
            </div>
          </MdCard>

          {/* Indicators List */}
          <div className="space-y-6">
            {filteredIndicators.map((ind) => {
              const isExpanded = !!expandedCards[ind.id];

              return (
                <div 
                  key={ind.id} 
                  className="bg-md-surface-container-low border border-md-outline-variant/60 rounded-[24px] p-5 shadow-sm space-y-4 transition-all duration-200 hover:border-md-outline"
                >
                  {/* Top Bar: Name, Type, and Author */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-3 border-b border-md-outline-variant/40">
                    <div className="flex items-start sm:items-center gap-3">
                      <div className="w-11 h-11 rounded-[14px] bg-md-primary/10 text-md-primary flex items-center justify-center font-bold text-lg shadow-sm border border-md-primary/20 shrink-0">
                        {ind.id.includes('mcdx') ? '📊' : ind.id.includes('smart') ? '🧠' : ind.id.includes('order') ? '🧱' : '📈'}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-lg font-extrabold text-md-on-surface">
                            {ind.nameAr}
                          </h3>
                          <span className="font-mono text-xs text-md-on-surface-variant font-semibold">
                            ({ind.nameEn})
                          </span>
                        </div>
                        <span className="text-xs font-bold text-md-primary block">
                          {ind.categoryLabel} • {ind.type}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-[11px] font-bold px-3 py-1 rounded-full ${ind.badgeColor}`}>
                        {ind.difficulty}
                      </span>
                    </div>
                  </div>

                  {/* Plain Language Overview */}
                  <div className="p-4 bg-md-surface rounded-[16px] border border-md-outline-variant/40 space-y-2">
                    <span className="font-bold text-md-primary block text-xs">💡 فكرة المؤشر بالبلدي:</span>
                    <p className="text-xs text-md-on-surface leading-relaxed font-medium">
                      {ind.overview}
                    </p>
                  </div>

                  {/* Objective & Why Use It */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 text-xs">
                    <div className="p-3.5 bg-md-surface-container rounded-[16px] border border-md-outline-variant/30 space-y-1">
                      <span className="font-bold text-md-on-surface block text-[11px]">🎯 الهدف الأساسي:</span>
                      <p className="text-md-on-surface-variant leading-relaxed text-[11px]">{ind.objective}</p>
                    </div>

                    <div className="p-3.5 bg-md-surface-container rounded-[16px] border border-md-outline-variant/30 space-y-1">
                      <span className="font-bold text-md-on-surface block text-[11px]">⏳ إمتى وليه تستخدمه؟</span>
                      <p className="text-md-on-surface-variant leading-relaxed text-[11px]">{ind.whenToUse}</p>
                    </div>
                  </div>

                  {/* Expand/Collapse Step by Step */}
                  <div className="pt-2 flex items-center justify-between border-t border-md-outline-variant/40 text-xs">
                    <button
                      onClick={() => toggleExpand(ind.id)}
                      className="flex items-center gap-1.5 text-md-primary font-bold hover:underline"
                    >
                      <span>{isExpanded ? 'إخفاء خطوات الاستخدام العملية' : 'عرض خطوات التداول العملية والإشارات الخاطئة'}</span>
                      {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>

                    <span className="text-xs text-md-on-surface-variant font-mono">
                      البحث في TradingView: <strong>{ind.tradingViewSearchTerm}</strong>
                    </span>
                  </div>

                  {/* Expanded Step by Step */}
                  {isExpanded && (
                    <div className="pt-3 border-t border-md-outline-variant/30 space-y-4 animate-fadeIn text-xs">
                      {/* Step by step guide */}
                      <div className="space-y-2">
                        <span className="font-bold text-md-on-surface block text-xs">🛠️ خطوات التداول خطوة بخطوة:</span>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {ind.howToUseStepByStep.map((s, idx) => (
                            <div key={idx} className="p-3 bg-md-surface rounded-[14px] border border-md-outline-variant/30 space-y-1">
                              <span className="font-bold text-md-primary block text-[11px]">{s.step}</span>
                              <p className="text-md-on-surface-variant leading-relaxed text-[11px]">{s.description}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Insights & Pitfalls */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                        <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/30 rounded-[16px] space-y-2">
                          <span className="font-bold text-emerald-600 dark:text-emerald-400 block text-xs">🟢 إشارات وقواعد الاستخراج:</span>
                          <ul className="space-y-1 text-md-on-surface-variant">
                            {ind.extractedInsights.map((sig, idx) => (
                              <li key={idx} className="flex items-start gap-1.5 leading-relaxed">
                                <span className="text-emerald-500 font-bold">•</span>
                                <span>{sig}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="p-3.5 bg-rose-500/10 border border-rose-500/30 rounded-[16px] space-y-2">
                          <span className="font-bold text-rose-600 dark:text-rose-400 block text-xs">🔴 فخاخ وإشارات خاطئة تجنبها:</span>
                          <ul className="space-y-1 text-md-on-surface-variant">
                            {ind.pitfallsAndFalseSignals.map((sig, idx) => (
                              <li key={idx} className="flex items-start gap-1.5 leading-relaxed">
                                <span className="text-rose-500 font-bold">•</span>
                                <span>{sig}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* Settings & Confluence */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                        <div className="p-3.5 bg-md-surface rounded-[16px] border border-md-outline-variant/40 space-y-1">
                          <span className="font-bold text-md-tertiary block text-xs">⚙️ الإعدادات الموصى بها:</span>
                          <p className="text-md-on-surface-variant leading-relaxed text-[11px]">
                            {ind.recommendedSettings}
                          </p>
                        </div>

                        <div className="p-3.5 bg-md-surface-container rounded-[16px] border border-md-outline-variant/40 space-y-1">
                          <span className="font-bold text-md-primary block text-xs">🤝 ادمجه مع هذه المؤشرات للتأكيد:</span>
                          <p className="text-md-on-surface-variant leading-relaxed font-mono text-[11px]">
                            {ind.confluenceWith.join(' • ')}
                          </p>
                        </div>
                      </div>

                      {/* Open-Source Pine Script Box */}
                      {ind.pineScriptSnippet && (
                        <div className="p-3.5 bg-black/90 text-white rounded-[18px] border border-orange-500/40 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-orange-400 text-xs flex items-center gap-1.5">
                              <Code2 size={15} />
                              <span>كود Pine Script المفتوح المصدر (جاهز للصق في TradingView):</span>
                            </span>
                            <button
                              onClick={() => copyPineScript(ind.id, ind.pineScriptSnippet!)}
                              className="flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-lg bg-orange-500 text-black hover:bg-orange-400 transition-all shadow-sm"
                            >
                              {copiedPineId === ind.id ? <Check size={12} /> : <Copy size={12} />}
                              <span>{copiedPineId === ind.id ? 'تم النسخ بنجاح! 📋' : 'نسخ الكود'}</span>
                            </button>
                          </div>
                          <pre className="text-[10px] font-mono text-gray-300 overflow-x-auto max-h-48 p-3 bg-gray-950 rounded-xl border border-gray-800 scrollbar-thin leading-relaxed" dir="ltr">
                            {ind.pineScriptSnippet}
                          </pre>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
