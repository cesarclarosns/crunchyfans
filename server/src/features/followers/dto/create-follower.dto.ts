import { IsObjectId } from '@/common/decorators/is-object-id.decorator';

export class CreateFollowerDto {
  @IsObjectId()
  followeeId: string;

  @IsObjectId()
  followerId: string;
}
