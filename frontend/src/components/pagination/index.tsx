import { Button, Stack } from '@mui/material';

const Pagination = ({
  currentPage,
  setCurrentPage,
  perPage,
  totalCount,
}: {
  currentPage: number;
  setCurrentPage: (page: number) => void;
  perPage: number;
  totalCount: number;
}) => {
  const totalPages = Math.ceil(totalCount / perPage);

  const getPages = () => {
    const pages = new Set<number>();
    pages.add(1);
    pages.add(totalPages);
    pages.add(currentPage);

    for (let d = 1; d < totalPages; d *= 2) {
      if (currentPage - d >= 1) pages.add(currentPage - d);
      if (currentPage + d <= totalPages) pages.add(currentPage + d);
    }

    return [...pages].sort((a, b) => a - b);
  };

  const pages = getPages();

  return (
    <Stack direction='row' sx={{ gap: 0.5, justifyContent: 'center', alignItems: 'center' }}>
      {pages.map((page, i) => {
        const showGap = i > 0 && page - pages[i - 1] > 1;
        return (
          <Stack direction='row' key={page} sx={{ gap: 0.5, alignItems: 'center' }}>
            {showGap && <span>…</span>}
            <Button
              size='small'
              variant={page === currentPage ? 'contained' : 'outlined'}
              onClick={() => setCurrentPage(page)}
              sx={{ minWidth: 36 }}
            >
              {page}
            </Button>
          </Stack>
        );
      })}
    </Stack>
  );
};

export default Pagination;
