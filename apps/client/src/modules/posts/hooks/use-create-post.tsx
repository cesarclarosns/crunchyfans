import { useMutation } from '@tanstack/react-query';

import { api } from '@/common/libs/apis';
import { type CreatePost } from '@/common/schemas/posts/create-post';
import { type Post } from '@/modules/posts/schemas/post';

export function useCreatePostMutation() {
  return useMutation({
    mutationFn: async (data: CreatePost): Promise<Post> => {
      const response = await api.post('posts', data);
      return response.data;
    },
    mutationKey: [],
  });
}
