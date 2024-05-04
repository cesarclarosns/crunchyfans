import { Media } from '@/modules/media/domain/models/media.model';

export class PostMedia extends Media {
  isFree: boolean;

  constructor(model: PostMedia) {
    super(model);
  }
}

export class Post {
  id: string;
  content: string;
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
  canViewMedia: boolean;

  constructor(model: PostWithViewerData) {
    super(model);

    Object.assign(this, model);
  }
}
