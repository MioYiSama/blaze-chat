import * as v from "valibot";

export const MessageRole = ["user", "assistant"] as const;

export const MessageSchema = v.object({
  role: v.picklist(MessageRole),
  content: v.string(),
});

export type Message = v.InferOutput<typeof MessageSchema>;
