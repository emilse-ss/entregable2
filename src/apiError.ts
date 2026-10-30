export class ApiError extends Error {
  public readonly statusCode: number;
  public readonly status: number;

  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
    this.status = statusCode;
    this.name = "ApiError";
  }
}