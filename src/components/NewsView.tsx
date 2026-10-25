import React, { useState } from 'react';
import { Newspaper, Clock, ArrowUpRight, Globe, ShieldAlert, Sparkles } from 'lucide-react';
import { EGXNewsItem } from '../types';
import { EGX_LATEST_NEWS } from '../services/egxService';
import { MdCard, MdChip, MdBadge } from './material';
import { LastUpdatedBanner } from './LastUpdatedBanner';

interface Props {
  onSelectStock: (symbol: string) => void;
  lastUpdated?: Date;
  onRefresh?: () => void;
  isLoading?: boolean;
  news?: EGXNewsItem[];
  macroRiskModifier?: number;
  macroSentiment?: 'إيجابي' | 'محايد' | 'حذر / توترات';
  recommendedCashRatioPct?: number;
}

export const NewsView: React.FC<Props> = ({ 
  onSelectStock,
  lastUpdated,
  onRefresh,
  isLoading = false,
  news = EGX_LATEST_NEWS,
  macroRiskModifier = 0,
  macroSentiment = 'محايد',
  recommendedCashRatioPct = 25
}) => {
  const [filter, setFilter] = useState<string>('all');

  const activeNewsList = (news && news.length > 0) ? news : EGX_LATEST_NEWS;

  const filtered = activeNewsList.filter(item => {
    if (filter === 'all') return true;
    return item.category === filter;
  });

  return (
    <div className="space-y-6 text-md-on-surface" dir="rtl">
      {/* Date of Last Update Banner */}
      <LastUpdatedBanner
        lastUpdated={lastUpdated}
        onRefresh={onRefresh}
        isLoading={isLoading}
        tabTitle="الإفصاحات وأخبار الاقتصاد الكلي الحية"
      />

      {/* Geopolitical & Macro Risk Assessment Card */}
      <MdCard variant="elevated" className="p-4 sm:p-5 border border-md-outline-variant/60 bg-gradient-to-r from-md-surface-container to-md-surface-container-high">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-blue-500/15 text-blue-500">
                <Globe size={20} />
              </span>
              <h3 className="font-extrabold text-base text-md-on-surface">
                محرك تقييم المخاطر الجيوسياسية والاقتصاد الكلي المباشر (Macro Risk Engine)
              </h3>
            </div>
            <p className="text-xs text-md-on-surface-variant leading-relaxed pr-8">
              يقوم المحرك بمسح عناوين الأخبار الحية لحظياً ورصد الكلمات المفتاحية (توترات إقليمية، قرارات الفائدة، أسعار الطاقة والنفط، الطروحات والاستحواذات) لتوليد معامل أمان المحفظة.
            </p>
          </div>

          {/* Key Metrics Chips */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <div className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 ${
              macroSentiment === 'إيجابي'
                ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
                : macroSentiment === 'حذر / توترات'
                ? 'bg-rose-500/15 border-rose-500/30 text-rose-600 dark:text-rose-400'
                : 'bg-blue-500/15 border-blue-500/30 text-blue-600 dark:text-blue-400'
            }`}>
              <ShieldAlert size={14} />
              <span>حالة المناخ العام:</span>
              <span className="font-extrabold">{macroSentiment}</span>
            </div>

            <div className="px-3 py-1.5 rounded-xl border border-md-outline-variant/60 bg-md-surface text-xs font-bold flex items-center gap-1.5">
              <span>تأثير السكور (Macro Modifier):</span>
              <span className={`font-mono font-extrabold ${macroRiskModifier >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                {macroRiskModifier > 0 ? `+${macroRiskModifier}%` : `${macroRiskModifier}%`}
              </span>
            </div>

            <div className="px-3 py-1.5 rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300 text-xs font-bold flex items-center gap-1.5">
              <span>السيولة النقدية الموصى بها:</span>
              <span className="font-mono font-extrabold">{recommendedCashRatioPct}% كاش</span>
            </div>
          </div>
        </div>
      </MdCard>

      {/* Top Banner (M3 Elevated Card - Filter Categories) */}
      <MdCard variant="elevated" className="p-4 sm:p-5 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-md-on-surface font-bold text-base mb-1">
            <div className="w-8 h-8 rounded-md-md bg-md-tertiary-container text-md-on-tertiary-container flex items-center justify-center">
              <Newspaper size={18} />
            </div>
            <span>شريط إفصاحات وأخبار الشركات المقيدة بالبورصة المصرية</span>
          </div>
          <p className="text-xs text-md-on-surface-variant leading-relaxed">
            متابعة فورية لإفصاحات مجالس الإدارات، قرارات الجمعيات العامة، التوزيعات النقدية، ونتائج الأعمال الفصلية مع تصنيف التأثير على حركة السهم.
          </p>
        </div>

        {/* Filter categories using MdChip */}
        <div className="flex items-center gap-2 text-xs overflow-x-auto w-full md:w-auto scrollbar-none">
          {['all', 'إفصاح رسمي', 'توزيعات أرباح', 'نتائج أعمال', 'استحواذ ودمج', 'أخبار عامة'].map(cat => (
            <MdChip
              key={cat}
              label={cat === 'all' ? 'جميع الإفصاحات' : cat}
              selected={filter === cat}
              onClick={() => setFilter(cat)}
            />
          ))}
        </div>
      </MdCard>

      {/* Disclosures Feed (M3 Outlined Cards) */}
      <div className="space-y-4">
        {filtered.map(item => (
          <MdCard 
            key={item.id}
            variant="outlined"
            className="p-5 hover:border-md-outline transition-all duration-200"
          >
            <div className="flex items-start justify-between gap-4 mb-2">
              <div className="flex items-center gap-2 flex-wrap">
                <MdBadge variant={
                  item.sentiment === 'إيجابي' ? 'primary' :
                  item.sentiment === 'سلبي' ? 'error' : 'secondary'
                }>
                  تأثير {item.sentiment}
                </MdBadge>

                <span className="text-[11px] bg-md-surface-container-highest text-md-on-surface-variant px-2.5 py-0.5 rounded-md-full border border-md-outline-variant/60 font-medium">
                  {item.category}
                </span>

                {item.company && (
                  <span className="text-xs font-bold text-md-on-surface bg-md-surface-container px-2 py-0.5 rounded-md">
                    {item.company}
                  </span>
                )}

                {item.symbol && (
                  <button
                    onClick={() => onSelectStock(item.symbol!)}
                    className="text-xs font-mono font-bold text-md-primary bg-md-surface-container px-2.5 py-0.5 rounded-md-sm border border-md-outline-variant hover:border-md-primary transition-colors flex items-center gap-1"
                  >
                    <span>{item.symbol}</span>
                    <ArrowUpRight size={12} />
                  </button>
                )}
              </div>

              <span className="text-xs text-md-on-surface-variant flex items-center gap-1 font-mono">
                <Clock size={13} />
                {item.time}
              </span>
            </div>

            <h4 className="font-bold text-md-on-surface text-sm mb-2 leading-relaxed">
              {item.title}
            </h4>

            <p className="text-xs text-md-on-surface-variant leading-relaxed bg-md-surface-container/60 p-3.5 rounded-md-md border border-md-outline-variant/40">
              {item.summary}
            </p>

            {item.url && (
              <div className="mt-3 pt-2 flex justify-end">
                <a 
                  href={item.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-xs text-md-primary hover:underline flex items-center gap-1 font-medium"
                >
                  <span>قراءة الخبر كاملاً من المصدر</span>
                  <ArrowUpRight size={12} />
                </a>
              </div>
            )}
          </MdCard>
        ))}
      </div>
    </div>
  );
};
