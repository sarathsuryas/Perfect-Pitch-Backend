import { GetObjectCommand, PutObjectCommand, S3, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import configuration from 'src/config/configuration';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UploadService {
  
  private client: S3Client;
  private bucketName = configuration().aws_bucket_name

  constructor(
   
  ) {
    const s3_region = configuration().aws_region
 
    if (!s3_region) {
      throw new Error('S3_REGION not found in environment variables');
    }
 
    this.client = new S3Client({
      region: s3_region,
      credentials: {
        accessKeyId: configuration().aws_access_key_id,
        secretAccessKey: configuration().aws_secret_access_key
      },
      forcePathStyle: true,
    });
 
  }
 
  async uploadSingleFile({
    file,
    isPublic = true,
  }: {
    file: Express.Multer.File;
    isPublic: boolean;
  }) {
    try {
      const key = `perfect-pitch`
      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
        ACL: isPublic ? 'public-read' : 'private',
 
        Metadata: {
          originalName: file.originalname,
        },
      });
 
      const uploadResult = await this.client.send(command);
 
  
      return {
        url: isPublic
          ? (await this.getFileUrl(key)).url
          : (await this.getPresignedSignedUrl(key)).url,
        key,
        isPublic,
      };
    } catch (error) {
      console.log(error)
      console.log('error is come')
      throw new InternalServerErrorException(error);
    }
  }
 
  async getFileUrl(key: string) {
    return { url: `https://${this.bucketName}.s3.amazonaws.com/${key}` };
  }
  
  async getPresignedSignedUrl(key: string) {
    try {
      const command = new GetObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      }); 
    
      const url = await getSignedUrl(this.client, command, {
        expiresIn:60 * 60 * 24 * 6 + 60 * 60, // 7 day and one hour
      });
  
      return { url };
    } catch (error) { 
      throw new InternalServerErrorException(error);
    }
  }

 

}

 


