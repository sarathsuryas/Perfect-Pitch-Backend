export interface ICreateLiveStreamDto {
  title:string;
  description:string; 
  genreId:string;
  thumbNail:Express.Multer.File;
}