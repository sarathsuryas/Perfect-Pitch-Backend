import { Module } from '@nestjs/common';
import { CommentsController } from 'src/user/controllers/comments/comments.controller';
import { CommentsRepository } from 'src/user/repositories/comments.repository';
import { CommentsService } from 'src/user/services/comments/comments.service';

@Module({
  imports:[],
  controllers:[CommentsController],
  providers:[CommentsRepository,CommentsService]
})
export class CommentsModule {}
