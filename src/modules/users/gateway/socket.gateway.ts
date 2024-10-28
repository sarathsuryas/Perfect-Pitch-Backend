import { MessageBody,  SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server } from 'socket.io';

@WebSocketGateway({ cors: true })
export class SocketGateway  {
constructor() {
}
@WebSocketServer()
server: Server;
@SubscribeMessage('offer')
getOffer(@MessageBody() data) {
  // socket.to(data.userId).emit("getOffer",data.offer)
  this.server.emit("sendOffer",data)
  // data consists of userId of the viewer and offer from streamer
}
@SubscribeMessage('findOffer')
findOffer(@MessageBody() data) {
  this.server.to(data.streamId).emit('getOffer',{userId:data.userId})
}

@SubscribeMessage('startLive')
startLive(@MessageBody() data) {
  this.server.socketsJoin(data)
}

@SubscribeMessage('answer')
answer(@MessageBody() data) {

this.server.emit('answer',data)
}
// socket.join(userId)

//startLive({id:string}:{id}) {
//   this.server.socketsJoin(id)
// }

// findOffer({uuid:string,userId:string},{id}){
//  socket.to(uuid).emit("getOffer",{userId})
// }

}




// Frontend -------



// Streamer

// when live starts data = {uuid,...etc} socket.emit("startLive",{id:uuid})
// when someOne requests for offer ...   socket.on("getOffer",{userId} ){
// socket.emit("getOffer",{offer,userId})
// }

// Viewer

// when user goes live liveplayer socket.emit("findOffer",{userId,uuid})
// viewer gets the offer through socket ---- socket.on("getOffer",(offer)=>{
//  RTCPeer ---- offer
// })