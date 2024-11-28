import { Module } from '@nestjs/common';
import { UsersController } from './controllers/users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { userSchema } from '../../user/schema/user.schema';
import { otpScema } from '../../user/schema/otp.schema';
import { UserRepository } from './repositories/user.repository';
import { JwtModule } from '@nestjs/jwt';
import { UserResetTokenSchema } from '../../user/schema/userResetToken';
import { CloudinaryProvider } from './providers/cloudinary.provider';
import { UserAuthenticationGuard } from '../../user/user-auth-guard/user-authentication.guard';
import { UploadService } from './services/upload/upload.service';
import { UsersService } from './services/users/users.service';
import { s3ClientProvider } from '../../config/aws.config';
import { videoSchema } from '../../user/schema/video.schema';
import { PresignedUrlService } from './services/presigned-url/presigned-url.service';
import { albumSchema } from '../../user/schema/album.schema';
import { audioSchema } from '../../user/schema/audio.schema';
import { TaskService } from './services/task-service/task.service';
import { videoCommentSchema } from '../../user/schema/videoComment.schema';
import { commentReplySchema } from '../../user/schema/commentReply.schema';
import { playlistSchema } from '../../user/schema/playlist.schema';
import { genresSchema } from '../../user/schema/genres.schema';
import { SocketGateway } from './gateway/socket.gateway';
import {  replyToReplySchema } from '../../user/schema/replyToReply.schema';
import { PaymentService } from './services/payment/payment.service';
import { memebershipSchema } from '../../user/schema/membership.schema';
import { paymentSchema } from '../../user/schema/payment.schema';
import { liveSchema } from '../../user/schema/live.schema';
import { LiveChatSchema } from '../../user/schema/liveChat.schema';

@Module({
  imports:[MongooseModule.forFeature([{name:'User',schema:userSchema},
    {name:'Otp',schema:otpScema},{name:'UserResetToken',schema:UserResetTokenSchema},{name:'Video',schema:videoSchema},{name:'Album',schema:albumSchema},{name:'Audio',schema:audioSchema},{name:'VideoComment',schema:videoCommentSchema},{name:'CommentReply',schema:commentReplySchema},{name:'Playlist',schema:playlistSchema},{name:'Genre',schema:genresSchema},{name:'ReplyToReply',schema:replyToReplySchema},{name:'MemberShip',schema:memebershipSchema},{name:'Payment',schema:paymentSchema},{name:'Live',schema:liveSchema},{name:'LiveChat',schema:LiveChatSchema}]),
    JwtModule, 
  ],
  controllers:[UsersController],
  providers:[UsersService,UserRepository,CloudinaryProvider,UserAuthenticationGuard, UploadService,s3ClientProvider, PresignedUrlService, TaskService,SocketGateway, PaymentService]
})
export class UsersModule {} 
 