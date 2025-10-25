/**
 * Normalize email address for consistent storage and lookup
 * Prevents case-variant duplicates (e.g., "User@Example.com" vs "user@example.com")
 * 
 * @param email - Raw email address from user input
 * @returns Normalized email (lowercase, trimmed)
 */
export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

