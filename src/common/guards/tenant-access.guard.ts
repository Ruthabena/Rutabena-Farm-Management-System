import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '@prisma/client';
import { TENANT_SCOPED_KEY } from '../decorators/tenant-scoped.decorator';
import { RequestWithUser } from '../interfaces/request-with-user.interface';

@Injectable()
export class TenantAccessGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const isTenantScoped = this.reflector.getAllAndOverride<boolean>(
      TENANT_SCOPED_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!isTenantScoped) {
      return true;
    }

    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const user = request.user;

    if (!user) {
      return false;
    }

    if (user.role === UserRole.SUPER_ADMIN) {
      return true;
    }

    const resolvedTenantId = request.tenantId ?? user.tenantId;

    if (!resolvedTenantId || !user.tenantId || resolvedTenantId !== user.tenantId) {
      throw new ForbiddenException('Tenant access denied.');
    }

    request.tenantId = resolvedTenantId;
    return true;
  }
}
