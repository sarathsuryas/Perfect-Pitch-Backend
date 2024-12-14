import { ISongData } from "./ISongData";

export interface IAudioRepostory {
  getSong(songId: string): Promise<ISongData>
}