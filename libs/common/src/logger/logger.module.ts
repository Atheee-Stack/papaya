import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LoggerModule as PinoLoggerModule } from 'nestjs-pino';
import pino from 'pino';

@Module({
  imports: [
    PinoLoggerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        pinoHttp: {
          level: configService.get('LOG_LEVEL') || 'info',
          transport:
            configService.get('NODE_ENV') !== 'production'
              ? {
                  target: 'pino-pretty',
                  options: {
                    colorize: true,
                    singleLine: true,
                    translateTime: 'yyyy-mm-dd HH:MM:ss.l',
                  },
                }
              : undefined,
        },
      }),
    }),
  ],
  providers: [
    {
      provide: 'PINO_LOGGER',
      useFactory: () => {
        return pino({
          level: process.env.LOG_LEVEL || 'info',
        });
      },
    },
  ],
  exports: ['PINO_LOGGER'],
})
export class LoggerModule {}
