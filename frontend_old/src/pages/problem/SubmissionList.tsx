import {
  Button,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import { useParams } from 'react-router';

import { useMe } from '../../queries/me';
import { useSubmissions } from '../../queries/submission';

const verdictColor = (verdict?: string): string => {
  if (!verdict) return 'text.secondary';
  if (verdict === 'AC') return 'success.main';
  if (verdict === 'PC') return 'warning.main';
  return 'error.main';
};

const SubmissionList = () => {
  const { data: me } = useMe();
  const { problemId } = useParams<{ problemId: string }>();
  const queryClient = useQueryClient();

  const { data: submissions, isLoading } = useSubmissions({
    problemId,
    identity: `::${me?.key}`,
  });

  if (isLoading) return <Typography color='text.secondary'>Loading submissions...</Typography>;
  if (!submissions || submissions.data.length === 0)
    return <Typography color='text.secondary'>No submissions yet.</Typography>;

  const refreshSubmission = async (submissionId: string) => {
    await fetch(`${import.meta.env.VITE_API_URL}/submissions/${submissionId}/refresh`, {
      method: 'POST',
      credentials: 'include',
    });
    queryClient.invalidateQueries({ queryKey: ['submissions'] });
  };

  return (
    <Stack spacing={1}>
      <Stack direction='row' sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant='h6'>Submissions</Typography>
      </Stack>
      <TableContainer component={Paper} variant='outlined'>
        <Table size='small'>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Format</TableCell>
              <TableCell>Verdict</TableCell>
              <TableCell>Submitted</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {submissions.data.map((s) => (
              <TableRow key={s.id}>
                <TableCell sx={{ fontFamily: 'monospace' }}>{s.id}</TableCell>
                <TableCell>{s.format}</TableCell>
                <TableCell>
                  <Typography sx={{ fontWeight: 600, fontSize: '0.85rem', color: verdictColor(s.verdict) }}>
                    {s.verdict ?? 'Pending'}
                  </Typography>
                </TableCell>
                <TableCell sx={{ fontSize: '0.85rem' }}>{new Date(s.submittedAt).toLocaleString()}</TableCell>
                <TableCell>
                  {!s.verdict && (
                    <Button size='small' variant='outlined' onClick={() => refreshSubmission(s.id)}>
                      Refresh
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Stack>
  );
};

export default SubmissionList;
