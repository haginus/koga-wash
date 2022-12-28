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