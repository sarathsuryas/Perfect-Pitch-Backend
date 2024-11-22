
export interface IAlbumData {
  _id:string;
  title:string;
  uuid:string
  visibility:boolean;
  thumbNailLink:string;
  viewers:string[]
  artistDetails:{
    _id:string;
    fullName:string;
  }
  viewersCount:number
}




