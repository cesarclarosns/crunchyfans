import { type InfiniteData, useInfiniteQuery } from '@tanstack/react-query';

import { api } from '@/libs/apis';
import { type PostComment } from '@/models/post/post-comment';

import { postsKeys } from './posts-keys';

export type UseGetPostCommentsQueryParams = {
  postId: string;
  postCommentId?: string;
};

export type Param = {
  pageParam: { skip: number; cursor: string } | undefined;
};

const DEFAULT_LIMIT = 10;

export type InfiniteDataPostComments = InfiniteData<
  Array<PostComment>,
  Array<Param>
>;

export function useGetPostCommentsQuery(params: UseGetPostCommentsQueryParams) {
  return useInfiniteQuery({
    getNextPageParam: (lastPage, allPages) => {
      const hasNextPage = lastPage.length === DEFAULT_LIMIT;
      if (!hasNextPage) return undefined;

      const cursor = allPages.at(0)!.at(-1)!._id;
      const skip =
        (allPages.length > 1 ? allPages.length - 1 : 0) * DEFAULT_LIMIT;

      return { cursor, skip };
    },
    initialPageParam: undefined,
    queryFn: async ({ pageParam }: Param): Promise<Array<PostComment>> => {
      const urlSearchParams = new URLSearchParams();
      urlSearchParams.set('limit', String(DEFAULT_LIMIT));
      urlSearchParams.set('skip', String(0));

      if (pageParam) {
        urlSearchParams.set('cursor', pageParam.cursor);
        urlSearchParams.set('skip', String(pageParam.skip));
      }

      if (params.postCommentId) {
        urlSearchParams.set('postCommentId', params.postCommentId);
      }

      const response = await api.get(
        `posts/${params.postId}/comments?` + urlSearchParams.toString(),
      );
      return response.data;
    },
    queryKey: postsKeys.infiniteCommentsList(params),
  });
}
