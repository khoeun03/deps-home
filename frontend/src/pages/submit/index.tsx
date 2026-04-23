import { Box, Button, Stack, TextField } from '@mui/material';
import { useRef, useState } from 'react';

const Submit = () => {
  const endpointRef = useRef<HTMLInputElement>(null);
  const formatRef = useRef<HTMLInputElement>(null);
  const languageRef = useRef<HTMLInputElement>(null);
  const filenameRef = useRef<HTMLInputElement>(null);
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
          format: formatRef.current?.value,
          language: languageRef.current?.value,
          filename: filenameRef.current?.value,
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
        <TextField label='Endpoint' size='small' sx={{ width: '100%' }} inputRef={endpointRef} />
        <TextField label='Format' size='small' sx={{ width: '100%' }} inputRef={formatRef} />
        <TextField label='Language' size='small' sx={{ width: '100%' }} inputRef={languageRef} />
        <TextField label='Filename' size='small' sx={{ width: '100%' }} inputRef={filenameRef} />
        <TextField label='Code' size='small' sx={{ width: '100%' }} multiline rows={10} inputRef={codeRef} />
        <Button variant='contained' sx={{ width: '100%' }} loading={loading} onClick={handleClick}>
          Submit
        </Button>
      </Stack>
    </Box>
  );
};

export default Submit;
