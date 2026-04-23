import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { YIELD_REPOSITORY } from './domain/yield-repository.interface';
import { YieldsController } from './yields.controller';
import { YieldsRepository } from './yields.repository';
import { YieldsService } from './yields.service';

@Module({
  imports: [PrismaModule],
  controllers: [YieldsController],
  providers: [
    YieldsService,
    { provide: YIELD_REPOSITORY, useClass: YieldsRepository },
  ],
  exports: [YieldsService],
})
export class YieldsModule {}
