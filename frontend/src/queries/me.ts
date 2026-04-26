import { useQuery } from '@tanstack/react-query';

import type { MeResponse } from '../types/api';

const API_URL = import.meta.env.VITE_API_URL!;

const fetchMe = async (): Promise<MeResponse | null> => {
  const res = await fetch(`${API_URL}/me`, {
    credentials: 'include',
  });
  if (res.status === 401) return null;
  if (!res.ok) throw new Error('Unexpected error');
  return res.json();
};

const useMe = () =>
  useQuery({
    queryKey: ['me'],
    queryFn: fetchMe,
    retry: false,
  });

export { useMe };
