import type { InferTKey, Key, ValidKeyOrKeys } from "./types";
import type { StandardSchemaV1 } from "@standard-schema/spec";
import { Micro, pipe } from "effect";

import { ObjectStoreError, type ValidationError } from "./error";
import { Index, type IndexFromSchema, type IndexSchemas } from "./idx";
import { validate, validateAll } from "./validate";

/**
 * @see {@link IDBDatabase["createObjectStore"]}, {@link IDBObjectStoreParameters}
 */
export type ObjectStoreSchema<
  T extends object,
  Ks extends ValidKeyOrKeys<T>,
  I extends IndexSchemas<T>,
> = {
  readonly schema: StandardSchemaV1<T>;
  readonly key: Ks;
  readonly indexes?: I;
  readonly setup?: (
    objectStore: ObjectStoreFromTKI<T, Ks, I>,
  ) => Micro.Micro<any, ObjectStoreError | ValidationError>;
};
export type ObjectStoreSchemas = Record<string, ObjectStoreSchema<any, any, any>>;

type ObjectStoreFromTKI<
  T extends object,
  Ks extends ValidKeyOrKeys<T>,
  I extends IndexSchemas<T>,
> = ObjectStore<T, InferTKey<T, Ks> & IDBValidKey, I>;

export type ObjectStoreFromSchema<S extends ObjectStoreSchema<any, any, any>> =
  S extends ObjectStoreSchema<infer T, infer Ks, infer I> ? ObjectStoreFromTKI<T, Ks, I> : never;

/**
 * Utility function for type safety
 */
export function defineObjectStoreSchema<
  T extends object,
  const Ks extends ValidKeyOrKeys<T>,
  I extends IndexSchemas<T>,
>(schema: ObjectStoreSchema<T, Ks, I>) {
  return schema;
}

export class ObjectStore<T extends object, K extends IDBValidKey, I extends IndexSchemas<T>> {
  private readonly objectStore: IDBObjectStore;
  private readonly schema: StandardSchemaV1<T>;

  constructor(objectStore: IDBObjectStore, schema: StandardSchemaV1<T>) {
    this.objectStore = objectStore;
    this.schema = schema;
  }

  add(value: T) {
    return pipe(
      validate(this.schema, value),
      Micro.flatMap((value) =>
        Micro.async<K, ObjectStoreError>((resume) => {
          const request = this.objectStore.add(value);

          request.addEventListener("success", () => resume(Micro.succeed(request.result as K)));

          request.addEventListener("error", () =>
            resume(Micro.fail(new ObjectStoreError({ cause: request.error! }))),
          );
        }),
      ),
    );
  }

  delete(key: K) {
    return Micro.async<void, ObjectStoreError>((resume) => {
      const request = this.objectStore.delete(key);

      request.addEventListener("success", () => resume(Micro.void));

      request.addEventListener("error", () =>
        resume(Micro.fail(new ObjectStoreError({ cause: request.error! }))),
      );
    });
  }

  get(key: K) {
    return Micro.async<T, ObjectStoreError | ValidationError>((resume) => {
      const request = this.objectStore.get(key);

      request.addEventListener("success", () => resume(validate(this.schema, request.result)));

      request.addEventListener("error", () =>
        resume(Micro.fail(new ObjectStoreError({ cause: request.error! }))),
      );
    });
  }

  getAll() {
    return Micro.async<readonly T[], ObjectStoreError | ValidationError>((resume) => {
      const request = this.objectStore.getAll();

      request.addEventListener("success", () => resume(validateAll(this.schema, request.result)));

      request.addEventListener("error", () =>
        resume(Micro.fail(new ObjectStoreError({ cause: request.error! }))),
      );
    });
  }

  put(value: T) {
    return pipe(
      validate(this.schema, value),
      Micro.flatMap((value) =>
        Micro.async<K, ObjectStoreError>((resume) => {
          const request = this.objectStore.put(value);

          request.addEventListener("success", () => resume(Micro.succeed(request.result as K)));

          request.addEventListener("error", () =>
            resume(Micro.fail(new ObjectStoreError({ cause: request.error! }))),
          );
        }),
      ),
    );
  }

  index<const Name extends Key<I>>(name: Name) {
    return pipe(
      Micro.try({
        try: () => this.objectStore.index(name),
        catch: (error) => new ObjectStoreError({ cause: error as DOMException }),
      }),
      Micro.map((index) => new Index(index, this.schema) as IndexFromSchema<I[Name]>),
    );
  }
}
