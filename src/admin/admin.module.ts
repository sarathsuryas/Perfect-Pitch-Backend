import { Module } from '@nestjs/common';
import { AdminController } from './controllers/admin.controller';
import { AdminService } from './services/admin.service';
import { MongooseModule } from '@nestjs/mongoose';
import { adminSchema } from './schema/admin.schema';
import { JwtModule } from '@nestjs/jwt';
import { AdminRepository } from './repositories/admin.repository';
import { userSchema } from '../modules/users/schema/user.schema';
import { ResetTokenSchema } from './schema/resetToken.schema';
import { AuthenticationGuard } from './admin-auth-guard/authentication.guard';
import { genresSchema } from '../modules/users/schema/genres.schema';
import { memebershipSchema } from '../modules/users/schema/membership.schema';

@Module({
  imports:[MongooseModule.forFeature([{name:'Admin',schema:adminSchema}]),MongooseModule.forFeature([{name:'User',schema:userSchema}]),MongooseModule.forFeature([{name:'ResetToken',schema:ResetTokenSchema},{name:'Genre',schema:genresSchema},{name:'MemberShip',schema:memebershipSchema}]),JwtModule],
  controllers: [AdminController],
  providers: [AdminService,AdminRepository,AuthenticationGuard],
  
})
export class AdminModule {
  constructor() {}
}
