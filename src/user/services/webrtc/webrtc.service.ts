import { Injectable } from '@nestjs/common';
import * as wrtc from 'wrtc';
import {  Socket } from 'socket.io';
import { IStream } from 'src/user/interfaces/IStream';

@Injectable()
export class WebrtcService {
private broadcasters:IStream[] = []
private viewers = new Map(); // Map to store viewer connections

async createPeerConnection(streamKey:string,client:Socket,offer: RTCSessionDescription ) {
    const peerConnection = new wrtc.RTCPeerConnection({
        iceServers: [
            { urls: 'stun:stun.stunprotocol.org:3478' },
            { urls: 'stun:stun.l.google.com:19302' }
        ]
    });
    const stream:IStream = {
        streamKey:streamKey ,
        broadcasterId:client.id,
        mediaStream:new wrtc.MediaStream(),
        peerConnection:peerConnection 
      }
      this.broadcasters.push(stream)
     await this.handleBroadcasterOffer(this.broadcasters,client,streamKey,offer)
} 

async createPeerConnectionForViewer(client:Socket,streamKey:string) {
    try {
        // Create a new RTCPeerConnection for this viewer
        
        const viewerPC = new wrtc.RTCPeerConnection({
          iceServers: [
            {
              urls: "stun:stun.relay.metered.ca:80",
            },
            {
              urls: "turn:global.relay.metered.ca:80",
              username: "836c17083ecba16b626af6f7",
              credential: "j/Du96pT1PjJXgP/",
            },
            {
              urls: "turn:global.relay.metered.ca:80?transport=tcp",
              username: "836c17083ecba16b626af6f7",
              credential: "j/Du96pT1PjJXgP/",
            },
            {
              urls: "turn:global.relay.metered.ca:443",
              username: "836c17083ecba16b626af6f7",
              credential: "j/Du96pT1PjJXgP/",
            },
            {
              urls: "turns:global.relay.metered.ca:443?transport=tcp",
              username: "836c17083ecba16b626af6f7",
              credential: "j/Du96pT1PjJXgP/",
            },
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

async handleBroadcasterOffer(broadcasters:IStream[],client:Socket,streamKey:string,offer:RTCSessionDescription) {
    try {
        const stream = broadcasters.find(stream=>stream.streamKey === streamKey)
        console.log('offer///////////////////////////////////////////////////////')
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
         await stream.peerConnection.setRemoteDescription(offer); 
         const answer = await stream.peerConnection.createAnswer();
         await stream.peerConnection.setLocalDescription(answer); 
        // Send answer back to broadcaster
        client.emit('broadcaster_answer', stream.peerConnection.localDescription);  
    } catch (error) {
        console.error("error from handle broadcast offer",error)
    }
}

async handleBroadcasterIceCandidate(candidate:RTCIceCandidate,streamKey:string) {
    try {
        const room = this.broadcasters.find(room=>room.streamKey === streamKey)
       await room.peerConnection.addIceCandidate(new wrtc.RTCIceCandidate(candidate));
      } catch (error) {
        console.error('Error adding broadcaster ICE candidate:', error);
      }
}

handleStopBroadCast(streamKey:string) {
  try {
    let index = this.broadcasters.findIndex(obj=>obj.streamKey === streamKey)
    this.broadcasters[index].peerConnection.close()
    this.broadcasters.splice(index,1)
    console.log(this.broadcasters)
  } catch (error) {
    console.error('stop broadcasting error:', error);
  }
} 

handleViewerRequest(client:Socket,streamKey:string) {
 this.createPeerConnectionForViewer(client,streamKey)
}
async handleViewerAnswer(client:Socket, answer:RTCSessionDescriptionInit) {
    const viewerPC = this.viewers.get(client.id);
    if (!viewerPC) return;
    try {
      await viewerPC.setRemoteDescription(answer);
      console.log(`Viewer ${client.id} answer processed successfully`);
    } catch (error) {
      console.error('Error setting viewer remote description:', error);
    }
}

async handleViewerIceCandidate(client:Socket,candidate:RTCIceCandidateInit) {
    const viewerPC = this.viewers.get(client.id);
    if (!viewerPC) return;
    
    try {
     await viewerPC.addIceCandidate(new wrtc.RTCIceCandidate(candidate));
    } catch (error) {
      console.error('Error adding viewer ICE candidate:', error);
    }
}

}
