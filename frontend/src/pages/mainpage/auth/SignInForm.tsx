import { useRef } from 'react';
import { Link, useNavigate } from 'react-router';

import Button from '../../../components/button/Button';
import TextInput from '../../../components/textinput/TextInput';
import { performLogin } from '../../../lib/signin';
import styles from './SignInForm.module.scss';

const SignInForm = () => {
  const navigate = useNavigate();

  const handleRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const handleClick = async () => {
    const handle = handleRef.current?.value;
    const password = passwordRef.current?.value;

    if (!handle || !password) return;

    try {
      await performLogin({ handle, password });
      navigate('/');
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className={styles.signInForm}>
      <TextInput type='text' name='handle' placeholder='핸들네임' ref={handleRef} required autoFocus />
      <TextInput type='password' name='password' placeholder='비밀번호' ref={passwordRef} required />
      <div className={styles.buttons}>
        <Link to='/'>
          <Button color='transparent' className={styles.back}>
            ←
          </Button>
        </Link>
        <Button color='primary' onClick={handleClick}>
          로그인
        </Button>
      </div>
    </div>
  );
};

export default SignInForm;
