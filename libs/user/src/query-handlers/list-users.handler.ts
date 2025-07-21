// list-users.handler.ts
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { EntityManager } from '@mikro-orm/core';
import { ListUsersQuery } from '../queries/list-users.query';
import { User } from '../entities/user.entity';
import { UserResponseDto } from '../dto/user-response.dto';

interface ListUsersResult {
  data: UserResponseDto[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

@QueryHandler(ListUsersQuery)
export class ListUsersHandler
  implements IQueryHandler<ListUsersQuery, ListUsersResult>
{
  constructor(private readonly em: EntityManager) {}

  async execute(query: ListUsersQuery): Promise<ListUsersResult> {
    const { page, limit } = query;
    const offset = (page - 1) * limit;

    const [users, total] = await this.em.findAndCount(
      User,
      { isDeleted: false },
      {
        fields: ['id', 'email', 'firstName', 'lastName', 'avatar'],
        limit,
        offset,
      },
    );

    return {
      data: users.map((user) => ({
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        avatar: user.avatar,
      })),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
