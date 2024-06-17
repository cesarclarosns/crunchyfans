export * from './post-created.event';
export * from './post-deleted.event';

export enum PostsDomainEvents {
  postCreated = 'posts:postCreated',
  postDeleted = 'posts:postDeleted',
}
