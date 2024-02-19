import { ApiProperty } from '@nestjs/swagger';

export class DeleteResponseBodyDto {
  @ApiProperty()
  acknowledged: boolean;

  @ApiProperty()
  modifiedCount: number;

  @ApiProperty()
  upsertedId: null | string;

  @ApiProperty()
  upsertedCount: number;

  @ApiProperty()
  matchedCount: number;
}
