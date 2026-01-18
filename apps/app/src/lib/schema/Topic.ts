import { MessageSchema } from "$lib/schema/Message";
import * as v from "valibot";

export const TopicSchema = v.object({
  id: v.pipe(v.string(), v.uuid()),
  assistantId: v.pipe(v.string(), v.uuid()),
  name: v.string(),
  messages: v.array(MessageSchema),
});

export type Topic = v.InferOutput<typeof TopicSchema>;
