import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Seeder } from 'nestjs-seeder';

import { Media } from '../media/entities/media.entity';
import { User } from '../users/entities/user.entity';
import { CreateMediaDto } from './dto/create-media.dto';
import { TRANSCODING_STATUS } from './media.constants';
import {
  getFileFormatFromFileName,
  getMediaTypeFromFileName,
} from './media.utils';

@Injectable()
export class MediaSeeder implements Seeder {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(Media.name) private readonly mediaModel: Model<Media>,
  ) {}

  async seed() {
    const fileKeys = [
      'assets/samples/sample_image_1_420.jpg',
      'assets/samples/sample_image_2_640.jpg',
      'assets/samples/sample_image_3_640.jpg',
      'assets/samples/sample_image_4_640.jpg',
      'assets/samples/sample_image_5_640.jpg',
      'assets/samples/sample_image_6_640.jpg',
      'assets/samples/sample_image_7_640.jpg',
      'assets/samples/sample_video_1_360p.mp4',
      'assets/samples/sample_video_2_360p.mp4',
      'assets/samples/sample_video_3_360p.mp4',
      'assets/samples/sample_video_4_360p.mp4',
      'assets/samples/sample_video_5_480p.mkv',
      'assets/samples/sample_video_6_240p.mp4',
      'assets/samples/sample_video_7_360p.mp4',
      'assets/samples/sample_video_8_360p.mp4',
      'assets/samples/sample_video_9_360p.mp4',
      'assets/samples/sample_video_10_360p.mp4',
      'assets/samples/sample_video_11_360p.mp4',
      'assets/samples/sample_video_12_360p.mp4',
      'assets/samples/sample_video_13_540p.mp4',
      'assets/samples/sample_video_14_540p.mp4',
      'assets/samples/sample_video_15_720p.mp4',
      'assets/samples/sample_video_16_720p.mp4',
      'assets/samples/sample_video_17_1080p.mp4',
    ];

    await Promise.all(
      fileKeys.map(async (fileKey) => {
        const fileName = fileKey.split('/').at(-1);
        const mediaType = getMediaTypeFromFileName(fileName);

        const createMediaDto = new CreateMediaDto();
        createMediaDto.userId = new mongoose.Types.ObjectId().toString();
        createMediaDto.mediaType = mediaType;
        createMediaDto.processing = {
          fileKey,
          transcodingStatus: TRANSCODING_STATUS.complete,
        };
        createMediaDto.sources = [{ fileKey, quality: 'original' }];

        await this.mediaModel.create(createMediaDto);
      }),
    );
  }

  async drop() {
    await Promise.all([await this.mediaModel.deleteMany({})]);
  }
}
