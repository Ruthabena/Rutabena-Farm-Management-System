import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { TENANT_REPOSITORY } from './domain/tenant-repository.interface';
import { TenantsController } from './tenants.controller';
import { TenantsRepository } from './tenants.repository';
import { TenantsService } from './tenants.service';

@Module({
  imports: [PrismaModule],
  controllers: [TenantsController],
  providers: [
    TenantsService,
    { provide: TENANT_REPOSITORY, useClass: TenantsRepository },
  ],
  exports: [TenantsService],
})
export class TenantsModule {}
