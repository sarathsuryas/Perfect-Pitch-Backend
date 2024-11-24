import { Module } from '@nestjs/common';
import { VideoController } from 'src/user/controllers/video/video.controller';
import { VideoRepository } from 'src/user/repositories/video.repository';
import { PresignedUrlService } from 'src/user/services/presigned-url/presigned-url.service';
import { VideoService } from 'src/user/services/video/video.service';

@Module({
  imports:[],
  controllers:[VideoController],
  providers:[VideoRepository,VideoService,PresignedUrlService]
})
export class VideoModule {}
