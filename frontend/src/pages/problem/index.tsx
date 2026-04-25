import { Divider, Paper, Stack, Typography } from '@mui/material';
import ReactMarkdown from 'react-markdown';
import { useParams } from 'react-router';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import rehypeKatex from 'rehype-katex';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';

import { useMe } from '../../queries/me.js';
import { useProblem } from '../../queries/problem';
import SubmitForm from './SubmitForm.js';

const Problem = () => {
  const { problemId } = useParams<{ problemId: string }>();

  const { data: problem, isLoading, isError } = useProblem(problemId ?? '');
  const { data: me } = useMe();

  if (isLoading) return <Typography sx={{ p: 3 }}>Loading...</Typography>;
  if (isError || !problem) return <Typography sx={{ p: 3 }}>Problem not found.</Typography>;

  return (
    <Stack sx={{ maxWidth: 800, margin: '0 auto', p: 3 }} spacing={3}>
      <Stack spacing={1}>
        <Typography variant='h4' sx={{ fontWeight: 700 }}>
          {problem.title}
        </Typography>
        <Typography sx={{ fontFamily: 'monospace', color: 'text.secondary', fontSize: '0.85rem' }}>
          {problem.id}
        </Typography>
      </Stack>

      <Divider />

      <Paper variant='outlined' sx={{ p: 3 }}>
        <ReactMarkdown
          remarkPlugins={[remarkGfm, remarkMath]}
          rehypePlugins={[rehypeKatex]}
          components={{
            h1: ({ children }) => (
              <Typography variant='h5' gutterBottom sx={{ fontWeight: 600, mt: 3 }}>
                {children}
              </Typography>
            ),
            h2: ({ children }) => (
              <Typography variant='h6' gutterBottom sx={{ fontWeight: 600, mt: 2 }}>
                {children}
              </Typography>
            ),
            p: ({ children }) => (
              <Typography variant='body1' gutterBottom sx={{ lineHeight: 1.8 }}>
                {children}
              </Typography>
            ),
            code({ className, children }) {
              const match = /language-(\w+)/.exec(className || '');
              return match ? (
                <SyntaxHighlighter style={oneDark} language={match[1]} customStyle={{ borderRadius: 8 }}>
                  {String(children).replace(/\n$/, '')}
                </SyntaxHighlighter>
              ) : (
                <Typography
                  component='code'
                  sx={{
                    bgcolor: 'action.hover',
                    px: 0.8,
                    py: 0.2,
                    borderRadius: 0.5,
                    fontFamily: 'monospace',
                    fontSize: '0.9em',
                  }}
                >
                  {children}
                </Typography>
              );
            },
            table: ({ children }) => (
              <Paper variant='outlined' sx={{ overflow: 'auto', my: 2 }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>{children}</table>
              </Paper>
            ),
            th: ({ children }) => (
              <th
                style={{
                  padding: '8px 16px',
                  textAlign: 'left',
                  borderBottom: '2px solid #e0e0e0',
                  fontWeight: 600,
                }}
              >
                {children}
              </th>
            ),
            td: ({ children }) => (
              <td style={{ padding: '8px 16px', borderBottom: '1px solid #e0e0e0' }}>{children}</td>
            ),
          }}
        >
          {problem.content}
        </ReactMarkdown>
      </Paper>
      {me && <SubmitForm formats={problem.formats} />}
    </Stack>
  );
};

export default Problem;
