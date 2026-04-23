import { Prisma, Tenant, User } from '@prisma/client';
import { CreateUserDto } from '../dto/create-user.dto';
import { ListUsersQueryDto } from '../dto/list-users-query.dto';

export const USER_REPOSITORY = 'USER_REPOSITORY';

export interface IUserRepository {
  findByEmail(email: string): Promise<User | null>;
  findActiveByEmailWithTenant(email: string): Promise<(User & { tenant: Tenant | null }) | null>;
  findActiveById(id: string): Promise<User | null>;
  create(tenantId: string, dto: CreateUserDto, createdById: string): Promise<User>;
  findMany(tenantId: string | undefined, query: ListUsersQueryDto): Promise<{ items: User[]; total: number }>;
  findById(id: string, tenantId: string | undefined): Promise<User | null>;
  update(id: string, data: Prisma.UserUpdateInput): Promise<User>;
  deactivate(id: string): Promise<User>;
  setRefreshTokenHash(id: string, hash: string | null, lastLoginAt?: Date): Promise<void>;
}
