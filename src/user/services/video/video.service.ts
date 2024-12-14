import { Injectable } from '@nestjs/common';
import { IResponseVideo } from 'src/user/interfaces/IResponseVideo';
import { IVideoList } from 'src/user/interfaces/IVideoList';
import { VideoRepository } from 'src/user/repositories/video.repository';

@Injectable()
export class VideoService {
  constructor(private _videoRepository:VideoRepository){}
  async SubmitVideoDetails(videoName: string, videoDescription: string, genreId: string, artistId: string, videoLink: string, thumbNailLink: string, artist: string) {
    try {
      const data = await this._videoRepository.uploadVideo(videoName, videoDescription, genreId, artistId, videoLink, thumbNailLink, artist)
      return data._id
    } catch (error) {
      console.error(error)
    }
  }

  async listVideos(data: { page: number, perPage: number }): Promise<IVideoList[]> {
    try {
      return await this._videoRepository.listVideos(data)
    } catch (error) {
      console.error(error)
    }
  }
  async searchVideos(query: string): Promise<IVideoList[]> {
    try {
      return await this._videoRepository.searchVideos(query)
    } catch (error) {
      console.error(error)
    }
  }
  async getVideoDetails(id: string, userId: string): Promise<IResponseVideo> {
    try {
      return this._videoRepository.getVideoDetails(id, userId)
    } catch (error) {
      console.error(error)
    }
  }
  async likeVideo(videoId: string, userId: string) {
    try {
      return await this._videoRepository.likeVideo(videoId, userId)
    } catch (error) {
      console.error(error)
    }
  }
async IndividualVideos(data: { page: number, perPage: number,artistId:string }): Promise<IVideoList[]>  {
 try {
    return await this._videoRepository.IndividualVideos(data)
  } catch (error) {
  console.error(error)
 }
}
  


}
