export interface IAlbumDetails {
  title:string;
  artistName:string;
  thumbNailLink:string;
  songs:{title:string,link:string,artistName:string}[]
}