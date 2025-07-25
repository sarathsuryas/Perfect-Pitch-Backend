import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { LiveChatSchema } from 'src/user/schema/liveChat.schema';
import { ChatController } from 'src/user/controllers/chat/chat.controller';
import { ChatRepository } from 'src/user/repositories/chat.repository';
import { ChatService } from 'src/user/services/chat/chat.service';
import { SocketGateway } from 'src/user/socket-gateway/socket.gateway';
import { WebrtcService } from 'src/user/services/webrtc/webrtc.service';

@Module({
  imports:[MongooseModule.forFeature([{name:'LiveChat',schema:LiveChatSchema}]),JwtModule],
  controllers:[ChatController],
  providers:[SocketGateway,
      {
      provide: 'IChatService',
      useClass: ChatService,
    },
     {
      provide:'IChatRepository',
      useClass: ChatRepository,
    },
    WebrtcService]
})
export class ChatModule {}
 