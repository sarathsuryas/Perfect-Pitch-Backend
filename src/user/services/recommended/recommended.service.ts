import { Inject, Injectable } from '@nestjs/common';
import { IAlbumRepository } from 'src/user/interfaces/IAlbumRepository';
import { IHomePageData } from 'src/user/interfaces/IHomePageData';
import { IPlaylistRepository } from 'src/user/interfaces/IPlaylistRepository';
import { IRecommendedService } from 'src/user/interfaces/IRecommendedService';
import { IUserRepository } from 'src/user/interfaces/IUserRepository';
import { IVideoRepository } from 'src/user/interfaces/IVideoRepository';


@Injectable()
export class RecommendedService implements IRecommendedService {
  constructor(
    @Inject('IAlbumRepository')
    private readonly _albumRepository: IAlbumRepository,

    @Inject('IUserRepository')
    private readonly _userRepository: IUserRepository,

    @Inject('IVideoRepository')
    private readonly _videoRepository: IVideoRepository,

    @Inject('IPlaylistRepository')
    private readonly _playlistRepository: IPlaylistRepository,
  ) {}
  async recommended(): Promise<IHomePageData> {
    try {
      const albums = await this._albumRepository.recommendedAlbums()
      const artists = await this._userRepository.recomendedArtists()
      const videos = await this._videoRepository.recommendedVideos()
      const playlists = await this._playlistRepository.recommendedPlaylists()
      return {
        albums,
        artists,
        playlists,
        videos
      }
    } catch (error) {
      console.error(error)
    }
  }

}
