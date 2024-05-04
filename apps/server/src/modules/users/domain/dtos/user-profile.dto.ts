import { UserBasicProfileDto } from './user-profile-basic.dto';

class PostsData {
  mediasCount: number;
  postsCount: number;

  constructor(partial: Partial<PostsData>) {
    Object.assign(this, partial);
  }
}

export class UserProfileDto extends UserBasicProfileDto {
  postsData: PostsData;

  constructor({ postsData, ...partial }: Partial<UserProfileDto>) {
    super(partial);

    Object.assign(this, partial);

    if (postsData) {
      this.postsData = new PostsData(postsData);
    }
  }
}
