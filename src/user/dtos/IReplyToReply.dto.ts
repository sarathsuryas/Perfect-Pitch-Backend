export interface IReplyToReplyDto {
  replyId: string;
  userId: string;
  likes?: string[];
  replyToReply: string;
}