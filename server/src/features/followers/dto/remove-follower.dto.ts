import { IsObjectId } from '@/common/decorators/is-object-id.decorator';

export class RemoveFollowerDto {
  @IsObjectId()
  followerId: string;

  @IsObjectId()
  followeeId: string;
}
