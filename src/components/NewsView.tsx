import React, { useState } from 'react';
import { Newspaper, Clock, ArrowUpRight } from 'lucide-react';
import { EGXNewsItem } from '../types';
import { EGX_LATEST_NEWS } from '../services/egxService';
import { MdCard, MdChip, MdBadge } from './material';
import { LastUpdatedBanner } from './LastUpdatedBanner';

interface Props {
  onSelectStock: (symbol: string) => void;
  lastUpdated?: Date;
  onRefresh?: () => void;
  isLoading?: boolean;
}

export const NewsView: React.FC<Props> = ({ 
  onSelectStock,
  lastUpdated,
  onRefresh,
  isLoading = false
}) => {
  const [filter, setFilter] = useState<string>('all');

  const filtered = EGX_LATEST_NEWS.filter(item => {
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
        tabTitle="الإفصاحات وأخبار الشركات المقيدة"
      />

      {/* Top Banner (M3 Elevated Card - Compact) */}
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
          {['all', 'إفصاح رسمي', 'توزيعات أرباح', 'نتائج أعمال', 'أخبار عامة'].map(cat => (
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
          </MdCard>
        ))}
      </div>
    </div>
  );
};
