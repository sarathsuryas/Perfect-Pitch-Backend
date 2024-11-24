import { Module } from '@nestjs/common';
import { UploadService } from 'src/modules/users/services/upload/upload.service';
import { UserController } from 'src/user/controllers/user/user.controller';
import { UserService } from 'src/user/services/user/user.service';

@Module({
  imports:[],
  controllers:[UserController],
  providers:[UserService, UploadService]
})
export class UserModule {}
