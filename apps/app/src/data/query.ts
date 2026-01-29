import { database } from "#data/db.ts";
import type { Assistant } from "#schemas/Assistant.ts";
import { QueryClient, useMutation, useQuery } from "@tanstack/solid-query";
import { Micro, pipe } from "effect";
import type { Accessor } from "solid-js";
import { uuidv7 } from "uuidv7";

export const queryClient = new QueryClient();

export function getAssistantsQuery() {
  return useQuery(() => ({
    queryKey: ["assistant"],
    queryFn: async () =>
      Micro.runPromise(
        database.useTransaction("assistant", "readonly", (transaction) =>
          pipe(
            transaction.objectStore("assistant"),
            Micro.flatMap((objectStore) => objectStore.getAll()),
          ),
        ),
      ),
  }));
}

export function getAssistantQuery(id: Accessor<Assistant["id"]>) {
  return useQuery(() => ({
    queryKey: ["assistant", id()],
    queryFn: async () =>
      Micro.runPromise(
        database.useTransaction("assistant", "readonly", (transaction) =>
          pipe(
            transaction.objectStore("assistant"),
            Micro.flatMap((objectStore) => objectStore.get(id())),
          ),
        ),
      ),
  }));
}

export function addAssistantMutation() {
  return useMutation(() => ({
    mutationKey: ["addAssistant"],
    mutationFn: async (newAssistant: Omit<Assistant, "id" | "modelId">) =>
      Micro.runPromise(
        database.useTransaction("assistant", "readwrite", (transaction) =>
          pipe(
            transaction.objectStore("assistant"),
            Micro.flatMap((objectStore) =>
              objectStore.add({
                id: uuidv7(),
                modelId: null,
                ...newAssistant,
              }),
            ),
          ),
        ),
      ),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["assistant"] }),
  }));
}
