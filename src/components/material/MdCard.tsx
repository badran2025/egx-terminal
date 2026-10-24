import React from 'react';

interface MdCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'elevated' | 'outlined' | 'filled';
  children: React.ReactNode;
  className?: string;
}

export const MdCard: React.FC<MdCardProps> = ({
  variant = 'outlined',
  children,
  className = '',
  ...props
}) => {
  const variantClasses = {
    elevated: 'bg-md-surface-container-low shadow-md-1 hover:shadow-md-2 border-transparent transition-shadow duration-200',
    outlined: 'bg-md-surface border border-md-outline-variant hover:border-md-outline transition-colors duration-200',
    filled: 'bg-md-surface-container-highest border-transparent'
  };

  return (
    <div
      className={`rounded-md-xl p-5 sm:p-6 text-md-on-surface ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
