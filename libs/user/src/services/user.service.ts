import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateUserCommand } from '../commands/create-user.command';
import { DeleteUserCommand } from '../commands/delete-user.command';
import { UpdateUserCommand } from '../commands/update-user.command';
import { UpdateUserDto } from '../dto/update-user.dto';
import { GetUserQuery } from '../queries/get-user.query';
import { ListUsersQuery } from '../queries/list-users.query';
import { UserResponseDto } from '../dto/user-response.dto';
import { PaginatedUsers } from '../interfaces/paginated-users.interface';
import { LoginUserCommand } from '../commands/login-user.command';
import { AuthenticationFailedException } from '../exceptions/authentication-failed.exception';
import { LoginResponse } from '../interfaces/login-response.interface';
import { Logger } from 'pino';

@Injectable()
export class UserService {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    @Inject('PINO_LOGGER') private readonly logger: Logger,
  ) {}

  async createUser(
    email: string,
    password: string,
    firstName: string,
    lastName: string,
  ): Promise<UserResponseDto> {
    try {
      this.logger.info('Creating new user', { email });
      const result = await this.commandBus.execute<
        CreateUserCommand,
        UserResponseDto
      >(new CreateUserCommand(email, password, firstName, lastName));
      this.logger.info('User created successfully', { userId: result.id });
      return result;
    } catch (error: unknown) {
      this.logger.error('Failed to create user', {
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
      });
      const message =
        error instanceof Error ? error.message : 'Unknown error occurred';
      throw new Error(`Failed to create user: ${message}`);
    }
  }

  async getUser(userId: string): Promise<UserResponseDto> {
    try {
      this.logger.debug('Fetching user', { userId });
      const user = await this.queryBus.execute<GetUserQuery, UserResponseDto>(
        new GetUserQuery(userId),
      );
      if (!user) {
        this.logger.warn('User not found', { userId });
        throw new NotFoundException(`User with ID ${userId} not found`);
      }
      return user;
    } catch (error: unknown) {
      this.logger.error('Failed to get user', {
        userId,
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
      });
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

      this.logger.debug('Listing users', { page, limit });
      return await this.queryBus.execute<ListUsersQuery, PaginatedUsers>(
        new ListUsersQuery(page, limit),
      );
    } catch (error: unknown) {
      this.logger.error('Failed to list users', {
        page,
        limit,
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
      });
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
      this.logger.info('Updating user', { userId, updates });
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
        this.logger.warn('User not found for update', { userId });
        throw new NotFoundException(`User with ID ${userId} not found`);
      }
      this.logger.info('User updated successfully', { userId });
      return user;
    } catch (error: unknown) {
      this.logger.error('Failed to update user', {
        userId,
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
      });
      const message =
        error instanceof Error ? error.message : 'Unknown error occurred';
      throw new Error(`Failed to update user: ${message}`);
    }
  }

  async deleteUser(userId: string): Promise<void> {
    try {
      this.logger.info('Deleting user', { userId });
      await this.commandBus.execute<DeleteUserCommand, void>(
        new DeleteUserCommand(userId),
      );
      this.logger.info('User deleted successfully', { userId });
    } catch (error: unknown) {
      this.logger.error('Failed to delete user', {
        userId,
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
      });
      const message =
        error instanceof Error ? error.message : 'Unknown error occurred';
      throw new Error(`Failed to delete user: ${message}`);
    }
  }

  async login(email: string, password: string): Promise<LoginResponse> {
    try {
      this.logger.debug(`Attempting login for user: ${email}`);
      const result = await this.commandBus.execute<
        LoginUserCommand,
        LoginResponse
      >(new LoginUserCommand(email, password));
      this.logger.debug(`Login successful for user: ${email}`);
      return result;
    } catch (error: unknown) {
      this.logger.error(
        `Login failed for user: ${email}`,
        error instanceof Error ? error.stack : undefined,
      );
      const message =
        error instanceof Error ? error.message : 'Unknown error occurred';
      throw new AuthenticationFailedException(`Failed to login: ${message}`);
    }
  }
}
