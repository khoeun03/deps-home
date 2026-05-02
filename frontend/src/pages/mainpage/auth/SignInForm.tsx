import { Link } from 'react-router';

import Button from '../../../components/button/Button';
import TextInput from '../../../components/textinput/TextInput';
import styles from './SignInForm.module.scss';

const SignInForm = () => {
  return (
    <div className={styles.signInForm}>
      <TextInput type='text' name='username' placeholder='핸들네임' required autoFocus />
      <TextInput type='password' name='password' placeholder='비밀번호' required />
      <div className={styles.buttons}>
        <Link to='/'>
          <Button color='transparent' className={styles.back}>
            ←
          </Button>
        </Link>
        <Button color='primary'>로그인</Button>
      </div>
    </div>
  );
};

export default SignInForm;
