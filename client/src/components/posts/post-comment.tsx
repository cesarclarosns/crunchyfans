import { formatDistanceToNowStrict } from 'date-fns';
import { useCallback, useContext, useMemo, useState } from 'react';

import { useCreatePostCommentLikeMutation } from '@/hooks/posts/use-create-post-comment-like-mutation';
import { useDeletePostCommentLikeMutation } from '@/hooks/posts/use-delete-post-comment-like-mutation';
import { cn } from '@/libs/utils';
import { type PostComment as PostCommentModel } from '@/models/post/post-comment';

import { Icons } from '../ui/icons';
import { UserAvatar } from '../users/user-avatar';
import { PostCommentRepliesList } from './post-comment-replies-list';
import { PostCommentsList } from './post-comments-list';
import {
  PostCommentsListContext,
  usePostCommentsListContext,
} from './post-comments-list-provider';

export interface PostCommentProps extends React.ComponentProps<'div'> {
  postComment: PostCommentModel;
}

export function PostComment({
  postComment,
  className,
  ...props
}: PostCommentProps) {
  const { onReply } = usePostCommentsListContext();

  const [viewReplies, setViewReplies] = useState(false);
  const [showReplies, setShowReplies] = useState(true);

  const createPostCommentLikeMutation = useCreatePostCommentLikeMutation();
  const deletePostCommentLikeMutation = useDeletePostCommentLikeMutation();

  const createdAt = useMemo(
    () => formatDistanceToNowStrict(new Date(postComment.createdAt)),
    [postComment],
  );

  const onLike = useCallback(() => {
    if (postComment.isLiked) {
      deletePostCommentLikeMutation.mutate({
        postCommentId: postComment._id,
        postId: postComment.postId,
      });
    } else {
      createPostCommentLikeMutation.mutate({
        postCommentId: postComment._id,
        postId: postComment.postId,
      });
    }
  }, [postComment]);

  return (
    <div {...props} className={cn('flex min-h-fit gap-4', className)}>
      <div className="">
        <UserAvatar user={postComment.user} className="h-10 w-10" />
      </div>
      <div className="flex flex-1 flex-col gap-2">
        <div className="flex gap-2">
          <div className="flex-1">
            <p className="text-sm text-muted-foreground">
              @{postComment.user.username}
            </p>
            <p>{postComment.content}</p>
          </div>
          <div>
            <Icons.HeartIcon
              onClick={onLike}
              className={cn(
                'h-6 w-6 hover:cursor-pointer',
                postComment.isLiked ? 'fill-red-500 stroke-red-500' : '',
              )}
            />
          </div>
        </div>

        <div className="flex gap-4">
          <span className="text-sm text-muted-foreground">{createdAt}</span>
          <span className="text-sm text-muted-foreground">
            {postComment.metadata.likesCount == 1
              ? `1 like`
              : `${postComment.metadata.likesCount} likes`}
          </span>
          <span
            className="text-sm text-muted-foreground hover:cursor-pointer hover:underline"
            onClick={() => onReply(postComment)}
          >
            Reply
          </span>
        </div>

        {!!!postComment.postCommentId &&
          !!postComment.metadata.commentsCount && (
            <>
              {viewReplies ? (
                <p
                  className="text-sm text-muted-foreground hover:cursor-pointer hover:underline"
                  onClick={() => setShowReplies((value) => !value)}
                >
                  {showReplies ? 'Hide replies' : 'Show replies'}
                </p>
              ) : (
                <p
                  className="text-sm text-muted-foreground hover:cursor-pointer hover:underline"
                  onClick={() => setViewReplies(true)}
                >
                  View replies {`(${postComment.metadata.commentsCount})`}
                </p>
              )}

              {viewReplies && (
                <PostCommentRepliesList
                  className={cn(!showReplies && 'hidden')}
                  postId={postComment.postId}
                  postCommentId={postComment._id}
                />
              )}
            </>
          )}
      </div>
    </div>
  );
}
