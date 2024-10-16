import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document, ObjectId } from "mongoose";

@Schema()
export class Album extends Document {
@Prop({required:true})  
title: string;
@Prop()
description:string;
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
@Prop({type: mongoose.Schema.Types.ObjectId,ref:'Genre'})
genreId:ObjectId
@Prop({type:[mongoose.Schema.Types.ObjectId]})
songs:ObjectId[] 
}

export const albumSchema = SchemaFactory.createForClass(Album)