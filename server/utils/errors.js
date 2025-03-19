export class NotFoundError extends Error {
    constructor(message) {
      super(message);
      this.name = 'NotFoundError';
      this.statusCode = 404;
    }
  }
  
  export class ValidationError extends Error {
    constructor(message) {
      super(message);
      this.name = 'ValidationError';
      this.statusCode = 400;
    }
  }
  
  export class DatabaseError extends Error {
    constructor(message) {
      super(message);
      this.name = 'DatabaseError';
      this.statusCode = 500;
    }
  }
  
  export class AuthorizationError extends Error {
    constructor(message) {
      super(message);
      this.name = 'AuthorizationError';
      this.statusCode = 403;
    }
  }
  
  export class RateLimitError extends Error {
    constructor(message) {
      super(message);
      this.name = 'RateLimitError';
      this.statusCode = 429;
    }
  }
  
  export class ApiConnectionError extends Error {
    constructor(message) {
      super(message);
      this.name = 'ApiConnectionError';
      this.statusCode = 503;
    }
  }