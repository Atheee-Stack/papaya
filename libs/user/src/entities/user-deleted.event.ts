// user-deleted.event.ts
export class UserDeletedEvent {
  constructor(public readonly userId: string) {}
}
