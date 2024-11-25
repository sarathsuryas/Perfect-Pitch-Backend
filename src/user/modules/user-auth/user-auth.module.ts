import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { otpScema } from 'src/modules/users/schema/otp.schema';
import { userSchema } from 'src/modules/users/schema/user.schema';
import { UserResetTokenSchema } from 'src/modules/users/schema/userResetToken';
import { UserAuthController } from 'src/user/controllers/user-auth/user-auth.controller';
import { UserAuthRepository } from 'src/user/repositories/user-auth.repository';
import { UserAuthService } from 'src/user/services/user-auth/user-auth.service';

@Module({
  imports:[MongooseModule.forFeature([
    {name:'User',schema:userSchema},
    {name:'Otp',schema:otpScema},
    {name:'UserResetToken',schema:UserResetTokenSchema}]),JwtModule],
    controllers:[UserAuthController],
    providers:[UserAuthService,UserAuthRepository]
})
export class UserAuthModule {}
