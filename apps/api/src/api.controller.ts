import { Controller, Get, Header } from '@nestjs/common';
import { ApiService } from './api.service';

@Controller()
export class ApiController {
  constructor(private readonly apiService: ApiService) {}

  @Get()
  @Header('Cache-Control', 'no-store') // Disables caching
  getHello(): string {
    return this.apiService.getHello();
  }
}
