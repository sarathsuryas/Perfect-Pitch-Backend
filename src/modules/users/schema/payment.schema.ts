import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema()
export class Payment extends Document {
  @Prop({required:true})
  memberShipId:string;
  @Prop({ required: true })
  paymentId: string;
  @Prop({ required: true })
  amount: string;
  @Prop({ required: true })
  userId: string;
  @Prop({ required: true })
  email: string;
  @Prop({ required: true })
  name: string;
  @Prop({ required: true })
  valid: boolean;
  @Prop({ required: true })
  expires_at: number;
  @Prop({ required: true })
  paymentIntent: string;
  @Prop({ required: true })
  paymentStatus: string;
  @Prop({ required: true })
  status: string;

}
export const paymentSchema = SchemaFactory.createForClass(Payment)
