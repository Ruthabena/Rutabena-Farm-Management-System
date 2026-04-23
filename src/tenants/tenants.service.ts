import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { TenantStatus, UserRole, UserStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { BCRYPT_SALT_ROUNDS } from '../common/constants/auth.constants';
import { AuthenticatedUser } from '../common/interfaces/request-with-user.interface';
import { PrismaService } from '../prisma/prisma.service';
import { buildListMeta } from '../common/prisma/prisma-query.helper';
import { sanitizeUser } from '../common/utils/user-sanitizer.util';
import { OnboardTenantDto } from './dto/onboard-tenant.dto';
import { TenantListQueryDto } from './dto/tenant-list-query.dto';
import { UpdateTenantDto } from './dto/update-tenant.dto';
import { UpdateTenantSettingsDto } from './dto/update-tenant-settings.dto';
import { ITenantRepository, TENANT_REPOSITORY } from './domain/tenant-repository.interface';

@Injectable()
export class TenantsService {
  constructor(
    @Inject(TENANT_REPOSITORY) private readonly tenants: ITenantRepository,
    private readonly prisma: PrismaService,
  ) {}

  async onboard(dto: OnboardTenantDto) {
    const slug = dto.slug.trim().toLowerCase();
    const ownerEmail = dto.ownerEmail.trim().toLowerCase();

    const [existingTenant, existingUser] = await Promise.all([
      this.tenants.findBySlug(slug),
      this.prisma.user.findUnique({ where: { email: ownerEmail } }),
    ]);

    if (existingTenant) throw new BadRequestException('Tenant slug already exists.');
    if (existingUser) throw new BadRequestException('Owner email already exists.');

    return this.prisma.$transaction(async (tx) => {
      const tenant = await tx.tenant.create({
        data: {
          name: dto.name,
          slug,
          legalName: dto.legalName,
          email: dto.email,
          phone: dto.phone,
          country: dto.country,
          state: dto.state,
          city: dto.city,
          address: dto.address,
          settings: { create: {} },
        },
        include: { settings: true },
      });

      const owner = await tx.user.create({
        data: {
          tenantId: tenant.id,
          email: ownerEmail,
          passwordHash: await bcrypt.hash(dto.ownerPassword, BCRYPT_SALT_ROUNDS),
          firstName: dto.ownerFirstName,
          lastName: dto.ownerLastName,
          phone: dto.ownerPhone,
          role: UserRole.TENANT_OWNER,
          status: UserStatus.ACTIVE,
        },
      });

      return {
        message: 'Tenant onboarded successfully.',
        tenant,
        owner: sanitizeUser(owner),
      };
    });
  }

  async findAll(query: TenantListQueryDto) {
    const { items, total } = await this.tenants.findMany(query);
    return { items, meta: buildListMeta(total, query) };
  }

  async findOne(id: string) {
    const tenant = await this.tenants.findById(id);
    if (!tenant) throw new NotFoundException('Tenant not found.');
    return tenant;
  }

  async getAccessibleTenant(id: string, actor: AuthenticatedUser) {
    if (actor.role !== UserRole.SUPER_ADMIN) {
      if (!actor.tenantId || actor.tenantId !== id) {
        throw new ForbiddenException('Cross-tenant access is not allowed.');
      }
    }

    return this.findOne(id);
  }

  async update(id: string, dto: UpdateTenantDto, actor: AuthenticatedUser) {
    await this.getAccessibleTenant(id, actor);
    return this.tenants.update(id, dto);
  }

  async updateSettings(tenantId: string, dto: UpdateTenantSettingsDto, actor: AuthenticatedUser) {
    await this.getAccessibleTenant(tenantId, actor);
    return this.tenants.upsertSettings(tenantId, dto);
  }

  async setStatus(id: string, status: TenantStatus) {
    await this.findOne(id);
    return this.tenants.setStatus(id, status);
  }
}
