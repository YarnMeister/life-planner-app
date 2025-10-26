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

// In-memory storage
const mockUsers: Array<typeof users.$inferSelect> = [];
const mockAuthCodes: Array<typeof authCodes.$inferSelect> = [];
const mockFailedAttempts: Array<typeof failedAuthAttempts.$inferSelect> = [];

// Simple ID generators
let userIdCounter = 1;
let authCodeIdCounter = 1;
let failedAttemptIdCounter = 1;

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
                // Get the table data
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

                // Apply basic filtering (this is simplified)
                // In a real implementation, you'd parse the condition properly
                const filtered = data.filter(() => true); // Simplified - always return all
                
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
                return resolve(data);
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
          console.log('🗄️  MOCK DB: Created user:', newUser.email);
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
          console.log('🗄️  MOCK DB: Created auth code for:', newCode.email);
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
          console.log('🗄️  MOCK DB: Logged failed attempt for:', newAttempt.email);
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
              // Update all matching codes
              mockAuthCodes.forEach(code => {
                Object.assign(code, data);
              });
              console.log('🗄️  MOCK DB: Updated auth code');
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
  console.log('🗄️  MOCK DB: Cleared all data');
}

// Log when mock DB is loaded
if (isMockDbEnabled()) {
  console.log('🗄️  MOCK DATABASE MODE ENABLED');
  console.log('⚠️  Data stored in memory - will be lost on restart');
  console.log('⚠️  DO NOT USE IN PRODUCTION');
}

