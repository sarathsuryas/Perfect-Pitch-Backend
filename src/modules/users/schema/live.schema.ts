import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document, ObjectId } from "mongoose";

@Schema()
export class Live extends Document {
@Prop({required:true})
caption:string;
@Prop() 
thumbNailLink:string
@Prop()
artistId:string;
@Prop()
description:string;
@Prop()
genreId:string

}

export const liveSchema = SchemaFactory.createForClass(Live)