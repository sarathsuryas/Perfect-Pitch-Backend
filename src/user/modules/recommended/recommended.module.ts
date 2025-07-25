import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { albumSchema } from 'src/user/schema/album.schema';
import { audioSchema } from 'src/user/schema/audio.schema';
import { playlistSchema } from 'src/user/schema/playlist.schema';
import { userSchema } from 'src/user/schema/user.schema';
import { videoSchema } from 'src/user/schema/video.schema';
import { RecommendedController } from 'src/user/controllers/recommended/recommended.controller';
import { AlbumRepository } from 'src/user/repositories/album.repository';
import { PlaylistRepository } from 'src/user/repositories/playlist.repository';
import { UserRepository } from 'src/user/repositories/user.repository';
import { VideoRepository } from 'src/user/repositories/video.repository';
import { RecommendedService } from 'src/user/services/recommended/recommended.service';

@Module({
  imports:[MongooseModule.forFeature([{name:'User',schema:userSchema},
   {name:'Video',schema:videoSchema},{name:'Album',schema:albumSchema},{name:'Audio',schema:audioSchema},{name:'Playlist',schema:playlistSchema}]),JwtModule],
  controllers:[RecommendedController],
  providers:[
     {
      provide: 'IRecommendedService',
      useClass: RecommendedService,
    },
     {
      provide: 'IAlbumRepository',
      useClass: AlbumRepository,
    },
    {
      provide: 'IUserRepository',
      useClass: UserRepository,
    },
    {
      provide: 'IVideoRepository',
      useClass: VideoRepository,
    },
    {
      provide: 'IPlaylistRepository',
      useClass: PlaylistRepository,
    }, 
  ]
})
export class RecommendedModule {}
