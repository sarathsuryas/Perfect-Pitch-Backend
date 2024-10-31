export interface IAudioData {
  _id:string
  title:string;
  thumbNailLink:string
  uuid:string
  genre:string;
  artistId:{
    _id:string;
    fullName:string;
  }
}
