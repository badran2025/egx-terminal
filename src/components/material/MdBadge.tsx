import React from 'react';

interface MdBadgeProps {
  children?: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'tertiary' | 'error' | 'success';
  className?: string;
  dot?: boolean;
}

export const MdBadge: React.FC<MdBadgeProps> = ({
  children,
  variant = 'secondary',
  className = '',
  dot = false
}) => {
  const variantStyles = {
    primary: 'bg-md-primary-container text-md-on-primary-container border border-md-primary/20',
    secondary: 'bg-md-secondary-container text-md-on-secondary-container border border-md-secondary/20',
    tertiary: 'bg-md-tertiary-container text-md-on-tertiary-container border border-md-tertiary/20',
    error: 'bg-md-error-container text-md-on-error-container border border-md-error/20',
    success: 'bg-md-primary-container text-md-on-primary-container border border-md-primary/30'
  };

  if (dot) {
    return (
      <span
        className={`inline-block w-2.5 h-2.5 rounded-full ${variantStyles[variant]} ${className}`}
      />
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md-full text-[11px] font-semibold tracking-wide ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  );
};
