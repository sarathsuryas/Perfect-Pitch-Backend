
export interface IUploadService {
  uploadToS3(file: Express.Multer.File, fileName: string): Promise<{ url: string }>;
  getFileUrl(key: string): Promise<{ url: string }>;
  getPresignedSignedUrl(key: string): Promise<{ url: string }>;
  uploadVideo(file: Express.Multer.File, originalName: string): Promise<string>;
}
