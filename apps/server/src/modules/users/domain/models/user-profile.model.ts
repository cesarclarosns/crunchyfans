import { Media } from '@/modules/media/infrastructure/entities/media.entity';

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

  constructor(model: UserProfile) {
    super(model);

    Object.assign(model);
  }
}

export class UserProfileWithViewerData extends UserProfile {
  subscriptionsData: {
    subscribersCount: number;
    isSubscribed: boolean;
  };
  followersData: {
    followersCount: number;
    isFollowed: boolean;
  };
  postsData: {
    mediasCount: number;
    postsCount: number;
  };

  constructor(model: UserProfileWithViewerData) {
    super(model);

    Object.assign(this, model);
  }
}
