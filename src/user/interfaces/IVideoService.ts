import { IVideoList } from '../interfaces/IVideoList';
import { IResponseVideo } from '../interfaces/IResponseVideo';

export interface IVideoService {
  SubmitVideoDetails(
    videoName: string,
    videoDescription: string,
    genreId: string,
    artistId: string,
    videoLink: string,
    thumbNailLink: string,
    artist: string
  ): Promise<string>;

  listVideos(data: { page: number; perPage: number }): Promise<IVideoList[]>;

  searchVideos(query: string): Promise<IVideoList[]>;

  getVideoDetails(id: string, userId: string): Promise<IResponseVideo>;

  likeVideo(videoId: string, userId: string): Promise<void>;

  IndividualVideos(data: {
    page: number;
    perPage: number;
    artistId: string;
  }): Promise<IVideoList[]>;
}
