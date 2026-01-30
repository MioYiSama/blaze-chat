import type { IndexSchemas } from "./idx";
import type { KeyOrKeys, PickKeyOrKeys } from "./types";
import { Micro } from "effect";

import { DatabaseError, ObjectStoreError, TransactionError, type ValidationError } from "./error";
import { ObjectStore, type ObjectStoreSchema, type ObjectStoreSchemas } from "./object-store";
import { Transaction } from "./transaction";

export class Database<S extends ObjectStoreSchemas> {
  static open<S extends ObjectStoreSchemas>(name: string, version: number, schemas: S) {
    return Micro.acquireUseRelease(
      Micro.try({
        try: () => window.indexedDB.open(name, version),
        catch: (error) => new DatabaseError({ cause: error as DOMException }),
      }),

      (request) =>
        Micro.async<Database<S>, DatabaseError | ObjectStoreError | ValidationError>((resume) => {
          request.addEventListener("success", () =>
            resume(Micro.succeed(new Database(request.result, schemas))),
          );

          request.addEventListener("error", () =>
            resume(Micro.fail(new DatabaseError({ cause: request.error! }))),
          );

          request.addEventListener("upgradeneeded", async () => {
            const database = request.result;

            const exit = await Micro.runPromiseExit(
              Micro.forEach(
                Object.entries(schemas),
                ([name, schema]) => createObjectStore(database, name, schema),
                { concurrency: "unbounded", discard: true },
              ),
            );

            if (Micro.exitIsFailure(exit)) {
              resume(Micro.failCause(exit.cause));
            }
          });
        }),

      (request, exit) => Micro.catchAll(exit, () => Micro.succeed(request.transaction?.abort())),
    );
  }

  private readonly database: IDBDatabase;
  private readonly schemas: S;

  private constructor(database: IDBDatabase, schemas: S) {
    this.database = database;
    this.schemas = schemas;
  }

  useTransaction<const Names extends KeyOrKeys<S>, A, E>(
    objectStoreNames: Names,
    mode: IDBTransactionMode,
    fn: (transaction: Transaction<PickKeyOrKeys<S, Names>>) => Micro.Micro<A, E>,
  ) {
    return Micro.acquireUseRelease(
      Micro.try({
        try: () => this.database.transaction(objectStoreNames, mode),
        catch: (error) => new TransactionError({ cause: error as DOMException }),
      }),

      (transaction) => fn(new Transaction(transaction, this.schemas as PickKeyOrKeys<S, Names>)),

      (transaction, exit) => Micro.catchAll(exit, () => Micro.succeed(transaction.abort())),
    );
  }
}

function createObjectStore(
  database: IDBDatabase,
  name: string,
  { schema, key, setup, indexes }: ObjectStoreSchema<any, any, IndexSchemas<any>>,
) {
  return Micro.gen(function* () {
    const objectStore = yield* Micro.try({
      try: () => database.createObjectStore(name, { keyPath: key }),
      catch: (error) => new DatabaseError({ cause: error as DOMException }),
    });

    if (indexes) {
      yield* Micro.forEach(
        Object.entries(indexes),
        ([name, { key, unique = false }]) =>
          Micro.try({
            try: () => objectStore.createIndex(name, key, { unique }),
            catch: (error) => new ObjectStoreError({ cause: error as DOMException }),
          }),
        { concurrency: "unbounded", discard: true },
      );
    }

    if (setup) {
      yield* setup(new ObjectStore(objectStore, schema));
    }
  });
}
