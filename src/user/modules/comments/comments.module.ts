import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { commentReplySchema } from 'src/modules/users/schema/commentReply.schema';
import { replyToReplySchema } from 'src/modules/users/schema/replyToReply.schema';
import { videoCommentSchema } from 'src/modules/users/schema/videoComment.schema';
import { CommentsController } from 'src/user/controllers/comments/comments.controller';
import { CommentsRepository } from 'src/user/repositories/comments.repository';
import { CommentsService } from 'src/user/services/comments/comments.service';

@Module({
  imports:[MongooseModule.forFeature([{name:'VideoComment',schema:videoCommentSchema},{name:'CommentReply',schema:commentReplySchema},{name:'ReplyToReply',schema:replyToReplySchema}]),JwtModule],
  controllers:[CommentsController],
  providers:[CommentsRepository,CommentsService,CommentsRepository]
}) 
export class CommentsModule {}
