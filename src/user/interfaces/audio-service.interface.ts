

import { ISongData } from "./ISongData";

export interface IAudioService {
  getSong(songId: string): Promise<ISongData>;
}