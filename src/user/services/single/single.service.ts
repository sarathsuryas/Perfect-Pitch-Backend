import { Injectable } from '@nestjs/common';
import { IAudioData } from 'src/user/interfaces/IAudioData';
import { ISubmitSongDetails } from 'src/user/interfaces/ISubmitSongDetails';
import { SingleRepository } from 'src/user/repositories/single.repository';

@Injectable()
export class SingleService {
constructor(private _singleRepository:SingleRepository){}
  async submitSingleDetails(data: ISubmitSongDetails):Promise<IAudioData | unknown> {
    try {
      return await this._singleRepository.submitSingleDetails(data)
    } catch (error) {
      console.error(error)
    }
  }
}
