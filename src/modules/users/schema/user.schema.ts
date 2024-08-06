import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema()
export class User extends Document {
  @Prop({required:true})
  fullName: string
  @Prop({required:true})
  email: string
  @Prop({required:true})
  password: string
  @Prop({required:true})
  phone: number
  @Prop()
  refreshToken: string
  @Prop({default:false})
  isBlocked: boolean
  @Prop({default:false})
  isAdmin: boolean
  @Prop()
  profileImage: string
} 

export const userSchema = SchemaFactory.createForClass(User)
