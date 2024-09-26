import { ICommentDetails } from "./ICommentDetails"

export interface ICommentResponse {
    _id:string;
    comments:ICommentDetails[]
}