import { UserRole } from '@prisma/client';
import { Request } from 'express';

export interface AuthenticatedUser {
  userId: string;
  tenantId: string | null;
  role: UserRole;
  email: string;
}

export interface RequestWithUser extends Request {
  user?: AuthenticatedUser;
  tenantId?: string | null;
}
