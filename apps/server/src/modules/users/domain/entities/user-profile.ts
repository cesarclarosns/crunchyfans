import { UserFollowers } from '@/modules/followers/domain/entities/user-followers';
import { Media } from '@/modules/media/domain/entities/media';
import { UserPosts } from '@/modules/posts/domain/entities';
import { UserSubscriptionsData } from '@/modules/subscriptions/infrastructure/repositories/mongo/entities/user-subscriptions-data.entity';

export class UserProfileBasic {
  id: string;
  username: string;
  name: string;
  pictures: { cover: Media; profile: Media };

  constructor(model: UserProfileBasic) {
    Object.assign(model);
  }
}

export class UserProfile extends UserProfileBasic {
  about: string;
  lastSeen: string;
  userPosts: UserPosts;
  userFollowers: UserFollowers;
  subscriptionsData: UserSubscriptionsData;

  constructor(model: UserProfile) {
    super(model);

    Object.assign(model);
  }
}

export class UserProfileWithViewerData extends UserProfile {
  subscription: unknown;
  following: unknown;

  constructor(model: UserProfileWithViewerData) {
    super(model);

    Object.assign(this, model);
  }
}
