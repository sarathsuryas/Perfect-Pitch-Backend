import { RegisterUserDto } from 'src/user/dtos/registerUser.dto';
import { EditUserDto } from 'src/admin/dtos/editUser.dto';
import { AddMemberShipDto } from 'src/admin/dtos/addMemberShip.dto';
import { IReturnAdminData } from 'src/admin/interfaces/IReturnAdminData';
import { IUserData } from 'src/user/interfaces/IUserData';
import { IAdminData } from 'src/admin/interfaces/IAdminData';
import { IGenres } from 'src/admin/interfaces/IGenres';

export interface IAdminService {
  /**
   
   */
  login(email: string, password: string): Promise<IReturnAdminData | string>;

  
  getUsers(): Promise<IUserData[]>;

 
  blockUser(email: string): Promise<void>;

  
  addUser(userData: RegisterUserDto): Promise<string>;

  
  editUser(userData: EditUserDto): Promise<string>;

  
  decodeToken(token: string): Promise<IAdminData>;

  
  createAccessToken(payload: IAdminData): Promise<string>;

  
  getRefreshToken(payload: IAdminData): Promise<string>;

  
  searchUser(search: string): Promise<IUserData[]>;

  
  existUser(email: string): Promise<string>;

 
  savePasswordResetToken(id: string, email: string): Promise<boolean>;

  
  getResetPasswordToken(resetToken: string): Promise<any>;

  
  newPassword(password: string, AdminId: string): Promise<boolean>;

  
  addGenre(genre: string, newId: number, color: string): Promise<any>;

  
  getGenre(): Promise<IGenres[]>;

  
  createMemberShip(data: AddMemberShipDto): Promise<void>;

  
  getMemberShip(): Promise<any>;

  
  blockUnblock(id: string, isBlocked: boolean): Promise<any>;
}