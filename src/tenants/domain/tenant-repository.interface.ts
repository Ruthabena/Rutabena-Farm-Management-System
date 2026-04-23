import { Tenant, TenantSettings, TenantStatus } from '@prisma/client';
import { TenantListQueryDto } from '../dto/tenant-list-query.dto';
import { UpdateTenantDto } from '../dto/update-tenant.dto';
import { UpdateTenantSettingsDto } from '../dto/update-tenant-settings.dto';

export const TENANT_REPOSITORY = 'TENANT_REPOSITORY';

export type TenantWithSettings = Tenant & { settings: TenantSettings | null };

export interface ITenantRepository {
  findBySlug(slug: string): Promise<Tenant | null>;
  findById(id: string): Promise<TenantWithSettings | null>;
  findMany(query: TenantListQueryDto): Promise<{ items: TenantWithSettings[]; total: number }>;
  update(id: string, dto: UpdateTenantDto): Promise<TenantWithSettings>;
  upsertSettings(tenantId: string, dto: UpdateTenantSettingsDto): Promise<TenantSettings>;
  setStatus(id: string, status: TenantStatus): Promise<Tenant>;
}
