'use client';

import { Post } from '@/modules/posts/components/post';
import { PostCommentsList } from '@/modules/posts/components/post-comments-list';
import { useGetPostQuery } from '@/modules/posts/hooks/use-get-post-query';

export default function PostPage({ params }: { params: { postId: string } }) {
  const { postId } = params;

  const { data: post } = useGetPostQuery(postId);

  return (
    <div
      className="flex flex-1 flex-col gap-5 overflow-y-scroll py-5"
      style={{ scrollbarWidth: 'none' }}
    >
      {!!post && (
        <>
          <Post post={post} />
          <PostCommentsList postId={post._id} className="px-5 pb-10" />
        </>
      )}
    </div>
  );
}
