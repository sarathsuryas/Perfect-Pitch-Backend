import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { audioSchema } from 'src/user/schema/audio.schema';
import { AudioController } from 'src/user/controllers/audio/audio.controller';
import { AudioRepository } from 'src/user/repositories/audio.repository';
import { AudioService } from 'src/user/services/audio/audio.service';

@Module({
  imports:[MongooseModule.forFeature([{name:'Audio',schema:audioSchema}]),JwtModule],
  controllers:[AudioController],
  providers:[AudioService,AudioRepository]
})
export class AudioModule {}
