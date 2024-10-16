export interface IAudioData {
  title:string;
  link:string;
  artistId:{
    _id:string;
    fullName:string;
  }
  albumId:{
    _id:string;
    title:string
  }
  genre:string
}
