import type { RouteSectionProps } from "@solidjs/router";
import { Plus } from "lucide-solid";
import { For } from "solid-js";
import { getAssistants } from "../lib/storage";

export default function ChatPage(props: RouteSectionProps) {
  const id = props.location.query["assistant"] ?? 0;

  return (
    <div class="flex size-full flex-row divide-x">
      <ul class="flex h-full grow flex-col items-center gap-4 p-4">
        <For each={getAssistants()}>
          {(assistant) => (
            <a href={`?assistant=${assistant.id}`}>{assistant.name}</a>
          )}
        </For>
        <button
          class="flex cursor-pointer flex-row items-center gap-2 rounded border-2 p-4"
          onClick={() => {}}
        >
          <Plus class="text-sm" />
          添加…
        </button>
      </ul>
      <section class="hidden h-full grow flex-col md:flex">
        <p>{JSON.stringify(props.location.query)}</p>
        <textarea>输入框</textarea>
      </section>
    </div>
  );
}
