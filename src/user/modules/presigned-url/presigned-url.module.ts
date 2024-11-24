import { Module } from '@nestjs/common';
import { PresignedUrlController } from 'src/user/controllers/presigned-url/presigned-url.controller';
import { PresignedUrlService } from 'src/user/services/presigned-url/presigned-url.service';

@Module({
  imports:[],
  controllers:[PresignedUrlController],
  providers:[PresignedUrlService]
})
export class PresignedUrlModule {}
