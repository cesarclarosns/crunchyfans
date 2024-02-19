import { useQuery } from '@tanstack/react-query';

export function useFindAllMediaQuery() {
  return useQuery({
    queryFn: async () => {},
    queryKey: [],
  });
}
