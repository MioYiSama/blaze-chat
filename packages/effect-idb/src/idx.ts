import type { InferTKey, ValidKeyOrKeys } from "./types";
import type { StandardSchemaV1 } from "@standard-schema/spec";
import { Micro } from "effect";

import { IndexError, ValidationError } from "./error";
import { validate, validateAll } from "./validate";

/**
 * @see {@link IDBObjectStore["createIndex"]}, {@link IDBIndexParameters}
 */
export type IndexSchema<T extends object, Ks extends ValidKeyOrKeys<T>> = {
  readonly schema: StandardSchemaV1<T>;
  readonly key: Ks;
  readonly unique?: boolean;
};
export type IndexSchemas<T extends object> = Record<string, IndexSchema<T, ValidKeyOrKeys<T>>>;

export type IndexFromSchema<S extends IndexSchema<any, any>> =
  S extends IndexSchema<infer T, infer Ks> ? Index<T, InferTKey<T, Ks> & IDBValidKey> : never;

/**
 * Utility function for type safety
 */
export function defineIndexSchema<T extends object, const Ks extends ValidKeyOrKeys<T>>(
  schema: IndexSchema<T, Ks>,
) {
  return schema;
}

export class Index<T extends object, K extends IDBValidKey> {
  private readonly index: IDBIndex;
  private readonly schema: StandardSchemaV1<T>;

  constructor(index: IDBIndex, schema: StandardSchemaV1<T>) {
    this.index = index;
    this.schema = schema;
  }

  get(key: K) {
    return Micro.async<T | undefined, IndexError | ValidationError>((resume) => {
      const request = this.index.get(key);

      request.addEventListener("success", async () => {
        resume(validate(this.schema, request.result));
      });

      request.addEventListener("error", () =>
        resume(Micro.fail(new IndexError({ cause: request.error! }))),
      );
    });
  }

  getAll(key: K) {
    return Micro.async<readonly T[], IndexError | ValidationError>((resume) => {
      const request = this.index.getAll(key);

      request.addEventListener("success", async () => {
        resume(validateAll(this.schema, request.result));
      });

      request.addEventListener("error", () =>
        resume(Micro.fail(new IndexError({ cause: request.error! }))),
      );
    });
  }
}
