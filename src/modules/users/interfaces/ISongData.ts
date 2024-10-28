export interface ISongData {
  _id:string;
  title:string;
  link:string;
  thumbNailLink:string;
  albumDetails: {
    _id: string;
    title: string;
    songs:string[]
  }
}