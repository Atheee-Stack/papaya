import { Entity, PrimaryKey, Property, Unique } from '@mikro-orm/core';
import { IsEmail, IsString, MinLength, MaxLength } from 'class-validator';
import { v4 } from 'uuid';

@Entity()
export class User {
  @PrimaryKey()
  id: string = v4();

  @Property()
  @Unique()
  @IsEmail()
  email: string;

  @Property()
  @IsString()
  @MinLength(8)
  @MaxLength(20)
  password: string;

  @Property()
  @IsString()
  @MinLength(2)
  firstName: string;

  @Property()
  @IsString()
  @MinLength(2)
  lastName: string;

  @Property({ nullable: true })
  avatar?: string;

  @Property({ default: false })
  isDeleted = false;

  @Property({ onCreate: () => new Date() })
  createdAt = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt = new Date();

  constructor(
    email: string,
    password: string,
    firstName: string,
    lastName: string,
  ) {
    this.email = email;
    this.password = password;
    this.firstName = firstName;
    this.lastName = lastName;
  }
}
