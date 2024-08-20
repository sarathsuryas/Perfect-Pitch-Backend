import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document } from "mongoose";

@Schema()
export class UserPasswordResetToken extends Document {
  @Prop({required:true,type:mongoose.Schema.ObjectId,ref:'User'})
  _userId:typeof mongoose.Schema.ObjectId
  @Prop({required:true})
  resetToken:string
  @Prop({required:true,default:Date.now,expires:3600})
  createdAt:Date
}

export const UserResetTokenSchema = SchemaFactory.createForClass(UserPasswordResetToken)
