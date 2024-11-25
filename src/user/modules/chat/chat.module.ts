import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { LiveChatSchema } from 'src/modules/users/schema/liveChat.schema';
import { ChatController } from 'src/user/controllers/chat/chat.controller';
import { ChatRepository } from 'src/user/repositories/chat.repository';
import { ChatService } from 'src/user/services/chat/chat.service';
import { SocketGateway } from 'src/user/socket-gateway/socket.gateway';

@Module({
  imports:[MongooseModule.forFeature([{name:'LiveChat',schema:LiveChatSchema}]),JwtModule],
  controllers:[ChatController],
  providers:[SocketGateway,ChatService,ChatRepository]
})
export class ChatModule {}
 