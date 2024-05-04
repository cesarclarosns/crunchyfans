import { MediaDto } from '@/modules/media/domain/dtos/media.dto';

export class PostMediaDto extends MediaDto {
  isFree: boolean;

  constructor(partial: Partial<PostMediaDto>) {
    super(partial);
  }
}

export class PostDto {
  id: string;
  userId: string;
  medias: PostMediaDto[];
  content: string;
  commentsCount: number;
  likesCount: number;
  price: number;
  createdAt: string;

  constructor({ medias, ...partial }: Partial<PostDto>) {
    Object.assign(this, partial);

    if (medias) {
      this.medias = this.medias.map((media) => new PostMediaDto(media));
    }
  }
}
