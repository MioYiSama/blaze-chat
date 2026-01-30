import { generateMessage } from "#ai/index.ts";
import { useAssistantMutation, useAssistantQuery, useAssistantsQuery } from "#data/Assistant.ts";
import { ZeroUUID } from "#data/index.ts";
import type { Message } from "#data/Message.ts";
import { useTopicMutation, useTopicQuery } from "#data/Topic.ts";
import { clamp } from "#util/index.ts";
import { createFileRoute, Link } from "@tanstack/solid-router";
import { createSignal, For, Show, type Accessor, type Setter } from "solid-js";
import { uuidv7 } from "uuidv7";
import * as v from "valibot";
import LucideChevronLeft from "~icons/lucide/chevron-left";
import LucideEllipsis from "~icons/lucide/ellipsis";
import LucideHistory from "~icons/lucide/history";
import LucideMessageCirclePlus from "~icons/lucide/message-circle-plus";
import LucideSearch from "~icons/lucide/search";
import LucideSend from "~icons/lucide/send";
import LucideUserRoundPlus from "~icons/lucide/user-round-plus";

export const Route = createFileRoute("/")({
  validateSearch: v.object({
    assistant: v.optional(v.pipe(v.string(), v.uuid()), ZeroUUID),
    topic: v.optional(v.pipe(v.string(), v.uuid())),
  }),
  component: ChatPage,
});

function ChatPage() {
  const [sidebar, setSidebar] = createSignal(true);

  return (
    <div class="bg-surface *:bg-background grid size-full grid-flow-col grid-rows-[3.5rem_1fr] gap-px sm:grid-cols-[minmax(12rem,1fr)_5fr]">
      <div classList={{ "not-sm:hidden": !sidebar() }}>
        <AssistantListHeader />
      </div>

      <div class="overflow-hidden" classList={{ "not-sm:hidden": !sidebar() }}>
        <AssistantList setSidebar={setSidebar} />
      </div>

      <div classList={{ "not-sm:hidden": sidebar() }}>
        <ChatAreaHeader setSidebar={setSidebar} />
      </div>

      <div classList={{ "not-sm:hidden": sidebar() }}>
        <ChatArea />
      </div>
    </div>
  );
}

function AssistantListHeader() {
  const mutation = useAssistantMutation();

  return (
    <div class="center-child size-full gap-2 pr-2 pl-4">
      <form
        class="border-surface flex flex-row items-center gap-2 rounded-md border px-2 py-1"
        onSubmit={(e) => e.preventDefault()}
      >
        <LucideSearch />
        <input class="size-full outline-0" type="search" placeholder="搜索助手" />
      </form>
      <button
        class="btn-ghost"
        onclick={() => mutation.mutate({ id: uuidv7(), name: "未命名助手", modelId: null })}
      >
        <LucideUserRoundPlus />
      </button>
    </div>
  );
}

function AssistantList(props: { setSidebar: Setter<boolean> }) {
  const assistants = useAssistantsQuery();

  return (
    <ul class="size-full overflow-y-scroll">
      <For each={assistants.data}>
        {(assistant) => (
          <li>
            <Link
              class="link-active btn-ghost py-6 text-center"
              to="/"
              search={{ assistant: assistant.id }}
              onClick={() => props.setSidebar(false)}
            >
              {assistant.name}
            </Link>
          </li>
        )}
      </For>
    </ul>
  );
}

function ChatAreaHeader(props: { setSidebar: Setter<boolean> }) {
  const search = Route.useSearch();
  const assistantQuery = useAssistantQuery(() => search().assistant);

  return (
    <div class="flex size-full flex-row items-center px-1 sm:px-2">
      <button class="btn-ghost sm:hidden" onClick={() => props.setSidebar(true)}>
        <LucideChevronLeft />
      </button>
      <button class="btn-ghost">
        <LucideHistory />
      </button>

      <div class="center-child grow flex-col">
        <Show when={assistantQuery.data}>
          {(assistant) => <p class="headline">{assistant().name}</p>}
        </Show>
      </div>

      <Show when={search().topic}>
        <Link class="btn-ghost" to="/" search={{ assistant: search().assistant }}>
          <LucideMessageCirclePlus />
        </Link>
      </Show>

      <Link to="/assistant" search={{ id: search().assistant }} class="btn-ghost">
        <LucideEllipsis />
      </Link>
    </div>
  );
}

function ChatArea() {
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  const topicQuery = useTopicQuery(() => search().topic);
  const mutation = useTopicMutation();

  const [height, setHeight] = createSignal(160);

  let textarea: HTMLTextAreaElement;

  return (
    <div class="grid size-full" style={{ "grid-template-rows": `1fr 0.5rem ${height()}px` }}>
      <ul class="flex flex-col">
        <Show when={topicQuery.data}>
          {(topic) => (
            <For each={topic().messages}>
              {({ role, content }) => (
                <p
                  classList={{
                    "self-start": role === "assistant",
                    "self-end": role === "user",
                  }}
                >
                  {content}
                </p>
              )}
            </For>
          )}
        </Show>
      </ul>

      <Splitter target={[height, setHeight]} min={128} max={512} />

      <form
        class="bg-card flex flex-col gap-2 p-2"
        onSubmit={async (e) => {
          e.preventDefault();

          const message: Message = {
            role: "user",
            content: textarea.value,
          };

          let messages: Message[];

          if (search().topic) {
            if (topicQuery.data) {
              messages = [...topicQuery.data.messages, message];
              mutation.mutate({ ...topicQuery.data, messages });
            } else return;
          } else {
            const id = uuidv7();

            messages = [message];

            mutation.mutate({
              id,
              name: "未命名话题",
              assistantId: search().assistant,
              messages,
            });

            await navigate({ to: "/", search: { assistant: search().assistant, topic: id } });
          }

          textarea.value = "";

          const result = await generateMessage(search().assistant, messages);
          messages.push({ role: "assistant", content: result });
          mutation.mutate({ ...topicQuery.data!, messages });
        }}
      >
        <textarea
          class="grow resize-none p-2 outline-0"
          placeholder="输入消息内容"
          ref={(e) => (textarea = e)}
        />
        <button class="btn-primary self-end px-3 py-1.5" type="submit">
          <LucideSend />
          <span>发送</span>
        </button>
      </form>
    </div>
  );
}

// Note: we do not need reactive props
function Splitter({
  target: [value, setValue],
  min,
  max,
}: {
  target: [Accessor<number>, Setter<number>];
  min: number;
  max: number;
}) {
  let start: number | null = null;

  return (
    <div
      class="adaptive-hover:bg-surface cursor-row-resize transition-colors"
      onPointerDown={(e) => {
        start = value() + e.clientY;
        e.currentTarget.setPointerCapture(e.pointerId);
      }}
      onPointerMove={(e) => {
        if (start) setValue(clamp(min, start - e.clientY, max));
      }}
      onPointerUp={() => (start = null)}
      onPointerCancel={() => (start = null)}
    />
  );
}
