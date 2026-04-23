import { Farm } from '@prisma/client';
import { CreateFarmDto } from '../dto/create-farm.dto';
import { ListFarmsQueryDto } from '../dto/list-farms-query.dto';
import { UpdateFarmDto } from '../dto/update-farm.dto';

export const FARM_REPOSITORY = 'FARM_REPOSITORY';

export interface IFarmRepository {
  create(tenantId: string, dto: CreateFarmDto): Promise<Farm>;
  findMany(tenantId: string | undefined, query: ListFarmsQueryDto): Promise<{ items: Farm[]; total: number }>;
  findById(id: string, tenantId: string | undefined): Promise<Farm | null>;
  update(id: string, dto: UpdateFarmDto): Promise<Farm>;
  softDelete(id: string): Promise<Farm>;
}
