import { IAlbumDetails } from "./albumDetails";
import { IAlbumData } from "./IAlbumData";

export interface IAlbumRepository {
  submitAlbumDetails(details: IAlbumDetails, uuids: string[])
  getAlbums(data: { page: number, perPage: number }): Promise<IAlbumData[]> 
  submitAudioDetails(songs: IAlbumDetails):Promise<void>
  searchAlbum(query: string): Promise<IAlbumData[]> 
  getIndividualAlbums(data: { page: number, perPage: number,artistId:string }): Promise<IAlbumData[]> 
  getAlbumDetails(id: string, userId: string): Promise<IAlbumData>
  getUserAlbums(artistId: string): Promise<IAlbumData[]>
  recommendedAlbums(): Promise<IAlbumData[]>
}