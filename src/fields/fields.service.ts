import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { AuthenticatedUser } from '../common/interfaces/request-with-user.interface';
import { buildListMeta } from '../common/prisma/prisma-query.helper';
import { requireTenantScope } from '../common/utils/tenant-scope.util';
import { CreateFieldDto } from './dto/create-field.dto';
import { ListFieldsQueryDto } from './dto/list-fields-query.dto';
import { UpdateFieldDto } from './dto/update-field.dto';
import { FIELD_REPOSITORY, IFieldRepository } from './domain/field-repository.interface';

@Injectable()
export class FieldsService {
  constructor(@Inject(FIELD_REPOSITORY) private readonly fields: IFieldRepository) {}

  create(dto: CreateFieldDto, actor: AuthenticatedUser) {
    const tenantId = requireTenantScope(actor);
    return this.fields.create(tenantId!, dto);
  }

  async findAll(actor: AuthenticatedUser, query: ListFieldsQueryDto) {
    const tenantId = requireTenantScope(actor);
    const { items, total } = await this.fields.findMany(tenantId, query);
    return { items, meta: buildListMeta(total, query) };
  }

  async findOne(id: string, actor: AuthenticatedUser) {
    const tenantId = requireTenantScope(actor);
    const field = await this.fields.findById(id, tenantId);
    if (!field) throw new NotFoundException('Field not found.');
    return field;
  }

  async update(id: string, dto: UpdateFieldDto, actor: AuthenticatedUser) {
    await this.findOne(id, actor);
    return this.fields.update(id, dto);
  }

  async remove(id: string, actor: AuthenticatedUser) {
    await this.findOne(id, actor);
    return this.fields.softDelete(id);
  }
}
