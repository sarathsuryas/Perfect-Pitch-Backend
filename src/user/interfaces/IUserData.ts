
export interface IUserData {
  _id:string;
  fullName: string;
  email: string;
  password?: string;
  phone?: number;
  refreshToken?: string;
  token?:string
  isBlocked: boolean;
  isAdmin: boolean;
  profileImage?: string;
  profileImageUrlGeneratedAt?:Date
  profileImageUrlExpiresAt?:Date
  subscribers?:[]
  premiumUser?:boolean
  subscribersCount?: number
}