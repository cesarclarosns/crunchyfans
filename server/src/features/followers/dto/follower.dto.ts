import { UserDto } from '@/features/users/dto/user.dto';

export class FollowerDto {
  followeeId: string;
  followerId: string;
  follower: UserDto;
  followee: UserDto;
}
