import { Button, Stack, TextField } from '@mui/material';
import { useRef, useState } from 'react';

const Register = () => {
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
      setUsernameInvalidReason('Required');
      valid = false;
    } else if (!username.match(/^[a-zA-Z0-9-]{2,18}$/)) {
      setUsernameInvalidReason('Username must match /^[a-zA-Z0-9-]{2-18}$/');
      valid = false;
    } else {
      setUsernameInvalidReason(null);
    }

    if (!password) {
      setPasswordInvalidReason('Required');
      valid = false;
    } else if (password.length < 6 || password.length > 128) {
      setPasswordInvalidReason('Password length should in range [6, 128]');
      valid = false;
    } else {
      setPasswordInvalidReason(null);
    }

    if (password !== passwordCheck) {
      setPasswordCheckInvalidReason('Incorrect password check');
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
      const res = await fetch(`${import.meta.env.VITE_API_URL}/register`, {
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
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  return (
    <Stack
      direction='column'
      sx={{
        maxWidth: 400,
        alignItems: 'center',
        gap: 1,
        margin: '0 auto',
        minHeight: '100vh',
        justifyContent: 'center',
      }}
    >
      <TextField
        label='Username'
        size='small'
        sx={{ width: '100%' }}
        error={!!usernameInvalidReason}
        helperText={usernameInvalidReason}
        inputRef={usernameRef}
      />
      <TextField
        label='Password'
        type='password'
        size='small'
        sx={{ width: '100%' }}
        error={!!passwordInvalidReason}
        helperText={passwordInvalidReason}
        inputRef={passwordRef}
      />
      <TextField
        label='Confirm Password'
        type='password'
        size='small'
        sx={{ width: '100%' }}
        error={!!passwordCheckInvalidReason}
        helperText={passwordCheckInvalidReason}
        inputRef={passwordCheckRef}
      />
      <Button variant='contained' sx={{ width: '100%' }} loading={loading} onClick={handleSubmit}>
        Register
      </Button>
    </Stack>
  );
};

export default Register;
