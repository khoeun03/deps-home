import { Link } from 'react-router';

import Button from '../../../components/button/Button';
import TextInput from '../../../components/textinput/TextInput';
import styles from './SignUpForm.module.scss';

const SignUpForm = () => {
  return (
    <form className={styles.signUpForm}>
      <fieldset className={styles.username}>
        <label>
          @ <TextInput type='text' name='username' placeholder='핸들네임' required autoFocus /> ::eto.example.org
        </label>
      </fieldset>
      <TextInput type='password' name='password' placeholder='비밀번호' required />
      <fieldset>
        <TextInput type='password' name='password' placeholder='비밀번호 확인' required />
        <small>비밀번호는 8자 이상 128자 미만이어야 합니다.</small>
      </fieldset>
      <div className={styles.buttons}>
        <Link to='/'>
          <Button color='transparent' className={styles.back}>
            ←
          </Button>
        </Link>
        <Button color='primary' type='submit'>
          계정 만들기
        </Button>
      </div>
    </form>
  );
};

export default SignUpForm;
