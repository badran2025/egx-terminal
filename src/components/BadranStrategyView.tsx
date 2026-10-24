import React, { useState } from 'react';
import { 
  Compass, CheckCircle2, AlertTriangle, ShieldAlert, 
  HelpCircle, Sparkles, Target, Zap, Award, ArrowLeft, 
  ArrowRight, Layers, Smartphone, FlaskConical, ExternalLink
} from 'lucide-react';
import { 
  BADRAN_STRATEGY_PLAYBOOK, 
  THNDR_SEVEN_LAYERS_MAPPING 
} from '../services/thndrIndicatorsData';
import { LastUpdatedBanner } from './LastUpdatedBanner';

interface Props {
  onNavigateToLab?: (symbol?: string) => void;
  lastUpdated?: Date;
  onRefresh?: () => void;
  isLoading?: boolean;
}

export const BadranStrategyView: React.FC<Props> = ({
  onNavigateToLab,
  lastUpdated,
  onRefresh,
  isLoading = false
}) => {
  const [activeStepTab, setActiveStepTab] = useState<number>(1);
  const [selectedProfile, setSelectedProfile] = useState<'long_term' | 'swing' | 'day_trader'>('swing');

  const currStep = BADRAN_STRATEGY_PLAYBOOK.steps.find(s => s.stepNumber === activeStepTab) || BADRAN_STRATEGY_PLAYBOOK.steps[0];
  const currProf = BADRAN_STRATEGY_PLAYBOOK.profiles.find(p => p.type === selectedProfile) || BADRAN_STRATEGY_PLAYBOOK.profiles[1];

  return (
    <div className="space-y-6 text-md-on-surface animate-fadeIn" dir="rtl">
      {/* Date of Last Update Banner */}
      <LastUpdatedBanner
        lastUpdated={lastUpdated}
        onRefresh={onRefresh}
        isLoading={isLoading}
        tabTitle="دليل استراتيجية التحليل وخارطة القرار المعتمدة (قالب BADRAN)"
      />

      {/* 1. M3 Hero Banner */}
      <div className="bg-gradient-to-r from-blue-600/20 via-indigo-600/15 to-purple-600/15 border-2 border-blue-500/40 rounded-[28px] p-6 shadow-sm relative overflow-hidden">
        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="w-10 h-10 rounded-[14px] bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-xl shadow-md">
                🧭
              </span>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">
                    {BADRAN_STRATEGY_PLAYBOOK.suiteTitle}
                  </h2>
                  <span className="px-3 py-0.5 rounded-full text-xs font-extrabold bg-blue-600 text-white shadow-sm flex items-center gap-1">
                    <CheckCircle2 size={13} />
                    <span>قالب BADRAN المعتمد في ثاندر</span>
                  </span>
                </div>
                <span className="text-xs text-blue-700 dark:text-blue-300 font-semibold block">
                  خارطة الطريق التشغيلية: كيف تقرأ المؤشرات بالترتيب، وتحدد أسلوبك، وتنفذ بالمليم!
                </span>
              </div>
            </div>

            <p className="text-xs text-md-on-surface-variant max-w-3xl leading-relaxed font-medium">
              مرجعك الميداني الصارم الذي يربط الشارت بقرار التداول: نبدأ بفحص تيار البورصة العام والنشاط، ثم نكشف قيعان كتل الحيتان ومساحة الحركة، ونختبر تانك البنزين ودواسة الزخم، وننتهي بمعادلة التنفيذ بالقرش دون تردد أو عشوائية.
            </p>
          </div>

          {/* Quick Action CTA & Metrics */}
          <div className="flex flex-col sm:flex-row lg:flex-col items-stretch lg:items-end gap-2.5 w-full lg:w-auto">
            {onNavigateToLab && (
              <button
                onClick={() => onNavigateToLab('COMI')}
                className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold shadow-md transition-all whitespace-nowrap"
              >
                <FlaskConical size={15} />
                <span>تطبيق الاستراتيجية في المعمل المباشر 🔬</span>
              </button>
            )}

            <div className="flex items-center gap-2">
              <div className="bg-md-surface/90 border border-blue-500/30 rounded-[14px] px-3.5 py-1.5 text-center flex-1 sm:flex-none">
                <div className="text-[10px] text-md-on-surface-variant font-bold">المؤشرات المعتمدة</div>
                <div className="text-sm font-mono font-extrabold text-blue-600 dark:text-blue-400">8 مؤشرات متناسقة</div>
              </div>
              <div className="bg-md-surface/90 border border-blue-500/30 rounded-[14px] px-3.5 py-1.5 text-center flex-1 sm:flex-none">
                <div className="text-[10px] text-md-on-surface-variant font-bold">تسلسل الخطوات</div>
                <div className="text-sm font-mono font-extrabold text-purple-600 dark:text-purple-400">6 خطوات صارمة</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. الترتيب التسلسلي الصارم لعملية التحليل (6 خطوات بالترتيب) */}
      <div className="space-y-4 bg-md-surface-container-low border border-md-outline-variant/60 rounded-[28px] p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-md-outline-variant/30">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-blue-600 text-white font-mono font-bold flex items-center justify-center text-sm shadow-sm">
              1
            </span>
            <div>
              <h3 className="text-base sm:text-lg font-extrabold text-md-on-surface">
                الترتيب التسلسلي الصارم: تبدأ بمؤشر إيه الأول وتقيس إشاراته إزاي؟
              </h3>
              <span className="text-xs text-md-on-surface-variant">
                المتداول الهاوي بيبص على مؤشر عشوائي ويشتري، لكن المحترف بيمشي بهذا الترتيب الهرمي الثابت:
              </span>
            </div>
          </div>
          <span className="text-xs text-blue-600 dark:text-blue-400 font-bold self-start sm:self-auto">
            خطوة {activeStepTab} من 6
          </span>
        </div>

        {/* Step Selector Horizontal Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
          {BADRAN_STRATEGY_PLAYBOOK.steps.map((st) => (
            <button
              key={st.stepNumber}
              onClick={() => setActiveStepTab(st.stepNumber)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-full font-bold transition-all duration-200 select-none whitespace-nowrap border ${
                activeStepTab === st.stepNumber
                  ? 'bg-blue-600 text-white border-blue-600 shadow-md ring-2 ring-blue-400/40'
                  : 'bg-md-surface text-md-on-surface-variant border-md-outline-variant/60 hover:bg-md-surface-container'
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
        <div className="bg-md-surface border-2 border-blue-500/30 rounded-[24px] p-5 shadow-sm space-y-4">
          {/* Header of Active Step */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-md-outline-variant/30">
            <div className="flex items-center gap-3">
              <span className="w-9 h-9 rounded-[14px] bg-blue-600 text-white font-mono font-extrabold flex items-center justify-center text-sm shadow-sm">
                #{currStep.stepNumber}
              </span>
              <div>
                <h4 className="text-base font-extrabold text-md-on-surface">
                  {currStep.stepName}
                </h4>
                <span className="text-xs font-bold text-blue-600 dark:text-blue-400 block mt-0.5">
                  المؤشر المعتمد في ثاندر: <span className="font-mono">{currStep.indicatorUsed}</span> • ({currStep.indicatorLocation})
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveStepTab(prev => Math.max(1, prev - 1))}
                disabled={currStep.stepNumber === 1}
                className="px-3 py-1.5 rounded-md-full text-xs font-bold border border-md-outline-variant/60 hover:bg-md-surface-container disabled:opacity-30 transition-all"
              >
                السابق
              </button>
              <button
                onClick={() => setActiveStepTab(prev => Math.min(6, prev + 1))}
                disabled={currStep.stepNumber === 6}
                className="px-3.5 py-1.5 rounded-md-full text-xs font-bold bg-blue-600 text-white disabled:opacity-30 transition-all shadow-xs"
              >
                التالي
              </button>
            </div>
          </div>

          {/* Core Question */}
          <div className="p-3.5 bg-blue-500/10 rounded-[16px] border border-blue-500/25 space-y-1">
            <span className="text-xs font-extrabold text-blue-700 dark:text-blue-300 flex items-center gap-1.5">
              <HelpCircle size={14} />
              <span>السؤال الجوهري الذي تسأله لنفسك قبل الشراء:</span>
            </span>
            <p className="text-xs sm:text-sm font-bold text-md-on-surface leading-relaxed">
              "{currStep.coreQuestion}"
            </p>
          </div>

          {/* Signals Grid: Bullish vs Bearish */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Bullish */}
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-[18px] space-y-1.5">
              <span className="text-xs font-extrabold text-emerald-700 dark:text-emerald-300 flex items-center gap-1.5">
                <CheckCircle2 size={15} className="text-emerald-600" />
                <span>إشارة الشراء الخضراء المؤكدة (Bullish Signal):</span>
              </span>
              <p className="text-xs text-md-on-surface-variant leading-relaxed font-medium">
                {currStep.bullishSignal}
              </p>
            </div>

            {/* Bearish */}
            <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-[18px] space-y-1.5">
              <span className="text-xs font-extrabold text-rose-700 dark:text-rose-300 flex items-center gap-1.5">
                <ShieldAlert size={15} className="text-rose-600" />
                <span>إشارة الحذر أو المنع (Bearish / Warning):</span>
              </span>
              <p className="text-xs text-md-on-surface-variant leading-relaxed font-medium">
                {currStep.bearishSignal}
              </p>
            </div>
          </div>

          {/* Pitfall vs Pro Trick */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
            {/* Pitfall */}
            <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-[18px] space-y-1.5">
              <span className="text-xs font-extrabold text-amber-700 dark:text-amber-300 flex items-center gap-1.5">
                <AlertTriangle size={15} className="text-amber-600" />
                <span>⚠️ الخطأ الشائع الذي يقع فيه أغلب الناس:</span>
              </span>
              <p className="text-xs text-md-on-surface-variant leading-relaxed">
                {currStep.commonPitfall}
              </p>
            </div>

            {/* Pro Trick */}
            <div className="p-4 bg-purple-500/10 border border-purple-500/30 rounded-[18px] space-y-1.5">
              <span className="text-xs font-extrabold text-purple-700 dark:text-purple-300 flex items-center gap-1.5">
                <Sparkles size={15} className="text-purple-600" />
                <span>💡 تريكة المحترفين وصناع السوق:</span>
              </span>
              <p className="text-xs text-md-on-surface-variant leading-relaxed font-medium">
                {currStep.proTrick}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 3. شجرة القرار: تحديد هوية المتداول (مستثمر طويل vs سوينج vs مضارب) */}
      <div className="space-y-4 bg-md-surface-container-low border border-md-outline-variant/60 rounded-[28px] p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-md-outline-variant/30">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-purple-600 text-white font-mono font-bold flex items-center justify-center text-sm shadow-sm">
              2
            </span>
            <div>
              <h3 className="text-base sm:text-lg font-extrabold text-md-on-surface">
                شجرة القرار: أنت داخل كمستثمر طويل ولا سوينج متوسط ولا مضارب لحظي؟
              </h3>
              <span className="text-xs text-md-on-surface-variant">
                لكل أسلوب فريم محدد، وشروط دخول مختلفة، ونسبة وقف ومستهدف متباينة
              </span>
            </div>
          </div>
        </div>

        {/* Profile Tabs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          {BADRAN_STRATEGY_PLAYBOOK.profiles.map((prof) => (
            <button
              key={prof.type}
              onClick={() => setSelectedProfile(prof.type)}
              className={`p-4.5 rounded-[22px] border text-right transition-all duration-200 flex flex-col justify-between space-y-2.5 ${
                selectedProfile === prof.type
                  ? 'bg-purple-500/15 border-purple-500 shadow-md ring-2 ring-purple-400/30'
                  : 'bg-md-surface border-md-outline-variant/60 hover:bg-md-surface-container'
              }`}
            >
              <div className="space-y-1">
                <span className="text-sm font-extrabold text-purple-700 dark:text-purple-300 block">
                  {prof.title}
                </span>
                <div className="text-xs text-md-on-surface-variant font-medium">
                  الفريم المعتمد: <span className="font-bold text-md-on-surface">{prof.timeframeUsed}</span>
                </div>
              </div>
              <div className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-md-surface-container w-fit text-md-on-surface-variant border border-md-outline-variant/40">
                فترة الاحتفاظ: {prof.holdingPeriod}
              </div>
            </button>
          ))}
        </div>

        {/* Selected Profile Detailed Specs Card */}
        <div className="bg-md-surface border border-purple-500/30 rounded-[24px] p-5 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-md-outline-variant/30">
            <div>
              <h4 className="text-base font-extrabold text-purple-700 dark:text-purple-300">
                {currProf.title}
              </h4>
              <p className="text-xs text-md-on-surface-variant font-medium mt-0.5">
                {currProf.baladiSummary}
              </p>
            </div>
            <div className="flex items-center gap-2 font-mono text-xs font-bold bg-purple-500/15 text-purple-700 dark:text-purple-300 px-3.5 py-1.5 rounded-full border border-purple-500/25">
              <span>نسبة العائد إلى المخاطرة (R:R):</span>
              <span>{currProf.riskRewardMin}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            {/* Entry Condition */}
            <div className="p-4 bg-md-surface-container rounded-[18px] border border-md-outline-variant/40 space-y-1.5">
              <span className="font-extrabold text-md-primary block text-xs flex items-center gap-1.5">
                <Target size={14} />
                <span>شروط الدخول المعتمدة:</span>
              </span>
              <p className="text-md-on-surface-variant leading-relaxed">
                {currProf.entryCondition}
              </p>
            </div>

            {/* Stop Loss Rule */}
            <div className="p-4 bg-rose-500/10 rounded-[18px] border border-rose-500/25 space-y-1.5">
              <span className="font-extrabold text-rose-700 dark:text-rose-300 block text-xs flex items-center gap-1.5">
                <ShieldAlert size={14} />
                <span>قاعدة وقف الخسارة الصارمة:</span>
              </span>
              <p className="text-md-on-surface-variant leading-relaxed">
                {currProf.stopLossRule}
              </p>
            </div>

            {/* Take Profit Rule */}
            <div className="p-4 bg-emerald-500/10 rounded-[18px] border border-emerald-500/25 space-y-1.5">
              <span className="font-extrabold text-emerald-700 dark:text-emerald-300 block text-xs flex items-center gap-1.5">
                <Award size={14} />
                <span>قاعدة جني الأرباح (TP1 & TP2):</span>
              </span>
              <p className="text-md-on-surface-variant leading-relaxed">
                {currProf.takeProfitRule}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 4. معادلة التنفيذ بالمليم (Entry, Stop Loss, TP1, TP2) */}
      <div className="space-y-4 bg-md-surface-container-low border border-md-outline-variant/60 rounded-[28px] p-5 sm:p-6 shadow-sm">
        <div className="flex items-center gap-2 pb-3 border-b border-md-outline-variant/30">
          <span className="w-8 h-8 rounded-full bg-emerald-600 text-white font-mono font-bold flex items-center justify-center text-sm shadow-sm">
            3
          </span>
          <div>
            <h3 className="text-base sm:text-lg font-extrabold text-md-on-surface">
              معادلة التنفيذ بالمليم: هتدخل فين بالظبط والستوب لوس وجني الأرباح فين؟
            </h3>
            <span className="text-xs text-md-on-surface-variant">
              قواعد رياضية دقيقة مبنية على كتل الأوردر بلوك ومستويات فيبوناتشي
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Entry Card */}
          <div className="p-4.5 bg-blue-500/10 border-2 border-blue-500/30 rounded-[20px] space-y-2.5 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-blue-700 dark:text-blue-300 flex items-center gap-1.5">
                  <Target size={15} className="text-blue-600" />
                  <span>1. سعر الدخول بالقرش</span>
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
          <div className="p-4.5 bg-rose-500/10 border-2 border-rose-500/30 rounded-[20px] space-y-2.5 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-rose-700 dark:text-rose-300 flex items-center gap-1.5">
                  <ShieldAlert size={15} className="text-rose-600" />
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
          <div className="p-4.5 bg-amber-500/10 border-2 border-amber-500/30 rounded-[20px] space-y-2.5 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-amber-700 dark:text-amber-300 flex items-center gap-1.5">
                  <Award size={15} className="text-amber-600" />
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
          <div className="p-4.5 bg-emerald-500/10 border-2 border-emerald-500/30 rounded-[20px] space-y-2.5 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-emerald-700 dark:text-emerald-300 flex items-center gap-1.5">
                  <Zap size={15} className="text-emerald-600" />
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
        <div className="p-3.5 bg-gradient-to-r from-amber-500/15 via-amber-500/10 to-transparent border border-amber-500/35 rounded-[18px] flex items-center gap-3">
          <span className="text-xl">⚖️</span>
          <p className="text-xs sm:text-sm font-extrabold text-amber-800 dark:text-amber-200">
            {BADRAN_STRATEGY_PLAYBOOK.execution.goldenRiskRule}
          </p>
        </div>
      </div>

      {/* 5. خريطة مطابقة الـ 8 مؤشرات المعتمدة في ثاندر (Confluence Matrix) */}
      <div className="space-y-4 bg-md-surface-container-low border border-md-outline-variant/60 rounded-[28px] p-5 sm:p-6 shadow-sm">
        <div className="flex items-center justify-between pb-3 border-b border-md-outline-variant/30">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-teal-600 text-white font-mono font-bold flex items-center justify-center text-sm shadow-sm">
              4
            </span>
            <div>
              <h3 className="text-base sm:text-lg font-extrabold text-md-on-surface">
                مصفوفة مطابقة قالب BADRAN في ثاندر مع منظومتنا في الموقع
              </h3>
              <span className="text-xs text-md-on-surface-variant">
                كل مؤشر مثبت في ثاندر يقابله بالمليم نفس المفهوم والتحليل في موقعنا
              </span>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto rounded-[20px] border border-md-outline-variant/60 bg-md-surface shadow-inner">
          <table className="w-full text-right text-xs border-collapse">
            <thead>
              <tr className="bg-md-surface-container border-b border-md-outline-variant/40 text-md-on-surface font-extrabold">
                <th className="p-3.5 w-12 text-center">#</th>
                <th className="p-3.5">الطبقة في منظومتنا</th>
                <th className="p-3.5">المؤشر المثبت في ثاندر (قالب BADRAN)</th>
                <th className="p-3.5">المؤشر الموازي في تريدنج فيو والموقع</th>
                <th className="p-3.5 text-center">موضع العرض في ثاندر</th>
                <th className="p-3.5">طريقة قراءة الإشارة بالبلدي</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-md-outline-variant/30 font-medium">
              {THNDR_SEVEN_LAYERS_MAPPING.map((row) => (
                <tr key={row.layerNumber} className="hover:bg-blue-500/5 transition-colors">
                  <td className="p-3.5 text-center font-mono font-bold">
                    <span className="w-6 h-6 rounded-full bg-blue-500/15 text-blue-700 dark:text-blue-300 inline-flex items-center justify-center text-xs">
                      {row.layerNumber}
                    </span>
                  </td>
                  <td className="p-3.5 font-bold text-md-on-surface">
                    <div>{row.layerName}</div>
                    <span className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold">{row.mirrorName}</span>
                  </td>
                  <td className="p-3.5">
                    <span className="font-mono font-extrabold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md text-[11px] inline-block">
                      {row.installedInBadranTemplate}
                    </span>
                  </td>
                  <td className="p-3.5 text-md-on-surface-variant font-mono text-[11px]">
                    {row.equivalentInOurSystem}
                  </td>
                  <td className="p-3.5 text-center">
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                      row.coverageType === 'شارت ثاندر المباشر'
                        ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20'
                        : row.coverageType === 'لوحة الزخم السفلية'
                        ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20'
                        : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                    }`}>
                      {row.coverageType}
                    </span>
                  </td>
                  <td className="p-3.5 text-xs text-md-on-surface leading-relaxed max-w-xs">
                    {row.whatToLookFor}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 6. أشهر 5 أخطاء وتريكات يقع فيها 90% من المتداولين */}
      <div className="space-y-4 bg-md-surface-container-low border border-md-outline-variant/60 rounded-[28px] p-5 sm:p-6 shadow-sm">
        <div className="flex items-center gap-2 pb-3 border-b border-md-outline-variant/30">
          <span className="w-8 h-8 rounded-full bg-rose-600 text-white font-mono font-bold flex items-center justify-center text-sm shadow-sm">
            5
          </span>
          <div>
            <h3 className="text-base sm:text-lg font-extrabold text-md-on-surface">
              أشهر 5 أخطاء وتريكات يقع فيها 90% من المتداولين ولازم تتفاداها
            </h3>
            <span className="text-xs text-md-on-surface-variant">
              الفارق الحقيقي بين المتداول المحترف والهاوي الذي يخسر أرباحه بعد كل موجة صاعدة
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {BADRAN_STRATEGY_PLAYBOOK.top5Mistakes.map((mis) => (
            <div
              key={mis.id}
              className="bg-md-surface border border-md-outline-variant/60 rounded-[20px] p-4.5 space-y-3 flex flex-col justify-between hover:border-rose-500/40 transition-all duration-200 shadow-sm"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-rose-500/15 text-rose-700 dark:text-rose-300 font-mono font-bold text-xs flex items-center justify-center">
                    {mis.id}
                  </span>
                  <h4 className="text-xs font-extrabold text-md-on-surface">
                    {mis.title}
                  </h4>
                </div>
                <div className="p-3 bg-rose-500/10 rounded-[14px] border border-rose-500/20 text-xs space-y-0.5">
                  <span className="font-bold text-rose-700 dark:text-rose-300 block text-[10px]">الخطأ بالبلدي:</span>
                  <p className="text-md-on-surface-variant leading-relaxed">
                    "{mis.mistakeBaladi}"
                  </p>
                </div>
              </div>

              <div className="p-3 bg-emerald-500/10 rounded-[14px] border border-emerald-500/20 text-xs space-y-0.5">
                <span className="font-bold text-emerald-700 dark:text-emerald-300 block text-[10px] flex items-center gap-1">
                  <CheckCircle2 size={12} className="text-emerald-600" />
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
  );
};
