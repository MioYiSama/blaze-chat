import { useAssistantMutation, useAssistantQuery } from "#data/Assistant.ts";
import { useModelsQuery } from "#data/Model.ts";
import { emptyStringAsNull } from "#util/index.ts";
import { createFileRoute, Link } from "@tanstack/solid-router";
import { For, Show } from "solid-js";
import * as v from "valibot";
import LucideChevronLeft from "~icons/lucide/chevron-left";

export const Route = createFileRoute("/assistant")({
  validateSearch: v.object({
    id: v.pipe(v.string(), v.uuid()),
  }),
  component: RouteComponent,
});

function RouteComponent() {
  const assistantId = Route.useSearch({ select: (search) => search.id });
  const navigate = Route.useNavigate();

  const assistantQuery = useAssistantQuery(assistantId);
  const modelsQuery = useModelsQuery();
  const mutation = useAssistantMutation();

  let modelSelect: HTMLSelectElement;

  return (
    <Show when={assistantQuery.data}>
      {(assistant) => (
        <div class="grid size-full grid-rows-[3rem_1fr]">
          <div class="bg-card flex flex-row items-center px-2 sm:px-4">
            <Link class="btn-ghost hover:bg-surface" to="/" search={{ assistant: assistant().id }}>
              <LucideChevronLeft />
            </Link>
            <p class="title3 grow text-center">助手设置</p>
          </div>

          <form
            onSubmit={async (e) => {
              e.preventDefault();
              const modelId = modelSelect.value;
              mutation.mutate({
                ...assistant(),
                modelId: emptyStringAsNull(modelId),
              });
              await navigate({ to: "/", search: { assistant: assistant().id } });
            }}
          >
            <label for="model">模型</label>
            <select class="input" name="model" ref={(e) => (modelSelect = e)}>
              <option value="" selected={assistant().modelId === null}>
                &lt;无&gt;
              </option>
              <For each={modelsQuery.data}>
                {(model) => (
                  <option value={model.id} selected={assistant().modelId === model.id}>
                    {model.name}
                  </option>
                )}
              </For>
            </select>

            <button class="btn-primary" type="submit">
              保存
            </button>
          </form>
        </div>
      )}
    </Show>
  );
}
