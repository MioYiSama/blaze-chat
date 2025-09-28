import { BackIcon, SendIcon, SettingsIcon } from "@/components/icons";
import { getAssistantById } from "@/lib/db";
import { createResource } from "solid-js";

export default function ChatPanel(props: {
  hidden: boolean;
  onBack(): void;
  assistantId: number;
}) {
  const [assistant] = createResource(
    () => props.assistantId,
    async (id) => {
      return await getAssistantById(id);
    },
  );

  return (
    <div
      class="flex size-full flex-col divide-y"
      classList={{
        "not-sm:hidden": props.hidden,
      }}
    >
      <div class="flex w-full items-center justify-between p-2">
        <button class="sm:invisible" onClick={props.onBack}>
          <BackIcon />
        </button>
        <h2 class="overflow-hidden overflow-ellipsis">{assistant()?.name}</h2>
        <button class="sm:invisible">
          <SettingsIcon />
        </button>
      </div>

      <div class="grow">
        <p>Message</p>
      </div>

      <div class="flex h-1/5 flex-col p-2">
        <textarea
          class="size-full resize-none outline-0"
          placeholder="聊天栏……"
        ></textarea>
        <button class="hover-color flex flex-row items-center gap-1 self-end rounded border px-4 py-1">
          <SendIcon />
          <span>发送</span>
        </button>
      </div>
    </div>
  );
}
