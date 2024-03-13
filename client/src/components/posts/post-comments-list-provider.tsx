import { createContext, useContext } from 'react';

import { type PostComment } from '@/schemas/posts/post-comment';

export interface PostCommentsListContextProps {
  onReply: (postComment: PostComment) => void;
}

export const PostCommentsListContext =
  createContext<PostCommentsListContextProps | null>(null);

export interface PostCommentsListProviderProps
  extends PostCommentsListContextProps {
  children: React.ReactNode;
}

export function PostCommentsListProvider({
  children,
  onReply,
}: PostCommentsListProviderProps) {
  return (
    <PostCommentsListContext.Provider value={{ onReply }}>
      {children}
    </PostCommentsListContext.Provider>
  );
}

export function usePostCommentsListContext() {
  const context = useContext(PostCommentsListContext);

  if (!context)
    throw new Error(
      'usePostsCommentsListContext must be used with a PostCommentsListProvider',
    );

  return context;
}
