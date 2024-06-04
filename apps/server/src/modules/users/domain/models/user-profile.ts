import { UserFollowersData } from '@/modules/followers/domain/models/user-followers-data.model';
import { Media } from '@/modules/media/domain/models/media.model';
import { UserPostsData } from '@/modules/posts/domain/models/user-posts-data.model';
import { UserSubscriptionsData } from '@/modules/subscriptions/domain/entities/user-subscriptions-data.entity';

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
  postsData: UserPostsData;
  followersData: UserFollowersData;
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
