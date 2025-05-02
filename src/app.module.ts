import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { datasourceoptions } from 'db/data-source';

@Module({
  imports: [TypeOrmModule.forRoot(datasourceoptions),UsersModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
