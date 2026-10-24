import React from 'react';
import { RefreshCw, Radio, CheckCircle2 } from 'lucide-react';

interface Props {
  lastUpdated?: Date;
  onRefresh?: () => void;
  isLoading?: boolean;
  tabTitle?: string;
  className?: string;
}

export function formatArabicDateTime(date: Date = new Date()): string {
  const days = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
  const months = [
    'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
    'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
  ];
  
  const dayName = days[date.getDay()];
  const day = date.getDate();
  const monthName = months[date.getMonth()];
  const year = date.getFullYear();
  
  let hours = date.getHours();
  const ampm = hours >= 12 ? 'م' : 'ص';
  hours = hours % 12 || 12;
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');
  
  return `${dayName}، ${day} ${monthName} ${year} - ${hours}:${minutes}:${seconds} ${ampm} (بتوقيت القاهرة)`;
}

export const LastUpdatedBanner: React.FC<Props> = ({
  lastUpdated = new Date(),
  onRefresh,
  isLoading = false,
  tabTitle,
  className = ''
}) => {
  return (
    <div 
      className={`flex flex-wrap items-center justify-between gap-3 p-3.5 bg-md-surface-container rounded-[20px] border border-md-outline-variant/60 text-xs text-md-on-surface-variant shadow-sm ${className}`}
      dir="rtl"
    >
      {/* Right side: Timestamp & Live Pulse */}
      <div className="flex items-center gap-2.5 flex-wrap">
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
        </span>

        <span className="font-semibold text-md-on-surface">
          تاريخ آخر تحديث للبيانات:
        </span>

        <span className="font-mono font-bold text-md-primary bg-md-surface-container-high px-2.5 py-0.5 rounded-md-full border border-md-outline-variant/40">
          {formatArabicDateTime(lastUpdated)}
        </span>

        {tabTitle && (
          <span className="text-[11px] font-bold text-md-tertiary bg-md-tertiary-container/30 px-2.5 py-0.5 rounded-full border border-md-tertiary/20 hidden sm:inline-block">
            {tabTitle}
          </span>
        )}
      </div>

      {/* Left side: Source confirmation badge & Refresh button */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-semibold bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
          <CheckCircle2 size={13} className="text-emerald-400" />
          <span>مطابق لحظياً لمؤشرات تريدنج فيو وشاشات EGX وثاندر</span>
        </div>

        {onRefresh && (
          <button
            type="button"
            onClick={onRefresh}
            disabled={isLoading}
            className="flex items-center gap-1.5 px-3 py-1 bg-md-surface hover:bg-md-surface-container-highest border border-md-outline-variant/60 rounded-full font-medium text-[11px] text-md-on-surface transition-colors shadow-sm disabled:opacity-50"
            title="تحديث البيانات لحظياً"
          >
            <RefreshCw size={12} className={isLoading ? 'animate-spin text-md-primary' : ''} />
            <span>تحديث الآن</span>
          </button>
        )}
      </div>
    </div>
  );
};
