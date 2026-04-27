import { useQuery } from '@tanstack/react-query';

import type { ProblemResponse, ProblemsResponse } from '../types/api.js';

// TODO: make it util
const normalizeUrl = (url: string) => {
  if (!/^https?:\/\//.test(url)) return `https://${url}`;
  return url;
};

const fetchProblems = async (judgeUrl: string, offset: number, limit: number): Promise<ProblemsResponse> => {
  const res = await fetch(normalizeUrl(`${judgeUrl}/_deps/judge/problems?offset=${offset}&limit=${limit}`));
  if (!res.ok) throw new Error(`Failed to fetch problems: ${res.status}`);
  return res.json();
};

const fetchProblem = async (problemId: string): Promise<ProblemResponse> => {
  const judgeUrl = problemId.split('::').at(-1);
  const res = await fetch(normalizeUrl(`${judgeUrl}/_deps/judge/problems/${problemId}`));
  if (!res.ok) throw new Error(`Failed to fetch problem: ${res.status}`);
  return res.json();
};

const useProblems = (judgeUrl: string, offset: number, limit: number) =>
  useQuery({
    queryKey: ['problems', judgeUrl, offset, limit],
    queryFn: () => fetchProblems(judgeUrl, offset, limit),
    enabled: !!judgeUrl,
  });

const useProblem = (problemId: string) =>
  useQuery({
    queryKey: ['problem', problemId],
    queryFn: () => fetchProblem(problemId),
    enabled: !!problemId,
  });

export { useProblem, useProblems };
