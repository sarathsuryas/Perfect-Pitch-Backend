import { v2 } from 'cloudinary';
import { CLOUDINARY } from '../constants/constants';
import configuration from 'src/config/configuration';

export const CloudinaryProvider = {
  provide: CLOUDINARY,
  useFactory: () => {
    return v2.config({
      cloud_name: configuration().cloudinary_cloud_name,
      api_key: configuration().cloundinary_api_key,
      api_secret: configuration().cloudinary_api_secret,
    });
  },
};