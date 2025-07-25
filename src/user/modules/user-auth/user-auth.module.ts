import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { otpScema } from 'src/user/schema/otp.schema';
import { userSchema } from 'src/user/schema/user.schema';
import { UserResetTokenSchema } from 'src/user/schema/userResetToken';
import { UserAuthController } from 'src/user/controllers/user-auth/user-auth.controller';
import { UserAuthRepository } from 'src/user/repositories/user-auth.repository';
import { UserAuthService } from 'src/user/services/user-auth/user-auth.service';

@Module({
  imports: [MongooseModule.forFeature([
    { name: 'User', schema: userSchema },
    { name: 'Otp', schema: otpScema },
    { name: 'UserResetToken', schema: UserResetTokenSchema }]), JwtModule],
  controllers: [UserAuthController],
  providers: [
    {
      provide: 'IUserAuthService',
      useClass: UserAuthService
    },
    {
      provide: 'IUserAuthRepository',
      useClass: UserAuthRepository,
    },
  ]
})
export class UserAuthModule { }
