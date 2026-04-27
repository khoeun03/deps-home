import { forwardRef, type InputHTMLAttributes } from 'react';

type TextInputSize = 'sm' | 'md';
type HelperColor = 'default' | 'success' | 'warning' | 'danger' | 'info';

interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  inputSize?: TextInputSize;
  label?: string;
  helperText?: string;
  helperColor?: HelperColor;
}

const base = [
  'w-full rounded-lg border bg-transparent',
  'text-neutral-900 placeholder:text-neutral-400',
  'transition-colors duration-150',
  'focus:outline-none focus:ring-2 focus:ring-offset-0',
  'disabled:cursor-not-allowed disabled:opacity-40',
  'dark:text-neutral-100 dark:placeholder:text-neutral-500',
].join(' ');

const sizes: Record<TextInputSize, string> = {
  sm: 'text-body2 h-8 px-3',
  md: 'text-body1 h-10 px-3',
};

const borderDefault = [
  'border-neutral-300 focus:border-primary-500 focus:ring-primary-500/20',
  'dark:border-neutral-600 dark:focus:border-primary-400 dark:focus:ring-primary-400/20',
].join(' ');

const borderError = ['border-danger-fg focus:border-danger-fg focus:ring-danger-fg/20'].join(' ');

const helperColors: Record<HelperColor, string> = {
  default: 'text-neutral-500',
  success: 'text-success-text',
  warning: 'text-warning-text',
  danger: 'text-danger-text',
  info: 'text-info-text',
};

const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  ({ error = false, inputSize = 'md', label, helperText, helperColor, className = '', id, ...rest }, ref) => {
    const inputCls = [base, sizes[inputSize], error ? borderError : borderDefault, className].filter(Boolean).join(' ');

    return (
      <div className='flex flex-col gap-1'>
        {label && (
          <label htmlFor={id} className='text-label2 text-neutral-700 dark:text-neutral-300'>
            {label}
          </label>
        )}
        <input ref={ref} id={id} className={inputCls} {...rest} />
        {helperText && <p className={`text-caption ${helperColors[helperColor ?? 'default']}`}>{helperText}</p>}
      </div>
    );
  },
);

TextInput.displayName = 'TextInput';

export { TextInput, type TextInputProps, type TextInputSize };
