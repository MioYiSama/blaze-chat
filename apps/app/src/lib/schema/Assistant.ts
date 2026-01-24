import * as v from "valibot";

export const AssistantSchema = v.object({
  id: v.pipe(v.string(), v.uuid()),
  name: v.string(),
  modelId: v.nullable(v.pipe(v.string(), v.uuid())),
});

export type Assistant = v.InferOutput<typeof AssistantSchema>;
