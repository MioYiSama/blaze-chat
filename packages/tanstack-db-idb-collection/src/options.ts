import type { StandardSchemaV1 } from "@standard-schema/spec";
import type {
  ChangeMessageOrDeleteKeyMessage,
  DeleteMutationFn,
  InsertMutationFn,
  SyncConfig,
  UpdateMutationFn,
} from "@tanstack/db";
import type { Database } from "./database";
import type {
  ObjectStore,
  ObjectStoreEntity,
  ObjectStoreId,
  ObjectStores,
} from "./types";

class IDBCollectionConfig<
  const T extends ObjectStores,
  Name extends keyof T & string,
  Entity extends ObjectStoreEntity<T[Name]>,
  IdType extends ObjectStoreId<T[Name]>,
> {
  id: string;
  schema: StandardSchemaV1<Entity>;
  getKey: (entity: Entity) => IdType;
  sync: SyncConfig<Entity>;

  onInsert: InsertMutationFn<Entity, IdType>;
  onUpdate: UpdateMutationFn<Entity, IdType>;
  onDelete: DeleteMutationFn<Entity, IdType>;

  private begin!: () => void;
  private write!: (
    message: ChangeMessageOrDeleteKeyMessage<Entity, IdType>,
  ) => void;
  private commit!: () => void;

  constructor({ idb, objectStores }: Database<T>, name: Name) {
    const { schema, idPath } = objectStores[name]! as ObjectStore<Entity>;

    this.id = name;
    this.schema = schema;
    this.getKey = (entity) => entity[idPath];
    this.sync = {
      sync: ({ begin, write, commit, markReady }) => {
        this.begin = begin;
        this.write = write;
        this.commit = commit;

        (async () => {
          try {
            begin();

            for (const entity of await (await idb).getAll(name)) {
              write({ type: "insert", value: entity });
            }

            commit();
          } finally {
            markReady();
          }
        })();
      },
    };

    this.onInsert = async ({ transaction }) => {
      const entities = transaction.mutations.map((m) => m.modified);

      const tx = (await idb).transaction(name, "readwrite");

      await Promise.all(entities.map((entity) => tx.store.add(entity)));

      await tx.done;

      this.begin();
      for (const entity of entities) {
        this.write({ type: "insert", value: entity });
      }
      this.commit();
    };
    this.onUpdate = async ({ transaction }) => {
      const entities = transaction.mutations.map((m) => m.modified);

      const tx = (await idb).transaction(name, "readwrite");

      await Promise.all(entities.map((entity) => tx.store.put(entity)));

      await tx.done;

      this.begin();
      for (const entity of entities) {
        this.write({ type: "update", value: entity });
      }
      this.commit();
    };
    this.onDelete = async ({ transaction }) => {
      const keys = transaction.mutations.map((m) => m.key as IdType);

      const tx = (await idb).transaction(name, "readwrite");

      await Promise.all(keys.map((key) => tx.store.delete(key)));

      await tx.done;

      this.begin();
      for (const key of keys) {
        this.write({ type: "delete", key });
      }
      this.commit();
    };
  }
}

export function idbCollectionOptions<
  const T extends ObjectStores,
  Name extends keyof T & string,
>({ database, name }: { database: Database<T>; name: Name }) {
  return new IDBCollectionConfig(database, name);
}
