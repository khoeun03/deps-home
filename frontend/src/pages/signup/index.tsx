import { Box, Button, Stack, TextField } from '@mui/material';
import { useRef, useState } from 'react';
import { useNavigate } from 'react-router';

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
    <Box
      sx={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Stack
        direction='column'
        sx={{
          minWidth: 400,
          alignItems: 'center',
          gap: 1,
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
          Sign Up
        </Button>
      </Stack>
    </Box>
  );
};

export default SignUp;
