import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from 'socket.io';
import { IMessageDto } from "src/user/dtos/IMessageDto";
import { ChatRepository } from "../repositories/chat.repository";
import { iceConfiguration } from "src/turnconfig";
import { WebrtcService } from "../services/webrtc/webrtc.service";
import { __ServiceException } from "@aws-sdk/client-s3/dist-types/models/S3ServiceException";

@WebSocketGateway({ cors: true })
export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;
  constructor(
    private _chatRepository:ChatRepository,
    private _webrtcService:WebrtcService
  ) {

   }
  
 
  handleConnection(socket: Socket) {
    console.log('Client connected:', socket.id);
  }
  
  
  @SubscribeMessage('removeFromRoom')
  removeFromRoom(@MessageBody() room: string) {
    try {
      console.log(this.server.of('/').adapter.rooms, `users in room ${room}`)
      this.server.socketsLeave(room)
      console.log(this.server.of('/').adapter.rooms, `no users in room ${room}`)
    } catch (error) {
      console.error(error)
    }
  }

  @SubscribeMessage('message')
  async message(
    @ConnectedSocket() socket: Socket,
    @MessageBody() body:IMessageDto
  ) {
   console.log(this.server.of('/').adapter.rooms.has(body.streamKey))
    await this._chatRepository.create(body)
    socket.to(body.streamKey).emit("message",body)    
  }

  @SubscribeMessage('start_broadcast')
  handleStartBroadcast(client: Socket) {
    console.log(`Broadcast started by ${client.id}`);
    client.emit('start_broadcast'); // Emit back to the client
  } 
  @SubscribeMessage('broadcaster_offer')
  async handleBroadcasterOffer(
    @MessageBody() data: { streamKey: string; offer: RTCSessionDescription },
    @ConnectedSocket() client: Socket,
  ) {
    try {
     await this._webrtcService.createPeerConnection(data.streamKey,client,data.offer)

    } catch (error) {
       console.error('error from the broadcaster offer event',error)

    }
  }

  @SubscribeMessage('broadcaster_ice_candidate')
 async handleBroadcasterIceCandidate(
    @MessageBody() data: { streamKey: string; candidate: RTCIceCandidate },
    @ConnectedSocket() client: Socket,
  ) {
    this._webrtcService.handleBroadcasterIceCandidate(data.candidate,data.streamKey)
  }
 @SubscribeMessage('stop_broadcast') 
async handleStopBroadcast(
  @MessageBody() streamKey:string
)  {
   this._webrtcService.handleStopBroadCast(streamKey)
}
@SubscribeMessage('viewer_request')
async handleViewerRequest(
  @MessageBody() streamKey: string, // Data sent with the event
  @ConnectedSocket() client: Socket, // Reference to the connected client
) {
  await this._webrtcService.createPeerConnectionForViewer(client,streamKey)
  console.log(`Received viewer request for stream key: ${streamKey}`);
}
 // Handle viewer answer
 @SubscribeMessage('viewer_answer')
 async handleViewerAnswer(
   @MessageBody() description: RTCSessionDescriptionInit,
   @ConnectedSocket() client: Socket,
 ) {
   await this._webrtcService.handleViewerAnswer(client,description)
 }
 // Handle viewer ICE candidate
 @SubscribeMessage('viewer_ice_candidate')
 async handleViewerIceCandidate(
   @MessageBody() candidate: RTCIceCandidateInit,
   @ConnectedSocket() client: Socket,
 ) {
   console.log(`Received ICE candidate from viewer: ${client.id}`);

 }

  handleDisconnect(socket: Socket) {
    console.log('Client disconnected:', socket.id);
  }
 
}






