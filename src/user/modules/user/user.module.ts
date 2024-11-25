import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { albumSchema } from 'src/modules/users/schema/album.schema';
import { audioSchema } from 'src/modules/users/schema/audio.schema';
import { playlistSchema } from 'src/modules/users/schema/playlist.schema';
import { userSchema } from 'src/modules/users/schema/user.schema';
import { videoSchema } from 'src/modules/users/schema/video.schema';
import { UploadService } from 'src/modules/users/services/upload/upload.service';
import { UserController } from 'src/user/controllers/user/user.controller';
import { AlbumRepository } from 'src/user/repositories/album.repository';
import { PlaylistRepository } from 'src/user/repositories/playlist.repository';
import { UserRepository } from 'src/user/repositories/user.repository';
import { VideoRepository } from 'src/user/repositories/video.repository';
import { PresignedUrlService } from 'src/user/services/presigned-url/presigned-url.service';
import { UserService } from 'src/user/services/user/user.service';

@Module({
  imports:[MongooseModule.forFeature([{name:'User',schema:userSchema},{name:'Album',schema:albumSchema},{name:'Audio',schema:audioSchema},{name:'Video',schema:videoSchema},
    {name:'Playlist',schema:playlistSchema}]),JwtModule], 
  controllers:[UserController], 
  providers:[UserService, UploadService,UserRepository,PresignedUrlService,AlbumRepository,VideoRepository,PlaylistRepository]
})
export class UserModule {}
