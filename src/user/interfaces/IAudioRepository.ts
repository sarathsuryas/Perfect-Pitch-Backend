import { ISongData } from "./ISongData";

export interface IAudioRepository {
  getSong(songId: string): Promise<ISongData>
}