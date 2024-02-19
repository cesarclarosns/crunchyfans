import { formatDistanceToNowStrict } from 'date-fns';
import Link from 'next/link';
import React, { useCallback, useMemo } from 'react';

import { env } from '@/env';
import { useCreatePostLikeMutation } from '@/hooks/posts/use-create-post-like-mutation';
import { useDeletePostLikeMutation } from '@/hooks/posts/use-delete-post-like-mutation';
import { cn } from '@/libs/utils';
import { type Post } from '@/models/post/post';

import { Card, CardContent } from '../ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '../ui/carousel';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Icons } from '../ui/icons';
import { Skeleton } from '../ui/skeleton';
import { UserAvatar } from '../users/user-avatar';
import { PostCommentsList } from './post-comments-list';

export interface PostProps extends React.ComponentProps<'div'> {
  post: Post;
}

export function Post({ post, className, ...props }: PostProps) {
  const createPostLikeMutation = useCreatePostLikeMutation();
  const deletePostLikeMutation = useDeletePostLikeMutation();

  const createdAt = useMemo(
    () => formatDistanceToNowStrict(new Date(post.createdAt)),
    [post],
  );

  const handleLike = useCallback(() => {
    if (post.isLiked) {
      deletePostLikeMutation.mutate({ postId: post._id });
    } else {
      createPostLikeMutation.mutate({ postId: post._id });
    }
  }, [post]);

  const handleCopyLinkToPost = useCallback(() => {
    const link = `${env.NEXT_PUBLIC_APP_DOMAIN}/${post.user?.username}/${post._id}`;
    navigator.clipboard.writeText(link);
  }, [post]);

  return (
    <div {...props} className={cn('flex min-h-fit flex-col gap-5', className)}>
      <div className="flex justify-between gap-5">
        <div className="flex items-center gap-2">
          {post.user ? (
            <UserAvatar user={post.user} className="h-10 w-10" />
          ) : (
            <Skeleton className="h-10 w-10 rounded-full" />
          )}

          <div className="">
            <p className="flex items-center gap-1 text-sm font-semibold leading-tight">
              {post.user?.displayName}
              <Icons.BadgeCheckIcon className="h-4 w-4" />
            </p>
            <p className="text-sm leading-tight text-muted-foreground">
              @{post.user?.username}
            </p>
          </div>
        </div>

        <div className="flex flex-col items-end justify-center">
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Icons.MoreHorizontalIcon className="h-5 w-5 hover:cursor-pointer" />
            </DropdownMenuTrigger>
            <DropdownMenuContent onCloseAutoFocus={(ev) => ev.preventDefault()}>
              <DropdownMenuItem onClick={handleCopyLinkToPost}>
                Copy link to post
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <span className="text-xs text-muted-foreground">{createdAt}</span>
        </div>
      </div>

      <div className="flex flex-col gap-5">
        {post.content ? (
          <div>
            <span>{post.content}</span>
          </div>
        ) : null}

        <Carousel>
          <CarouselContent>
            {Array.from({ length: 5 }).map((_, index) => (
              <CarouselItem key={index}>
                <Card>
                  <CardContent className="flex aspect-square items-center justify-center p-6">
                    <span className="text-3xl font-semibold">{index + 1}</span>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-2 top-1/2" />
          <CarouselNext className="right-2 top-1/2" />
        </Carousel>

        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-5">
            <Icons.HeartIcon
              onClick={handleLike}
              className={cn(
                'h-6 w-6 hover:cursor-pointer',
                post.isLiked ? 'fill-red-500 stroke-red-500' : '',
              )}
            />

            <Link href={`/${post.user.username}/${post._id}`}>
              <Icons.MessageCircleIcon
                className="h-6 w-6"
                transform="rotate(260)"
              />
            </Link>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>
              {post.metadata.likesCount == 1
                ? `1 like`
                : `${post.metadata.likesCount} likes`}
            </span>
            <span className="h-1 w-1 rounded-full bg-muted-foreground"></span>
            <span>
              {post.metadata.commentsCount == 1
                ? `1 comment`
                : `${post.metadata.commentsCount} comments`}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
