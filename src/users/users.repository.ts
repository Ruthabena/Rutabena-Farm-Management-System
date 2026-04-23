import { Injectable } from '@nestjs/common';
import { Prisma, Tenant, User, UserStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { BCRYPT_SALT_ROUNDS } from '../common/constants/auth.constants';
import { INSENSITIVE_MODE } from '../common/constants/prisma.constants';
import { buildPagination } from '../common/utils/pagination.util';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ListUsersQueryDto } from './dto/list-users-query.dto';
import { IUserRepository } from './domain/user-repository.interface';

@Injectable()
export class UsersRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaService) {}

  findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }

  findActiveByEmailWithTenant(email: string): Promise<(User & { tenant: Tenant | null }) | null> {
    return this.prisma.user.findFirst({
      where: { email, deletedAt: null, isActive: true },
      include: { tenant: true },
    });
  }

  findActiveById(id: string): Promise<User | null> {
    return this.prisma.user.findFirst({ where: { id, deletedAt: null, isActive: true } });
  }

  async create(tenantId: string, dto: CreateUserDto, createdById: string): Promise<User> {
    return this.prisma.user.create({
      data: {
        tenantId,
        email: dto.email.toLowerCase(),
        passwordHash: await bcrypt.hash(dto.password, BCRYPT_SALT_ROUNDS),
        firstName: dto.firstName,
        lastName: dto.lastName,
        phone: dto.phone,
        jobTitle: dto.jobTitle,
        role: dto.role,
        status: UserStatus.ACTIVE,
        createdById,
      },
    });
  }

  async findMany(
    tenantId: string | undefined,
    query: ListUsersQueryDto,
  ): Promise<{ items: User[]; total: number }> {
    const { skip, take, sortOrder } = buildPagination(query);
    const where = {
      tenantId,
      deletedAt: null,
      ...(query.role ? { role: query.role } : {}),
      ...(query.status ? { status: query.status } : {}),
      ...(query.search
        ? {
            OR: [
              { firstName: { contains: query.search, mode: INSENSITIVE_MODE } },
              { lastName: { contains: query.search, mode: INSENSITIVE_MODE } },
              { email: { contains: query.search, mode: INSENSITIVE_MODE } },
            ],
          }
        : {}),
    };

    const [items, total] = await Promise.all([
      this.prisma.user.findMany({ where, skip, take, orderBy: { createdAt: sortOrder } }),
      this.prisma.user.count({ where }),
    ]);

    return { items, total };
  }

  findById(id: string, tenantId: string | undefined): Promise<User | null> {
    return this.prisma.user.findFirst({ where: { id, tenantId, deletedAt: null } });
  }

  update(id: string, data: Prisma.UserUpdateInput): Promise<User> {
    return this.prisma.user.update({ where: { id }, data });
  }

  deactivate(id: string): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data: { status: UserStatus.INACTIVE, isActive: false, deletedAt: new Date() },
    });
  }

  async setRefreshTokenHash(id: string, hash: string | null, lastLoginAt?: Date): Promise<void> {
    await this.prisma.user.update({
      where: { id },
      data: {
        refreshTokenHash: hash,
        ...(lastLoginAt ? { lastLoginAt } : {}),
      },
    });
  }
}
