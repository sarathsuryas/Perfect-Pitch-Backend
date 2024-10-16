export interface IAlbumData {
  _id:string;
  title:string;
  artistId:{
    _id:string;
    fullName:string;
  }
  visibility:boolean;
  thumbNailLink:string;
}