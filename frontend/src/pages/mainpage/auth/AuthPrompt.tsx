import { Link } from 'react-router';

import Button from '../../../components/button/Button';
import styles from './AuthPrompt.module.scss';

const AuthPrompt = () => {
  return (
    <div className={styles.authPrompt}>
      <Link to='/signup'>
        <Button>계정 만들기</Button>
      </Link>
      <Link to='/signin'>
        <Button color='transparent'>로그인</Button>
      </Link>
    </div>
  );
};

export default AuthPrompt;
