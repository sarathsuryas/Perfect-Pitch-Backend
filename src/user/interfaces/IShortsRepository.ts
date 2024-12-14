import { IShortsDto } from "../dtos/IShorts.dto";
import { IResponseShorts } from "./IResponseShorts";

export interface IShortsRepository {
  submitShortsDetails(data: IShortsDto):Promise<void>
   getShorts(userId: string): Promise<IResponseShorts> 
}