import { Module } from '@nestjs/common';
import { UsersController } from './controllers/users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { userSchema } from './schema/user.schema';
import { otpScema } from './schema/otp.schema';
import { UserRepository } from './repositories/user.repository';
import { JwtModule } from '@nestjs/jwt';
import { AdminRepository } from '../admin/repositories/admin.repository';
import { AdminModule } from '../admin/admin.module';
import { UserResetTokenSchema } from './schema/userResetToken';
import { CloudinaryProvider } from './providers/cloudinary.provider';
import { UserAuthenticationGuard } from './guards/user-authentication/user-authentication.guard';
import { UploadService } from './services/upload/upload.service';
import { UsersService } from './services/users/users.service';
import { s3ClientProvider } from 'src/config/aws.config';
import { videoSchema } from './schema/video.schema';
import { PresignedUrlService } from './services/presigned-url/presigned-url.service';

@Module({
  imports:[MongooseModule.forFeature([{name:'User',schema:userSchema},
    {name:'Otp',schema:otpScema},{name:'UserResetToken',schema:UserResetTokenSchema},{name:'Video',schema:videoSchema}]),
    JwtModule,
   
  ],
  controllers:[UsersController],
  providers:[UsersService,UserRepository,CloudinaryProvider,UserAuthenticationGuard, UploadService,s3ClientProvider, PresignedUrlService]
})
export class UsersModule {} 
 