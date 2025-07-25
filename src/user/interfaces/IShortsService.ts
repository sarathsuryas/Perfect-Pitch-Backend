import { IShortsDto } from '../dtos/IShorts.dto';
import { IResponseShorts } from '../interfaces/IResponseShorts';

export interface IShortsService {
  submitShortsDetails(data: IShortsDto): Promise<void>;
  getShorts(userId: string): Promise<IResponseShorts>;
}