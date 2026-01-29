import { AssistantSchema } from "#schemas/Assistant.ts";
import { ZeroUUID } from "#schemas/index.ts";
import { Database, defineObjectStoreSchema } from "@blaze-chat/effect-idb";
import { Micro } from "effect";

export const database = await Micro.runPromise(
  Database.open("blaze-chat", 1, {
    assistant: defineObjectStoreSchema({
      schema: AssistantSchema,
      key: "id",
      setup: (objectStore) =>
        objectStore.add({
          id: ZeroUUID,
          name: "默认助手",
          modelId: null,
        }),
    }),
  }),
);
