export interface IVideoCommentDto {
  videoId:string;
  commentDetails:{
    userId:string;
    userName:string;
    comment:string;
    profileImage:string;
  }
  }