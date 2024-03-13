import { useMutation, useQueryClient } from '@tanstack/react-query';

import { type CreatePostComment } from '@/common/schemas/posts/create-post-comment';
import { api } from '@/libs/apis';
import { type Post } from '@/schemas/posts/post';

import { postsKeys } from './posts-keys';
import { type InfiniteDataPostComments } from './use-get-post-comments-query';

export function useCreatePostCommentMutation() {
  const queryClient = useQueryClient();

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
    onSettled: (data, error, variables, context) => {
      console.log('onSettled', { context, data, error, variables });

      if (!error) {
        if (!variables.postCommentId) {
          queryClient.setQueryData(
            postsKeys.detail(variables.postId),
            (data: Post): Post => {
              if (data) {
                return {
                  ...data,
                  metadata: {
                    ...data.metadata,
                    commentsCount: data.metadata.commentsCount + 1,
                  },
                };
              }
              return data;
            },
          );
        }

        queryClient
          .invalidateQueries({
            queryKey: postsKeys.infiniteCommentsList({
              postCommentId: variables.postCommentId,
              postId: variables.postId,
            }),
          })
          .then(() => {
            if (variables.postCommentId) {
              queryClient.setQueryData(
                postsKeys.infiniteCommentsList({ postId: variables.postId }),
                (data: InfiniteDataPostComments) => {
                  if (data) {
                    return {
                      ...data,
                      pages: data.pages.map((page) =>
                        page.map((postComment) => {
                          if (postComment._id === variables.postCommentId) {
                            postComment.metadata.commentsCount++;
                          }
                          return postComment;
                        }),
                      ),
                    };
                  }
                  return data;
                },
              );
            }
          });
      }
    },
  });
}
