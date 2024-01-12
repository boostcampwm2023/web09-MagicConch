export class JwtError extends Error {
  readonly code: number;
  constructor({ code, message }: { code: number; message: string }) {
    super(message);
    this.code = code;
  }
}
