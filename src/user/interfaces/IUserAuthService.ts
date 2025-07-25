import { CreateUserDto } from 'src/admin/dtos/createUser.dto';
import { RegisterUserDto } from 'src/user/dtos/registerUser.dto';
import { LoginUserDto } from 'src/user/dtos/loginUser.dto';
import { IGoogleLoginDto } from 'src/user/dtos/IGoogleLogin.dto';
import { IUserData } from 'src/user/interfaces/IUserData';
import { IReturnUserData } from 'src/admin/interfaces/IReturnUserData';
import { IUserResetToken } from 'src/user/interfaces/IUserResetToken';

export interface IUserAuthService {
  /**
   * Checks if user data is valid and sends OTP for registration
   * @param userData - User registration data
   * @returns Promise resolving to user data or error message
   */
  checkUser(userData: RegisterUserDto): Promise<string | RegisterUserDto>;

  /**
   * Verifies OTP and creates user account
   * @param userData - Stringified user data
   * @param otp - OTP to verify
   * @returns Promise resolving to user data or error message
   */
  verifyOtp(userData: string, otp: string): Promise<IUserData | string>;

  /**
   * Authenticates user login
   * @param userData - User login credentials
   * @returns Promise resolving to user data with tokens or error message
   */
  login(userData: LoginUserDto): Promise<IReturnUserData | string>;

  /**
   * Handles Google OAuth login
   * @param userData - Google login data
   * @returns Promise resolving to user data with tokens or error message
   */
  googleLogin(userData: IGoogleLoginDto): Promise<IReturnUserData | string>;

  /**
   * Resends OTP to user email
   * @param email - User email address
   * @returns Promise that resolves when OTP is sent
   */
  resendOtp(email: string): Promise<void>;

  /**
   * Decodes JWT token to extract user data
   * @param token - JWT token to decode
   * @returns Promise resolving to decoded user data
   */
  decodeToken(token: string): Promise<IUserData>;

  /**
   * Creates new access token for user
   * @param payload - User data payload
   * @returns Promise resolving to access token
   */
  createAccessToken(payload: IUserData): Promise<string>;

  /**
   * Retrieves and validates refresh token for user
   * @param payload - User data payload
   * @returns Promise resolving to refresh token or error message
   */
  getRefreshToken(payload: IUserData): Promise<string>;

  /**
   * Checks if user exists by email
   * @param email - User email address
   * @returns Promise resolving to user ID or "undefined"
   */
  existUser(email: string): Promise<string>;

  /**
   * Saves password reset token and sends reset email
   * @param id - User ID
   * @param email - User email address
   * @returns Promise resolving to boolean indicating success
   */
  savePasswordResetToken(id: string, email: string): Promise<boolean>;

  /**
   * Retrieves password reset token data
   * @param resetToken - Password reset token
   * @returns Promise resolving to reset token data
   */
  getResetPasswordToken(resetToken: string): Promise<IUserResetToken>;

  /**
   * Updates user password using reset token
   * @param password - New password
   * @param UserId - User ID
   * @returns Promise resolving to boolean indicating success
   */
  newPassword(password: string, UserId: string): Promise<boolean>;
}