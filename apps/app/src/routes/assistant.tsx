import { useAssistantMutation, useAssistantQuery } from "#data/Assistant.ts";
import { useModelsQuery } from "#data/Model.ts";
import { createFileRoute } from "@tanstack/solid-router";
import { For, Show } from "solid-js";
import * as v from "valibot";

export const Route = createFileRoute("/assistant")({
  validateSearch: v.object({
    id: v.pipe(v.string(), v.uuid()),
  }),
  component: RouteComponent,
});

function RouteComponent() {
  const assistantId = Route.useSearch({ select: (search) => search.id });

  const assistant = useAssistantQuery(assistantId);
  const models = useModelsQuery();
  const mutation = useAssistantMutation();

  let modelSelect: HTMLSelectElement;

  return (
    <Show when={assistant.isSuccess && assistant.data}>
      {(assistant) => (
        <div>
          <p>{assistant().name}</p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              const modelId = modelSelect.value;
              mutation.mutate({
                ...assistant(),
                modelId: modelId ? modelId : null,
              });
            }}
          >
            <select class="input" ref={(e) => (modelSelect = e)}>
              <option value="" selected={assistant().modelId === null}>
                &lt;无&gt;
              </option>
              <For each={models.data}>
                {(model) => (
                  <option value={model.id} selected={assistant().modelId === model.id}>
                    {model.name}
                  </option>
                )}
              </For>
            </select>

            <button class="btn-primary" type="submit">
              保存设置
            </button>
          </form>
        </div>
      )}
    </Show>
  );
}
