import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { userSchema } from 'src/user/schema/user.schema';
import { videoSchema } from 'src/user/schema/video.schema';
import { ShortsController } from 'src/user/controllers/shorts/shorts.controller';
import { ShortsRepository } from 'src/user/repositories/shorts.repository';
import { PresignedUrlService } from 'src/user/services/presigned-url/presigned-url.service';
import { ShortsService } from 'src/user/services/shorts/shorts.service';

@Module({
  imports:[MongooseModule.forFeature([{name:'User',schema:userSchema},
    {name:'Video',schema:videoSchema}]),JwtModule],
  controllers:[ShortsController],
  providers:[ShortsService,ShortsRepository,PresignedUrlService]
})
export class ShortsModule {}
 