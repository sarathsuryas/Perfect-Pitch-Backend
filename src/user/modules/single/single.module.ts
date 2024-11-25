import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { audioSchema } from 'src/modules/users/schema/audio.schema';
import { SingleController } from 'src/user/controllers/single/single.controller';
import { SingleRepository } from 'src/user/repositories/single.repository';
import { PresignedUrlService } from 'src/user/services/presigned-url/presigned-url.service';
import { SingleService } from 'src/user/services/single/single.service';

@Module({
  imports:[MongooseModule.forFeature([{name:'Audio',schema:audioSchema}]),JwtModule],
  controllers:[SingleController],
  providers:[SingleService,SingleRepository,PresignedUrlService]
})
export class SingleModule {}