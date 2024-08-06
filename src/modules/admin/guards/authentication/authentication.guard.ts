import { CanActivate, ExecutionContext, HttpStatus, Injectable } from '@nestjs/common';
import { ExecutionContextHost } from '@nestjs/core/helpers/execution-context-host';
import { JwtService } from '@nestjs/jwt';
import { access } from 'fs';
import { Observable } from 'rxjs';
import configuration from 'src/config/configuration';
import { AdminRepository } from 'src/modules/admin/repositories/admin.repository';
import { UserRepository } from 'src/modules/users/repositories/user.repository';

@Injectable()
export class AuthenticationGuard implements CanActivate {
  constructor(private readonly _jwtService:JwtService,private readonly _adminRepository:AdminRepository) {}
 async canActivate(
    context: ExecutionContext,
  ):  Promise<boolean> {
    const request = context.switchToHttp().getRequest();
       const token = request.headers.authorization.split(' ')[1]
       const response = context.switchToHttp().getResponse()
      try {
        const decoded = await this._jwtService.verifyAsync(token,
          {
            secret:configuration().jwtSecret
          }
        )
       
        request.user = decoded
        return true
      } catch (error) {

        if(error.message == "jwt expired") {
          const payload = this._jwtService.decode(token);
       
         await this._adminRepository.getUser(payload._id)
         const accessToken = await this._jwtService.signAsync({
          _id:payload._id,
          email:payload.email,
          fullName:payload.fullName,
          isAdmin:payload.isAdmin, 
          isBlocked:payload.isBlocked
         }, { secret: configuration().jwtSecret, expiresIn: "1d" })
         console.log(accessToken)
         return response.status(202).json({accessToken})
        }
        //console.error(error)
      }
    
    
  
  }
}
