import clsx from 'clsx';
import type { ButtonHTMLAttributes } from 'react';

import styles from './Button.module.scss';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  color?: 'primary' | 'transparent';
};

const Button = ({ color = 'primary', className, children, ...rest }: ButtonProps) => {
  const buttonClass = color === 'primary' ? styles.buttonPrimary : styles.buttonTransparent;
  return (
    <button className={clsx(styles.button, buttonClass, className)} {...rest}>
      {children}
    </button>
  );
};

export default Button;
