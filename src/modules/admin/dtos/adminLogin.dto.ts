import { IsEmail, IsNotEmpty, IsString, Matches, MinLength } from "class-validator";

export class AdminLoginDto {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email:string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @Matches(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).*/)
  password:string
}