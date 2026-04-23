import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { USER_REPOSITORY } from './domain/user-repository.interface';
import { UsersController } from './users.controller';
import { UsersRepository } from './users.repository';
import { UsersService } from './users.service';

@Module({
  imports: [PrismaModule],
  controllers: [UsersController],
  providers: [
    UsersService,
    { provide: USER_REPOSITORY, useClass: UsersRepository },
  ],
  exports: [UsersService, USER_REPOSITORY],
})
export class UsersModule {}
