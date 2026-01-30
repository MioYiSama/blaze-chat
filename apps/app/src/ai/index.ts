import { database } from "#data/index.ts";
import type { Message } from "#data/Message.ts";
import { Micro } from "effect";

export async function generateMessage(assistantId: string, messages: Message[]) {
  const [assistant, model, provider] = await Micro.runPromise(
    database.useTransaction(["assistants", "models", "providers"], "readonly", (tx) =>
      Micro.gen(function* () {
        const assistants = yield* tx.objectStore("assistants");
        const assistant = yield* assistants.get(assistantId);

        const models = yield* tx.objectStore("models");
        const model = yield* models.get(assistant.modelId!);

        const providers = yield* tx.objectStore("providers");
        const provider = yield* providers.get(model.providerId);

        return [assistant, model, provider];
      }),
    ),
  );

  const response = await fetch(
    provider.baseUrl ?? "https://openrouter.ai/api/v1/chat/completions",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${provider.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: model.identifier,
        messages,
      }),
    },
  );

  return (await response.json())["choices"][0]["message"]["content"] as string;
}
