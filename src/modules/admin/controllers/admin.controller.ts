import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { AdminLoginDto } from '../dtos/adminLogin.dto';
import { AdminService } from '../services/admin.service';
import { Response } from 'express';

@Controller('admin')
export class AdminController {
  constructor (private readonly _adminService:AdminService) {}
  @Post('login')
  async login(@Res() res:Response, @Body() adminData:AdminLoginDto) {
    try {
      const data = await this._adminService.login(adminData.email,adminData.password)
      if(typeof data!== "string") {
       res.status(HttpStatus.OK).json(data)
      }  else {
        res.status(HttpStatus.NOT_FOUND).json(data)
      }
    } catch (error) {
      console.log(error)
    }
  }
}
