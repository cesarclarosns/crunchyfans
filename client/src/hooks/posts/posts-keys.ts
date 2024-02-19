import { type UseGetPostCommentsQueryParams } from './use-get-post-comments-query';
import { type UseGetPostsQueryParams } from './use-get-posts-query';

export const postsKeys = {
  all: () => ['posts'] as const,
  detail: (id: string | null) => [...postsKeys.details(), id] as const,
  details: () => [...postsKeys.all(), 'detail'] as const,
  infiniteComments: () => ['infiniteComments'] as const,
  infiniteCommentsList: (params: UseGetPostCommentsQueryParams) =>
    [...postsKeys.infiniteComments(), params] as const,
  infiniteFeed: () => ['infiniteFeed'] as const,
  infinitePosts: () => ['infinitePosts'] as const,
  infinitePostsList: (params: UseGetPostsQueryParams) =>
    [...postsKeys.infinitePosts(), params] as const,
};
