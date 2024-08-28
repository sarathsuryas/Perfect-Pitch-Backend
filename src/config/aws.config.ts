import { S3Client } from '@aws-sdk/client-s3';
import configuration from './configuration';

const credentials = {
  accessKeyId:configuration().aws_access_key_id,
  secretAccessKey: configuration().aws_secret_access_key,
};
const region = configuration().aws_region
export const s3ClientProvider = {
  provide: S3Client,
  useValue: new S3Client({ region, credentials }),
};