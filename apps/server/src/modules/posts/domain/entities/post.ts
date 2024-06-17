import { Media } from '@/modules/media/domain/entities/media';

export class PostMedia extends Media {
  isFree: boolean;

  constructor(model: PostMedia) {
    super(model);
  }
}

export class Post {
  id: string;
  text: string;
  medias: PostMedia[];
  likesCount: number;
  commentsCount: number;
  price: number;
  createdAt: string;
  updatedAt: string;

  constructor(model: Post) {
    Object.assign(this, model);

    if (model.medias) {
      model.medias = model.medias.map((media) => new PostMedia(media));
    }
  }
}

export class PostWithViewerData extends Post {
  isLiked: boolean;
  canViewMedias: boolean;

  constructor(model: PostWithViewerData) {
    super(model);

    Object.assign(this, model);
  }
}
