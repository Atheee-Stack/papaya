// src/users/interfaces/paginated-users.interface.ts
import { UserResponseDto } from '../dto/user-response.dto';

export interface PaginatedUsers {
  data: UserResponseDto[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
