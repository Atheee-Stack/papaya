import { Module, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_PIPE } from '@nestjs/core';
import { AuthModule } from '@papaya/common/auth/auth/auth.module';
import { DatabaseModule } from '@papaya/common/database/database.module';
import { LoggerModule } from '@papaya/common/logger/logger.module';
import { UserModule } from '@papaya/user';
import { ApiModule } from 'apps/api/src/api.module';

@Module({
  imports: [
    ApiModule, // TODO 优化 功能应在api实现
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),
    DatabaseModule,
    LoggerModule,
    AuthModule,
    UserModule,
  ],
  providers: [
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
  ],
})
export class AppModule {}
