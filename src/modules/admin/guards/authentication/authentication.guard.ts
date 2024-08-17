import { CanActivate, ExecutionContext, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import configuration from 'src/config/configuration';
import { AdminRepository } from 'src/modules/admin/repositories/admin.repository';

@Injectable()
export class AuthenticationGuard implements CanActivate {
  constructor(private readonly _jwtService: JwtService) { }
  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
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
      response.status(HttpStatus.UNAUTHORIZED)
    }

  }
}
