import { ObjectId } from "mongoose"
import { IAudioData } from "./IAudioData"

export interface IUserPlaylists {
  _id: string
  title: string
  visibility: true,
  access: string
  userId: string
  songsId:IAudioData[]
}