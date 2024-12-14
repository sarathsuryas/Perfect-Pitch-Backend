import { Document } from "mongoose"


export interface IChats extends Document {
    _id:string
    streamKey: string
    message: string
    createdAt: Date
    userData: {
      _id: string
      fullName: string
    }
}