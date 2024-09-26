import { IUserData } from "./IUserData";

export interface IVideoDetails {
_id:string;
artist:string;  
title: string;
description:string;
like:[]
link:string;
visibility:boolean;
artistId:IUserData;
access:string;
genre:string
shorts:boolean;
thumbnailLink:string;
} 