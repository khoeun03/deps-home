import { Button, MenuItem, Select, Stack, TextField, Typography } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useParams } from 'react-router';

import type { SubmitFormat } from '../../types/api.js';

const CodeEditor = ({
  filename,
  code,
  onChange,
}: {
  filename: string;
  code: string;
  onChange: (newCode: string) => void;
}) => {
  return (
    <Stack>
      <Typography variant='body1'>{filename}</Typography>
      <TextField
        size='small'
        sx={{ width: '100%' }}
        multiline
        rows={10}
        value={code}
        onChange={(e) => onChange(e.target.value)}
      />
    </Stack>
  );
};

const SubmitForm = ({ formats }: { formats: Record<string, SubmitFormat> }) => {
  const { problemId } = useParams<{ problemId: string }>();

  const formatTypes = Object.keys(formats);

  const [formatType, setFormatType] = useState<string>(formatTypes[0]);
  const [files, setFiles] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const queryClient = useQueryClient();

  const handleCodeChange = (filename: string) => {
    return (newCode: string) =>
      setFiles({
        ...files,
        [filename]: newCode,
      });
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/submit`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          problemId,
          format: formatType,
          files: Object.fromEntries(
            formats[formatType].files.map(({ name: filename, languages }) => [
              filename,
              {
                language: languages[0],
                content: files[filename],
              },
            ]),
          ),
        }),
      });
      if (res.ok) queryClient.invalidateQueries({ queryKey: ['submissions'] });
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  return (
    <Stack sx={{ gap: 1 }}>
      <Select value={formatType} size='small'>
        {formatTypes.map((ft) => (
          <MenuItem value={ft} key={ft} onClick={() => setFormatType(ft)}>
            {ft}
          </MenuItem>
        ))}
      </Select>
      {formats[formatType].files.map(({ name: filename }) => (
        <CodeEditor
          filename={filename}
          code={files[filename] ?? ''}
          onChange={handleCodeChange(filename)}
          key={filename}
        />
      ))}
      <Button variant='contained' loading={loading} onClick={handleSubmit}>
        Submit
      </Button>
    </Stack>
  );
};

export default SubmitForm;
