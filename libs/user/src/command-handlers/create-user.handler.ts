import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { EntityManager } from '@mikro-orm/core';
import { EventBus } from '@nestjs/cqrs';
import * as bcrypt from 'bcrypt';
import { CreateUserCommand } from '../commands/create-user.command';
import { User } from '../entities/user.entity';
import { UserCreatedEvent } from '../events/user-created.event';
import { UserResponseDto } from '../dto/user-response.dto';

@CommandHandler(CreateUserCommand)
export class CreateUserHandler
  implements ICommandHandler<CreateUserCommand, UserResponseDto>
{
  constructor(
    private readonly em: EntityManager,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: CreateUserCommand): Promise<UserResponseDto> {
    const { email, password, firstName, lastName } = command;

    // 添加盐值轮数配置
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const user = new User(email, hashedPassword, firstName, lastName);

    await this.em.persistAndFlush(user);

    this.eventBus.publish(new UserCreatedEvent(user.id, user.email));

    // 使用明确的类型转换
    const userResponse: UserResponseDto = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      avatar: user.avatar || undefined, // 明确处理可能的undefined
    };

    return userResponse;
  }
}
