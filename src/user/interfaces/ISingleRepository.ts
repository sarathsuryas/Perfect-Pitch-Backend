import { IAudioDto } from "../dtos/IAudio.dto";
import { ISubmitSongDetails } from "./ISubmitSongDetails";

export interface ISingleRepository {
  submitSingleDetails(data: ISubmitSongDetails):Promise<IAudioDto | unknown> 
}