import * as v from "valibot";

export const AssistantSchema = v.object({
  id: v.pipe(v.string(), v.uuid()),
  name: v.string(),
  modelId: v.union([v.uuid(), v.null()]),
});

export type Assistant = v.InferOutput<typeof AssistantSchema>;
