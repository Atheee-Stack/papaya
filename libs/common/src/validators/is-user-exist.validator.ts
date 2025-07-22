import { Injectable, PipeTransform, BadRequestException } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/core';
import { User } from '@papaya/user/entities/user.entity';

@Injectable()
export class IsUserExistPipe implements PipeTransform {
  constructor(private readonly em: EntityManager) {}

  async transform(value: string) {
    const user = await this.em.findOne(User, { id: value, isDeleted: false });
    if (!user) {
      throw new BadRequestException('User not found');
    }
    return value;
  }
}
