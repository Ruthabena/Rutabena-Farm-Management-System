import { PaginationQueryDto } from '../dto/pagination-query.dto';
import { buildPagination } from '../utils/pagination.util';

export function buildListMeta(total: number, query: PaginationQueryDto) {
  const { page, limit } = buildPagination(query);

  return {
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}
