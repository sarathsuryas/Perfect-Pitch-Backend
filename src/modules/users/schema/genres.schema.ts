import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema()
export class Genres {
  @Prop({required:true})
  Genre:string;
  @Prop({required:true}) 
  newId:number
  @Prop({required:true})
  color:string
}

export const genresSchema = SchemaFactory.createForClass(Genres)
