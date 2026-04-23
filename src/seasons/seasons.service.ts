import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { AuthenticatedUser } from '../common/interfaces/request-with-user.interface';
import { buildListMeta } from '../common/prisma/prisma-query.helper';
import { requireTenantScope } from '../common/utils/tenant-scope.util';
import { CreateSeasonDto } from './dto/create-season.dto';
import { ListSeasonsQueryDto } from './dto/list-seasons-query.dto';
import { UpdateSeasonDto } from './dto/update-season.dto';
import { ISeasonRepository, SEASON_REPOSITORY } from './domain/season-repository.interface';

@Injectable()
export class SeasonsService {
  constructor(@Inject(SEASON_REPOSITORY) private readonly seasons: ISeasonRepository) {}

  create(dto: CreateSeasonDto, actor: AuthenticatedUser) {
    const tenantId = requireTenantScope(actor);
    return this.seasons.create(tenantId!, dto);
  }

  async findAll(actor: AuthenticatedUser, query: ListSeasonsQueryDto) {
    const tenantId = requireTenantScope(actor);
    const { items, total } = await this.seasons.findMany(tenantId, query);
    return { items, meta: buildListMeta(total, query) };
  }

  async findOne(id: string, actor: AuthenticatedUser) {
    const tenantId = requireTenantScope(actor);
    const season = await this.seasons.findById(id, tenantId);
    if (!season) throw new NotFoundException('Season not found.');
    return season;
  }

  async update(id: string, dto: UpdateSeasonDto, actor: AuthenticatedUser) {
    await this.findOne(id, actor);
    return this.seasons.update(id, dto);
  }

  async remove(id: string, actor: AuthenticatedUser) {
    await this.findOne(id, actor);
    return this.seasons.softDelete(id);
  }
}
