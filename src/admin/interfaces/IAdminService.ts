import { RegisterUserDto } from 'src/user/dtos/registerUser.dto';
import { EditUserDto } from 'src/admin/dtos/editUser.dto';
import { AddMemberShipDto } from 'src/admin/dtos/addMemberShip.dto';
import { IReturnAdminData } from 'src/admin/interfaces/IReturnAdminData';
import { IUserData } from 'src/user/interfaces/IUserData';
import { IAdminData } from 'src/admin/interfaces/IAdminData';
import { IResetToken } from 'src/admin/interfaces/IResetToken';
import { IGenres } from 'src/admin/interfaces/IGenres';

export interface IAdminService {
  /**
   * Authenticates admin login
   * @param email - Admin email address
   * @param password - Admin password
   * @returns Promise resolving to admin data with tokens or error message
   */
  login(email: string, password: string): Promise<IReturnAdminData | string>;

  /**
   * Retrieves all users in the system
   * @returns Promise resolving to array of user data
   */
  getUsers(): Promise<IUserData[]>;

  /**
   * Blocks a user by email
   * @param email - User email to block
   * @returns Promise that resolves when user is blocked
   */
  blockUser(email: string): Promise<void>;

  /**
   * Adds a new user to the system
   * @param userData - User registration data
   * @returns Promise resolving to success message or error
   */
  addUser(userData: RegisterUserDto): Promise<string>;

  /**
   * Edits existing user data
   * @param userData - Updated user data
   * @returns Promise resolving to success message or error
   */
  editUser(userData: EditUserDto): Promise<string>;

  /**
   * Decodes JWT token to extract admin data
   * @param token - JWT token to decode
   * @returns Promise resolving to decoded admin data
   */
  decodeToken(token: string): Promise<IAdminData>;

  /**
   * Creates new access token for admin
   * @param payload - Admin data payload
   * @returns Promise resolving to access token
   */
  createAccessToken(payload: IAdminData): Promise<string>;

  /**
   * Retrieves and validates refresh token for admin
   * @param payload - Admin data payload
   * @returns Promise resolving to refresh token or error message
   */
  getRefreshToken(payload: IAdminData): Promise<string>;

  /**
   * Searches for users based on search criteria
   * @param search - Search string
   * @returns Promise resolving to array of matching users
   */
  searchUser(search: string): Promise<IUserData[]>;

  /**
   * Checks if user exists by email
   * @param email - User email address
   * @returns Promise resolving to user existence status
   */
  existUser(email: string): Promise<string>;

  /**
   * Saves password reset token and sends reset email to admin
   * @param id - Admin ID
   * @param email - Admin email address
   * @returns Promise resolving to boolean indicating success
   */
  savePasswordResetToken(id: string, email: string): Promise<boolean>;

  /**
   * Retrieves password reset token data
   * @param resetToken - Password reset token
   * @returns Promise resolving to reset token data
   */
  getResetPasswordToken(resetToken: string): Promise<any>;

  /**
   * Updates admin password using reset token
   * @param password - New password
   * @param AdminId - Admin ID
   * @returns Promise resolving to boolean indicating success
   */
  newPassword(password: string, AdminId: string): Promise<boolean>;

  /**
   * Adds a new genre to the system
   * @param genre - Genre name
   * @param newId - Genre ID
   * @param color - Genre color
   * @returns Promise resolving to operation result
   */
  addGenre(genre: string, newId: number, color: string): Promise<any>;

  /**
   * Retrieves all genres in the system
   * @returns Promise resolving to array of genres
   */
  getGenre(): Promise<IGenres[]>;

  /**
   * Creates a new membership plan
   * @param data - Membership plan data
   * @returns Promise that resolves when membership is created
   */
  createMemberShip(data: AddMemberShipDto): Promise<void>;

  /**
   * Retrieves all membership plans
   * @returns Promise resolving to membership plans
   */
  getMemberShip(): Promise<any>;

  /**
   * Blocks or unblocks a membership plan
   * @param id - Membership plan ID
   * @param isBlocked - Block status
   * @returns Promise resolving to operation result
   */
  blockUnblock(id: string, isBlocked: boolean): Promise<any>;
}