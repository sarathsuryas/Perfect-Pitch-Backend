export interface IStream {
    streamKey: string;
    broadcasterId: string;
    mediaStream: MediaStream;
    peerConnection: RTCPeerConnection;
  }