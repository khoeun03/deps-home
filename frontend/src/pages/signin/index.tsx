import { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router';

import { Button } from '../../components/Button';
import { TextInput } from '../../components/TextInput';

const SignIn = () => {
  const navigate = useNavigate();

  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const [usernameInvalidReason, setUsernameInvalidReason] = useState<string | null>(null);
  const [passwordInvalidReason, setPasswordInvalidReason] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);

  const validate = (username?: string, password?: string) => {
    let valid = true;

    if (!username) {
      setUsernameInvalidReason('Required');
      valid = false;
    }
    if (!password) {
      setPasswordInvalidReason('Required');
      valid = false;
    }

    return valid;
  };

  const handleSubmit = async () => {
    const username = usernameRef.current?.value;
    const password = passwordRef.current?.value;
    if (!validate(username, password)) {
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/signin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      setLoading(false);

      const { success } = await res.json();
      if (success) navigate('/mypage');
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  return (
    <div className='flex flex-1 items-center justify-center'>
      <div className='flex w-80 flex-col gap-2'>
        <TextInput
          placeholder='Username'
          ref={usernameRef}
          helperText={usernameInvalidReason ?? undefined}
          helperColor='warning'
        />
        <TextInput
          type='password'
          placeholder='Password'
          ref={passwordRef}
          helperText={passwordInvalidReason ?? undefined}
          helperColor='warning'
        />
        <Button color='primary' variant='contained' onClick={handleSubmit} loading={loading}>
          로그인
        </Button>
        <Link to='/signup'>
          <Button color='secondary' variant='outlined' className='w-full'>
            회원 가입
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default SignIn;
