import type { StandardSchemaV1 } from "@standard-schema/spec";

export type ValidId = number | string;

/**
 * Extract Valid ID Type from Entity
 */
export type ValidIdPath<Entity extends object> = {
  [K in keyof Entity]: Entity[K] extends ValidId ? K : never;
}[keyof Entity];

export type ObjectStore<Entity extends object = any, IdPath extends ValidIdPath<Entity> = any> = {
  schema: StandardSchemaV1<Entity>;
  idPath: IdPath;
  indicies?: (keyof Entity & string)[];
};

export type ObjectStores = Record<string, ObjectStore>;

/**
 * Extract `Entity` from ObjectStore
 */
export type ObjectStoreEntity<Store extends ObjectStore> =
  Store extends ObjectStore<infer Entity> ? Entity : never;

/**
 * Extract `IdPath` from ObjectStore
 */
export type ObjectStoreIdPath<Store extends ObjectStore> =
  Store extends ObjectStore<any, infer IdPath> ? IdPath : never;

/**
 * Get IdType from ObjectStore
 */
export type ObjectStoreIdType<Store extends ObjectStore> =
  Store extends ObjectStore<infer Entity, infer IdPath> ? Entity[IdPath] : never;
