import { type ButtonHTMLAttributes, forwardRef } from 'react';

type ButtonColor = 'primary' | 'secondary' | 'danger';
type ButtonVariant = 'contained' | 'outlined';
type ButtonSize = 'sm' | 'md';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  color?: ButtonColor;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
};

const base = [
  'inline-flex items-center justify-center',
  'rounded-lg cursor-pointer',
  'transition-colors duration-150',
  'focus-visible:outline-2 focus-visible:outline-offset-2',
  'disabled:pointer-events-none disabled:opacity-40',
].join(' ');

const colorVariants: Record<ButtonColor, Record<ButtonVariant, string>> = {
  primary: {
    contained: [
      'bg-primary-600 text-white',
      'hover:bg-primary-700 active:bg-primary-800',
      'focus-visible:outline-primary-600',
    ].join(' '),
    outlined: [
      'border border-primary-600 text-primary-600 bg-transparent',
      'hover:bg-primary-50 active:bg-primary-100',
      'focus-visible:outline-primary-600',
      'dark:border-primary-400 dark:text-primary-400',
      'dark:hover:bg-primary-950 dark:active:bg-primary-900',
    ].join(' '),
  },

  secondary: {
    contained: [
      'bg-secondary-600 text-white',
      'hover:bg-secondary-700 active:bg-secondary-800',
      'focus-visible:outline-secondary-600',
    ].join(' '),
    outlined: [
      'border border-secondary-600 text-secondary-600 bg-transparent',
      'hover:bg-secondary-50 active:bg-secondary-100',
      'focus-visible:outline-secondary-600',
      'dark:border-secondary-400 dark:text-secondary-400',
      'dark:hover:bg-secondary-950 dark:active:bg-secondary-900',
    ].join(' '),
  },

  danger: {
    contained: [
      'bg-danger-fg text-white',
      'hover:brightness-110 active:brightness-90',
      'focus-visible:outline-danger-fg',
    ].join(' '),
    outlined: [
      'border border-danger-fg text-danger-fg bg-transparent',
      'hover:bg-danger-bg active:brightness-95',
      'focus-visible:outline-danger-fg',
    ].join(' '),
  },
};

const sizes: Record<ButtonSize, string> = {
  sm: 'text-label2 h-8 px-3 gap-1.5',
  md: 'text-label1 h-10 px-4 gap-2',
};

const Spinner = ({ className = '' }: { className?: string }) => (
  <svg
    className={`animate-spin ${className}`}
    width='1em'
    height='1em'
    viewBox='0 0 24 24'
    fill='none'
    aria-hidden='true'
  >
    <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4' />
    <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z' />
  </svg>
);

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      color = 'primary',
      variant = 'contained',
      size = 'md',
      loading = false,
      disabled,
      className = '',
      children,
      ...rest
    },
    ref,
  ) => {
    const isDisabled = disabled || loading;

    const cls = [base, colorVariants[color][variant], sizes[size], className].filter(Boolean).join(' ');

    return (
      <button ref={ref} className={cls} disabled={isDisabled} {...rest}>
        {loading && <Spinner />}
        {!loading && children}
        {loading && <span className='sr-only'>로딩 중</span>}
      </button>
    );
  },
);

Button.displayName = 'Button';

export { Button, type ButtonColor, type ButtonProps, type ButtonSize, type ButtonVariant };
