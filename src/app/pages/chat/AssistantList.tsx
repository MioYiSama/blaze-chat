import { AddIcon } from "@/components/icons";
import { addAssistant, type Assistant, getAssistants } from "@/lib/db";
import { createResource, createSelector, For } from "solid-js";

export default function AssistantList(props: {
  hidden: boolean;
  assistantId: number;
  onClick(): void;
}) {
  const [assistants, { refetch }] = createResource(getAssistants);

  const isSelected = createSelector(() => props.assistantId);

  async function onClick() {
    const name = window.prompt("请输入助手名称");

    if (name) {
      await addAssistant(name);
      refetch();
    }
  }

  return (
    <div
      class="flex flex-col items-center gap-4 p-4 not-sm:w-full sm:w-2/7"
      classList={{
        "not-sm:hidden": props.hidden,
      }}
    >
      <h2 class="text-2xl">助手列表</h2>

      <ul class="flex h-full w-full flex-col gap-4 overflow-y-scroll">
        <For each={assistants()}>
          {(assistant) => (
            <AssistantItem
              assistant={assistant}
              selected={isSelected(assistant.id!)}
              onClick={props.onClick}
            />
          )}
        </For>
      </ul>

      <button
        onClick={onClick}
        class="hover-color flex flex-row items-center justify-center gap-1 rounded border px-4 py-2"
      >
        <AddIcon />
        <span>新建助手</span>
      </button>
    </div>
  );
}

function AssistantItem(props: {
  assistant: Assistant;
  selected: boolean;
  onClick(): void;
}) {
  return (
    <li>
      <a
        href={`?assistant=${props.assistant.id}`}
        onClick={props.onClick}
        class="border-secondary hover-color block overflow-hidden rounded-lg border py-4 text-center overflow-ellipsis"
        classList={{
          "bg-primary!": props.selected,
        }}
      >
        {props.assistant.name}
      </a>
    </li>
  );
}
