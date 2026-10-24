import React, { useState, useMemo } from 'react';
import { 
  GraduationCap, BookOpen, Layers, Search, 
  ExternalLink, ChevronDown, ChevronUp, ArrowRight
} from 'lucide-react';
import { INDICATORS_KNOWLEDGE_BASE, GROWTHX_SEVEN_LAYERS } from '../services/indicatorsEducationData';
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
  const [activeMainTab, setActiveMainTab] = useState<'indicators' | 'framework'>('indicators');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({});

  // Filter indicators
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
        tabTitle="أكاديمية المؤشرات الفنية ونظام الطبقات السبع"
      />

      {/* 1. M3 Hero Banner: Compact & Clean */}
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
                  موسوعة المؤشرات بالبلدي • نظام الطبقات السبع وعمارة الأدوار ومرايا التداول
                </span>
              </div>
            </div>
            <p className="text-xs text-md-on-surface-variant max-w-3xl leading-relaxed font-medium">
              مرجع تعليمي مبسط يشرح أهم مؤشرات التحليل الفني ومفاهيم الأموال الذكية بالعامية المصرية المبسطة، بالإضافة إلى استراتيجية الطبقات السبع لاتخاذ قرارات مدروسة في البورصة.
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="bg-md-surface text-md-on-surface rounded-[16px] px-3.5 py-2 text-center min-w-[95px] shadow-sm border border-md-outline-variant/40">
              <div className="text-[10px] text-md-on-surface-variant font-semibold mb-0.5">مؤشرات مشروحة</div>
              <div className="text-lg font-mono font-extrabold text-md-primary">{INDICATORS_KNOWLEDGE_BASE.length} مؤشر</div>
            </div>
            <div className="bg-md-surface text-md-on-surface rounded-[16px] px-3.5 py-2 text-center min-w-[95px] shadow-sm border border-md-outline-variant/40">
              <div className="text-[10px] text-md-on-surface-variant font-semibold mb-0.5">طبقات القرار</div>
              <div className="text-lg font-mono font-extrabold text-md-tertiary">7 طبقات</div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Navigation Tabs: 2 Tabs ONLY */}
      <div className="flex items-center justify-center sm:justify-start">
        <div className="flex items-center gap-1.5 bg-md-surface-container p-1.5 rounded-md-full border border-md-outline-variant/60 shadow-sm text-xs overflow-x-auto scrollbar-none">
          {/* TAB 1: موسوعة المؤشرات بالبلدي */}
          <button
            onClick={() => setActiveMainTab('indicators')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md-full font-bold transition-all duration-200 select-none whitespace-nowrap ${
              activeMainTab === 'indicators'
                ? 'bg-md-primary text-md-on-primary shadow-sm'
                : 'text-md-on-surface-variant hover:text-md-on-surface hover:bg-md-surface-container-high'
            }`}
          >
            <BookOpen size={15} className={activeMainTab === 'indicators' ? 'text-md-on-primary' : 'text-md-primary'} />
            <span>📖 موسوعة المؤشرات بالبلدي ({INDICATORS_KNOWLEDGE_BASE.length})</span>
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
            <span>🏛️ نظام الطبقات السبع وعمارة الأدوار ومرايا التداول</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: موسوعة المؤشرات الفنية المشروحة بالبلدي */}
      {/* ========================================================================= */}
      {activeMainTab === 'indicators' && (
        <div className="space-y-6">
          {/* Filter Bar & Search Card */}
          <MdCard variant="outlined" className="space-y-4">
            <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
              {/* Category Chips */}
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
                          <span className="text-xs font-mono font-bold text-md-primary bg-md-primary/10 px-2.5 py-0.5 rounded-full border border-md-primary/30">
                            {ind.nameEn}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-md-on-surface-variant mt-1">
                          <span>النوع: <strong>{ind.type}</strong></span>
                          {ind.author && <span>المطور: <strong>{ind.author}</strong></span>}
                          {ind.tradingViewScriptUrl && (
                            <a
                              href={ind.tradingViewScriptUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-md-primary font-bold hover:underline inline-flex items-center gap-1"
                            >
                              <span>على TradingView</span>
                              <ExternalLink size={12} />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>

                    <MdButton
                      variant="tonal"
                      size="sm"
                      onClick={() => toggleExpand(ind.id)}
                      icon={isExpanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                    >
                      {isExpanded ? 'طي التفاصيل' : 'اقرأ الشرح بالكامل'}
                    </MdButton>
                  </div>

                  {/* Overview & Objective */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                    <div className="p-3.5 bg-md-surface rounded-[16px] border border-md-outline-variant/40 space-y-1">
                      <div className="flex items-center gap-2 text-xs font-bold text-md-primary">
                        <span className="text-base">☕</span>
                        <span>فكرته وبيعمل إيه بالبلدي:</span>
                      </div>
                      <p className="text-xs text-md-on-surface leading-relaxed font-medium">
                        {ind.overview}
                      </p>
                    </div>

                    <div className="p-3.5 bg-amber-500/10 border border-amber-500/30 rounded-[16px] space-y-1">
                      <div className="flex items-center gap-2 text-xs font-bold text-amber-700 dark:text-amber-300">
                        <span className="text-base">🎯</span>
                        <span>الهدف الأساسي من استخدامه:</span>
                      </div>
                      <p className="text-xs text-md-on-surface leading-relaxed font-medium">
                        {ind.objective}
                      </p>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {isExpanded && (
                    <div className="space-y-4 pt-3 border-t border-md-outline-variant/40 animate-fadeIn text-xs">
                      {/* When & Why */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                        <div className="p-3.5 bg-md-surface rounded-[16px] border border-md-outline-variant/40 space-y-1">
                          <span className="font-bold text-md-primary block text-xs">⏰ إمتى تستخدمه؟</span>
                          <p className="text-md-on-surface-variant leading-relaxed">
                            {ind.whenToUse}
                          </p>
                        </div>
                        <div className="p-3.5 bg-md-surface rounded-[16px] border border-md-outline-variant/40 space-y-1">
                          <span className="font-bold text-md-tertiary block text-xs">💡 ليه تعتمد عليه تحديداً؟</span>
                          <p className="text-md-on-surface-variant leading-relaxed">
                            {ind.whyUseIt}
                          </p>
                        </div>
                      </div>

                      {/* Step by Step Guide */}
                      <div className="space-y-2 pt-2 border-t border-md-outline-variant/40">
                        <span className="font-bold text-md-primary block text-xs">🚀 خطوات التطبيق خطوة بخطوة:</span>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
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
                    </div>
                  )}
                </div>
              );
            })}
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
                  المنظومة التي نقلت المتداولين من الاعتماد على المؤشرات الفردية إلى فحص مؤسسي شامل
                </span>
              </div>
            </div>

            <p className="text-xs text-md-on-surface-variant leading-relaxed">
              تعتمد هذه الاستراتيجية على فكرة بديهية: لا تشتري سهماً أبداً بناءً على مؤشر واحد فقط (مثل RSI أو خط دعم عادي)، لأن المؤشرات مجرد <strong>تأكيد</strong> لحدث تم بالفعل، وليست <strong>قراراً</strong>. قرار الشراء الاحترافي يتطلب اجتياز السهم لـ 7 طبقات فنية متتالية، بدءاً من الاتجاه العام، وصولاً إلى سيولة الأموال الذكية ومناطق الـ Order Blocks.
            </p>
          </div>

          {/* 7 Layers Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {GROWTHX_SEVEN_LAYERS.map((layer) => (
              <div 
                key={layer.layerNumber}
                className="bg-md-surface-container-low border border-md-outline-variant/60 rounded-[22px] p-4 shadow-sm space-y-3.5 flex flex-col justify-between"
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

                  <div className="p-3 bg-md-surface rounded-[14px] border border-md-outline-variant/40 text-xs space-y-1">
                    <span className="font-bold text-md-primary block text-[11px]">قاعدة اتخاذ القرار:</span>
                    <p className="text-md-on-surface-variant leading-relaxed text-[11px]">
                      {layer.actionRule}
                    </p>
                  </div>

                  <div className="p-3 bg-md-surface-container rounded-[14px] border border-md-outline-variant/30 text-xs space-y-1">
                    <span className="font-bold text-md-on-surface block text-[11px]">المؤشرات المستخدمة:</span>
                    <p className="text-md-on-surface-variant leading-relaxed font-mono text-[11px]">
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
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
