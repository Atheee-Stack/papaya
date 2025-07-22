import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import {
  ExtractJwt,
  Strategy,
  StrategyOptionsWithoutRequest,
} from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

// 1. 定义严格的 JWT Payload 类型
interface JwtPayload {
  sub: string; // 用户ID
  email: string;
  // 可以添加其他需要的字段
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    // 2. 确保 secretOrKey 不会是 undefined
    const secretOrKey = configService.get<string>('auth.jwtSecret');
    if (!secretOrKey) {
      throw new Error('JWT secret is not configured');
    }

    // 3. 创建正确的策略选项
    const options: StrategyOptionsWithoutRequest = {
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request) => {
          // 使用类型断言处理 cookies
          const reqWithCookies = request as {
            cookies?: Record<string, string>;
          };
          return reqWithCookies.cookies?.Authentication || null;
        },
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: false,
      secretOrKey,
    };

    super(options);
  }

  // 4. 虽然不需要 await 但保持 async 一致性
  // 使用 @ts-expect-error 禁用特定警告
  // eslint-disable-next-line @typescript-eslint/require-await
  async validate(
    payload: JwtPayload,
  ): Promise<{ userId: string; email: string }> {
    return { userId: payload.sub, email: payload.email };
  }
}
