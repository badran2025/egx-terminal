import React from 'react';

interface MdChipProps {
  label: React.ReactNode;
  selected?: boolean;
  onClick?: () => void;
  icon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
  className?: string;
  disabled?: boolean;
}

export const MdChip: React.FC<MdChipProps> = ({
  label,
  selected = false,
  onClick,
  icon,
  trailingIcon,
  className = '',
  disabled = false
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center gap-2 h-8 px-3.5 rounded-md-sm text-xs font-medium transition-all duration-150 select-none whitespace-nowrap ${
        selected
          ? 'bg-md-secondary-container text-md-on-secondary-container shadow-sm border border-transparent'
          : 'bg-md-surface border border-md-outline text-md-on-surface-variant hover:bg-md-surface-container-high hover:text-md-on-surface'
      } ${disabled ? 'opacity-38 pointer-events-none' : ''} ${className}`}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      <span>{label}</span>
      {trailingIcon && <span className="flex-shrink-0">{trailingIcon}</span>}
    </button>
  );
};
