import type { RouteSectionProps } from "@solidjs/router";
import { createMemo, createSignal } from "solid-js";
import AssistantList from "./AssistantList";
import ChatPanel from "./ChatPanel";

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
    <div class="size-full sm:flex sm:flex-row sm:divide-x">
      <AssistantList
        assistantId={assistantId()}
        hidden={!showSidebar()}
        onClick={() => setShowSidebar(false)}
      />

      <ChatPanel
        hidden={showSidebar()}
        onBack={() => setShowSidebar(true)}
        assistantId={assistantId()}
      />
    </div>
  );
}
