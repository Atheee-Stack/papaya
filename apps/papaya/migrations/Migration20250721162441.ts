import { Migration } from '@mikro-orm/migrations';

export class Migration20250721162441 extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `create table "user" ("id" varchar(255) not null, "email" varchar(255) not null, "password" varchar(255) not null, "first_name" varchar(255) not null, "last_name" varchar(255) not null, "avatar" varchar(255) null, "is_deleted" boolean not null default false, "created_at" timestamptz not null, "updated_at" timestamptz not null, constraint "user_pkey" primary key ("id"));`,
    );
    this.addSql(
      `alter table "user" add constraint "user_email_unique" unique ("email");`,
    );
  }
}
