import { NotFoundException } from "@nestjs/common";
import { FindOptionsOrder } from "typeorm";

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

export function getOrder<T>(field: string, direction: 'ASC' | 'DESC'): FindOptionsOrder<T> {
  const nests = field.split('.');
  const result = {};
  let current = result;

  nests.forEach((nest, index) => {
    if (index === nests.length - 1) {
      current[nest] = direction;
    } else {
      current[nest] = {};
      current = current[nest];
    }
  });
  return result as FindOptionsOrder<T>;
}

export function likeStr(str: string, left = true, right = true) {
  return `${left ? '%' : ''}${str}${right ? '%' : ''}`;
}

export function logError(error: unknown) {
  console.error(error);
}