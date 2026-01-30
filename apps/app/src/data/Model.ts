import { database, queryClient } from "#data/index.ts";
import type { Icon } from "#util/types.ts";
import { useMutation, useQuery } from "@tanstack/solid-query";
import { Micro, pipe } from "effect";
import type { Accessor } from "solid-js";
import * as v from "valibot";
import SimpleIconsClaude from "~icons/simple-icons/claude";
import SimpleIconsGooglegemini from "~icons/simple-icons/googlegemini";
import SimpleIconsOpenai from "~icons/simple-icons/openai";

export const ModelTypes = ["GPT", "Claude", "Gemini"] as const;
export const ModelIcons: Record<ModelType, Icon> = {
  GPT: SimpleIconsOpenai,
  Claude: SimpleIconsClaude,
  Gemini: SimpleIconsGooglegemini,
};

export const ModelSchema = v.object({
  id: v.pipe(v.string(), v.uuid()),
  providerId: v.pipe(v.string(), v.uuid()),
  identifier: v.string(),
  name: v.string(),
  type: v.picklist(ModelTypes),
});

export type Model = v.InferOutput<typeof ModelSchema>;
export type ModelType = (typeof ModelTypes)[number];

export function useModelsQuery() {
  return useQuery(() => ({
    queryKey: ["models"],
    queryFn: async () =>
      Micro.runPromise(
        database.useTransaction("models", "readonly", (transaction) =>
          pipe(
            transaction.objectStore("models"),
            Micro.flatMap((models) => models.getAll()),
          ),
        ),
      ),
  }));
}

export function useProviderModelsQuery(providerId: Accessor<string>) {
  return useQuery(() => ({
    queryKey: ["models", providerId()],
    queryFn: async () =>
      Micro.runPromise(
        database.useTransaction("models", "readonly", (transaction) =>
          pipe(
            transaction.objectStore("models"),
            Micro.flatMap((models) => models.index("providerId")),
            Micro.flatMap((index) => index.getAll(providerId())),
          ),
        ),
      ),
  }));
}

export function useModelMutation() {
  return useMutation(() => ({
    mutationKey: ["addModel"],
    mutationFn: async (model: Model) =>
      Micro.runPromise(
        database.useTransaction("models", "readwrite", (tx) =>
          pipe(
            tx.objectStore("models"),
            Micro.flatMap((models) => models.add(model)),
          ),
        ),
      ),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["models"] }),
  }));
}
