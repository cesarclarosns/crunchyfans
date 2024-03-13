import { useMemo } from 'react';
import { useForm } from 'react-hook-form';

import { useGetPostCommentsQuery } from '@/hooks/posts/use-get-post-comments-query';
import { cn } from '@/libs/utils';
import { type CreatePostComment } from '@/schemas/posts/create-post-comment';

import { PostComment } from './post-comment';

export interface PostCommentRepliesListProps
  extends React.ComponentProps<'div'> {
  postId: string;
  postCommentId: string;
}

export function PostCommentRepliesList({
  postId,
  postCommentId,
  className,
  ...props
}: PostCommentRepliesListProps) {
  const { data, hasNextPage, isFetchingNextPage, fetchNextPage } =
    useGetPostCommentsQuery({ postCommentId, postId });

  const postComments = useMemo(() => (data?.pages ?? []).flat(), [data]);

  return (
    <div
      {...props}
      className={cn('flex min-h-fit flex-1 flex-col gap-5', className)}
    >
      {postComments.map((postComment) => (
        <PostComment
          postComment={postComment}
          key={postComment._id}
        ></PostComment>
      ))}

      {hasNextPage && !isFetchingNextPage && (
        <p
          className="text-sm text-muted-foreground hover:cursor-pointer hover:underline"
          onClick={() => fetchNextPage()}
        >
          View more replies
        </p>
      )}
    </div>
  );
}
