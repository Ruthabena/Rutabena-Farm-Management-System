import { ForbiddenException } from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { AuthenticatedUser } from '../interfaces/request-with-user.interface';

export function requireTenantScope(user: AuthenticatedUser, tenantId?: string | null) {
  if (user.role === UserRole.SUPER_ADMIN) {
    return tenantId ?? undefined;
  }

  if (!user.tenantId) {
    throw new ForbiddenException('User is not assigned to a tenant.');
  }

  if (tenantId && tenantId !== user.tenantId) {
    throw new ForbiddenException('Cross-tenant access is not allowed.');
  }

  return user.tenantId;
}
