export * from './post-created.event';
export * from './post-deleted.event';

export const POSTS_EVENTS = {
  postCreated: 'posts.postCreated',
  postDeleted: 'posts.postDeleted',
} as const;
