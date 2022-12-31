import { NotFoundException } from "@nestjs/common";

export function roundToNearest10(date = new Date()) {
  const minutes = 10;
  const ms = 1000 * 60 * minutes;

  return new Date(Math.ceil(date.getTime() / ms) * ms);
}

export async function entityOrFail<T>(entityPromise: Promise<T>, message?: string) {
  const entity = await entityPromise;
  if (!entity) {
    throw new NotFoundException(message || "Resursa nu a fost gasită.");
  }
  return entity;
}

export function groupBy<T>(collection: T[], getKey: ((item: T) => string | number)) {
  return collection.reduce((storage, item) => {
    const group = getKey(item);
    storage[group] = storage[group] || [];
    storage[group].push(item); 
    return storage;
  }, {} as Record<string, T[]>);
}

export function indexArray<T = any, U = T>(arr: T[], getKey: (item: T) => string | number, getValue: (item: T) => U = (item: T) => item as any): Record<string | number, U> {
  return arr.reduce((acc, item) => ({ ...acc, [getKey(item)]: getValue(item) }), {});
}