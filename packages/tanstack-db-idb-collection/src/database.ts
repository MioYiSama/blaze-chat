import { openDB, type IDBPDatabase } from "idb";
import type { ObjectStore, ObjectStores, ValidIdPath } from "./types";

/**
 * Helper function for IDE auto completion
 */
export function defineObjectStore<
  const Entity extends object,
  const IdPath extends ValidIdPath<Entity>,
>(objectStore: ObjectStore<Entity, IdPath>): ObjectStore<Entity, IdPath> {
  return objectStore;
}

export type Database<T extends ObjectStores> = {
  /**
   * Note: Safari does not support Top-Level Await
   */
  idb: Promise<IDBPDatabase>;
  objectStores: T;
};

export function createDatabase<const T extends ObjectStores>(
  name: string,
  version: number,
  objectStores: T,
): Database<T> {
  const idb = openDB(name, version, {
    async upgrade(database) {
      for (const [key, { idPath: keyPath, indicies }] of Object.entries(objectStores)) {
        const objectStore = database.createObjectStore(key, { keyPath });

        if (indicies) {
          // oxlint-disable-next-line no-await-in-loop
          await Promise.all(indicies.map((index) => objectStore.createIndex(name, index)));
        }
      }
    },
  });

  return { idb, objectStores };
}
