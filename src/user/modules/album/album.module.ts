import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { albumSchema } from 'src/modules/users/schema/album.schema';
import { audioSchema } from 'src/modules/users/schema/audio.schema';
import { AlbumController } from 'src/user/controllers/album/album.controller';
import { AlbumRepository } from 'src/user/repositories/album.repository';
import { AlbumService } from 'src/user/services/album/album.service';
import { PresignedUrlService } from 'src/user/services/presigned-url/presigned-url.service';

@Module({
  imports:[MongooseModule.forFeature([
  {name:'Album',schema:albumSchema},{name:'Audio',schema:audioSchema}]),JwtModule],
  controllers:[AlbumController],
  providers:[AlbumService,PresignedUrlService,AlbumRepository]
})
export class AlbumModule {}
