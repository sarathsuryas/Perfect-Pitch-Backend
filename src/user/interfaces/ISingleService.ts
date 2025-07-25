
import { IAudioData } from '../interfaces/IAudioData';
import { ISubmitSongDetails } from './ISubmitSongDetails';

export interface ISingleService {
  submitSingleDetails(data: ISubmitSongDetails): Promise<IAudioData | unknown>;
}
