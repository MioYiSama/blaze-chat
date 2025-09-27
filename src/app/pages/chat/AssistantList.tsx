import { AddIcon } from "@/components/icons";
import { addAssistant, getAssistants } from "@/lib/db";
import { createResource, For } from "solid-js";

export default function AssistantList(props: {
  hidden: boolean;
  assistantId: number;
}) {
  const [assistants, { refetch }] = createResource(getAssistants);

  async function onClick() {
    const name = window.prompt("请输入助手名称");

    if (name) {
      await addAssistant(name);
      refetch();
    }
  }

  return (
    <div
      class="flex w-full flex-col items-center gap-4 p-4 sm:w-1/3"
      classList={{
        "not-sm:hidden": props.hidden,
      }}
    >
      <h2 class="w-full text-center sm:w-max">助手列表</h2>

      <ul class="flex h-full w-full flex-col gap-4 overflow-y-scroll">
        <For each={assistants()}>
          {(assistant) => (
            <li>
              <a
                href={`?assistant=${assistant.id}`}
                class="bg-secondary flex w-full flex-col items-center rounded-lg py-4 sm:px-4"
                classList={{
                  "bg-primary!": assistant.id === props.assistantId,
                }}
              >
                🤖 {assistant.name}
              </a>
            </li>
          )}
        </For>
      </ul>

      <button
        onClick={onClick}
        class="hover:bg-secondary flex w-max flex-row items-center justify-center gap-2 rounded border px-4 py-2"
      >
        <AddIcon />
        <span>新建助手</span>
      </button>
    </div>
  );
}
