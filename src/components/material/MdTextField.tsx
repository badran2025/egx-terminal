import React from 'react';

interface MdTextFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
  supportingText?: string;
  error?: boolean;
}

export const MdTextField: React.FC<MdTextFieldProps> = ({
  label,
  leadingIcon,
  trailingIcon,
  supportingText,
  error = false,
  className = '',
  ...props
}) => {
  return (
    <div className="w-full space-y-1">
      {label && (
        <label className="block text-xs font-semibold text-md-on-surface-variant mb-1">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {leadingIcon && (
          <span className="absolute right-3.5 text-md-on-surface-variant pointer-events-none">
            {leadingIcon}
          </span>
        )}
        <input
          className={`w-full bg-md-surface-container-high border rounded-md-md text-sm text-md-on-surface placeholder:text-md-on-surface-variant/60 focus:outline-none focus:ring-1 transition-all duration-150 ${
            leadingIcon ? 'pr-10 pl-4 py-2.5' : 'px-4 py-2.5'
          } ${trailingIcon ? 'pl-10' : ''} ${
            error
              ? 'border-md-error text-md-error focus:border-md-error focus:ring-md-error'
              : 'border-md-outline hover:border-md-on-surface focus:border-md-primary focus:ring-md-primary'
          } ${className}`}
          {...props}
        />
        {trailingIcon && (
          <span className="absolute left-3.5 text-md-on-surface-variant pointer-events-none">
            {trailingIcon}
          </span>
        )}
      </div>
      {supportingText && (
        <p className={`text-[11px] ${error ? 'text-md-error' : 'text-md-on-surface-variant'}`}>
          {supportingText}
        </p>
      )}
    </div>
  );
};
