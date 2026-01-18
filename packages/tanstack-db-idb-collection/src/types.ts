import type { StandardSchemaV1 } from "@standard-schema/spec";

export type IdType = number | string;

/**
 * Extract Valid Id Type from Entity
 */
export type ValidIdPath<Entity extends object> = {
  [K in keyof Entity]: Entity[K] extends IdType ? K : never;
}[keyof Entity];

export type ObjectStore<Entity extends object = any> = {
  schema: StandardSchemaV1<Entity>;
  idPath: ValidIdPath<Entity>;
  indicies?: (keyof Entity & string)[];
};

/**
 * Extract the `Entity` type from ObjectStore
 */
export type ObjectStoreEntity<T extends ObjectStore> =
  T extends ObjectStore<infer O> ? O : never;

/**
 * Extract the `Entity` type from ObjectStore
 */
export type ObjectStoreId<T extends ObjectStore> =
  ObjectStoreEntity<T>[T["idPath"]];

export type ObjectStores = Record<string, ObjectStore>;
