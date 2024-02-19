import { useMutation } from '@tanstack/react-query';

import { type CreatePost } from '@/common/schemas/posts/create-post';
import { api } from '@/libs/apis';
import { type Post } from '@/models/post/post';

export function useCreatePostMutation() {
  return useMutation({
    mutationFn: async (data: CreatePost): Promise<Post> => {
      const response = await api.post('posts', data);
      return response.data;
    },
    mutationKey: [],
  });
}
