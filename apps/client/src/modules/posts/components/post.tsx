import { formatDistanceToNowStrict } from 'date-fns';
import Link from 'next/link';
import React, { useCallback, useMemo } from 'react';

import { env } from '@/env';
import { useCreatePostLikeMutation } from '@/modules/posts/hooks/use-create-post-like';
import { useDeletePostLikeMutation } from '@/modules/posts/hooks/use-delete-post-like';
import { type Post } from '@/modules/posts/schemas/post';
import { cn } from '@/modules/ui/libs/utils';

import { MediaViewer } from '../../media/components/media-viewer';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '../../ui/components/carousel';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../ui/components/dropdown-menu';
import { Icons } from '../../ui/components/icons';
import { Skeleton } from '../../ui/components/skeleton';
import { UserAvatar } from '../../../components/users/user-avatar';

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
    const link = `${window.location.origin}/${post.user?.username}/${post._id}`;
    navigator.clipboard.writeText(link);
  }, [post]);

  return (
    <div {...props} className={cn('flex min-h-fit flex-col gap-5', className)}>
      <div className="flex justify-between gap-5 px-5">
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

      {post.content ? (
        <div className="px-5">
          <span>{post.content}</span>
        </div>
      ) : null}

      <div>
        <Carousel className="w-full">
          <CarouselContent>
            {post.media.map((media) => (
              <CarouselItem
                key={media._id}
                className="w-full items-center justify-center "
              >
                <div className="relative flex aspect-square items-center justify-center">
                  <MediaViewer media={media} />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-2 top-1/2" />
          <CarouselNext className="right-2 top-1/2" />
        </Carousel>
      </div>

      <div className="flex flex-col gap-2 px-5">
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
  );
}
