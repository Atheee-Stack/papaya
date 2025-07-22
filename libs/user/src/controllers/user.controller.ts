import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  ParseIntPipe,
  DefaultValuePipe,
  BadRequestException,
  HttpStatus,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserService } from '../services/user.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UserResponseDto } from '../dto/user-response.dto';
import { PaginatedUsers } from '../interfaces/paginated-users.interface';
import { LoginUserDto } from '../dto/login-user.dto';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('login')
  @ApiOperation({ summary: 'Login user' })
  @ApiResponse({ status: 200, description: 'User logged in successfully' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(@Body() loginUserDto: LoginUserDto) {
    return this.userService.login(loginUserDto.email, loginUserDto.password);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'User created successfully',
    type: UserResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad request',
  })
  async create(@Body() createUserDto: CreateUserDto): Promise<UserResponseDto> {
    try {
      const result = await this.userService.createUser(
        createUserDto.email,
        createUserDto.password,
        createUserDto.firstName,
        createUserDto.lastName,
      );
      return result;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Bad request';
      throw new BadRequestException(message);
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User found',
    type: UserResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'User not found',
  })
  async findOne(@Param('id') id: string): Promise<UserResponseDto> {
    try {
      const user = await this.userService.getUser(id);
      return user;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'User not found';
      throw new BadRequestException(message);
    }
  }

  @Get()
  @ApiOperation({ summary: 'List all users' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Users listed',
    type: Object as () => PaginatedUsers, // Fix for type reference
  })
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
  ): Promise<PaginatedUsers> {
    if (page < 1 || limit < 1 || limit > 100) {
      throw new BadRequestException('Invalid pagination parameters');
    }

    try {
      const result = await this.userService.listUsers(page, limit);
      return result;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to list users';
      throw new BadRequestException(message);
    }
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update user' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User updated',
    type: UserResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'User not found',
  })
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    try {
      const result = await this.userService.updateUser(id, updateUserDto);
      return result;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to update user';
      throw new BadRequestException(message);
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete user' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User deleted',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'User not found',
  })
  async remove(@Param('id') id: string): Promise<void> {
    try {
      await this.userService.deleteUser(id);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to delete user';
      throw new BadRequestException(message);
    }
  }
}
