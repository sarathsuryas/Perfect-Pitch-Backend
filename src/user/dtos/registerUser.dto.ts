import { IsEmail, IsNotEmpty, IsNumber, IsString, Length, Matches, MaxLength, min, MinLength } from "class-validator";

export class RegisterUserDto {
  @IsNotEmpty()
  @IsString()
  @Matches(/^[a-zA-Z ]*$/)
  fullName:string
 
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email:string


  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @Matches(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).*/)
  password:string
}