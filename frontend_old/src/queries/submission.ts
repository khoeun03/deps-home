import { useQuery } from '@tanstack/react-query';

import type { SubmissionsResponse } from '../types/api';

const API_URL = import.meta.env.VITE_API_URL!;

const fetchSubmissions = async (params: {
  problemId?: string;
  identity?: string;
  offset?: number;
  limit?: number;
}): Promise<SubmissionsResponse> => {
  const searchParams = new URLSearchParams();
  if (params.problemId) searchParams.set('problemId', params.problemId);
  if (params.identity) searchParams.set('identity', params.identity);
  if (params.offset !== undefined) searchParams.set('offset', String(params.offset));
  if (params.limit !== undefined) searchParams.set('limit', String(params.limit));

  const res = await fetch(`${API_URL}/submissions?${searchParams}`);
  if (!res.ok) throw new Error(`Failed to fetch submissions: ${res.status}`);
  return res.json();
};

const useSubmissions = (params: { problemId?: string; identity?: string; offset?: number; limit?: number }) =>
  useQuery({
    queryKey: ['submissions', params],
    queryFn: () => fetchSubmissions(params),
  });

export { useSubmissions };
