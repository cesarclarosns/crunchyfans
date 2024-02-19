import { useQuery } from '@tanstack/react-query';

import { api } from '@/libs/apis';
import { type Post } from '@/models/post/post';

import { postsKeys } from './posts-keys';

export function useGetPostQuery(id: string | null) {
  return useQuery({
    enabled: !!id,
    queryFn: async (): Promise<Post> => {
      const response = await api.get(`posts/${id}`);
      return response.data;
    },
    queryKey: postsKeys.detail(id),
  });
}
