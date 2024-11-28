import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema()
export class Otp{
  @Prop()
  storedOtp:string
} 

export const otpScema = SchemaFactory.createForClass(Otp)
