import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document } from "mongoose";

@Schema()
export class PasswordResetToken extends Document {
  @Prop({required:true,type:mongoose.Schema.ObjectId,ref:'Admin'})
  _adminId:typeof mongoose.Schema.ObjectId
  @Prop({required:true})
  resetToken:string
  @Prop({required:true,default:Date.now,expires:3600})
  createdAt:Date
}

export const ResetTokenSchema = SchemaFactory.createForClass(PasswordResetToken)
