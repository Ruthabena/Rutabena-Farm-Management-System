import { Field } from '@prisma/client';
import { CreateFieldDto } from '../dto/create-field.dto';
import { ListFieldsQueryDto } from '../dto/list-fields-query.dto';
import { UpdateFieldDto } from '../dto/update-field.dto';

export const FIELD_REPOSITORY = 'FIELD_REPOSITORY';

export interface IFieldRepository {
  create(tenantId: string, dto: CreateFieldDto): Promise<Field>;
  findMany(tenantId: string | undefined, query: ListFieldsQueryDto): Promise<{ items: Field[]; total: number }>;
  findById(id: string, tenantId: string | undefined): Promise<Field | null>;
  update(id: string, dto: UpdateFieldDto): Promise<Field>;
  softDelete(id: string): Promise<Field>;
}
