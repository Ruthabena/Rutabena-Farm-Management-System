import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { BCRYPT_SALT_ROUNDS } from '../common/constants/auth.constants';
import { buildListMeta } from '../common/prisma/prisma-query.helper';
import { AuthenticatedUser } from '../common/interfaces/request-with-user.interface';
import { requireTenantScope } from '../common/utils/tenant-scope.util';
import { sanitizeUser } from '../common/utils/user-sanitizer.util';
import { ChangeRoleDto } from './dto/change-role.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { ListUsersQueryDto } from './dto/list-users-query.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { IUserRepository, USER_REPOSITORY } from './domain/user-repository.interface';

@Injectable()
export class UsersService {
  constructor(@Inject(USER_REPOSITORY) private readonly users: IUserRepository) {}

  async create(dto: CreateUserDto, actor: AuthenticatedUser) {
    const tenantId = requireTenantScope(actor);

    const existingUser = await this.users.findByEmail(dto.email.toLowerCase());
    if (existingUser) throw new BadRequestException('Email already exists.');

    const user = await this.users.create(tenantId!, dto, actor.userId);
    return { message: 'User created successfully.', user: sanitizeUser(user) };
  }

  async findAll(actor: AuthenticatedUser, query: ListUsersQueryDto) {
    const tenantId = requireTenantScope(actor);
    const { items, total } = await this.users.findMany(tenantId, query);
    return { items: items.map(sanitizeUser), meta: buildListMeta(total, query) };
  }

  async findOne(id: string, actor: AuthenticatedUser) {
    const tenantId = requireTenantScope(actor);
    const user = await this.users.findById(id, tenantId);
    if (!user) throw new NotFoundException('User not found.');
    return sanitizeUser(user);
  }

  async update(id: string, dto: UpdateUserDto, actor: AuthenticatedUser) {
    await this.findOne(id, actor);

    const data: Prisma.UserUpdateInput = {
      ...(dto.email ? { email: dto.email.toLowerCase() } : {}),
      ...(dto.firstName !== undefined ? { firstName: dto.firstName } : {}),
      ...(dto.lastName !== undefined ? { lastName: dto.lastName } : {}),
      ...(dto.phone !== undefined ? { phone: dto.phone } : {}),
      ...(dto.jobTitle !== undefined ? { jobTitle: dto.jobTitle } : {}),
      ...(dto.role !== undefined ? { role: dto.role } : {}),
      ...(dto.password !== undefined
        ? { passwordHash: await bcrypt.hash(dto.password, BCRYPT_SALT_ROUNDS) }
        : {}),
    };

    const user = await this.users.update(id, data);
    return { message: 'User updated successfully.', user: sanitizeUser(user) };
  }

  async changeRole(id: string, dto: ChangeRoleDto, actor: AuthenticatedUser) {
    return this.update(id, { role: dto.role }, actor);
  }

  async deactivate(id: string, actor: AuthenticatedUser) {
    await this.findOne(id, actor);
    return this.users.deactivate(id);
  }
}
