import { Injectable } from '@nestjs/common';
import { IShortsDto } from 'src/user/dtos/IShorts.dto';
import { IResponseShorts } from 'src/user/interfaces/IResponseShorts';
import { ShortsRepository } from 'src/user/repositories/shorts.repository';

@Injectable()
export class ShortsService {
  constructor(private _shortsRepository: ShortsRepository) { }
  async submitShortsDetails(data: IShortsDto):Promise<void> {
    try {
      await this._shortsRepository.submitShortsDetails(data)
    } catch (error) {
      console.error(error)
    }
  }
  async getShorts(userId: string): Promise<IResponseShorts> {
    try {
      return await this._shortsRepository.getShorts(userId)
    } catch (error) {
      console.log(error)
    }
  }

}
