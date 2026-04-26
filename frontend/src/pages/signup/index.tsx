import { useRef, useState } from 'react';
import { useNavigate } from 'react-router';

import { Button } from '../../components/Button';
import { TextInput } from '../../components/TextInput';

const SignUp = () => {
  const navigate = useNavigate();

  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const passwordCheckRef = useRef<HTMLInputElement>(null);

  const [usernameInvalidReason, setUsernameInvalidReason] = useState<string | null>(null);
  const [passwordInvalidReason, setPasswordInvalidReason] = useState<string | null>(null);
  const [passwordCheckInvalidReason, setPasswordCheckInvalidReason] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);

  const validate = (username?: string, password?: string, passwordCheck?: string) => {
    let valid = true;

    if (!username) {
      setUsernameInvalidReason('This field is required');
      valid = false;
    } else if (!username.match(/^[a-zA-Z0-9-]{2,18}$/)) {
      setUsernameInvalidReason('Must be 2–18 characters using letters, numbers, or hyphens');
      valid = false;
    } else {
      setUsernameInvalidReason(null);
    }

    if (!password) {
      setPasswordInvalidReason('This field is required');
      valid = false;
    } else if (password.length < 6 || password.length > 128) {
      setPasswordInvalidReason('Password must be between 6 and 128 characters');
      valid = false;
    } else {
      setPasswordInvalidReason(null);
    }

    if (password !== passwordCheck) {
      setPasswordCheckInvalidReason('Passwords do not match');
      valid = false;
    } else {
      setPasswordCheckInvalidReason(null);
    }

    return valid;
  };

  const handleSubmit = async () => {
    const username = usernameRef.current?.value;
    const password = passwordRef.current?.value;
    const passwordCheck = passwordCheckRef.current?.value;
    if (!validate(username, password, passwordCheck)) {
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      setLoading(false);

      if (res.status === 422) {
        const { fields } = await res.json();
        setUsernameInvalidReason(fields.username);
        setPasswordInvalidReason(fields.password);
        return;
      }

      const { success } = await res.json();
      if (success) navigate('/mypage');
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  return (
    <div className='flex min-h-screen items-center justify-center'>
      <div className='w-80 flex flex-col gap-2'>
        <TextInput
          placeholder='Username'
          ref={usernameRef}
          helperText={usernameInvalidReason ?? undefined}
          helperColor='warning'
        />
        <TextInput
          placeholder='Password'
          ref={passwordRef}
          helperText={passwordInvalidReason ?? undefined}
          helperColor='warning'
        />
        <TextInput
          placeholder='Confirm Password'
          ref={passwordCheckRef}
          helperText={passwordCheckInvalidReason ?? undefined}
          helperColor='warning'
        />
        <Button color='secondary' variant='contained' onClick={handleSubmit} loading={loading}>
          회원 가입
        </Button>
      </div>
    </div>
  );
};

export default SignUp;
