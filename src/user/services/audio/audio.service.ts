import { Injectable } from '@nestjs/common';
import { ISongData } from 'src/modules/users/interfaces/ISongData';
import { AudioRepository } from 'src/user/repositories/audio.repository';

@Injectable()
export class AudioService {
  constructor(private _audioRepository:AudioRepository) {}
  async getSong(songId: string): Promise<ISongData> {
    try {
      return await this._audioRepository.getSong(songId)
    } catch (error) {
      console.error(error)
    }
  }

}
