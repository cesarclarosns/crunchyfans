import { UserFollowers } from '@/modules/followers/domain/entities/user-followers';
import { UserPosts } from '@/modules/posts/domain/entities';

export class UserProfileBasic {
  id: string;
  username: string;
  name: string;
  profilePicture: string;
  coverPicture: string;

  constructor(entity: UserProfileBasic) {
    Object.assign(entity);
  }
}

export class UserProfile extends UserProfileBasic {
  about: string;
  lastSeen: string;
  userPosts: UserPosts;
  userFollowers: UserFollowers;

  constructor(entity: UserProfile) {
    super(entity);

    Object.assign(entity);
  }
}

export class UserProfileWithViewerData extends UserProfile {
  subscription: unknown;
  following: unknown;

  constructor(entity: UserProfileWithViewerData) {
    super(entity);

    Object.assign(this, entity);
  }
}
