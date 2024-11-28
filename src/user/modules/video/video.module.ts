import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { userSchema } from 'src/user/schema/user.schema';
import { videoSchema } from 'src/user/schema/video.schema';
import { VideoController } from 'src/user/controllers/video/video.controller';
import { VideoRepository } from 'src/user/repositories/video.repository';
import { PresignedUrlService } from 'src/user/services/presigned-url/presigned-url.service';
import { VideoService } from 'src/user/services/video/video.service';

@Module({
  imports:[MongooseModule.forFeature([{name:'Video',schema:videoSchema},{name:'User',schema:userSchema}]),JwtModule],
  controllers:[VideoController],
  providers:[VideoRepository,VideoService,PresignedUrlService]
})
export class VideoModule {}
