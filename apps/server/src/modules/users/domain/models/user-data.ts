import { Media } from '@/modules/media/domain/models/media.model';
import { UserStatus } from '@/modules/users/domain/types/user-status';

export class UserData {
  id: string;
  username: string;
  email: string;
  name: string;
  status: UserStatus;
  about: string;
  pictures: { cover?: Media; profile?: Media };
  isEmailVerified: boolean;

  constructor(model: UserData) {
    Object.assign(this, model);

    if (model.pictures.cover) {
      model.pictures.cover = new Media(model.pictures.cover);
    }
    if (model.pictures.profile) {
      model.pictures.profile = new Media(model.pictures.profile);
    }
  }
}
