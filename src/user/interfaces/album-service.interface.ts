// interfaces/album-service.interface.ts
import { IAlbumDetails } from './albumDetails';
import { IAlbumData } from './IAlbumData';

export interface IAlbumService {
  submitAlbumDetails(details: IAlbumDetails, uuids: string[]): Promise<any>;
  getAlbums(data: { page: number; perPage: number }): Promise<IAlbumData[]>;
  searchAlbums(query: string): Promise<IAlbumData[]>;
  getIndividualAlbums(data: { page: number; perPage: number; artistId: string }): Promise<IAlbumData[]>;
  getAlbumDetails(id: string, userId: string): Promise<IAlbumData>;
}