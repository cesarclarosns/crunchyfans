import { ApiProperty } from '@nestjs/swagger';

export class PatchResponseBodyDto {
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
