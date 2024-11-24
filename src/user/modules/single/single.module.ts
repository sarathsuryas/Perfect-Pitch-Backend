import { Module } from '@nestjs/common';
import { SingleController } from 'src/user/controllers/single/single.controller';
import { SingleRepository } from 'src/user/repositories/single.repository';
import { PresignedUrlService } from 'src/user/services/presigned-url/presigned-url.service';
import { SingleService } from 'src/user/services/single/single.service';

@Module({
  imports:[],
  controllers:[SingleController],
  providers:[SingleService,SingleRepository,PresignedUrlService]
})
export class SingleModule {}
