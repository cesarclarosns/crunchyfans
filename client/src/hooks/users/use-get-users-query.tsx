import { useQuery } from '@tanstack/react-query';

import { api } from '@/libs/apis';
import { type User } from '@/schemas/users/user';

export function useGetUsersQuery(data: {
  skip: number;
  limit: number;
  sort?: string;
  filter?: string;
}) {
  return useQuery({
    queryFn: async (): Promise<User[]> => {
      const searchParams = new URLSearchParams();
      if (data.skip) searchParams.append('skip', `${data.skip}`);
      if (data.limit) searchParams.append('limit', `${data.limit}`);
      if (data.sort) searchParams.append('sort', data.sort);

      let searchParamsString = searchParams.toString();
      if (data.filter)
        searchParamsString = searchParamsString + `&filter=${data.filter}`;

      const response = await api.get(`/users?${searchParamsString}`);
      return response.data;
    },
    queryKey: ['users', data],
  });
}
