import { useQuery } from '@tanstack/react-query';

import { api } from '@/libs/apis';
import { type Post, postSchema } from '@/schemas/posts/post';

import { postsKeys } from './posts-keys';

export function useGetPostQuery(id: string | null) {
  return useQuery({
    enabled: !!id,
    queryFn: async (): Promise<Post> => {
      const response = await api.get(`posts/${id}`);

      const post = await postSchema.passthrough().parseAsync(response.data);
      return post;
    },
    queryKey: postsKeys.detail(id),
  });
}
