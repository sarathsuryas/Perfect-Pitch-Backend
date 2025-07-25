import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { playlistSchema } from 'src/user/schema/playlist.schema';
import { PlaylistController } from 'src/user/controllers/playlist/playlist.controller';
import { PlaylistRepository } from 'src/user/repositories/playlist.repository';
import { PlaylistService } from 'src/user/services/playlist/playlist.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Playlist', schema: playlistSchema }]), JwtModule],
  controllers: [PlaylistController],
  providers: [
    {
      provide: 'IPlaylistRepository',
      useClass: PlaylistRepository,
    },
    {
      provide: 'IPlaylistService',
      useClass: PlaylistService,
    }

  ]
})
export class PlaylistModule { }
