import { Box, Button, List, ListItemButton, ListItemText, Paper, Stack, TextField, Typography } from '@mui/material';
import { useEffect, useRef, useState } from 'react';

import Pagination from '../../components/pagination';
import { useProblems } from '../../queries/problem';

const Problems = () => {
  const [judgeUrl, setJudgeUrl] = useState<string | null>(null);
  const judgeUrlRef = useRef<HTMLInputElement>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const { data: problems } = useProblems(judgeUrl ?? '', 0, 100);
  console.log(problems);

  const handleSetButtonClick = () => {
    setJudgeUrl(judgeUrlRef.current?.value ?? null);
    setCurrentPage(1);
  };

  useEffect(() => {}, [judgeUrl]);

  return (
    <Stack
      direction='column'
      sx={{
        alignItems: 'center',
        gap: 1,
        margin: '0 auto',
        minHeight: '100vh',
        justifyContent: 'center',
      }}
    >
      <Box sx={{ width: 400, display: 'flex', gap: 1 }}>
        <TextField label='Judge server URL' size='small' sx={{ flex: 1 }} inputRef={judgeUrlRef} />
        <Button variant='contained' onClick={handleSetButtonClick}>
          Set
        </Button>
      </Box>
      {problems && (
        <Paper variant='outlined' sx={{ width: 400 }}>
          <List disablePadding>
            {problems.data.map((problem, i) => (
              <ListItemButton
                key={problem.id}
                divider={i < problems.data.length - 1}
                sx={{ display: 'flex', justifyContent: 'space-between' }}
              >
                <ListItemText primary={problem.title} slotProps={{ primary: { sx: { fontWeight: 500 } } }} />
                <Typography
                  sx={{
                    fontFamily: 'monospace',
                    fontSize: '0.8rem',
                    color: 'text.secondary',
                    flexShrink: 0,
                    ml: 2,
                  }}
                >
                  {problem.id}
                </Typography>
              </ListItemButton>
            ))}
          </List>
        </Paper>
      )}

      {problems && (
        <Pagination
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          perPage={100}
          totalCount={problems.totalCount}
        />
      )}
    </Stack>
  );
};

export default Problems;
