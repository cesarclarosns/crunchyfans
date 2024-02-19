import { IsNumber, IsOptional } from 'class-validator';

export class IncrementUserMetadataDto {
  @IsNumber()
  @IsOptional()
  'metadata.videosCount'?: number;

  @IsNumber()
  @IsOptional()
  'metadata.imagesCount'?: number;

  @IsNumber()
  @IsOptional()
  'metadata.followersCount'?: number;

  @IsNumber()
  @IsOptional()
  'metadata.subscriptionsCount'?: number;
}
