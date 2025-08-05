import useSWR from 'swr';
import api from '@/lib/axios';

export function useCurrentUser() {
  const fetcher = (url: string) => api.get(url).then(res => res.data);

  const { data, error, isLoading, mutate } = useSWR('/users/me', fetcher);

  return {
    user: data,
    isLoading,
    isError: error,
    mutateUser: mutate,
  };
}
