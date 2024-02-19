import { useMutation } from '@tanstack/react-query';

import { type CreatePostComment } from '@/common/schemas/posts/create-post-comment';
import { api } from '@/libs/apis';

export function useCreatePostCommentMutation() {
  return useMutation({
    mutationFn: async (data: CreatePostComment) => {
      const urlSearchParams = new URLSearchParams();

      if (data.postCommentId) {
        urlSearchParams.set('postCommentId', data.postCommentId);
      }

      const response = await api.post(
        `posts/${data.postId}/comments?${urlSearchParams.toString()}`,
        data,
      );

      return response.data;
    },
    onMutate: (variables) => {
      console.log('onMutate', { variables });
    },
    onSettled: (data, error, variables, context) => {
      console.log('onSettled', { context, data, error, variables });
    },
  });
}
