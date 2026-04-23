import { PaginationQueryDto } from '../dto/pagination-query.dto';

export function buildPagination(query: PaginationQueryDto) {
  const page = query.page ?? 1;
  const limit = query.limit ?? 20;

  return {
    page,
    limit,
    skip: (page - 1) * limit,
    take: limit,
    sortOrder: query.sortOrder === 'asc' ? 'asc' : 'desc',
  } as const;
}
