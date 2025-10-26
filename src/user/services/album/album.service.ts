import { Inject, Injectable } from '@nestjs/common';
import { ObjectId } from 'mongoose';
import { IAlbumService } from 'src/user/interfaces/album-service.interface';
import { IAlbumDetails } from 'src/user/interfaces/albumDetails';
import { IAlbumData } from 'src/user/interfaces/IAlbumData';
import { IAlbumRepository } from 'src/user/interfaces/IAlbumRepository';

@Injectable()
export class AlbumService implements IAlbumService{
  constructor(
    @Inject('IAlbumRepository') 
    private readonly _albumRepository: IAlbumRepository,
  ) {}

  async submitAlbumDetails(details: IAlbumDetails, uuids: string[]) {
    try {
      const album = await this._albumRepository.submitAlbumDetails(details, uuids)
      for (let i = 0; i < details.songs.length; i++) {
        details.songs[i].albumId = album._id as ObjectId
        details.songs[i].genreId = details.genreId
      }
      const data = await this._albumRepository.submitAudioDetails(details)
      return album
    } catch (error) {
      console.error(error)
    }
  }

  async getAlbums(data: { page: number, perPage: number }): Promise<IAlbumData[]> {
    try {
      return await this._albumRepository.getAlbums(data)
    } catch (error) {
      console.error(error)
    }
  }

  async searchAlbums(query: string): Promise<IAlbumData[]> {
    try {
      return await this._albumRepository.searchAlbum(query)
    } catch (error) {
      console.error(error)
    }
  }

  async getIndividualAlbums(data: { page: number, perPage: number,artistId:string }): Promise<IAlbumData[]> {
    try {
      return await this._albumRepository.getIndividualAlbums(data)
    } catch (error) {
      console.error(error)
    }
  }

  async getAlbumDetails(id: string, userId: string): Promise<IAlbumData> {
    try {
      return await this._albumRepository.getAlbumDetails(id, userId)
    } catch (error) {
      console.log(error)
    }
  }

}
