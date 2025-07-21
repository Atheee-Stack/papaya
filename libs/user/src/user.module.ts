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
// Import event handlers if you have any

const CommandHandlers = [
  CreateUserHandler,
  UpdateUserHandler,
  DeleteUserHandler,
];
const QueryHandlers = [GetUserHandler, ListUsersHandler];
const EventHandlers = []; // Add your event handlers here if any

@Module({
  imports: [CqrsModule, MikroOrmModule.forFeature([User])],
  controllers: [UserController],
  providers: [
    UserService,
    ...CommandHandlers,
    ...QueryHandlers,
    ...EventHandlers,
  ],
  exports: [UserService],
})
export class UserModule {}
