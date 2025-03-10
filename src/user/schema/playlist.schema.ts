import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document, ObjectId } from "mongoose";

enum access {
 Public = 'public',
 Private = 'private'
}

@Schema()
export class Playlist extends Document {
@Prop({required:true})  
title: string;
@Prop({required:true})
thumbNailLink:string;
@Prop({default:true})
visibility:boolean;
@Prop({type:String,enum:access})
access:access
@Prop({type: mongoose.Schema.Types.ObjectId, ref: 'User' }) 
userId:string;
@Prop()
section:string;
@Prop({type:[mongoose.Schema.Types.ObjectId], ref: 'Audio' })
songsId:ObjectId[]
@Prop({default:[]})
viewers:string[];
}

export const playlistSchema = SchemaFactory.createForClass(Playlist)