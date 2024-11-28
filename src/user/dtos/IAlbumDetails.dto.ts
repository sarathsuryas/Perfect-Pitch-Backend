export interface IAlbumDetailsDto {
  title:string;
  genreId:string
  thumbnailKey:string;
  songs:{title:string,uniqueKey:string,thumbNailUniqueKey:string}[]
}