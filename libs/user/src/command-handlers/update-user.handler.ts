import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { EntityManager } from '@mikro-orm/core';
import { EventBus } from '@nestjs/cqrs';
import { UpdateUserCommand } from '../commands/update-user.command';
import { User } from '../entities/user.entity';
import { UserResponseDto } from '../dto/user-response.dto';
import { UserUpdatedEvent } from '../entities/user-updated.event';

@CommandHandler(UpdateUserCommand)
export class UpdateUserHandler
  implements ICommandHandler<UpdateUserCommand, UserResponseDto>
{
  constructor(
    private readonly em: EntityManager,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: UpdateUserCommand): Promise<UserResponseDto> {
    const { userId, firstName, lastName, avatar } = command;
    const user = await this.em.findOne(User, userId);

    if (!user) {
      throw new Error('User not found');
    }

    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (avatar) user.avatar = avatar;

    await this.em.flush();
    this.eventBus.publish(new UserUpdatedEvent(user.id));

    // 返回更新后的用户数据
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      avatar: user.avatar,
    };
  }
}
