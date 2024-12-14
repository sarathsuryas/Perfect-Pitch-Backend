import { EditProfileDto } from "../dtos/editProfile.dto"
import { IReturnEdit } from "./IReturnEdit"
import { IUserData } from "./IUserData"

export interface IUserRepository {
  updateProfileImage(_id: string, link: string): Promise<string>
   editProfile(data: EditProfileDto, email: string): Promise<IReturnEdit>
    resetPassword(_id: string, password: string): Promise<IUserData> 
    getUser(id: string): Promise<IUserData>
    subscribeArtist(subscribedUserId: string, artistId: string):Promise<void>
    getArtists(data:{page:number,perPage:number}): Promise<IUserData[]>
    searchArtists(query: string): Promise<IUserData[]> 
    recomendedArtists(): Promise<IUserData[]>
}