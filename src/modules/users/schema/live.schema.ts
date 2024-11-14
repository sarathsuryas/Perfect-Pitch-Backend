import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document, ObjectId } from "mongoose";

@Schema()
export class Live extends Document {
@Prop({required:true})
uuid:string 
@Prop({required:true})
title:string;
@Prop() 
thumbNailLink:string
@Prop({type: mongoose.Schema.Types.ObjectId})
artistId:ObjectId;
@Prop()
description:string;
@Prop({type: mongoose.Schema.Types.ObjectId})
genreId:ObjectId
}

export const liveSchema = SchemaFactory.createForClass(Live)