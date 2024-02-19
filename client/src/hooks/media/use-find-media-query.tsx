import { useQueries, useQuery } from '@tanstack/react-query';

export function useFindMediaQuery() {
  return useQuery({
    queryFn: async () => {},
    queryKey: [],
  });
}
