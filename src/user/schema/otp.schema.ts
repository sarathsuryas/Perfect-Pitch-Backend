import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema()
export class Otp extends Document{ 
  @Prop()
  storedOtp:string
} 

export const otpScema = SchemaFactory.createForClass(Otp)
