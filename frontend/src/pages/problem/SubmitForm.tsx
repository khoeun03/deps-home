import { Button, MenuItem, Select, Stack, TextField, Typography } from '@mui/material';
import { useState } from 'react';

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
  const formatTypes = Object.keys(formats);

  const [formatType, setFormatType] = useState<string>(formatTypes[0]);

  const [files, setFiles] = useState<Record<string, string>>({});

  const handleCodeChange = (filename: string) => {
    return (newCode: string) =>
      setFiles({
        ...files,
        [filename]: newCode,
      });
  };

  console.log(files);

  return (
    <Stack sx={{ gap: 1 }}>
      <Select value={formatType}>
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
      <Button variant='contained'>Submit</Button>
    </Stack>
  );
};

export default SubmitForm;
