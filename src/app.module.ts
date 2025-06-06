import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { datasourceoptions } from 'db/data-source';
import { ConfigModule } from '@nestjs/config';
import { CurrentUserMiddleware } from './utility/common/middleware/current-user.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot(datasourceoptions),UsersModule],
  controllers: [],
  providers: [],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
    .apply(CurrentUserMiddleware)
    .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
