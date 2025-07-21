// delete-user.handler.ts
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { EntityManager } from '@mikro-orm/core';
import { EventBus } from '@nestjs/cqrs';
import { DeleteUserCommand } from '../commands/delete-user.command';
import { UserDeletedEvent } from '../entities/user-deleted.event';
import { User } from '../entities/user.entity';

@CommandHandler(DeleteUserCommand)
export class DeleteUserHandler implements ICommandHandler<DeleteUserCommand> {
  constructor(
    private readonly em: EntityManager,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: DeleteUserCommand): Promise<void> {
    const { userId } = command;
    const user = await this.em.findOne(User, userId);

    if (!user) {
      throw new Error('User not found');
    }

    user.isDeleted = true;
    await this.em.flush();

    this.eventBus.publish(new UserDeletedEvent(user.id));
  }
}
