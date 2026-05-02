import { useRef } from 'react';
import { Link } from 'react-router';

import Button from '../../../components/button/Button';
import TextInput from '../../../components/textinput/TextInput';
import { prepareSignUp } from '../../../lib/signup';
import styles from './SignUpForm.module.scss';

const API_URL = import.meta.env.VITE_API_URL!;

const SignUpForm = () => {
  const handleRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const passwordConfirmRef = useRef<HTMLInputElement>(null);

  const handleClick = async () => {
    const handle = handleRef.current?.value;
    const password = passwordRef.current?.value;
    const passwordConfirm = passwordConfirmRef.current?.value;

    if (!handle || !password || !passwordConfirm) return;
    if (password !== passwordConfirm) return;
    if (password.length < 8 || password.length > 128) return;

    const signUpPayload = await prepareSignUp({ handle, password });
    const res = await fetch(`${API_URL}/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(signUpPayload),
    });

    console.log(res);
  };

  return (
    <div className={styles.signUpForm}>
      <fieldset className={styles.handle}>
        <label>
          @ <TextInput type='text' name='handle' placeholder='핸들네임' ref={handleRef} required autoFocus />{' '}
          ::eto.example.org
        </label>
      </fieldset>
      <TextInput type='password' name='password' placeholder='비밀번호' ref={passwordRef} required />
      <fieldset>
        <TextInput
          type='password'
          name='passwordConfirm'
          placeholder='비밀번호 확인'
          ref={passwordConfirmRef}
          required
        />
        <small>비밀번호는 8자 이상 128자 미만이어야 합니다.</small>
      </fieldset>
      <div className={styles.buttons}>
        <Link to='/'>
          <Button color='transparent' className={styles.back}>
            ←
          </Button>
        </Link>
        <Button color='primary' onClick={handleClick}>
          계정 만들기
        </Button>
      </div>
    </div>
  );
};

export default SignUpForm;
