import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { User } from './entities/user.entity';
import { UserController } from './controllers/user.controller';
import { UserService } from './services/user.service';
import { CreateUserHandler } from './command-handlers/create-user.handler';
import { UpdateUserHandler } from './command-handlers/update-user.handler';
import { DeleteUserHandler } from './command-handlers/delete-user.handler';
import { GetUserHandler } from './query-handlers/get-user.handler';
import { ListUsersHandler } from './query-handlers/list-users.handler';
import { JwtService } from '@nestjs/jwt';
import { AuthModule } from '@papaya/common/auth/auth/auth.module';
import { LoggerModule } from '@papaya/common/logger/logger.module';
import { LoginUserHandler } from './command-handlers/login-user.handler';
import { JwtAuthModule } from '@papaya/common/auth/jwt.module';
import { IsEmailUniqueConstraint } from '@papaya/common/validators/is-email-unique.validator';
import { IsUserExistPipe } from '@papaya/common/validators/is-user-exist.validator';

// Import event handlers if you have any

const CommandHandlers = [
  CreateUserHandler,
  UpdateUserHandler,
  DeleteUserHandler,
  LoginUserHandler,
];
const QueryHandlers = [GetUserHandler, ListUsersHandler];
const EventHandlers = []; // Add your event handlers here if any

@Module({
  imports: [
    CqrsModule,
    MikroOrmModule.forFeature([User]),
    AuthModule,
    LoggerModule,
    JwtAuthModule,
  ],
  controllers: [UserController],
  providers: [
    UserService,
    IsEmailUniqueConstraint,
    IsUserExistPipe,
    ...CommandHandlers,
    ...QueryHandlers,
    ...EventHandlers,
    JwtService,
    LoginUserHandler,
  ],
  exports: [UserService],
})
export class UserModule {}
