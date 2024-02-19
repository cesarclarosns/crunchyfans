import { FollowerCreatedEvent } from './follower-created.event';
import { FollowerRemovedEvent } from './follower-removed.event';

export const FOLLOWERS_EVENTS = {
  FollowerCreated: 'Followers.FollowerCreated',
  FollowerRemoved: 'Followers.FollowerRemoved',
};

export { FollowerCreatedEvent, FollowerRemovedEvent };
