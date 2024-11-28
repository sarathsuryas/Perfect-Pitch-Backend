import { Injectable } from '@nestjs/common';
import { ISubmitSongDetails } from 'src/user/interfaces/ISubmitSongDetails';
import { SingleRepository } from 'src/user/repositories/single.repository';

@Injectable()
export class SingleService {
constructor(private _singleRepository:SingleRepository){}
  async submitSingleDetails(data: ISubmitSongDetails) {
    try {
      return await this._singleRepository.submitSingleDetails(data)
    } catch (error) {
      console.error(error)
    }
  }
}
