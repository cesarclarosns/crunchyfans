import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect, useMemo, useRef } from 'react';
import { type SubmitHandler, useForm } from 'react-hook-form';

import { useCreatePostCommentMutation } from '@/hooks/posts/use-create-post-comment-mutation';
import { useGetPostCommentsQuery } from '@/hooks/posts/use-get-post-comments-query';
import { cn } from '@/libs/utils';
import {
  type CreatePostComment,
  createPostCommentSchema,
} from '@/schemas/posts/create-post-comment';

import { Button } from '../ui/button';
import { EmojiPicker } from '../ui/emoji-picker';
import { Icons } from '../ui/icons';
import { Input } from '../ui/input';
import { PostComment } from './post-comment';
import { PostCommentsListProvider } from './post-comments-list-provider';

export interface PostCommentsListProps extends React.ComponentProps<'div'> {
  postId: string;
}

export function PostCommentsList({
  postId,
  className,
  ...props
}: PostCommentsListProps) {
  const form = useForm<CreatePostComment>({
    defaultValues: {
      content: '',
      postId,
    },
    mode: 'all',
    resolver: zodResolver(createPostCommentSchema),
  });
  const content = form.watch('content');

  const createPostCommentMutation = useCreatePostCommentMutation();

  const { data, hasNextPage, isFetchingNextPage, fetchNextPage } =
    useGetPostCommentsQuery({ postId });
  const postComments = useMemo(() => (data?.pages ?? []).flat(), [data]);

  const inputContainerRef = useRef<HTMLDivElement | null>(null);

  const onSubmit: SubmitHandler<CreatePostComment> = async (data) => {
    try {
      createPostCommentMutation.mutateAsync(data);
      form.reset();
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (!content) {
      form.resetField('postCommentId');
      form.setValue('postId', postId);
    }
  }, [content]);

  return (
    <PostCommentsListProvider
      onReply={(postComment) => {
        form.setValue(
          'postCommentId',
          postComment.postCommentId ?? postComment._id,
        );
        form.setValue('postId', postComment.postId);
        form.setValue('content', `@${postComment.user.username}`);

        inputContainerRef.current?.scrollIntoView();
      }}
    >
      <div {...props} className={cn('flex flex-1 flex-col gap-5', className)}>
        {postComments.map((postComment) => (
          <PostComment
            postComment={postComment}
            key={postComment._id}
          ></PostComment>
        ))}

        {isFetchingNextPage && <p>Loading...</p>}

        {hasNextPage && !isFetchingNextPage && (
          <p
            className="text-sm text-muted-foreground hover:cursor-pointer hover:underline"
            onClick={() => fetchNextPage()}
          >
            View more comments
          </p>
        )}

        <form
          className="mt-5 flex min-h-fit flex-col border-t-2 pb-5 pt-2"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <div className="flex items-center gap-4 py-2" ref={inputContainerRef}>
            <Input
              autoComplete="off"
              className="my-0 h-fit border-0 px-0 py-0 text-base"
              placeholder="Add a comment..."
              {...form.register('content')}
            />
            <Button
              type="submit"
              variant={'link'}
              size={'icon'}
              disabled={form.formState.isSubmitting || !form.formState.isValid}
            >
              <Icons.SendHorizontalIcon className="h-5 w-5 hover:cursor-pointer hover:text-muted-foreground" />
            </Button>
          </div>

          <div className="flex gap-2">
            {/* <Icons.StickerIcon className="h-5 w-5 hover:cursor-pointer hover:text-muted-foreground" /> */}
            <EmojiPicker
              trigger={
                <Icons.SmileIcon className="h-5 w-5 hover:cursor-pointer hover:text-muted-foreground" />
              }
              onSelect={(emoji) => {
                form.setValue(
                  'content',
                  form.getValues().content + emoji.native,
                );
              }}
            />
          </div>
        </form>
      </div>
    </PostCommentsListProvider>
  );
}
