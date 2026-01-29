import type { Key } from "./types";
import { Micro, pipe } from "effect";

import { TransactionError } from "./error";
import { ObjectStore, type ObjectStoreFromSchema, type ObjectStoreSchemas } from "./object-store";

export class Transaction<S extends ObjectStoreSchemas> {
  private readonly transaction: IDBTransaction;
  private readonly schemas: S;

  constructor(transaction: IDBTransaction, schemas: S) {
    this.transaction = transaction;
    this.schemas = schemas;
  }

  objectStore<const Name extends Key<S>>(name: Name) {
    return pipe(
      Micro.try({
        try: () => this.transaction.objectStore(name),
        catch: (error) => new TransactionError({ cause: error as DOMException }),
      }),
      Micro.map(
        (objectStore) =>
          new ObjectStore(objectStore, this.schemas[name]!.schema) as ObjectStoreFromSchema<
            S[Name]
          >,
      ),
    );
  }
}
