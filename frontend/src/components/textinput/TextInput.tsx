import clsx from 'clsx';
import { forwardRef, type InputHTMLAttributes } from 'react';

import styles from './TextInput.module.scss';

type TextInputProps = InputHTMLAttributes<HTMLInputElement>;

const TextInput = forwardRef<HTMLInputElement, TextInputProps>(({ className, ...rest }, ref) => {
  return <input ref={ref} className={clsx(styles.textInput, className)} {...rest} />;
});

TextInput.displayName = 'TextInput';

export default TextInput;
