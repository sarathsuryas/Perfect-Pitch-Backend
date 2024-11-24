import { Module } from '@nestjs/common';
import { AudioController } from 'src/user/controllers/audio/audio.controller';
import { AudioRepository } from 'src/user/repositories/audio.repository';
import { AudioService } from 'src/user/services/audio/audio.service';

@Module({
  imports:[],
  controllers:[AudioController],
  providers:[AudioService,AudioRepository]
})
export class AudioModule {}
