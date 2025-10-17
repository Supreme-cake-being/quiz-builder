const messageList: Record<number, string> = {
  400: "Bad Request",
  401: "Not authorized",
  403: "Forbidden",
  404: "Not Found",
  408: "Request Timeout",
  409: "Conflict",
};

class CustomError extends Error {
  status: number;

  constructor(status: number, message?: string) {
    super(message || messageList[status]);
    this.status = status;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export const HttpError = (status: number, message?: string) =>
  new CustomError(status, message);
