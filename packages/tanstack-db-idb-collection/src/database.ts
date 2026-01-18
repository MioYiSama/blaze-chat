import { openDB, type IDBPDatabase } from "idb";
import type { ObjectStore, ObjectStores } from "./types";

export type Database<T extends ObjectStores> = {
  idb: Promise<IDBPDatabase>;
  objectStores: T;
};

export function defineObjectStore<Entity extends object>(
  objectStore: ObjectStore<Entity>,
): ObjectStore<Entity> {
  return objectStore;
}

export function createDatabase<const T extends ObjectStores>(
  name: string,
  version: number,
  objectStores: T,
) {
  const idb = openDB(name, version, {
    async upgrade(database) {
      for (const [key, { idPath: keyPath, indicies }] of Object.entries(
        objectStores,
      )) {
        const objectStore = database.createObjectStore(key, { keyPath });

        if (indicies) {
          await Promise.all(
            indicies.map((index) => objectStore.createIndex(name, index)),
          );
        }
      }
    },
  });

  return { idb, objectStores };
}
