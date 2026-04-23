import { useQuery } from '@tanstack/react-query';

type ProblemsResponseType = {
  data: {
    id: string;
    title: string;
  }[];
  totalCount: number;
};

const normalizeUrl = (url: string) => {
  if (!/^https?:\/\//.test(url)) return `https://${url}`;
  return url;
};

const fetchProblems = async (judgeUrl: string, offset: number, limit: number): Promise<ProblemsResponseType> => {
  const res = await fetch(normalizeUrl(`${judgeUrl}/_deps/judge/problems?offset=${offset}&limit=${limit}`));
  if (!res.ok) throw new Error(`Failed to fetch problems: ${res.status}`);
  return res.json();
};

const useProblems = (judgeUrl: string, offset: number, limit: number) =>
  useQuery({
    queryKey: ['problems', judgeUrl, offset, limit],
    queryFn: () => fetchProblems(judgeUrl, offset, limit),
    enabled: !!judgeUrl,
  });

export { useProblems };
