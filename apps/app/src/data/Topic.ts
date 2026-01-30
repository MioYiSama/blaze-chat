import { database, queryClient } from "#data/index.ts";
import { MessageSchema } from "#data/Message.ts";
import { useMutation, useQuery } from "@tanstack/solid-query";
import { Micro, pipe } from "effect";
import type { Accessor } from "solid-js";
import * as v from "valibot";

export const TopicSchema = v.object({
  id: v.pipe(v.string(), v.uuid()),
  assistantId: v.pipe(v.string(), v.uuid()),
  name: v.string(),
  messages: v.array(MessageSchema),
});

export type Topic = v.InferOutput<typeof TopicSchema>;

export function useTopicQuery(id: Accessor<string | undefined>) {
  return useQuery(() => ({
    enabled: () => Boolean(id()),
    queryKey: ["topic", id()],
    queryFn: async () =>
      Micro.runPromise(
        database.useTransaction("topics", "readonly", (transaction) =>
          pipe(
            transaction.objectStore("topics"),
            Micro.flatMap((topics) => topics.get(id()!)),
          ),
        ),
      ),
  }));
}

export function useTopicMutation() {
  return useMutation(() => ({
    mutationKey: ["topic"],
    mutationFn: async (topic: Topic) =>
      Micro.runPromise(
        database.useTransaction("topics", "readwrite", (tx) =>
          pipe(
            tx.objectStore("topics"),
            Micro.flatMap((topics) => topics.put(topic)),
          ),
        ),
      ),
    onSuccess: async (id) => {
      await queryClient.invalidateQueries({ queryKey: ["topics"] });
      await queryClient.invalidateQueries({ queryKey: ["topic", id] });
    },
  }));
}
