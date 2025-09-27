import { BackIcon, SendIcon, SettingsIcon } from "@/components/icons";
import { getAssistantById } from "@/lib/db";
import type { RouteSectionProps } from "@solidjs/router";
import { createMemo, createResource, createSignal } from "solid-js";
import AssistantList from "./AssistantList";

export default function ChatPage(props: RouteSectionProps) {
  const [showSidebar, setShowSidebar] = createSignal(false);

  const assistantId = createMemo(() => {
    let param = props.location.query["assistant"];

    param = Array.isArray(param) ? param[0] : param;

    if (!param) {
      return 0;
    }

    const id = Number.parseInt(param);

    if (Number.isNaN(id)) {
      return 0;
    }

    return id;
  });

  return (
    <div class="sm:divide-primary flex size-full flex-row sm:divide-x">
      <AssistantList assistantId={assistantId()} hidden={!showSidebar()} />
      <ChatPanel
        hidden={showSidebar()}
        onBack={() => setShowSidebar(true)}
        assistantId={assistantId()}
      />
    </div>
  );
}

function ChatPanel(props: {
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
      class="divide-primary flex size-full flex-col divide-y"
      classList={{
        "not-sm:hidden": props.hidden,
      }}
    >
      <div class="flex w-full items-center justify-between p-2">
        <button class="sm:invisible" onClick={props.onBack}>
          <BackIcon />
        </button>
        <h2>{assistant()?.name}</h2>
        <button class="sm:invisible">
          <SettingsIcon />
        </button>
      </div>

      <div class="grow">
        <p>hello</p>
      </div>

      <div class="flex flex-col p-2">
        <textarea
          class="h-24 w-full resize-none outline-0 placeholder:select-none"
          placeholder="聊天栏……"
        ></textarea>
        <button class="hover:bg-secondary flex flex-row items-center gap-1 self-end rounded border px-3 py-1">
          <SendIcon />
          <span class="select-none">发送</span>
        </button>
      </div>
    </div>
  );
}
