import { IUserData } from "./IUserData";

export interface IVideoDetails {
save(): unknown;
_id:string;
artist:string;  
title: string;
description:string;
like:[]
link:string;
visibility:boolean;
artistId:IUserData;
access:string;
genreId:string
shorts:boolean;
thumbnailLink:string;
views:number
} 