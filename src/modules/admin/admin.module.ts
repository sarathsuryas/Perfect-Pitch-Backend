import { Module } from '@nestjs/common';
import { AdminController } from './controllers/admin.controller';
import { AdminService } from './services/admin.service';
import { MongooseModule } from '@nestjs/mongoose';
import { adminSchema } from './schema/admin.schema';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { AdminRepository } from './repositories/admin.repository';
import { userSchema } from '../users/schema/user.schema';

@Module({
  imports:[MongooseModule.forFeature([{name:'Admin',schema:adminSchema}]),MongooseModule.forFeature([{name:'User',schema:userSchema}]),JwtModule],
  controllers: [AdminController],
  providers: [AdminService,AdminRepository]
})
export class AdminModule {
 
}
