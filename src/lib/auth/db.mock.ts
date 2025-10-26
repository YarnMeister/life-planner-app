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
  
  // Handle eq() conditions
  if (condition.sql && typeof condition.sql === 'string') {
    const sqlStr = condition.sql.toString();
    
    // Extract field name and check equality
    if (sqlStr.includes(' = ')) {
      // This is an eq() condition
      const field = Object.keys(condition)[0] || condition.column?.name;
      const value = condition.value?.value ?? condition.value;
      
      if (field && item[field] !== undefined) {
        return item[field] === value;
      }
    }
    
    // Handle gte() for date comparisons
    if (sqlStr.includes(' >= ')) {
      const field = Object.keys(condition)[0] || condition.column?.name;
      const value = condition.value?.value ?? condition.value;
      
      if (field && item[field] !== undefined) {
        const itemDate = new Date(item[field]).getTime();
        const compareDate = new Date(value).getTime();
        return itemDate >= compareDate;
      }
    }
  }
  
  // Handle and() conditions
  if (condition.operator === 'and' || (Array.isArray(condition) && condition.length > 1)) {
    const conditions = Array.isArray(condition) ? condition : condition.conditions || [];
    return conditions.every((cond: any) => evaluateCondition(item, cond));
  }
  
  // Handle or() conditions  
  if (condition.operator === 'or') {
    const conditions = condition.conditions || [];
    return conditions.some((cond: any) => evaluateCondition(item, cond));
  }
  
  // Fallback: try to match on common fields
  if (condition.email && item.email) {
    return item.email === condition.email;
  }
  
  if (condition.id && item.id) {
    return item.id === condition.id;
  }
  
  // Default: include item if we can't parse condition
  return true;
}

/**
 * Filter array by condition (supports eq, and, or, gte)
 */
function filterByCondition(data: any[], condition: any): any[] {
  if (!condition) return data;
  
  return data.filter(item => {
    // Handle drizzle-orm conditions
    if (typeof condition === 'function') {
      // Can't evaluate function conditions in mock
      return true;
    }
    
    // Handle object-based conditions
    if (condition && typeof condition === 'object') {
      // eq() condition
      if (condition.sql) {
        return evaluateCondition(item, condition);
      }
      
      // Direct field matching
      return Object.keys(condition).every(key => {
        if (key === 'sql' || key === 'operator') return true;
        return item[key] === condition[key];
      });
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
