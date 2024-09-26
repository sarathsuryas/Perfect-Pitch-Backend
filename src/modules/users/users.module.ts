import { Module } from '@nestjs/common';
import { UsersController } from './controllers/users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { userSchema } from './schema/user.schema';
import { otpScema } from './schema/otp.schema';
import { UserRepository } from './repositories/user.repository';
import { JwtModule } from '@nestjs/jwt';
import { UserResetTokenSchema } from './schema/userResetToken';
import { CloudinaryProvider } from './providers/cloudinary.provider';
import { UserAuthenticationGuard } from './guards/user-authentication/user-authentication.guard';
import { UploadService } from './services/upload/upload.service';
import { UsersService } from './services/users/users.service';
import { s3ClientProvider } from '../../config/aws.config';
import { videoSchema } from './schema/video.schema';
import { PresignedUrlService } from './services/presigned-url/presigned-url.service';
import { albumSchema } from './schema/album.schema';
import { audioSchema } from './schema/audio.schema';
import { TaskService } from './services/task-service/task.service';
import { videoCommentSchema } from './schema/videoComment.schema';

@Module({
  imports:[MongooseModule.forFeature([{name:'User',schema:userSchema},
    {name:'Otp',schema:otpScema},{name:'UserResetToken',schema:UserResetTokenSchema},{name:'Video',schema:videoSchema},{name:'Album',schema:albumSchema},{name:'Audio',schema:audioSchema},{name:'VideoComment',schema:videoCommentSchema}]),
    JwtModule, 
  ],
  controllers:[UsersController],
  providers:[UsersService,UserRepository,CloudinaryProvider,UserAuthenticationGuard, UploadService,s3ClientProvider, PresignedUrlService, TaskService]
})
export class UsersModule {} 
 