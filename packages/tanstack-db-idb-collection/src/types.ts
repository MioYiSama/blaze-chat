import type { StandardSchemaV1 } from "@standard-schema/spec";

export type IdType = number | string;

export type ValidIdPath<T extends object> = {
  [K in keyof T]: T[K] extends IdType ? K : never;
}[keyof T];

export type ObjectStore<Entity extends object = any> = {
  schema: StandardSchemaV1<Entity>;
  idPath: ValidIdPath<Entity>;
  indicies?: (keyof Entity & string)[];
};

export type ObjectStoreEntity<T extends ObjectStore> =
  T extends ObjectStore<infer O> ? O : never;

export type ObjectStoreId<T extends ObjectStore> =
  ObjectStoreEntity<T>[T["idPath"]];

export type ObjectStores = Record<string, ObjectStore>;
