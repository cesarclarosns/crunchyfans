import { useMemo } from 'react';
import { useForm } from 'react-hook-form';

import { useGetPostCommentsQuery } from '@/modules/posts/hooks/use-get-post-comments-query';
import { cn } from '@/modules/ui/libs/utils';
import { type CreatePostComment } from '@/modules/posts/schemas/create-post-comment';

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
