import { CanActivate, ExecutionContext, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import configuration from 'src/config/configuration';

@Injectable()
export class UserAuthenticationGuard implements CanActivate {
  constructor(private readonly _jwtService:JwtService) {}
 async canActivate(
    context: ExecutionContext,
  ): Promise<boolean>  {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization.split(' ')[1]
    const response = context.switchToHttp().getResponse()
    
    try {
    
      const decoded = await this._jwtService.verifyAsync(token,
        {
          secret: configuration().jwtSecret
        }
      )
      request.user = decoded 
      return true
    } catch (error) {
      console.error(error)
      throw new UnauthorizedException()
    }
  }  
  }

 