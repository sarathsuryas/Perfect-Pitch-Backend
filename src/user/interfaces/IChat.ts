import { ObjectId,Document } from "mongoose"

export class IChat extends Document {
  streamKey:string
  userId:ObjectId
  message:string
  createdAt?: Date
 } 
  