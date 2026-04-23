import { useQuery } from '@tanstack/react-query';

const API_URL = import.meta.env.VITE_API_URL!;

const fetchMe = async () => {
  const res = await fetch(`${API_URL}/me`, {
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Unauthenticated');
  return res.json();
};

const useMe = () =>
  useQuery({
    queryKey: ['me'],
    queryFn: fetchMe,
    retry: false,
  });

export { useMe };
