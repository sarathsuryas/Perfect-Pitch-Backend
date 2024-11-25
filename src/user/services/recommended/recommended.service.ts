import { Injectable } from '@nestjs/common';
import { IHomePageData } from 'src/modules/users/interfaces/IHomePageData';
import { AlbumRepository } from 'src/user/repositories/album.repository';
import { PlaylistRepository } from 'src/user/repositories/playlist.repository';
import { UserRepository } from 'src/user/repositories/user.repository';
import { VideoRepository } from 'src/user/repositories/video.repository';

@Injectable()
export class RecommendedService {
  constructor(private _albumRepository: AlbumRepository, private _userRepository: UserRepository, private _videoRepository: VideoRepository, private _playlistRepository: PlaylistRepository) { }
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
