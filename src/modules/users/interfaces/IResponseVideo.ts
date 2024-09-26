import { ICommentDetails } from "./ICommentDetails";
import { ICommentResponse } from "./ICommentResponse";
import { ISuggestionCommentResponse } from "./ISuggestionCommentResponse";
import { IVideoDetails } from "./IVideoDetails";

export interface IResponseVideo {
  video:IVideoDetails;
  suggestions:IVideoDetails[];
  userId?:string;
  profileImage?:string;
  comments:ICommentResponse
  suggestedVideoComments: ISuggestionCommentResponse[]
  userName:string
}