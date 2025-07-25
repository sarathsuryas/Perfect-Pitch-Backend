
import { IHomePageData } from './IHomePageData';

export interface IRecommendedService {
  recommended(): Promise<IHomePageData>;
}
