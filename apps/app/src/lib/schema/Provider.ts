import * as v from "valibot";

export const ProviderType = [
  "OpenAI",
  "Anthropic",
  "Google",
  "OpenRouter",
] as const;

export const ProviderSchema = v.object({
  id: v.pipe(v.string(), v.uuid()),
  name: v.string(),
  type: v.picklist(ProviderType),
  apiKey: v.string(),
  baseUrl: v.nullable(v.pipe(v.string(), v.url())),
});

export type Provider = v.InferOutput<typeof ProviderSchema>;
