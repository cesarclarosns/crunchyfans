export * from './post-created.message';
export * from './post-deleted.message';

export const POSTS_MESSAGES = {
  postCreated: 'postCreated',
  postDeleted: 'postDeleted',
} as const;
