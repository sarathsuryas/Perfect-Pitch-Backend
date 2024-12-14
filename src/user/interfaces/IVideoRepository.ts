import { IResponseVideo } from "./IResponseVideo"
import { IVideoList } from "./IVideoList"

export interface IVideoRepository {
   uploadVideo(videoName: string, videoDescription: string, genreId: string, artistId: string, videoLink: string, thumbNailLink: string, artist: string)
   listVideos(data: { page: number, perPage: number }): Promise<IVideoList[]>
   searchVideos(query: string): Promise<IVideoList[]>
   getVideoDetails(id: string, userId: string): Promise<IResponseVideo>
   likeVideo(videoId: string, userId: string) 
   getUserVideos(userId: string): Promise<IVideoList[]>
   recommendedVideos(): Promise<IVideoList[]> 
   IndividualVideos(data: { page: number, perPage: number,artistId:string }): Promise<IVideoList[]> 
}