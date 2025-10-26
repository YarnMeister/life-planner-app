/**
 * Mock Database for Development/Testing
 * 
 * This provides an in-memory implementation of database operations
 * for testing the template without a real database.
 * 
 * Data is stored in memory and lost on server restart.
 * DO NOT USE IN PRODUCTION.
 */

import { users, authCodes, failedAuthAttempts } from '../../../drizzle/schema';
import { eq, and, or, gte } from 'drizzle-orm';

// In-memory storage
const mockUsers: Array<typeof users.$inferSelect> = [];
const mockAuthCodes: Array<typeof authCodes.$inferSelect> = [];
const mockFailedAttempts: Array<typeof failedAuthAttempts.$inferSelect> = [];

// Simple ID generators
let userIdCounter = 1;
let authCodeIdCounter = 1;
let failedAttemptIdCounter = 1;

/**
 * Simple condition evaluator for mock DB
 * Supports: eq(), and(), or(), gte() for common auth queries
 */
function evaluateCondition(item: any, condition: any): boolean {
  if (!condition) return true;
  
  // Handle Drizzle SQL conditions by inspecting the structure
  const conditionType = condition?._?.$brand;
  
  // Handle and() - has children array
  if (condition?._ && Array.isArray(condition._)) {
    // This is an and() condition with multiple children
    return condition._.every((child: any) => evaluateCondition(item, child));
  }
  
  // Handle or() - similar structure
  if (condition?.operator === 'or' && Array.isArray(condition?.conditions)) {
    return condition.conditions.some((child: any) => evaluateCondition(item, child));
  }
  
  // Handle eq() - check if left side matches item field and right side matches value
  if (condition?.left && condition?.right !== undefined) {
    const fieldName = condition.left?.name || condition.left?.fieldName;
    const compareValue = condition.right?.value ?? condition.right;
    
    if (fieldName && item[fieldName] !== undefined) {
      return item[fieldName] === compareValue;
    }
  }
  
  // Handle gte() for date comparisons
  if (condition?.operator === '>=' || (condition?.left && condition?.right && condition?.operator)) {
    const fieldName = condition.left?.name || condition.left?.fieldName;
    const compareValue = condition.right?.value ?? condition.right;
    
    if (fieldName && item[fieldName] !== undefined) {
      // Handle date comparisons
      if (compareValue instanceof Date || item[fieldName] instanceof Date) {
        const itemDate = new Date(item[fieldName]).getTime();
        const compareDate = new Date(compareValue).getTime();
        
        if (condition.operator === '>=') return itemDate >= compareDate;
        if (condition.operator === '>') return itemDate > compareDate;
        if (condition.operator === '<=') return itemDate <= compareDate;
        if (condition.operator === '<') return itemDate < compareDate;
      }
      
      // Handle numeric/string comparisons
      if (condition.operator === '>=') return item[fieldName] >= compareValue;
      if (condition.operator === '>') return item[fieldName] > compareValue;
      if (condition.operator === '<=') return item[fieldName] <= compareValue;
      if (condition.operator === '<') return item[fieldName] < compareValue;
      if (condition.operator === '=') return item[fieldName] === compareValue;
    }
  }
  
  // Default: include item if we can't parse condition
  console.warn('Mock DB: Unhandled condition structure:', JSON.stringify(condition, null, 2));
  return true;
}

/**
 * Filter array by condition (supports eq, and, or, gte)
 */
function filterByCondition(data: any[], condition: any): any[] {
  if (!condition) return data;
  
  // Debug: log condition structure in dev
  if (process.env.NODE_ENV !== 'production') {
    console.log('🗄️  MOCK DB: Filtering', data.length, 'items with condition type:', condition?.constructor?.name || typeof condition);
  }
  
  return data.filter(item => {
    // Handle drizzle-orm conditions
    if (typeof condition === 'function') {
      // Can't evaluate function conditions in mock
      return true;
    }
    
    // Handle object-based conditions
    if (condition && typeof condition === 'object') {
      const result = evaluateCondition(item, condition);
      return result;
    }
    
    return true;
  });
}

/**
 * Mock implementation of Drizzle ORM operations
 */
export const mockDb = {
  select(fields?: any) {
    return {
      from(table: any) {
        return {
          where(condition: any) {
            return {
              limit(count: number) {
                let data: any[];
                if (table === users) {
                  data = mockUsers;
                } else if (table === authCodes) {
                  data = mockAuthCodes;
                } else if (table === failedAuthAttempts) {
                  data = mockFailedAttempts;
                } else {
                  data = [];
                }

                const filtered = filterByCondition(data, condition);
                return Promise.resolve(filtered.slice(0, count));
              },
              async then(resolve: any) {
                let data: any[];
                if (table === users) {
                  data = mockUsers;
                } else if (table === authCodes) {
                  data = mockAuthCodes;
                } else if (table === failedAuthAttempts) {
                  data = mockFailedAttempts;
                } else {
                  data = [];
                }
                
                const filtered = filterByCondition(data, condition);
                return resolve(filtered);
              }
            };
          },
        };
      },
    };
  },

  insert(table: any) {
    return {
      values(data: any) {
        const timestamp = new Date();
        
        if (table === users) {
          const newUser = {
            id: `user_${userIdCounter++}`,
            email: data.email,
            createdAt: timestamp,
            updatedAt: timestamp,
          };
          mockUsers.push(newUser);
          if (process.env.NODE_ENV !== 'production') {
            console.log('🗄️  MOCK DB: Created user:', newUser.email);
          }
          return Promise.resolve([newUser]);
        }
        
        if (table === authCodes) {
          const newCode = {
            id: `code_${authCodeIdCounter++}`,
            email: data.email,
            code: data.code,
            ipAddress: data.ipAddress,
            expiresAt: data.expiresAt,
            used: data.used,
            createdAt: timestamp,
          };
          mockAuthCodes.push(newCode);
          if (process.env.NODE_ENV !== 'production') {
            console.log('🗄️  MOCK DB: Created auth code for:', newCode.email);
          }
          return Promise.resolve([newCode]);
        }
        
        if (table === failedAuthAttempts) {
          const newAttempt = {
            id: `attempt_${failedAttemptIdCounter++}`,
            email: data.email,
            ipAddress: data.ipAddress,
            attemptedAt: timestamp,
          };
          mockFailedAttempts.push(newAttempt);
          if (process.env.NODE_ENV !== 'production') {
            console.log('🗄️  MOCK DB: Logged failed attempt for:', newAttempt.email);
          }
          return Promise.resolve([newAttempt]);
        }
        
        return Promise.resolve([]);
      },
    };
  },

  update(table: any) {
    return {
      set(data: any) {
        return {
          where(condition: any) {
            if (table === authCodes) {
              // Find matching codes and update only those
              const matchingIndices: number[] = [];
              mockAuthCodes.forEach((code, index) => {
                if (evaluateCondition(code, condition)) {
                  matchingIndices.push(index);
                }
              });
              
              // Update only matching rows
              matchingIndices.forEach(index => {
                Object.assign(mockAuthCodes[index], data);
              });
              
              if (process.env.NODE_ENV !== 'production' && matchingIndices.length > 0) {
                console.log(`🗄️  MOCK DB: Updated ${matchingIndices.length} auth code(s)`);
              }
            }
            return Promise.resolve([]);
          },
        };
      },
    };
  },
};

/**
 * Helper to check if mock DB mode is enabled
 */
export function isMockDbEnabled(): boolean {
  const dbUrl = process.env.DATABASE_URL || '';
  return dbUrl.startsWith('mock://') || dbUrl === 'mock';
}

/**
 * Clear all mock data (useful for testing)
 */
export function clearMockDb() {
  mockUsers.length = 0;
  mockAuthCodes.length = 0;
  mockFailedAttempts.length = 0;
  userIdCounter = 1;
  authCodeIdCounter = 1;
  failedAttemptIdCounter = 1;
  if (process.env.NODE_ENV !== 'production') {
    console.log('🗄️  MOCK DB: Cleared all data');
  }
}

// Log when mock DB is loaded
if (isMockDbEnabled()) {
  if (process.env.NODE_ENV !== 'production') {
    console.log('🗄️  MOCK DATABASE MODE ENABLED');
    console.log('⚠️  Data stored in memory - will be lost on restart');
    console.log('⚠️  DO NOT USE IN PRODUCTION');
  }
}
