import clsx from 'clsx';
import type { InputHTMLAttributes } from 'react';

import styles from './TextInput.module.scss';

type TextInputProps = InputHTMLAttributes<HTMLInputElement>;

const TextInput = ({ className, ...rest }: TextInputProps) => {
  return <input className={clsx(styles.textInput, className)} {...rest} />;
};

export default TextInput;
