
export interface IUserData {
  _id:string;
  fullName: string;
  email: string;
  password?: string;
  phone?: number;
  refreshToken?: string;
  isBlocked: boolean;
  isAdmin: boolean;
  profileImage?: string;
}