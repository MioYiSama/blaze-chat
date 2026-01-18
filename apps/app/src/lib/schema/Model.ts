import * as v from "valibot";

export const ModelType = ["GPT", "Claude", "Gemini"] as const;

export const ModelSchema = v.object({
  id: v.pipe(v.string(), v.uuid()),
  providerId: v.pipe(v.string(), v.uuid()),
  identifier: v.string(),
  name: v.string(),
  type: v.picklist(ModelType),
});

export type Model = v.InferOutput<typeof ModelSchema>;
