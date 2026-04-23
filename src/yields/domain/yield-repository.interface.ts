import { YieldRecord } from '@prisma/client';
import { CreateYieldRecordDto } from '../dto/create-yield-record.dto';
import { ListYieldRecordsQueryDto } from '../dto/list-yield-records-query.dto';
import { UpdateYieldRecordDto } from '../dto/update-yield-record.dto';

export const YIELD_REPOSITORY = 'YIELD_REPOSITORY';

export interface IYieldRepository {
  create(tenantId: string, dto: CreateYieldRecordDto): Promise<YieldRecord>;
  findMany(tenantId: string | undefined, query: ListYieldRecordsQueryDto): Promise<{ items: YieldRecord[]; total: number }>;
  findById(id: string, tenantId: string | undefined): Promise<YieldRecord | null>;
  update(id: string, dto: UpdateYieldRecordDto): Promise<YieldRecord>;
  softDelete(id: string): Promise<YieldRecord>;
}
