import { Inject, Injectable } from '@nestjs/common';
import { IAudioData } from 'src/user/interfaces/IAudioData';
import { ISingleRepository } from 'src/user/interfaces/ISingleRepository';
import { ISingleService } from 'src/user/interfaces/ISingleService';
import { ISubmitSongDetails } from 'src/user/interfaces/ISubmitSongDetails';

@Injectable()
export class SingleService implements ISingleService {
  constructor(
    @Inject('ISingleRepository')
    private readonly _singleRepository: ISingleRepository,
  ) {}
  async submitSingleDetails(data: ISubmitSongDetails):Promise<IAudioData | unknown> {
    try {
      return await this._singleRepository.submitSingleDetails(data)
    } catch (error) {
      console.error(error)
    }
  }
}
