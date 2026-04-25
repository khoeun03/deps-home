import { Box, Button, Stack, TextField } from '@mui/material';
import { useRef, useState } from 'react';
import { useNavigate } from 'react-router';

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
        <Button variant='contained' sx={{ width: '100%' }} loading={loading} onClick={handleSubmit}>
          Sign In
        </Button>
      </Stack>
    </Box>
  );
};

export default SignIn;
