import { Season } from '@prisma/client';
import { CreateSeasonDto } from '../dto/create-season.dto';
import { ListSeasonsQueryDto } from '../dto/list-seasons-query.dto';
import { UpdateSeasonDto } from '../dto/update-season.dto';

export const SEASON_REPOSITORY = 'SEASON_REPOSITORY';

export interface ISeasonRepository {
  create(tenantId: string, dto: CreateSeasonDto): Promise<Season>;
  findMany(tenantId: string | undefined, query: ListSeasonsQueryDto): Promise<{ items: Season[]; total: number }>;
  findById(id: string, tenantId: string | undefined): Promise<Season | null>;
  update(id: string, dto: UpdateSeasonDto): Promise<Season>;
  softDelete(id: string): Promise<Season>;
}
