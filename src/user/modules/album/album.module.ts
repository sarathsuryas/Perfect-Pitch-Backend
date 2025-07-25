import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { albumSchema } from 'src/user/schema/album.schema';
import { audioSchema } from 'src/user/schema/audio.schema';
import { AlbumController } from 'src/user/controllers/album/album.controller';
import { AlbumRepository } from 'src/user/repositories/album.repository';
import { AlbumService } from 'src/user/services/album/album.service';
import { PresignedUrlService } from 'src/user/services/presigned-url/presigned-url.service';
import { ALBUM_REPOSITORY, ALBUM_SERVICE } from 'src/user/Tokens/album.tokens';

@Module({
  imports:[MongooseModule.forFeature([
  {name:'Album',schema:albumSchema},
  {name:'Audio',schema:audioSchema}
  ]),JwtModule],
  controllers:[AlbumController],
  providers:[
     {
      provide: 'IPresignedUrlService',
      useClass: PresignedUrlService,  
    },
  
     {
      provide:'IAlbumService',
      useClass: AlbumService,
    },
   {
      provide: 'IAlbumRepository',
      useClass: AlbumRepository,
    },
  ]
})
export class AlbumModule {}
