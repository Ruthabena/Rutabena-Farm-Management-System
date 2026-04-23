import { PrismaClient, TenantStatus, UserRole, UserStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const superAdminEmail = 'superadmin@platform.local';
  const superAdminPasswordHash = await bcrypt.hash('Password123!', 10);

  await prisma.user.upsert({
    where: { email: superAdminEmail },
    update: {
      firstName: 'Platform',
      lastName: 'Admin',
      passwordHash: superAdminPasswordHash,
      role: UserRole.SUPER_ADMIN,
      status: UserStatus.ACTIVE,
      isActive: true,
    },
    create: {
      email: superAdminEmail,
      firstName: 'Platform',
      lastName: 'Admin',
      passwordHash: superAdminPasswordHash,
      role: UserRole.SUPER_ADMIN,
      status: UserStatus.ACTIVE,
      isActive: true,
    },
  });

  const tenantSlug = 'green-harvest';
  const ownerEmail = 'owner@greenharvest.com';
  const ownerPasswordHash = await bcrypt.hash('Password123!', 10);

  const tenant = await prisma.tenant.upsert({
    where: { slug: tenantSlug },
    update: {
      name: 'Green Harvest Cooperative',
      status: TenantStatus.ACTIVE,
      isActive: true,
    },
    create: {
      name: 'Green Harvest Cooperative',
      slug: tenantSlug,
      legalName: 'Green Harvest Cooperative Ltd',
      email: 'info@greenharvest.com',
      phone: '+2348000000000',
      country: 'Nigeria',
      state: 'Ogun',
      city: 'Abeokuta',
      address: 'Farm Estate Road',
      status: TenantStatus.ACTIVE,
      isActive: true,
      settings: {
        create: {
          currency: 'NGN',
          timezone: 'Africa/Lagos',
          financialYearStartMonth: 1,
          dateFormat: 'YYYY-MM-DD',
        },
      },
    },
  });

  await prisma.user.upsert({
    where: { email: ownerEmail },
    update: {
      tenantId: tenant.id,
      firstName: 'Tenant',
      lastName: 'Owner',
      passwordHash: ownerPasswordHash,
      role: UserRole.TENANT_OWNER,
      status: UserStatus.ACTIVE,
      isActive: true,
    },
    create: {
      tenantId: tenant.id,
      email: ownerEmail,
      firstName: 'Tenant',
      lastName: 'Owner',
      passwordHash: ownerPasswordHash,
      role: UserRole.TENANT_OWNER,
      status: UserStatus.ACTIVE,
      isActive: true,
    },
  });

  console.log('Seed completed successfully.');
}

main()
  .catch((error) => {
    console.error('Seed failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
