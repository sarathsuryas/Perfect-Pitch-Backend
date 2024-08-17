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

@Module({
  imports:[MongooseModule.forFeature([{name:'User',schema:userSchema},
    {name:'Otp',schema:otpScema}]),
    JwtModule,
   
  ],
  controllers:[UsersController],
  providers:[UsersService,UserRepository]
})
export class UsersModule {}
