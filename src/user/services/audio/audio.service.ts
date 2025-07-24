import { Inject, Injectable } from '@nestjs/common';
import { IAudioService } from 'src/user/interfaces/audio-service.interface';
import { IAudioRepository } from 'src/user/interfaces/IAudioRepository';
import { ISongData } from 'src/user/interfaces/ISongData';
import { AudioRepository } from 'src/user/repositories/audio.repository';

@Injectable()
export class AudioService implements IAudioService {
  constructor(@Inject('IAudioRepository')
    private readonly _audioRepository: IAudioRepository) {}
  async getSong(songId: string): Promise<ISongData> {
    try {
      return await this._audioRepository.getSong(songId)
    } catch (error) {
      console.error(error)
    }
  }

}
