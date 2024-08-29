import { Module } from '@nestjs/common';
import { UsersController } from './controllers/users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { userSchema } from './schema/user.schema';
import { otpScema } from './schema/otp.schema';
import { UsersService } from './services/users.service';
import { UserRepository } from './repositories/user.repository';
import { JwtModule } from '@nestjs/jwt';
import { AdminRepository } from '../admin/repositories/admin.repository';
import { AdminModule } from '../admin/admin.module';
import { UserResetTokenSchema } from './schema/userResetToken';
import { CloudinaryProvider } from './providers/cloudinary.provider';

@Module({
  imports:[MongooseModule.forFeature([{name:'User',schema:userSchema},
    {name:'Otp',schema:otpScema},{name:'UserResetToken',schema:UserResetTokenSchema}]),
    JwtModule,
   
  ],
  controllers:[UsersController],
  providers:[UsersService,UserRepository,CloudinaryProvider]
})
export class UsersModule {}
