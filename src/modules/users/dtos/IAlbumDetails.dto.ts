export interface IAlbumDetailsDto {
  title:string;
  thumbnailKey:string;
  songs:{title:string,uniqueKey:string}[]
}