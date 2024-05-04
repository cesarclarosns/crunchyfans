import { IsNotEmpty, IsString } from 'class-validator';

export class CreateFollowerDto {
  @IsString()
  @IsNotEmpty()
  followerId: string;

  @IsString()
  @IsNotEmpty()
  followeeId: string;

  constructor(dto: Partial<CreateFollowerDto>) {
    Object.assign(this, dto);
  }
}
