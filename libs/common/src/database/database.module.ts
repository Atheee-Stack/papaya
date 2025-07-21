import { MikroOrmModule } from '@mikro-orm/nestjs';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Global()
@Module({
  imports: [
    MikroOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        // 必须显式指定 driver
        driver: PostgreSqlDriver,
        // 数据库配置
        dbName: configService.get('DB_NAME'),
        user: configService.get('DB_USER'),
        password: configService.get('DB_PASSWORD'),
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        // 其他配置
        autoLoadEntities: true,
        migrations: {
          path: 'dist/migrations',
          pathTs: 'src/migrations',
        },
      }),
    }),
  ],
  // 正确导出方式
  providers: [
    {
      provide: 'MikroORM',
      useFactory: async (configService: ConfigService) => {
        return MikroOrmModule.forRoot({
          driver: PostgreSqlDriver,
          dbName: configService.get('DB_NAME'),
          user: configService.get('DB_USER'),
          password: configService.get('DB_PASSWORD'),
          host: configService.get('DB_HOST'),
          port: configService.get('DB_PORT'),
          autoLoadEntities: true,
          migrations: {
            path: 'dist/migrations',
            pathTs: 'src/migrations',
          },
        });
      },
      inject: [ConfigService],
    },
  ],
  exports: ['MikroORM'],
})
export class DatabaseModule {}
