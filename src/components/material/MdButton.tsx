import React from 'react';

interface MdButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'filled' | 'tonal' | 'outlined' | 'text' | 'fab';
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const MdButton: React.FC<MdButtonProps> = ({
  variant = 'filled',
  icon,
  children,
  className = '',
  size = 'md',
  disabled,
  ...props
}) => {
  const sizeClasses = {
    sm: 'text-xs py-1.5 px-3.5 gap-1.5 h-8',
    md: 'text-xs font-semibold py-2.5 px-5 gap-2 h-10',
    lg: 'text-sm font-semibold py-3 px-6 gap-2.5 h-12'
  };

  const variantClasses = {
    filled: 'bg-md-primary text-md-on-primary shadow-md-1 hover:shadow-md-2 active:scale-[0.98] disabled:bg-md-on-surface/10 disabled:text-md-on-surface/38 disabled:shadow-none',
    tonal: 'bg-md-secondary-container text-md-on-secondary-container hover:brightness-95 active:scale-[0.98] disabled:bg-md-on-surface/10 disabled:text-md-on-surface/38',
    outlined: 'border border-md-outline text-md-primary hover:bg-md-primary/8 active:bg-md-primary/12 disabled:border-md-on-surface/12 disabled:text-md-on-surface/38',
    text: 'text-md-primary hover:bg-md-primary/8 active:bg-md-primary/12 disabled:text-md-on-surface/38',
    fab: 'bg-md-primary-container text-md-on-primary-container shadow-md-3 hover:shadow-md-4 rounded-[16px] px-5 py-3.5 active:scale-[0.98]'
  };

  const baseRadius = variant === 'fab' ? 'rounded-[16px]' : 'rounded-md-full';

  return (
    <button
      disabled={disabled}
      className={`inline-flex items-center justify-center font-medium transition-all duration-150 select-none ${baseRadius} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      <span>{children}</span>
    </button>
  );
};
