import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DataFactory, Seeder } from 'nestjs-seeder';

import { AuthService } from '@/features/auth/auth.service';
import { User } from '@/features/users/entities/user.entity';

import { Media } from '../media/entities/media.entity';
import { MEDIA_TYPE } from '../media/media.constants';

@Injectable()
export class UsersSeeder implements Seeder {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(Media.name) private readonly mediaModel: Model<Media>,
    private readonly authService: AuthService,
  ) {}

  async seed(): Promise<any> {
    const password = await this.authService.hashData('password123456');

    await Promise.all(
      [...Array(10)].map(async () => {
        const images = await this.mediaModel.aggregate([
          {
            $match: {
              mediaType: MEDIA_TYPE.image,
            },
          },
          {
            $sample: { size: 1 },
          },
        ]);

        const users = DataFactory.createForClass(User).generate(1, {
          gender: 'male',
          password,
          pictures: { profilePicture: images[0]._id.toString() },
        });

        return await this.userModel.insertMany(users);
      }),
    );
  }

  async drop(): Promise<any> {
    return await this.userModel.deleteMany({});
  }
}
