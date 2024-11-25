import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
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
 
  async uploadToS3(file:Express.Multer.File,fileName:string) {
    try {
      const key = fileName
      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
        ACL: 'private',
 
        Metadata: {
          originalName: file.originalname,
        },
      });
 
      const uploadResult = await this.client.send(command)
      return  this.getFileUrl(fileName)
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
      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      
      }); 
    
      const url = await getSignedUrl(this.client, command, {
        expiresIn:60 * 60 * 24 * 6 + 60 * 60, // 6 day and one hour
      });
    
      return { url };
    } catch (error) { 
      throw new InternalServerErrorException(error);
    }
  }

async uploadVideo (file:Express.Multer.File,originalName:string):Promise<string> {
  const fileName = `${uuidv4()}-${originalName}`;
  const encodeFileName = encodeURIComponent(fileName);

 const command = new PutObjectCommand({
  Bucket:this.bucketName,
  Key:fileName,
  ACL: 'private',
  Body:file.buffer,
  ContentType: file.mimetype
 })
 try {
  const result = await  this.client.send(command)
  if(result) {
   return  `https://${this.bucketName}.s3.amazonaws.com/${encodeFileName}`;
  }
 } catch (error) {
  console.error(error)
 }
}
 

}

 


