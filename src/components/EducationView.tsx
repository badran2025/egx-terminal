import React, { useState, useMemo } from 'react';
import { 
  GraduationCap, BookOpen, Layers, Search, 
  ExternalLink, ChevronDown, ChevronUp, ArrowRight,
  Smartphone, HelpCircle, CheckCircle2, Zap, Sparkles, Filter,
  Code2, Copy, Check, Compass, Target, AlertTriangle, ShieldAlert, Award, Clock
} from 'lucide-react';
import { INDICATORS_KNOWLEDGE_BASE, GROWTHX_SEVEN_LAYERS } from '../services/indicatorsEducationData';
import { 
  THNDR_ALL_INDICATORS, 
  THNDR_SEVEN_LAYERS_MAPPING, 
  EGX_FRIEND_GLOSSARY,
  BADRAN_STRATEGY_PLAYBOOK,
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
  const [thndrSectionFilter, setThndrSectionFilter] = useState<'all' | 'mapping' | 'playbook' | 'glossary' | 'tamer_zaky' | 'trend' | 'momentum' | 'volume' | 'volatility'>('all');
  const [selectedProfile, setSelectedProfile] = useState<'long_term' | 'swing' | 'day_trader'>('swing');
  const [activeStepTab, setActiveStepTab] = useState<number>(1);
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
                  label="🧭 استراتيجية التحليل وخارطة القرار (BADRAN)"
                  selected={thndrSectionFilter === 'playbook'}
                  onClick={() => setThndrSectionFilter('playbook')}
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
            <div className="space-y-5">
              {/* Main Badge & Verification Banner */}
              <div className="bg-gradient-to-r from-emerald-500/20 via-emerald-500/10 to-teal-500/10 border-2 border-emerald-500/40 rounded-[22px] p-5 shadow-sm space-y-4">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="w-12 h-12 rounded-[16px] bg-emerald-500 text-white flex items-center justify-center font-bold text-2xl shadow-md">
                      🏛️
                    </span>
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-lg font-extrabold text-md-on-surface">
                          خريطة مطابقة الـ 7 طبقات مع قالب BADRAN المعتمد على ثاندر
                        </h3>
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-emerald-500 text-white shadow-sm flex items-center gap-1">
                          <CheckCircle2 size={13} />
                          <span>قالب BADRAN محفوظ ومفعّل 100%</span>
                        </span>
                      </div>
                      <p className="text-xs text-emerald-700 dark:text-emerald-300 font-medium">
                        الـ 5 مؤشرات المثبتة حالياً على شارتك في ثاندر تغطي كل مراحل اتخاذ القرار السبع في موقعنا بدون أي نقص أو تكرار!
                      </p>
                    </div>
                  </div>

                  {/* Summary Metric Chips */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <div className="bg-md-surface/90 border border-emerald-500/30 rounded-[14px] px-3 py-1.5 text-center">
                      <div className="text-[10px] text-md-on-surface-variant font-bold">المؤشرات على الشارت</div>
                      <div className="text-sm font-mono font-extrabold text-emerald-600 dark:text-emerald-400">5 مؤشرات نظيفة</div>
                    </div>
                    <div className="bg-md-surface/90 border border-emerald-500/30 rounded-[14px] px-3 py-1.5 text-center">
                      <div className="text-[10px] text-md-on-surface-variant font-bold">تغطية المراحل</div>
                      <div className="text-sm font-mono font-extrabold text-md-primary">7 من 7 طبقات</div>
                    </div>
                  </div>
                </div>

                {/* Quick Interactive Matrix / Comparison Table */}
                <div className="overflow-x-auto rounded-[16px] border border-emerald-500/25 bg-md-surface/95 shadow-inner">
                  <table className="w-full text-right text-xs border-collapse">
                    <thead>
                      <tr className="bg-emerald-500/10 border-b border-emerald-500/20 text-md-on-surface font-extrabold">
                        <th className="p-3 w-12 text-center">#</th>
                        <th className="p-3">الطبقة في منظومة الموقع</th>
                        <th className="p-3">المؤشر المثبت في ثاندر (قالب BADRAN)</th>
                        <th className="p-3">المؤشر الموازي في تريدنج فيو والموقع</th>
                        <th className="p-3 text-center">موضع العرض</th>
                        <th className="p-3">طريقة قراءة الإشارة بالبلدي</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-md-outline-variant/30 font-medium">
                      {THNDR_SEVEN_LAYERS_MAPPING.map((row) => (
                        <tr key={row.layerNumber} className="hover:bg-emerald-500/5 transition-colors">
                          <td className="p-3 text-center font-mono font-bold">
                            <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 inline-flex items-center justify-center text-xs">
                              {row.layerNumber}
                            </span>
                          </td>
                          <td className="p-3 font-bold text-md-on-surface">
                            <div>{row.layerName}</div>
                            <span className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold">{row.mirrorName}</span>
                          </td>
                          <td className="p-3">
                            <span className="font-mono font-extrabold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-md text-[11px] inline-block">
                              {row.installedInBadranTemplate}
                            </span>
                          </td>
                          <td className="p-3 text-md-on-surface-variant font-mono text-[11px]">
                            {row.equivalentInOurSystem}
                          </td>
                          <td className="p-3 text-center">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              row.coverageType === 'شارت ثاندر المباشر'
                                ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20'
                                : row.coverageType === 'لوحة الزخم السفلية'
                                ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20'
                                : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                            }`}>
                              {row.coverageType}
                            </span>
                          </td>
                          <td className="p-3 text-xs text-md-on-surface leading-relaxed max-w-xs">
                            {row.whatToLookFor}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Detailed 7 Layers Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4.5">
                {THNDR_SEVEN_LAYERS_MAPPING.map((m) => (
                  <div 
                    key={m.layerNumber}
                    className="bg-md-surface-container-low border border-md-outline-variant/60 rounded-[20px] p-4.5 space-y-3.5 flex flex-col justify-between hover:border-emerald-500/50 transition-all duration-200 shadow-sm"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-7 h-7 rounded-full bg-emerald-600 text-white font-mono font-bold flex items-center justify-center text-xs shadow-sm">
                            {m.layerNumber}
                          </span>
                          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
                            {m.mirrorName}
                          </span>
                        </div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-md-surface text-md-on-surface-variant border border-md-outline-variant/40">
                          {m.coverageType}
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

                      {/* BADRAN Template Indicator Highlight */}
                      <div className="p-3 bg-emerald-500/10 rounded-[14px] border border-emerald-500/30 space-y-1">
                        <span className="font-extrabold text-emerald-700 dark:text-emerald-300 block text-[11px] flex items-center gap-1.5">
                          <CheckCircle2 size={13} className="text-emerald-600" />
                          <span>المؤشر المثبت في قالب BADRAN:</span>
                        </span>
                        <p className="font-mono font-extrabold text-xs text-md-on-surface">
                          {m.installedInBadranTemplate}
                        </p>
                      </div>

                      {/* Mirror in Our System */}
                      <div className="p-2.5 bg-md-surface rounded-[12px] border border-md-outline-variant/40 space-y-0.5">
                        <span className="font-bold text-md-primary block text-[10px] flex items-center gap-1">
                          <Sparkles size={11} />
                          <span>المؤشر الموازي في المعمل وتريدنج فيو:</span>
                        </span>
                        <p className="font-mono text-[11px] text-md-on-surface font-semibold leading-relaxed">
                          {m.equivalentInOurSystem}
                        </p>
                      </div>

                      {/* Baladi Explanation */}
                      <p className="text-xs text-md-on-surface-variant leading-relaxed font-medium">
                        {m.explanationBaladi}
                      </p>

                      {/* How it is applied */}
                      <div className="p-2.5 bg-md-surface-container rounded-[12px] border border-md-outline-variant/30 text-[11px] space-y-0.5">
                        <span className="font-bold text-md-on-surface block text-[10px]">⚙️ وضعه الحالي في ثاندر:</span>
                        <p className="text-md-on-surface-variant leading-relaxed text-[10px]">
                          {m.howToApplyInThndr}
                        </p>
                      </div>
                    </div>

                    <div className="pt-2.5 border-t border-md-outline-variant/30 text-[11px] text-emerald-700 dark:text-emerald-300 font-extrabold flex items-start gap-1.5">
                      <CheckCircle2 size={13} className="mt-0.5 shrink-0 text-emerald-600" />
                      <span>علامة الشراء المؤكدة: {m.whatToLookFor}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* SECTION A2: استراتيجية وخريطة طريق التحليل واتخاذ القرار بقالب BADRAN */}
          {/* ========================================================================= */}
          {(thndrSectionFilter === 'playbook' || thndrSectionFilter === 'all') && !thndrSearchQuery && (
            <div className="space-y-6 pt-2">
              {/* Playbook Hero Header */}
              <div className="bg-gradient-to-r from-blue-600/15 via-indigo-600/10 to-purple-600/10 border-2 border-blue-500/35 rounded-[22px] p-5 shadow-sm space-y-4">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="w-12 h-12 rounded-[16px] bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-2xl shadow-md">
                      🧭
                    </span>
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-lg font-extrabold text-md-on-surface">
                          {BADRAN_STRATEGY_PLAYBOOK.suiteTitle}
                        </h3>
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-blue-600 text-white shadow-sm flex items-center gap-1">
                          <CheckCircle2 size={13} />
                          <span>8 مؤشرات متكاملة بقالب BADRAN</span>
                        </span>
                      </div>
                      <p className="text-xs text-blue-700 dark:text-blue-300 font-medium max-w-2xl leading-relaxed">
                        {BADRAN_STRATEGY_PLAYBOOK.suiteSubtitle}
                      </p>
                    </div>
                  </div>

                  {/* Summary Metric Chips */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <div className="bg-md-surface/90 border border-blue-500/30 rounded-[14px] px-3.5 py-1.5 text-center">
                      <div className="text-[10px] text-md-on-surface-variant font-bold">تسلسل الخطوات</div>
                      <div className="text-sm font-mono font-extrabold text-blue-600 dark:text-blue-400">6 خطوات صارمة</div>
                    </div>
                    <div className="bg-md-surface/90 border border-blue-500/30 rounded-[14px] px-3.5 py-1.5 text-center">
                      <div className="text-[10px] text-md-on-surface-variant font-bold">فئات المستثمرين</div>
                      <div className="text-sm font-mono font-extrabold text-purple-600 dark:text-purple-400">3 فئات واضحة</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 1. الترتيب التسلسلي الصارم لعملية التحليل (6 خطوات بالترتيب) */}
              <div className="space-y-3.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-full bg-blue-600 text-white font-mono font-bold flex items-center justify-center text-xs">
                      1
                    </span>
                    <h4 className="text-base font-extrabold text-md-on-surface">
                      الترتيب التسلسلي الصارم: تبدأ بمؤشر إيه الأول وتقيس إشاراته إزاي؟
                    </h4>
                  </div>
                  <span className="text-xs text-md-on-surface-variant font-medium hidden sm:inline-block">
                    اضغط على أي خطوة للاطلاع على تفاصيلها والتريكات
                  </span>
                </div>

                {/* Step Selector Horizontal Pills */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
                  {BADRAN_STRATEGY_PLAYBOOK.steps.map((st) => (
                    <button
                      key={st.stepNumber}
                      onClick={() => setActiveStepTab(st.stepNumber)}
                      className={`flex items-center gap-2 px-3.5 py-2 rounded-full font-bold transition-all duration-200 select-none whitespace-nowrap border ${
                        activeStepTab === st.stepNumber
                          ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                          : 'bg-md-surface-container-low text-md-on-surface-variant border-md-outline-variant/50 hover:bg-md-surface-container'
                      }`}
                    >
                      <span className="w-5 h-5 rounded-full bg-white/20 text-current flex items-center justify-center font-mono text-[10px]">
                        {st.stepNumber}
                      </span>
                      <span>{st.stepName.split('(')[0].trim()}</span>
                    </button>
                  ))}
                </div>

                {/* Active Step Detailed Card */}
                {(() => {
                  const currStep = BADRAN_STRATEGY_PLAYBOOK.steps.find(s => s.stepNumber === activeStepTab) || BADRAN_STRATEGY_PLAYBOOK.steps[0];
                  return (
                    <div className="bg-md-surface-container-low border-2 border-blue-500/30 rounded-[22px] p-5 shadow-sm space-y-4">
                      {/* Step Header */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-md-outline-variant/30">
                        <div className="flex items-center gap-2.5">
                          <span className="w-8 h-8 rounded-[12px] bg-blue-600 text-white font-mono font-extrabold flex items-center justify-center text-sm shadow-sm">
                            #{currStep.stepNumber}
                          </span>
                          <div>
                            <h5 className="text-base font-extrabold text-md-on-surface">
                              {currStep.stepName}
                            </h5>
                            <span className="text-[11px] font-semibold text-blue-600 dark:text-blue-400">
                              المؤشر المستخدم: <span className="font-mono">{currStep.indicatorUsed}</span> • ({currStep.indicatorLocation})
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setActiveStepTab(prev => Math.max(1, prev - 1))}
                            disabled={currStep.stepNumber === 1}
                            className="px-2.5 py-1 rounded-md text-xs font-bold border border-md-outline-variant/50 disabled:opacity-30"
                          >
                            السابق
                          </button>
                          <button
                            onClick={() => setActiveStepTab(prev => Math.min(6, prev + 1))}
                            disabled={currStep.stepNumber === 6}
                            className="px-2.5 py-1 rounded-md text-xs font-bold bg-blue-600 text-white disabled:opacity-30"
                          >
                            التالي
                          </button>
                        </div>
                      </div>

                      {/* Core Question */}
                      <div className="p-3 bg-blue-500/10 rounded-[14px] border border-blue-500/25 space-y-0.5">
                        <span className="text-[11px] font-extrabold text-blue-700 dark:text-blue-300 flex items-center gap-1.5">
                          <HelpCircle size={13} />
                          <span>السؤال الجوهري الذي تسأله لنفسك في هذه الخطوة:</span>
                        </span>
                        <p className="text-xs font-bold text-md-on-surface leading-relaxed">
                          "{currStep.coreQuestion}"
                        </p>
                      </div>

                      {/* Signals Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                        {/* Bullish */}
                        <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/30 rounded-[16px] space-y-1">
                          <span className="text-xs font-extrabold text-emerald-700 dark:text-emerald-300 flex items-center gap-1.5">
                            <CheckCircle2 size={14} className="text-emerald-600" />
                            <span>إشارة الشراء الخضراء المؤكدة (Bullish Signal):</span>
                          </span>
                          <p className="text-xs text-md-on-surface-variant leading-relaxed font-medium">
                            {currStep.bullishSignal}
                          </p>
                        </div>

                        {/* Bearish */}
                        <div className="p-3.5 bg-rose-500/10 border border-rose-500/30 rounded-[16px] space-y-1">
                          <span className="text-xs font-extrabold text-rose-700 dark:text-rose-300 flex items-center gap-1.5">
                            <ShieldAlert size={14} className="text-rose-600" />
                            <span>إشارة الحذر أو المنع (Bearish / Warning):</span>
                          </span>
                          <p className="text-xs text-md-on-surface-variant leading-relaxed font-medium">
                            {currStep.bearishSignal}
                          </p>
                        </div>
                      </div>

                      {/* Pitfall vs Pro Trick */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-1">
                        {/* Pitfall */}
                        <div className="p-3.5 bg-amber-500/10 border border-amber-500/30 rounded-[16px] space-y-1">
                          <span className="text-xs font-extrabold text-amber-700 dark:text-amber-300 flex items-center gap-1.5">
                            <AlertTriangle size={14} className="text-amber-600" />
                            <span>⚠️ الخطأ الشائع الذي يقع فيه أغلب الناس:</span>
                          </span>
                          <p className="text-xs text-md-on-surface-variant leading-relaxed">
                            {currStep.commonPitfall}
                          </p>
                        </div>

                        {/* Pro Trick */}
                        <div className="p-3.5 bg-purple-500/10 border border-purple-500/30 rounded-[16px] space-y-1">
                          <span className="text-xs font-extrabold text-purple-700 dark:text-purple-300 flex items-center gap-1.5">
                            <Sparkles size={14} className="text-purple-600" />
                            <span>💡 تريكة المحترفين وصناع السوق:</span>
                          </span>
                          <p className="text-xs text-md-on-surface-variant leading-relaxed font-medium">
                            {currStep.proTrick}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* 2. شجرة القرار: تحديد هوية المتداول (مستثمر طويل vs سوينج vs مضارب) */}
              <div className="space-y-3.5 pt-3">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-full bg-purple-600 text-white font-mono font-bold flex items-center justify-center text-xs">
                    2
                  </span>
                  <div>
                    <h4 className="text-base font-extrabold text-md-on-surface">
                      شجرة القرار: أنت داخل كمستثمر طويل ولا سوينج متوسط ولا مضارب لحظي؟
                    </h4>
                    <span className="text-xs text-md-on-surface-variant">
                      لكل أسلوب فريم محدد، وشروط دخول مختلفة، ونسبة وقف ومستهدف متباينة
                    </span>
                  </div>
                </div>

                {/* Profile Tabs */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {BADRAN_STRATEGY_PLAYBOOK.profiles.map((prof) => (
                    <button
                      key={prof.type}
                      onClick={() => setSelectedProfile(prof.type)}
                      className={`p-4 rounded-[20px] border text-right transition-all duration-200 flex flex-col justify-between space-y-2 ${
                        selectedProfile === prof.type
                          ? 'bg-purple-500/15 border-purple-500 shadow-sm'
                          : 'bg-md-surface-container-low border-md-outline-variant/60 hover:bg-md-surface-container'
                      }`}
                    >
                      <div className="space-y-1">
                        <span className="text-xs font-extrabold text-purple-600 dark:text-purple-400 block">
                          {prof.title}
                        </span>
                        <div className="text-[11px] text-md-on-surface-variant font-medium">
                          الفريم: <span className="font-bold text-md-on-surface">{prof.timeframeUsed}</span>
                        </div>
                      </div>
                      <div className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-md-surface w-fit text-md-on-surface-variant border border-md-outline-variant/30">
                        المدة: {prof.holdingPeriod}
                      </div>
                    </button>
                  ))}
                </div>

                {/* Selected Profile Detailed Specs Card */}
                {(() => {
                  const prof = BADRAN_STRATEGY_PLAYBOOK.profiles.find(p => p.type === selectedProfile) || BADRAN_STRATEGY_PLAYBOOK.profiles[1];
                  return (
                    <div className="bg-md-surface-container-low border border-purple-500/30 rounded-[22px] p-5 shadow-sm space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-md-outline-variant/30">
                        <div>
                          <h5 className="text-base font-extrabold text-purple-700 dark:text-purple-300">
                            {prof.title}
                          </h5>
                          <p className="text-xs text-md-on-surface-variant font-medium mt-0.5">
                            {prof.baladiSummary}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 font-mono text-xs font-bold bg-purple-500/15 text-purple-700 dark:text-purple-300 px-3 py-1.5 rounded-full border border-purple-500/25">
                          <span>نسبة العائد إلى المخاطرة:</span>
                          <span>{prof.riskRewardMin}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 text-xs">
                        {/* Entry Condition */}
                        <div className="p-3.5 bg-md-surface rounded-[16px] border border-md-outline-variant/40 space-y-1">
                          <span className="font-extrabold text-md-primary block text-[11px] flex items-center gap-1">
                            <Target size={13} />
                            <span>شروط الدخول المعتمدة:</span>
                          </span>
                          <p className="text-md-on-surface-variant leading-relaxed">
                            {prof.entryCondition}
                          </p>
                        </div>

                        {/* Stop Loss Rule */}
                        <div className="p-3.5 bg-rose-500/10 rounded-[16px] border border-rose-500/25 space-y-1">
                          <span className="font-extrabold text-rose-700 dark:text-rose-300 block text-[11px] flex items-center gap-1">
                            <ShieldAlert size={13} />
                            <span>قاعدة وقف الخسارة الصارمة:</span>
                          </span>
                          <p className="text-md-on-surface-variant leading-relaxed">
                            {prof.stopLossRule}
                          </p>
                        </div>

                        {/* Take Profit Rule */}
                        <div className="p-3.5 bg-emerald-500/10 rounded-[16px] border border-emerald-500/25 space-y-1">
                          <span className="font-extrabold text-emerald-700 dark:text-emerald-300 block text-[11px] flex items-center gap-1">
                            <Award size={13} />
                            <span>قاعدة جني الأرباح (TP1 & TP2):</span>
                          </span>
                          <p className="text-md-on-surface-variant leading-relaxed">
                            {prof.takeProfitRule}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* 3. معادلة التنفيذ بالمليم (Entry, Stop Loss, TP1, TP2) */}
              <div className="space-y-3.5 pt-3">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-full bg-emerald-600 text-white font-mono font-bold flex items-center justify-center text-xs">
                    3
                  </span>
                  <div>
                    <h4 className="text-base font-extrabold text-md-on-surface">
                      معادلة التنفيذ بالمليم: هتدخل فين بالظبط والستوب لوس وجني الأرباح فين؟
                    </h4>
                    <span className="text-xs text-md-on-surface-variant">
                      قواعد رياضية دقيقة مبنية على كتل الأوردر بلوك ومستويات فيبوناتشي
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5">
                  {/* Entry Card */}
                  <div className="p-4 bg-blue-500/10 border-2 border-blue-500/30 rounded-[18px] space-y-2 flex flex-col justify-between">
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-extrabold text-blue-700 dark:text-blue-300 flex items-center gap-1.5">
                          <Target size={14} className="text-blue-600" />
                          <span>1. نقطة الدخول الدقيقة</span>
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-700 dark:text-blue-300">
                          سعر الشراء
                        </span>
                      </div>
                      <p className="text-xs text-md-on-surface-variant leading-relaxed font-medium">
                        {BADRAN_STRATEGY_PLAYBOOK.execution.entryPriceRule}
                      </p>
                    </div>
                  </div>

                  {/* Stop Loss Card */}
                  <div className="p-4 bg-rose-500/10 border-2 border-rose-500/30 rounded-[18px] space-y-2 flex flex-col justify-between">
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-extrabold text-rose-700 dark:text-rose-300 flex items-center gap-1.5">
                          <ShieldAlert size={14} className="text-rose-600" />
                          <span>2. وقف الخسارة بالقرش</span>
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-700 dark:text-rose-300">
                          خط أحمر
                        </span>
                      </div>
                      <p className="text-xs text-md-on-surface-variant leading-relaxed font-medium">
                        {BADRAN_STRATEGY_PLAYBOOK.execution.stopLossExactRule}
                      </p>
                    </div>
                  </div>

                  {/* TP1 Card */}
                  <div className="p-4 bg-amber-500/10 border-2 border-amber-500/30 rounded-[18px] space-y-2 flex flex-col justify-between">
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-extrabold text-amber-700 dark:text-amber-300 flex items-center gap-1.5">
                          <Award size={14} className="text-amber-600" />
                          <span>3. الهدف الأول (TP1)</span>
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-300">
                          تأمين كاش 50%
                        </span>
                      </div>
                      <p className="text-xs text-md-on-surface-variant leading-relaxed font-medium">
                        {BADRAN_STRATEGY_PLAYBOOK.execution.takeProfitStage1Rule}
                      </p>
                    </div>
                  </div>

                  {/* TP2 Card */}
                  <div className="p-4 bg-emerald-500/10 border-2 border-emerald-500/30 rounded-[18px] space-y-2 flex flex-col justify-between">
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-extrabold text-emerald-700 dark:text-emerald-300 flex items-center gap-1.5">
                          <Zap size={14} className="text-emerald-600" />
                          <span>4. الهدف الثاني (TP2)</span>
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-300">
                          حصد الرالي 50%
                        </span>
                      </div>
                      <p className="text-xs text-md-on-surface-variant leading-relaxed font-medium">
                        {BADRAN_STRATEGY_PLAYBOOK.execution.takeProfitStage2Rule}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Golden Risk Rule Banner */}
                <div className="p-3 bg-gradient-to-r from-amber-500/15 to-transparent border border-amber-500/35 rounded-[16px] flex items-center gap-2.5">
                  <span className="text-base">⚖️</span>
                  <p className="text-xs font-extrabold text-amber-800 dark:text-amber-200">
                    {BADRAN_STRATEGY_PLAYBOOK.execution.goldenRiskRule}
                  </p>
                </div>
              </div>

              {/* 4. أشهر 5 أخطاء وتريكات بيقع فيها أغلب المتداولين */}
              <div className="space-y-3.5 pt-3">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-full bg-rose-600 text-white font-mono font-bold flex items-center justify-center text-xs">
                    4
                  </span>
                  <div>
                    <h4 className="text-base font-extrabold text-md-on-surface">
                      أشهر 5 أخطاء وتريكات يقع فيها 90% من المتداولين ولازم تتفاداها
                    </h4>
                    <span className="text-xs text-md-on-surface-variant">
                      الفارق الحقيقي بين المتداول المحترف والهاوي الذي يخسر أرباحه
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                  {BADRAN_STRATEGY_PLAYBOOK.top5Mistakes.map((mis) => (
                    <div
                      key={mis.id}
                      className="bg-md-surface-container-low border border-md-outline-variant/60 rounded-[18px] p-4 space-y-2.5 flex flex-col justify-between hover:border-rose-500/40 transition-all duration-200 shadow-sm"
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-rose-500/15 text-rose-700 dark:text-rose-300 font-mono font-bold text-xs flex items-center justify-center">
                            {mis.id}
                          </span>
                          <h5 className="text-xs font-extrabold text-md-on-surface">
                            {mis.title}
                          </h5>
                        </div>
                        <div className="p-2.5 bg-rose-500/10 rounded-[12px] border border-rose-500/20 text-[11px] space-y-0.5">
                          <span className="font-bold text-rose-700 dark:text-rose-300 block text-[10px]">الخطأ بالبلدي:</span>
                          <p className="text-md-on-surface-variant leading-relaxed">
                            "{mis.mistakeBaladi}"
                          </p>
                        </div>
                      </div>

                      <div className="p-2.5 bg-emerald-500/10 rounded-[12px] border border-emerald-500/20 text-[11px] space-y-0.5">
                        <span className="font-bold text-emerald-700 dark:text-emerald-300 block text-[10px] flex items-center gap-1">
                          <CheckCircle2 size={11} className="text-emerald-600" />
                          <span>إزاي تتفاداه باحترافية:</span>
                        </span>
                        <p className="text-md-on-surface leading-relaxed font-medium">
                          {mis.howToAvoid}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
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
                      <div className="p-3 bg-emerald-500/10 rounded-[14px] border border-emerald-500/30 text-xs space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="font-extrabold text-emerald-700 dark:text-emerald-300 text-[11px] flex items-center gap-1">
                            <CheckCircle2 size={13} className="text-emerald-600" />
                            <span>المؤشر في قالب BADRAN (ثاندر):</span>
                          </span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-800 dark:text-emerald-200">
                            {thndrMap.coverageType}
                          </span>
                        </div>
                        <p className="text-md-on-surface font-mono font-extrabold text-xs">
                          {thndrMap.installedInBadranTemplate}
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
