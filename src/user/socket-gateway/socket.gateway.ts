import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from 'socket.io';
import { IMessageDto } from "src/user/dtos/IMessageDto";
import { ChatRepository } from "../repositories/chat.repository";
import { iceConfiguration } from "src/turnconfig";
import { WebrtcService } from "../services/webrtc/webrtc.service";
import { IStream } from "../interfaces/IStream";
import * as wrtc from 'wrtc';
import { Stream } from "stream";

@WebSocketGateway({ cors: true })
export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private broadcasters: IStream[] = []
  private viewers = new Map(); // Map to store viewer connections
  @WebSocketServer()
  server: Server;
  constructor(
    private _chatRepository: ChatRepository,
    private _webrtcService: WebrtcService
  ) {

  }


  handleConnection(socket: Socket) {
    console.log('Client connected:', socket.id);
  }


  // @SubscribeMessage('removeFromRoom')
  // removeFromRoom(@MessageBody() room: string) {
  //   try {
  //     console.log(this.server.of('/').adapter.rooms, `users in room ${room}`)
  //     this.server.socketsLeave(room)
  //     console.log(this.server.of('/').adapter.rooms, `no users in room ${room}`)
  //   } catch (error) {
  //     console.error(error)
  //   }
  // }

  // @SubscribeMessage('message')
  // async message(
  //   @ConnectedSocket() socket: Socket,
  //   @MessageBody() body:IMessageDto
  // ) {
  //  console.log(this.server.of('/').adapter.rooms.has(body.streamKey))
  //   await this._chatRepository.create(body)
  //   socket.to(body.streamKey).emit("message",body)    
  // }

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
      /// create individual peer to server from browser
      console.log('offer/////////////////////////////////////////////////////')
      this.createPeerConnection(data.streamKey, client)
      const stream = this.broadcasters.find(stream => stream.streamKey === data.streamKey)
      stream.peerConnection.ontrack = (event) => {
        stream.mediaStream.addTrack(event.track)
        console.log(`Broadcaster stream now has ${stream.mediaStream.getTracks().length} tracks`);
        console.log(`Track types: ${stream.mediaStream.getTracks().map(t => t.kind).join(', ')}`);
      }
      stream.peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
          client.emit('broadcaster_ice_candidate', event.candidate);
        }
      }
      // Log connection state changes for debugging
      stream.peerConnection.onconnectionstatechange = () => {
        console.log(`Broadcaster connection state: ${stream.peerConnection.connectionState}`);
        if (stream.peerConnection.connectionState === 'connected') {
          console.log('Broadcaster fully connected!');
        }
      };
      stream.peerConnection.oniceconnectionstatechange = () => {
        console.log(`Broadcaster ICE connection state: ${stream.peerConnection.iceConnectionState} from ${stream.streamKey}`);
      };
      await stream.peerConnection.setRemoteDescription(data.offer); 
         const answer = await stream.peerConnection.createAnswer();
         await stream.peerConnection.setLocalDescription(answer); 
        // Send answer back to broadcaster
        client.emit('broadcaster_answer', stream.peerConnection.localDescription);

    } catch (error) {
      console.error('error from the broadcaster offer event', error)

    }
  }

  @SubscribeMessage('broadcaster_ice_candidate')
  async handleBroadcasterIceCandidate(
    @MessageBody() data: { streamKey: string; candidate: RTCIceCandidate },
    @ConnectedSocket() client: Socket,
  ) {
    try {
      console.log("ice candidate /////////////////////////////////////////////////////")
      const stream = this.broadcasters.find(stream=>stream.streamKey === data.streamKey)
       stream.peerConnection.addIceCandidate(new wrtc.RTCIceCandidate(data.candidate));
    } catch (error) {
      console.error('Error adding broadcaster ICE candidate:', error);
    }
  }
  @SubscribeMessage('stop_broadcast')
  async handleStopBroadcast(
    @MessageBody() streamKey: string
  ) {
    let index = this.broadcasters.findIndex(obj=>obj.streamKey === streamKey)
    this.broadcasters[index].peerConnection.close()
    this.broadcasters.splice(index,1)
    console.log(this.broadcasters)
  }
  @SubscribeMessage('viewer_request')
  async handleViewerRequest(
    @MessageBody() streamKey: string, // Data sent with the event
    @ConnectedSocket() client: Socket, // Reference to the connected client
  ) {
    
    try {
      // Create a new RTCPeerConnection for this viewer
      
      const viewerPC = new wrtc.RTCPeerConnection({
        
          iceServers: [
            {
              urls: "stun:global.stun.twilio.com:3478"
            },
            {
              username: "dc2d2894d5a9023620c467b0e71cfa6a35457e6679785ed6ae9856fe5bdfa269",
              credential: "tE2DajzSJwnsSbc123",
              urls: "turn:global.turn.twilio.com:3478?transport=udp"
            },
            {
              username: "dc2d2894d5a9023620c467b0e71cfa6a35457e6679785ed6ae9856fe5bdfa269",
              credential: "tE2DajzSJwnsSbc123",
              urls: "turn:global.turn.twilio.com:3478?transport=tcp"
            },
            {
              username: "dc2d2894d5a9023620c467b0e71cfa6a35457e6679785ed6ae9856fe5bdfa269",
              credential: "tE2DajzSJwnsSbc123",
              urls: "turn:global.turn.twilio.com:443?transport=tcp"
            }
          ],
         
        
      });
      
      // Add this viewer to our map
    this.viewers.set(client.id, viewerPC);
      
      // Handle ICE candidate events

      viewerPC.onicecandidate = (event) => {
        if (event.candidate) {
          client.emit('viewer_ice_candidate', event.candidate);
        }
      };
      
      // Log connection state changes for debugging
      viewerPC.onconnectionstatechange = () => {
        console.log(`Viewer ${client.id} connection state: ${viewerPC.connectionState}`);
        if (viewerPC.connectionState === 'connected') {
          console.log(`Viewer ${client.id} fully connected!`);
        }
      };
      
      viewerPC.oniceconnectionstatechange = () => {
        console.log(`Viewer ${client.id} ICE connection state: ${viewerPC.iceConnectionState}`);
      };
      
      // Check if we have tracks to send
      let tracksAdded = false;
      const broadcaster = this.broadcasters.find(obj=>obj.streamKey === streamKey)
    
      if (broadcaster && broadcaster.mediaStream.getTracks().length > 0) {
        console.log(`Adding ${ broadcaster.mediaStream.getTracks().length} tracks to viewer ${client.id}`);
        
        // Important: Clone the MediaStream to ensure proper handling
        const viewerStream = new wrtc.MediaStream();
        
        // Add all tracks from broadcaster stream to viewer stream and peer connection
        broadcaster.mediaStream.getTracks().forEach(track => {
          console.log(`Adding ${track.kind} track to viewer ${client.id}`);
          viewerPC.addTrack(track, viewerStream);
          tracksAdded = true;
        });
      }
      
      if (!tracksAdded) {
        console.warn('No tracks available to add to the viewer connection');
        client.emit('error', { message: 'No broadcast stream available yet. Please try again in a moment.' });
        return;
      }
      
      // Create offer for viewer
      const offer = await viewerPC.createOffer();
      await viewerPC.setLocalDescription(offer);
      
      // Send offer to viewer
      client.emit('viewer_offer', viewerPC.localDescription);
    } catch (error) {
      console.error('Error setting up viewer connection:', error);
      client.emit('error', { message: 'Failed to establish viewer connection' });
    }
    
  }
  // Handle viewer answer
  @SubscribeMessage('viewer_answer')
  async handleViewerAnswer(
    @MessageBody() description: RTCSessionDescriptionInit,
    @ConnectedSocket() client: Socket,
  ) {
    const viewerPC = this.viewers.get(client.id);
    if (!viewerPC) return;
    
    try {
      await viewerPC.setRemoteDescription(description);
      console.log(`Viewer ${client.id} answer processed successfully`);
    } catch (error) {
      console.error('Error setting viewer remote description:', error);
    }
  }
  // Handle viewer ICE candidate
  @SubscribeMessage('viewer_ice_candidate')
  async handleViewerIceCandidate(
    @MessageBody() candidate: RTCIceCandidateInit,
    @ConnectedSocket() client: Socket,
  ) {
    const viewerPC = this.viewers.get(client.id);
    if (!viewerPC) return;
    
    try {
      viewerPC.addIceCandidate(new wrtc.RTCIceCandidate(candidate));
    } catch (error) {
      console.error('Error adding viewer ICE candidate:', error);
    }

  }

  handleDisconnect(socket: Socket) {
    console.log('Client disconnected:', socket.id);
  }

  createPeerConnection(streamKey: string, client: Socket) {
    const peerConnection = new wrtc.RTCPeerConnection({
      iceServers: [
        { urls: 'stun:stun.stunprotocol.org:3478' },
        { urls: 'stun:stun.l.google.com:19302' }
      ]
    });
    const stream: IStream = { 
      streamKey: streamKey,
      broadcasterId: client.id,
      mediaStream: new wrtc.MediaStream(),
      peerConnection: peerConnection
    }
    this.broadcasters.push(stream)
  }

}






