import { database, queryClient } from "#data/index.ts";
import type { Icon } from "#util/types.ts";
import { useMutation, useQuery } from "@tanstack/solid-query";
import { Micro, pipe } from "effect";
import type { Accessor } from "solid-js";
import * as v from "valibot";
import SimpleIconsAnthropic from "~icons/simple-icons/anthropic";
import SimpleIconsGoogle from "~icons/simple-icons/google";
import SimpleIconsOpenai from "~icons/simple-icons/openai";
import SimpleIconsOpenrouter from "~icons/simple-icons/openrouter";

export const ProviderTypes = ["OpenAI", "Anthropic", "Google", "OpenRouter"] as const;

export const ProviderIcons: Record<ProviderType, Icon> = {
  OpenAI: SimpleIconsOpenai,
  Anthropic: SimpleIconsAnthropic,
  Google: SimpleIconsGoogle,
  OpenRouter: SimpleIconsOpenrouter,
};

export const ProviderSchema = v.object({
  id: v.pipe(v.string(), v.uuid()),
  name: v.string(),
  type: v.picklist(ProviderTypes),
  apiKey: v.string(),
  baseUrl: v.nullable(v.pipe(v.string(), v.url())),
});

export type Provider = v.InferOutput<typeof ProviderSchema>;
export type ProviderType = (typeof ProviderTypes)[number];

export function useProvidersQuery() {
  return useQuery(() => ({
    queryKey: ["providers"],
    queryFn: async () =>
      Micro.runPromise(
        database.useTransaction("providers", "readonly", (transaction) =>
          pipe(
            transaction.objectStore("providers"),
            Micro.flatMap((providers) => providers.getAll()),
          ),
        ),
      ),
  }));
}

export function useProviderQuery(id: Accessor<string>) {
  return useQuery(() => ({
    queryKey: ["provider", id()],
    queryFn: async () =>
      Micro.runPromise(
        database.useTransaction("providers", "readonly", (transaction) =>
          pipe(
            transaction.objectStore("providers"),
            Micro.flatMap((providers) => providers.get(id())),
          ),
        ),
      ),
  }));
}

export function useProviderMutation() {
  return useMutation(() => ({
    mutationKey: ["provider"],
    mutationFn: async (provider: Provider) =>
      Micro.runPromise(
        database.useTransaction("providers", "readwrite", (tx) =>
          pipe(
            tx.objectStore("providers"),
            Micro.flatMap((providers) => providers.put(provider)),
          ),
        ),
      ),
    onSuccess: async (id) => {
      await queryClient.invalidateQueries({ queryKey: ["providers"] });
      await queryClient.invalidateQueries({ queryKey: ["provider", id] });
    },
  }));
}
