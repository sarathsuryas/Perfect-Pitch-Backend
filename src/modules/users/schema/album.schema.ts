import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document } from "mongoose";

@Schema()
export class Album extends Document {
@Prop({required:true})  
title: string;
@Prop()
description:string;
@Prop()
artistName:string;
@Prop()
thumbNailLink:string
@Prop({default:true})
visibility:boolean;
@Prop()
access:string;
@Prop({type: mongoose.Schema.Types.ObjectId, ref: 'User' }) 
artistId:string;
@Prop()
section:string;
@Prop()
songs: {title:string,artistName:string,thumbNailLink:string,link:string}[]
}

export const albumSchema = SchemaFactory.createForClass(Album)