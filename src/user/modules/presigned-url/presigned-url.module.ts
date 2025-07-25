import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PresignedUrlController } from 'src/user/controllers/presigned-url/presigned-url.controller';
import { PresignedUrlService } from 'src/user/services/presigned-url/presigned-url.service';

@Module({
  imports: [JwtModule],
  controllers: [PresignedUrlController],
  providers: [
    {
      provide: 'IPresignedUrlService',
      useClass: PresignedUrlService,
    }

  ]
})
export class PresignedUrlModule { }
