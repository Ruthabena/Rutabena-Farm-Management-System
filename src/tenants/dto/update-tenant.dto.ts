import { PartialType } from '@nestjs/swagger';
import { OnboardTenantDto } from './onboard-tenant.dto';

export class UpdateTenantDto extends PartialType(OnboardTenantDto) {}
