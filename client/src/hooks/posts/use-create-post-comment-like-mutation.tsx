import { useMutation, useQueryClient } from '@tanstack/react-query';

import { api } from '@/libs/apis';

import { postsKeys } from './posts-keys';
import { type InfiniteDataPostComments } from './use-get-post-comments-query';

export function useCreatePostCommentLikeMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { postId: string; postCommentId: string }) => {
      const response = await api.post(
        `posts/${data.postId}/comments/${data.postCommentId}/likes`,
      );
      return response.data;
    },
    onMutate: (variables) => {
      // console.log('onMutate', { variables });

      queryClient.setQueriesData(
        { queryKey: postsKeys.infiniteComments() },
        (data: InfiniteDataPostComments | undefined) => {
          // console.log('setQueriesData', postsKeys.infiniteComments(), data);
          if (!data) return data;
          return {
            ...data,
            pages: data.pages.map((page) =>
              page.map((postComment) => {
                if (variables.postCommentId === postComment._id) {
                  postComment.metadata.likesCount++;
                  postComment.isLiked = true;
                }
                return postComment;
              }),
            ),
          };
        },
      );
    },
    onSettled: (data, error, variables, context) => {
      // console.log('onSettled', { context, data, error, variables });

      if (error) {
        queryClient.setQueriesData(
          { queryKey: postsKeys.infiniteComments() },
          (data: InfiniteDataPostComments | undefined) => {
            // console.log('setQueriesData', postsKeys.infiniteComments(), data);
            if (!data) return data;
            return {
              ...data,
              pages: data.pages.map((page) =>
                page.map((postComment) => {
                  if (variables.postCommentId === postComment._id) {
                    postComment.metadata.likesCount--;
                    postComment.isLiked = false;
                  }
                  return postComment;
                }),
              ),
            };
          },
        );
      }
    },
  });
}
