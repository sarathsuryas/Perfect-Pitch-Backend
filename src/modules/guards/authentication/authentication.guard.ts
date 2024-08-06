import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ExecutionContextHost } from '@nestjs/core/helpers/execution-context-host';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import configuration from 'src/config/configuration';

@Injectable()
export class AuthenticationGuard implements CanActivate {
  constructor(private readonly _jwtService:JwtService) {}
 async canActivate(
    context: ExecutionContext,
  ):  Promise<boolean> {
    const request = context.switchToHttp().getRequest();
       const token =  request.headers.bearer
      try {
        const decoded = await this._jwtService.verifyAsync(token,
          {
            secret:configuration().jwtSecret
          }
        )
        console.log(decoded)
        request.user = decoded
      } catch (error) {
        console.error(error)
      }
    
    return true
  
  }
}
