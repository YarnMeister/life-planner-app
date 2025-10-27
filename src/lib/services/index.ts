/**
 * Services Index
 * Exports all service classes and utilities
 */

// Error utilities (for API routes)
export function getErrorStatus(error: Error): number {
  if (error.message.includes('not found')) return 404;
  if (error.message.includes('Unauthorized')) return 401;
  if (error.message.includes('Cannot delete')) return 409;
  if (error.message.includes('Version mismatch')) return 409;
  return 500;
}

export function getErrorMessage(error: Error): string {
  return error.message || 'An unexpected error occurred';
}

// V2 Services
export { pillarsServiceV2 } from './pillars.service.v2';
export type { CreatePillarInput, UpdatePillarInput } from './pillars.service.v2';

export { themesServiceV2 } from './themes.service.v2';
export type { CreateThemeInput as CreateThemeInputV2, UpdateThemeInput as UpdateThemeInputV2 } from './themes.service.v2';

export { tasksServiceV2 } from './tasks.service.v2';
export type { CreateTaskInput as CreateTaskInputV2, UpdateTaskInput as UpdateTaskInputV2 } from './tasks.service.v2';

export { initializePlanningDocs, arePlanningDocsInitialized } from './user-init.service';
