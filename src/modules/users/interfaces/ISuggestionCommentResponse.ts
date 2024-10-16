import { ICommentDetails } from "./ICommentDetails";

export interface ISuggestionCommentResponse{
  _id:string,
  comments:ICommentDetails[][]
}

