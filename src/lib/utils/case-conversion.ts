/**
 * Utility functions for converting object keys between camelCase (TypeScript)
 * and snake_case (MongoDB). Used by domain mappers and CollectionConverters.
 */

/** Convert a single snake_case string to camelCase: `featured_image` → `featuredImage` */
export function snakeToCamel(str: string): string {
  if (str.startsWith("_")) return str;
  return str.replace(/_([a-z])/g, (_, char) => char.toUpperCase());
}

/** Convert a single camelCase string to snake_case: `featuredImage` → `featured_image` */
export function camelToSnake(str: string): string {
    return str.replace(/[A-Z]/g, (char) => `_${char.toLowerCase()}`);
}

/**
 * Recursively convert all keys of an object (or array of objects) from snake_case to camelCase.
 * - Preserves `_id` as-is
 * - Handles nested objects and arrays
 * - Passes through primitives and null/undefined unchanged
 */
export function mapKeysSnakeToCamel<T = Record<string, unknown>>(
    obj: unknown,
): T {
    if (obj === null || obj === undefined) return obj as T;
    if (Array.isArray(obj)) return obj.map(mapKeysSnakeToCamel) as T;
    if (typeof obj !== "object" || obj instanceof Date) return obj as T;

    const record = obj as Record<string, unknown>;
    const result: Record<string, unknown> = {};

    for (const key of Object.keys(record)) {
        const newKey = key === "_id" ? key : snakeToCamel(key);
        result[newKey] = mapKeysSnakeToCamel(record[key]);
    }

    return result as T;
}

/**
 * Recursively convert all keys of an object (or array of objects) from camelCase to snake_case.
 * - Preserves `_id` as-is
 * - Handles nested objects and arrays
 * - Passes through primitives and null/undefined unchanged
 */
export function mapKeysCamelToSnake(obj: unknown): unknown {
    if (obj === null || obj === undefined) return obj;
    if (Array.isArray(obj)) return obj.map(mapKeysCamelToSnake);
    if (typeof obj !== "object" || obj instanceof Date) return obj;

    const record = obj as Record<string, unknown>;
    const result: Record<string, unknown> = {};

    for (const key of Object.keys(record)) {
        const newKey = key === "_id" ? key : camelToSnake(key);
        result[newKey] = mapKeysCamelToSnake(record[key]);
    }

    return result;
}
