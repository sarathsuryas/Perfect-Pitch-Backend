import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { liveSchema } from 'src/modules/users/schema/live.schema';
import { LiveStreamingController } from 'src/user/controllers/live-streaming/live-streaming.controller';
import { LiveStreamingRepository } from 'src/user/repositories/liveStreaming.repository';
import { LiveStreamingService } from 'src/user/services/live-streaming/live-streaming.service';
import { UploadService } from 'src/user/services/upload/upload.service';

@Module({
  imports:[MongooseModule.forFeature([{name:'Live',schema:liveSchema}]),JwtModule],
  controllers:[LiveStreamingController],
  providers:[LiveStreamingService,LiveStreamingRepository,UploadService]
})
export class LiveStreamingModule {}