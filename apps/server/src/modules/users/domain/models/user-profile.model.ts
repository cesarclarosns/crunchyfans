import { UserFollowersData } from '@/modules/followers/domain/models/user-followers-data.model';
import { Media } from '@/modules/media/domain/models/media.model';
import { UserPostsData } from '@/modules/posts/domain/models/user-posts-data.model';
import { UserSubscriptionsData } from '@/modules/subscriptions/domain/entities/user-subscriptions-data.entity';
import { Subscription } from '@/modules/subscriptions/domain/models/subscription.model';

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
  subscription: Subscription | null;
  isFollowing: boolean;

  constructor(model: UserProfileWithViewerData) {
    super(model);

    Object.assign(this, model);
  }
}
