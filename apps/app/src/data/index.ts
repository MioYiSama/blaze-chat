import { AssistantSchema } from "#data/Assistant.ts";
import { ModelSchema } from "#data/Model.ts";
import { ProviderSchema } from "#data/Provider.ts";
import { TopicSchema } from "#data/Topic.ts";
import { Database, defineIndexSchema, defineObjectStoreSchema } from "@blaze-chat/effect-idb";
import { QueryClient } from "@tanstack/solid-query";
import { Micro } from "effect";

export const ZeroUUID = "00000000-0000-0000-0000-000000000000";

export const queryClient = new QueryClient();

export const database = await Micro.runPromise(
  Database.open("blaze-chat", 2, {
    assistants: defineObjectStoreSchema({
      schema: AssistantSchema,
      key: "id",
      setup: (objectStore) =>
        objectStore.add({
          id: ZeroUUID,
          name: "默认助手",
          modelId: null,
        }),
    }),
    topics: defineObjectStoreSchema({
      schema: TopicSchema,
      key: "id",
      indexes: {
        assistantId: defineIndexSchema({
          schema: TopicSchema,
          key: "assistantId",
        }),
      },
    }),
    providers: defineObjectStoreSchema({
      schema: ProviderSchema,
      key: "id",
    }),
    models: defineObjectStoreSchema({
      schema: ModelSchema,
      key: "id",
      indexes: {
        providerId: defineIndexSchema({
          schema: ModelSchema,
          key: "providerId",
        }),
      },
    }),
  }),
);
