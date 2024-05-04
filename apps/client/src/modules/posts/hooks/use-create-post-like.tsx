import { useMutation, useQueryClient } from '@tanstack/react-query';

import { api } from '@/common/libs/apis';
import { type Post } from '@/modules/posts/schemas/post';

import { postsKeys } from './posts-keys';
import { type InfiniteDataFeed } from './use-get-feed-query';
import { type InfiniteDataPosts } from './use-get-posts-query';

export function useCreatePostLikeMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { postId: string }) => {
      const response = await api.post(`posts/${data.postId}/likes`);
      return response.data;
    },
    onMutate: (variables) => {
      // console.log('onMutate', { variables });

      queryClient.cancelQueries({ queryKey: postsKeys.all() });

      queryClient.setQueriesData(
        { queryKey: postsKeys.infinitePosts() },
        (data: InfiniteDataPosts | undefined) => {
          // console.log('setQueriesData', postsKeys.infinitePosts(), data);
          if (!data) return data;
          return {
            ...data,
            pages: data.pages.map((page) =>
              page.map((post) => {
                if (variables.postId === post._id) {
                  post.metadata.likesCount++;
                  post.isLiked = true;
                }
                return post;
              }),
            ),
          };
        },
      );

      queryClient.setQueryData(
        postsKeys.infiniteFeed(),
        (data: InfiniteDataFeed | undefined) => {
          // console.log('setQueryData', postsKeys.infiniteFeed(), data);
          if (data) {
            return {
              ...data,
              pages: data.pages.map((page) =>
                page.map((post) => {
                  if (variables.postId === post._id) {
                    post.metadata.likesCount++;
                    post.isLiked = true;
                  }
                  return post;
                }),
              ),
            };
          }
          return data;
        },
      );

      queryClient.setQueryData(
        postsKeys.detail(variables.postId),
        (data: Post): Post => {
          if (data) {
            return {
              ...data,
              isLiked: true,
              metadata: {
                ...data.metadata,
                likesCount: data.metadata.likesCount + 1,
              },
            };
          }
          return data;
        },
      );
    },
    onSettled: (data, error, variables, context) => {
      // console.log('onSettled', { context, data, error, variables });

      if (error) {
        queryClient.setQueriesData(
          { queryKey: postsKeys.infinitePosts() },
          (data: InfiniteDataPosts | undefined) => {
            // console.log('setQueriesData', postsKeys.infinitePosts(), data);
            if (data) {
              return {
                ...data,
                pages: data.pages.map((page) =>
                  page.map((post) => {
                    if (variables.postId === post._id) {
                      post.metadata.likesCount--;
                      post.isLiked = false;
                    }
                    return post;
                  }),
                ),
              };
            }
          },
        );

        queryClient.setQueryData(
          postsKeys.infiniteFeed(),
          (data: InfiniteDataFeed | undefined) => {
            // console.log('setQueryData', postsKeys.infiniteFeed(), data);
            if (!data) return data;
            return {
              ...data,
              pages: data.pages.map((page) =>
                page.map((post) => {
                  if (variables.postId === post._id) {
                    post.metadata.likesCount--;
                    post.isLiked = false;
                  }
                  return post;
                }),
              ),
            };
          },
        );

        queryClient.setQueryData(
          postsKeys.detail(variables.postId),
          (data: Post): Post => {
            if (data) {
              return {
                ...data,
                isLiked: false,
                metadata: {
                  ...data.metadata,
                  likesCount: data.metadata.likesCount - 1,
                },
              };
            }
            return data;
          },
        );
      }
    },
  });
}
