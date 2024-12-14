import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema()
export class Genres extends Document {
  @Prop({required:true})
  Genre:string;
  @Prop({required:true}) 
  newId:number
  @Prop({required:true})
  color:string
}

export const genresSchema = SchemaFactory.createForClass(Genres)
