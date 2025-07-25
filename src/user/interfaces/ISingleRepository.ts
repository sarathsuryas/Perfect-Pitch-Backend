import { IAudioDto } from "../dtos/IAudio.dto";
import { IBaseRepository } from "./IBaseRepository";
import { ISubmitSongDetails } from "./ISubmitSongDetails";
import { Audio } from "src/user/schema/audio.schema";

export interface ISingleRepository extends IBaseRepository<Audio>{
  submitSingleDetails(data: ISubmitSongDetails):Promise<IAudioDto | unknown> 
}