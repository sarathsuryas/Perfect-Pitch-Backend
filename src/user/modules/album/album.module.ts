import { Module } from '@nestjs/common';
import { AlbumController } from 'src/user/controllers/album/album.controller';
import { AlbumService } from 'src/user/services/album/album.service';
import { PresignedUrlService } from 'src/user/services/presigned-url/presigned-url.service';

@Module({
  imports:[],
  controllers:[AlbumController],
  providers:[AlbumService,PresignedUrlService]
})
export class AlbumModule {}
