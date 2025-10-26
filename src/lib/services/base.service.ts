/**
 * Base Service Class
 * Provides common functionality for all service classes
 */

import { db } from '@/src/lib/auth/db.server';

export class BaseService {
  protected db = db;

  /**
   * Verify that the user owns the resource
   * Throws UnauthorizedError if user doesn't own the resource
   */
  protected async verifyOwnership(
    userId: string,
    resourceUserId: string,
    resourceName: string
  ): Promise<void> {
    if (userId !== resourceUserId) {
      throw new UnauthorizedError(
        `User does not have permission to access this ${resourceName}`
      );
    }
  }

  /**
   * Verify that a resource exists
   * Throws NotFoundError if resource doesn't exist
   */
  protected verifyExists<T>(
    resource: T | undefined,
    resourceName: string
  ): asserts resource is T {
    if (!resource) {
      throw new NotFoundError(`${resourceName} not found`);
    }
  }
}

/**
 * Custom Error Classes
 */

export class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NotFoundError';
  }
}

export class UnauthorizedError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'UnauthorizedError';
  }
}

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class ConflictError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ConflictError';
  }
}

/**
 * Error handler utility
 * Converts service errors to HTTP responses
 */
export function getErrorStatus(error: Error): number {
  if (error instanceof NotFoundError) return 404;
  if (error instanceof UnauthorizedError) return 403;
  if (error instanceof ValidationError) return 400;
  if (error instanceof ConflictError) return 409;
  return 500;
}

export function getErrorMessage(error: Error): string {
  if (error instanceof NotFoundError) return error.message;
  if (error instanceof UnauthorizedError) return error.message;
  if (error instanceof ValidationError) return error.message;
  if (error instanceof ConflictError) return error.message;
  return 'Internal server error';
}

