import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from 'socket.io';
import * as webrtc from 'wrtc';
import { UserRepository } from "../repositories/user.repository";
import { IMessageDto } from "src/modules/users/dtos/IMessageDto";
import { ChatRepository } from "../repositories/chat.repository";

@WebSocketGateway({ cors: true })
export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(private _chatRepository:ChatRepository) { }
  handleDisconnect(socket: Socket) {
    console.log('Client disconnected:', socket.id);
  }
  handleConnection(socket: Socket) {
    console.log('Client connected:', socket.id);
  }
  streamArray = []
  count: number = -1
  private streamKey: string
  handleTrackEvent(event) {
    this.count++
    console.log(this.count)
    console.log(this.streamKey, "key")
    this.streamArray.push({ stream: event.streams[0], key: this.streamKey })
  }
  @WebSocketServer()
  server: Server;
  @SubscribeMessage('broadcast')
  async broadcast(
    @ConnectedSocket() socket: Socket,
    @MessageBody() data: { key: string, sdp: any }
  ) {
    try {
      console.log("broadcast started '/////////////////////")
      socket.join(data.key)
      console.log(this.server.of('/').adapter.rooms.has(data.key))

      this.streamKey = data.key
      const peer = new webrtc.RTCPeerConnection({
        iceServers: [
          {
            urls: "stun:stun.stunprotocol.org"
          }
        ]
      })
      peer.ontrack = (e) => this.handleTrackEvent(e)
      const desc = new webrtc.RTCSessionDescription(data.sdp)
      await peer.setRemoteDescription(desc)
      const answer = await peer.createAnswer()
      await peer.setLocalDescription(answer)
      const payload = {
        sdp: peer.localDescription
      }
      socket.emit('payload', payload)
      console.log('joined')

    } catch (error) { 
      console.error(error)
    }
  }

  @SubscribeMessage('watch live')
  async consumer(
    @ConnectedSocket() socket: Socket,
    @MessageBody() data: { key: string, sdp: any }) {
    try {
      if (!this.server.of('/').adapter.rooms.has(data.key)) {
        console.log("no such room")
        return false
      }
      console.log(this.streamArray)
      console.log('count', this.count)
      let stream
      let testCount = 0
      for (let i = 0; i < this.streamArray.length; i++) {
        if (data.key === this.streamArray[i].key) {
          testCount++
        }
        if (testCount === 2) {
          stream = this.streamArray[i].stream
          console.log("break", i)
          console.log("my stream key and stream is", this.streamArray[i].key)
          testCount = 0
          break
        }
      }
      socket.join(data.key)
      const peer = new webrtc.RTCPeerConnection({
        iceServers: [
          {
            urls: "stun:stun.stunprotocol.org"
          }
        ]
      });
      const desc = new webrtc.RTCSessionDescription(data.sdp);
      await peer.setRemoteDescription(desc);
      console.log(stream, 'stream data')
      stream.getTracks().forEach(track => peer.addTrack(track, stream));
      console.log("after")
      const answer = await peer.createAnswer();
      await peer.setLocalDescription(answer);
      const payload = {
        sdp: peer.localDescription
      }
      this.server.to(data.key).emit('result', payload)
    } catch (error) {
      console.error(error)
    }
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
    console.log(body)
   console.log(this.server.of('/').adapter.rooms.has(body.streamKey))
    await this._chatRepository.StoreChat(body)
    socket.to(body.streamKey).emit("message",body)    
  }

}






