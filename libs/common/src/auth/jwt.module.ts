import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import authConfig from './auth.config';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule.forFeature(authConfig)],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const secret = config.get<string>('auth.jwtSecret');
        if (!secret) {
          throw new Error('JWT_SECRET is not configured');
        }
        return {
          secret,
          signOptions: {
            expiresIn: config.get<string>('auth.jwtExpiresIn'),
          },
        };
      },
    }),
  ],
  exports: [JwtModule],
})
export class JwtAuthModule {}
