import { Operation } from 'fast-json-patch';

/**
 * Generate JSON Patch operations for common CRUD scenarios
 */

/**
 * Create patch to add an item to the end of an array
 */
export function createAddItemPatch(item: unknown): Operation[] {
  return [
    {
      op: 'add',
      path: '/-', // Append to end of array
      value: item,
    },
  ];
}

/**
 * Create patch to update specific fields of an item at given index
 */
export function createUpdateItemPatch(
  index: number,
  updates: Record<string, unknown>
): Operation[] {
  return Object.entries(updates).map(([key, value]) => ({
    op: 'replace',
    path: `/${index}/${key}`,
    value,
  }));
}

/**
 * Create patch to remove an item at given index
 */
export function createRemoveItemPatch(index: number): Operation[] {
  return [
    {
      op: 'remove',
      path: `/${index}`,
    },
  ];
}

/**
 * Create patch to replace entire item at given index
 */
export function createReplaceItemPatch(index: number, item: unknown): Operation[] {
  return [
    {
      op: 'replace',
      path: `/${index}`,
      value: item,
    },
  ];
}

/**
 * Find index of item by ID in array
 * @throws Error if item not found
 */
export function findItemIndex<T extends { id: string }>(
  items: T[],
  id: string
): number {
  const index = items.findIndex((item) => item.id === id);
  if (index === -1) {
    throw new Error(`Item with id ${id} not found`);
  }
  return index;
}

/**
 * Create patch to move an item from one index to another
 */
export function createMoveItemPatch(fromIndex: number, toIndex: number): Operation[] {
  return [
    {
      op: 'move',
      from: `/${fromIndex}`,
      path: `/${toIndex}`,
    },
  ];
}

