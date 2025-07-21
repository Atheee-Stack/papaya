// get-user.handler.ts
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { EntityManager } from '@mikro-orm/core';
import { GetUserQuery } from '../queries/get-user.query';
import { User } from '../entities/user.entity';
import { UserResponseDto } from '../dto/user-response.dto';

@QueryHandler(GetUserQuery)
export class GetUserHandler
  implements IQueryHandler<GetUserQuery, UserResponseDto>
{
  constructor(private readonly em: EntityManager) {}

  async execute(query: GetUserQuery): Promise<UserResponseDto> {
    const user = await this.em.findOne(
      User,
      {
        id: query.userId,
        isDeleted: false,
      },
      {
        fields: ['id', 'email', 'firstName', 'lastName', 'avatar'],
      },
    );

    if (!user) {
      throw new Error('User not found');
    }

    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      avatar: user.avatar,
    };
  }
}
