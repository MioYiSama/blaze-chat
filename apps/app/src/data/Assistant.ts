import { database, queryClient } from "#data/index.ts";
import { useMutation, useQuery } from "@tanstack/solid-query";
import { Micro, pipe } from "effect";
import type { Accessor } from "solid-js";
import * as v from "valibot";

export const AssistantSchema = v.object({
  id: v.pipe(v.string(), v.uuid()),
  name: v.string(),
  modelId: v.nullable(v.pipe(v.string(), v.uuid())),
});

export type Assistant = v.InferOutput<typeof AssistantSchema>;

export function useAssistantsQuery() {
  return useQuery(() => ({
    queryKey: ["assistants"],
    queryFn: async () =>
      Micro.runPromise(
        database.useTransaction("assistants", "readonly", (transaction) =>
          pipe(
            transaction.objectStore("assistants"),
            Micro.flatMap((assistants) => assistants.getAll()),
          ),
        ),
      ),
  }));
}

export function useAssistantQuery(id: Accessor<Assistant["id"]>) {
  return useQuery(() => ({
    queryKey: ["assistant", id()],
    queryFn: async () =>
      Micro.runPromise(
        database.useTransaction("assistants", "readonly", (transaction) =>
          pipe(
            transaction.objectStore("assistants"),
            Micro.flatMap((assistants) => assistants.get(id())),
          ),
        ),
      ),
  }));
}

export function useAssistantMutation() {
  return useMutation(() => ({
    mutationKey: ["assistant"],
    mutationFn: async (assistant: Assistant) =>
      Micro.runPromise(
        database.useTransaction("assistants", "readwrite", (transaction) =>
          pipe(
            transaction.objectStore("assistants"),
            Micro.flatMap((assistants) => assistants.put(assistant)),
          ),
        ),
      ),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["assistants"] }),
  }));
}
