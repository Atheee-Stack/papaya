export class AuthenticationFailedException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AuthenticationFailedException';
  }
}
