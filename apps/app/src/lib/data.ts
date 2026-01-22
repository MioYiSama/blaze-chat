import { AssistantSchema, type Assistant } from "$lib/schema/Assistant";
import { ModelSchema } from "$lib/schema/Model";
import { ProviderSchema } from "$lib/schema/Provider";
import { TopicSchema } from "$lib/schema/Topic";
import {
  createDatabase,
  defineObjectStore,
  idbCollectionOptions,
} from "@blaze-chat/tanstack-db-idb-collection";
import { createCollection } from "@tanstack/svelte-db";

export const ZeroUUID = "00000000-0000-0000-0000-000000000000";

const database = createDatabase("blaze-chat", 1, {
  assistants: defineObjectStore({
    schema: AssistantSchema,
    idPath: "id",
    async upgrade(objectStore) {
      await objectStore.add({
        id: ZeroUUID,
        name: "默认助手",
        modelId: null,
      } satisfies Assistant);
    },
  }),
  topics: defineObjectStore({
    schema: TopicSchema,
    idPath: "id",
    indicies: ["assistantId"],
  }),
  providers: defineObjectStore({
    schema: ProviderSchema,
    idPath: "id",
  }),
  models: defineObjectStore({
    schema: ModelSchema,
    idPath: "id",
    indicies: ["providerId"],
  }),
});

export const assistantsCollection = createCollection(
  idbCollectionOptions({
    database,
    name: "assistants",
  }),
);

export const topicsCollection = createCollection(
  idbCollectionOptions({
    database,
    name: "topics",
  }),
);

export const providersCollection = createCollection(
  idbCollectionOptions({
    database,
    name: "providers",
  }),
);

export const modelsCollection = createCollection(
  idbCollectionOptions({
    database,
    name: "models",
  }),
);
