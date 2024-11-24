import { Module } from '@nestjs/common';
import { PlaylistController } from 'src/user/controllers/playlist/playlist.controller';
import { PlaylistRepository } from 'src/user/repositories/playlist.repository';

@Module({
  imports:[],
  controllers:[PlaylistController],
  providers:[PlaylistRepository,PlaylistRepository]
})
export class PlaylistModule {}
