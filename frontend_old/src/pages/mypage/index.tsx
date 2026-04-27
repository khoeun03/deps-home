import { Stack, Typography } from '@mui/material';

import { useMe } from '../../queries/me';

const MyPage = () => {
  const { data: me } = useMe();

  return (
    <Stack
      sx={{
        maxWidth: 400,
        margin: '0 auto',
        minHeight: '100vh',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Stack direction='column' sx={{ alignItems: 'start', width: '100%', gap: 1 }}>
        <Stack>
          <Typography variant='caption'>Username</Typography>
          <Typography variant='body1'>{me?.data?.nickname}</Typography>
        </Stack>
        <Stack>
          <Typography variant='caption'>Public Key</Typography>
          <Typography variant='body1'>{me?.key}</Typography>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default MyPage;
