import { Injectable, NestMiddleware } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NextFunction, Response } from 'express';
import { RequestWithUser } from '../interfaces/request-with-user.interface';

@Injectable()
export class TenantMiddleware implements NestMiddleware {
  constructor(private readonly configService: ConfigService) {}

  use(req: RequestWithUser, _res: Response, next: NextFunction) {
    const headerName =
      this.configService.get<string>('TENANT_HEADER') ?? 'x-tenant-id';
    const headerValue = req.headers[headerName] ?? req.headers[headerName.toLowerCase()];
    const tenantId = Array.isArray(headerValue) ? headerValue[0] : headerValue;

    if (typeof tenantId === 'string' && tenantId.trim().length > 0) {
      req.tenantId = tenantId.trim();
    }

    next();
  }
}
