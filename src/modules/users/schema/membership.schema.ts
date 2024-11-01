import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema()
export class MemberShip extends Document {
  @Prop({ required: true })
  name: string;
  @Prop({ required: true })
  price: string;
  @Prop({ required: true })
  priceId:string
  @Prop({required:true})
  features:string[]
  @Prop({required:true,default:false})
  isBlocked:boolean
  @Prop({required:true,default:[]})
  users:string[] 
}
export const memebershipSchema = SchemaFactory.createForClass(MemberShip)

