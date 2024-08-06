import { Module } from '@nestjs/common';
import { AdminController } from './controllers/admin.controller';
import { AdminService } from './services/admin.service';
import { MongooseModule } from '@nestjs/mongoose';
import { adminSchema } from './schema/admin.schema';
import { JwtModule } from '@nestjs/jwt';
import { AdminRepository } from './repositories/admin.repository';

@Module({
  imports:[MongooseModule.forFeature([{name:'Admin',schema:adminSchema}]),JwtModule],
  controllers: [AdminController],
  providers: [AdminService,AdminRepository]
})
export class AdminModule {
 
}
