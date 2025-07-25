export interface IPresignedUrlService {
  getPresignedSignedUrl(
    userId: string,
    fileName: string,
    contentType: string
  ): Promise<{ url: string; uniqueKey: string }>;

  getFileUrl(key: string): string;
}
