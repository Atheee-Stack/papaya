import { Injectable, NotFoundException } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateUserCommand } from '../commands/create-user.command';
import { DeleteUserCommand } from '../commands/delete-user.command';
import { UpdateUserCommand } from '../commands/update-user.command';
import { UpdateUserDto } from '../dto/update-user.dto';
import { GetUserQuery } from '../queries/get-user.query';
import { ListUsersQuery } from '../queries/list-users.query';
import { UserResponseDto } from '../dto/user-response.dto';
import { PaginatedUsers } from '../interfaces/paginated-users.interface';

@Injectable()
export class UserService {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  async createUser(
    email: string,
    password: string,
    firstName: string,
    lastName: string,
  ): Promise<UserResponseDto> {
    try {
      return await this.commandBus.execute<CreateUserCommand, UserResponseDto>(
        new CreateUserCommand(email, password, firstName, lastName),
      );
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Unknown error occurred';
      throw new Error(`Failed to create user: ${message}`);
    }
  }

  async getUser(userId: string): Promise<UserResponseDto> {
    try {
      const user = await this.queryBus.execute<GetUserQuery, UserResponseDto>(
        new GetUserQuery(userId),
      );
      if (!user) {
        throw new NotFoundException(`User with ID ${userId} not found`);
      }
      return user;
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Unknown error occurred';
      throw new Error(`Failed to get user: ${message}`);
    }
  }

  async listUsers(
    page: number = 1,
    limit: number = 10,
  ): Promise<PaginatedUsers> {
    try {
      if (page < 1) page = 1;
      if (limit < 1 || limit > 100) limit = 10;

      return await this.queryBus.execute<ListUsersQuery, PaginatedUsers>(
        new ListUsersQuery(page, limit),
      );
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Unknown error occurred';
      throw new Error(`Failed to list users: ${message}`);
    }
  }

  async updateUser(
    userId: string,
    updates: UpdateUserDto,
  ): Promise<UserResponseDto> {
    try {
      const user = await this.commandBus.execute<
        UpdateUserCommand,
        UserResponseDto
      >(
        new UpdateUserCommand(
          userId,
          updates.firstName,
          updates.lastName,
          updates.avatar,
        ),
      );
      if (!user) {
        throw new NotFoundException(`User with ID ${userId} not found`);
      }
      return user;
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Unknown error occurred';
      throw new Error(`Failed to update user: ${message}`);
    }
  }

  async deleteUser(userId: string): Promise<void> {
    try {
      await this.commandBus.execute<DeleteUserCommand, void>(
        new DeleteUserCommand(userId),
      );
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Unknown error occurred';
      throw new Error(`Failed to delete user: ${message}`);
    }
  }
}
