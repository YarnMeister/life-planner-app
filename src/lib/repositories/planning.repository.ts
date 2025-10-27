import { eq, and } from 'drizzle-orm';
import { db } from '@/lib/auth/db.server';
import { planningDoc } from '@/drizzle/schema';
import { 
  PlanningDocKind, 
  PillarsDoc, 
  ThemesDoc, 
  TasksDoc,
  PlanningDocument 
} from '@/types/planning.types';
import { 
  zPillarsDoc, 
  zThemesDoc, 
  zTasksDoc,
  zJsonPatch 
} from '@/lib/validation/planning.schemas';
import { applyPatch, Operation } from 'fast-json-patch';

// ============================================================================
// ERROR TYPES
// ============================================================================

export class DocumentNotFoundError extends Error {
  constructor(kind: PlanningDocKind) {
    super(`${kind} document not found`);
    this.name = 'DocumentNotFoundError';
  }
}

export class VersionMismatchError extends Error {
  constructor(expected: number, actual: number) {
    super(`Version mismatch: expected ${expected}, got ${actual}`);
    this.name = 'VersionMismatchError';
  }
}

export class ValidationError extends Error {
  constructor(message: string, public details?: unknown) {
    super(message);
    this.name = 'ValidationError';
  }
}

// ============================================================================
// REPOSITORY CLASS
// ============================================================================

export class PlanningRepository {
  /**
   * Get a planning document by kind
   */
  async getDoc<T = PillarsDoc | ThemesDoc | TasksDoc>(
    userId: string,
    kind: PlanningDocKind
  ): Promise<PlanningDocument<T> | null> {
    const row = await db.query.planningDoc.findFirst({
      where: and(
        eq(planningDoc.userId, userId),
        eq(planningDoc.kind, kind)
      ),
    });

    if (!row) return null;

    return {
      id: row.id,
      userId: row.userId,
      kind: row.kind as PlanningDocKind,
      data: row.data as T,
      version: row.version,
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
    };
  }

  /**
   * Create a new planning document
   */
  async createDoc<T = PillarsDoc | ThemesDoc | TasksDoc>(
    userId: string,
    kind: PlanningDocKind,
    data: T
  ): Promise<PlanningDocument<T>> {
    // Validate data
    this.validateDoc(kind, data);

    const result = await db
      .insert(planningDoc)
      .values({
        userId,
        kind,
        data: data as any,
        version: 1,
      })
      .returning();

    const row = result[0];
    return {
      id: row.id,
      userId: row.userId,
      kind: row.kind as PlanningDocKind,
      data: row.data as T,
      version: row.version,
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
    };
  }

  /**
   * Replace entire document (with optimistic locking)
   */
  async replaceDoc<T = PillarsDoc | ThemesDoc | TasksDoc>(
    userId: string,
    kind: PlanningDocKind,
    data: T,
    expectedVersion: number
  ): Promise<PlanningDocument<T>> {
    // Validate data
    this.validateDoc(kind, data);

    return db.transaction(async (tx) => {
      // Lock and fetch current version
      const current = await tx.query.planningDoc.findFirst({
        where: and(
          eq(planningDoc.userId, userId),
          eq(planningDoc.kind, kind)
        ),
        // @ts-ignore - Drizzle typing issue with 'for'
        for: 'update',
      });

      if (!current) {
        throw new DocumentNotFoundError(kind);
      }

      if (current.version !== expectedVersion) {
        throw new VersionMismatchError(expectedVersion, current.version);
      }

      const nextVersion = current.version + 1;

      const result = await tx
        .update(planningDoc)
        .set({
          data: data as any,
          version: nextVersion,
          updatedAt: new Date(),
        })
        .where(
          and(
            eq(planningDoc.userId, userId),
            eq(planningDoc.kind, kind)
          )
        )
        .returning();

      const row = result[0];
      return {
        id: row.id,
        userId: row.userId,
        kind: row.kind as PlanningDocKind,
        data: row.data as T,
        version: row.version,
        createdAt: row.createdAt.toISOString(),
        updatedAt: row.updatedAt.toISOString(),
      };
    });
  }

  /**
   * Apply JSON Patch operations (RFC-6902)
   */
  async patchDoc<T = PillarsDoc | ThemesDoc | TasksDoc>(
    userId: string,
    kind: PlanningDocKind,
    patch: Operation[],
    expectedVersion: number
  ): Promise<PlanningDocument<T>> {
    // Validate patch format
    const validationResult = zJsonPatch.safeParse(patch);
    if (!validationResult.success) {
      throw new ValidationError('Invalid JSON Patch', validationResult.error);
    }

    return db.transaction(async (tx) => {
      // Lock and fetch current version
      const current = await tx.query.planningDoc.findFirst({
        where: and(
          eq(planningDoc.userId, userId),
          eq(planningDoc.kind, kind)
        ),
        // @ts-ignore
        for: 'update',
      });

      if (!current) {
        throw new DocumentNotFoundError(kind);
      }

      if (current.version !== expectedVersion) {
        throw new VersionMismatchError(expectedVersion, current.version);
      }

      // Apply patch
      const patchResult = applyPatch(
        structuredClone(current.data),
        patch,
        true, // validate
        false // mutate (we're using a clone)
      );

      if (patchResult.newDocument === undefined) {
        throw new ValidationError('Patch application failed');
      }

      const newData = patchResult.newDocument as T;

      // Validate result
      this.validateDoc(kind, newData);

      const nextVersion = current.version + 1;

      const result = await tx
        .update(planningDoc)
        .set({
          data: newData as any,
          version: nextVersion,
          updatedAt: new Date(),
        })
        .where(
          and(
            eq(planningDoc.userId, userId),
            eq(planningDoc.kind, kind)
          )
        )
        .returning();

      const row = result[0];
      return {
        id: row.id,
        userId: row.userId,
        kind: row.kind as PlanningDocKind,
        data: row.data as T,
        version: row.version,
        createdAt: row.createdAt.toISOString(),
        updatedAt: row.updatedAt.toISOString(),
      };
    });
  }

  /**
   * Validate document data against schema
   */
  private validateDoc(kind: PlanningDocKind, data: unknown): void {
    let result;
    switch (kind) {
      case 'pillars':
        result = zPillarsDoc.safeParse(data);
        break;
      case 'themes':
        result = zThemesDoc.safeParse(data);
        break;
      case 'tasks':
        result = zTasksDoc.safeParse(data);
        break;
      default:
        throw new ValidationError(`Unknown document kind: ${kind}`);
    }

    if (!result.success) {
      throw new ValidationError(`Invalid ${kind} document`, result.error);
    }
  }
}

// Singleton instance
export const planningRepository = new PlanningRepository();

