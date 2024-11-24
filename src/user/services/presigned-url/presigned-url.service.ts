import {  PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { UserRepository } from '../../repositories/user.repository';
import configuration from 'src/config/configuration';

@Injectable()
export class PresignedUrlService {
  private client: S3Client;
  private bucketName = configuration().aws_bucket_name

  constructor() {
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


  async getPresignedSignedUrl(userId:string,fileName:string,contentType:string):Promise<{url:string,uniqueKey:string}> {
    try {
      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: userId + fileName,
        ContentType:contentType
      }); 
     
      const url = await getSignedUrl(this.client, command, {
        expiresIn:60*5, // 30 seconds
      });
       const uniqueKey = userId + fileName
       const uniqueUrl =  this.getFileUrl(uniqueKey)   
      
      return  {url,uniqueKey} 
    } catch (error) {   
      throw new InternalServerErrorException(error);
    }
  }

 getFileUrl(key: string) {
    return  `https://${this.bucketName}.s3.${configuration().aws_region}.amazonaws.com/${key}` ;
  }
  

}
