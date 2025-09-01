import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';
import { PayloadUser } from '../types/types';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredPermissions) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest<{ user: PayloadUser }>();

    if (!user || !user.permissions) {
      throw new ForbiddenException(
        'No tienes permisos para acceder a este recurso.',
      );
    }

    const hasPermission = () =>
      requiredPermissions.every((permission) =>
        user.permissions.includes(permission),
      );

    if (!hasPermission()) {
      throw new ForbiddenException(
        'No tienes permisos para acceder a este recurso.',
      );
    }

    return true;
  }
}
