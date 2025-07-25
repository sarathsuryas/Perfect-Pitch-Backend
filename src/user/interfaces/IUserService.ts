import { EditProfileDto } from "../dtos/editProfile.dto";
import { IReturnEdit } from "./IReturnEdit";
import { IUserData } from "./IUserData";
import { IUserMedia } from "./IUserMedia";


export interface IUserService {
  getUserData(id: string): Promise<IUserData>;
  updateProfileImage(_id: string, link: string): Promise<string>;
  editProfile(data: EditProfileDto, email: string): Promise<IReturnEdit>;
  checkPassword(password: string, checkPassword: string): Promise<boolean>;
  resetPassword(_id: string, password: string): Promise<boolean>;
  submitProfileImageDetails(uniqueKey: string, userId: string): Promise<void>;
  subscribeArtist(subscribedUserId: string, artistId: string): Promise<void>;
  getArtists(data: { page: number; perPage: number }): Promise<IUserData[]>;
  searchArtists(query: string): Promise<IUserData[]>;
  getArtistMedias(artistId: string): Promise<IUserMedia>;
}
