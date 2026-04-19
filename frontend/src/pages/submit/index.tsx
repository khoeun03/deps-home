import { Button, Stack, TextField } from '@mui/material';
import { useRef, useState } from 'react';

const Submit = () => {
  const endpointRef = useRef<HTMLInputElement>(null);
  const languageRef = useRef<HTMLInputElement>(null);
  const codeRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          endpoint: endpointRef.current?.value,
          language: languageRef.current?.value,
          code: codeRef.current?.value,
        }),
        credentials: 'include',
      });
      setLoading(false);

      console.log(res);
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
      <TextField label='Endpoint' size='small' sx={{ width: '100%' }} inputRef={endpointRef} />
      <TextField label='Language' size='small' sx={{ width: '100%' }} inputRef={languageRef} />
      <TextField label='Code' size='small' sx={{ width: '100%' }} multiline rows={10} inputRef={codeRef} />
      <Button variant='contained' sx={{ width: '100%' }} loading={loading} onClick={handleClick}>
        Submit
      </Button>
    </Stack>
  );
};

export default Submit;
