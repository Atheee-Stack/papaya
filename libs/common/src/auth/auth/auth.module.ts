import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import authConfig from '../auth.config';
import { JwtAuthModule } from '../jwt.module';
import { JwtStrategy } from '../strategies/jwt.strategy';

@Module({
  imports: [ConfigModule.forFeature(authConfig), JwtAuthModule],
  providers: [JwtStrategy],
  exports: [JwtAuthModule],
})
export class AuthModule {}
// TODO 修复错误500
