import { addAssistantMutation, getAssistantQuery, getAssistantsQuery } from "#data/query.ts";
import { ZeroUUID } from "#schemas/index.ts";
import { clamp } from "#util/math.ts";
import { createFileRoute, Link } from "@tanstack/solid-router";
import { createSignal, For, Show, type Setter } from "solid-js";
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

      <div class="overflow-y-scroll" classList={{ "not-sm:hidden": !sidebar() }}>
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
  const mutation = addAssistantMutation();

  return (
    <div class="flex size-full items-center justify-center gap-2 pr-2 pl-4">
      <form
        class="border-surface flex flex-row items-center gap-2 rounded-md border px-2 py-1"
        onSubmit={(e) => e.preventDefault()}
      >
        <LucideSearch />
        <input class="size-full outline-0" type="search" placeholder="搜索助手" />
      </form>
      <button
        class="icon-button"
        onclick={() => {
          mutation.mutate({ name: "未命名助手" });
        }}
      >
        <LucideUserRoundPlus />
      </button>
    </div>
  );
}

function AssistantList(props: { setSidebar: Setter<boolean> }) {
  const assistants = getAssistantsQuery();

  return (
    <ul class="size-full">
      <For each={assistants.data}>
        {(assistant) => (
          <li>
            <Link
              class="[&.active]:text-primary icon-button block py-6 text-center"
              to="/"
              search={{ assistant: assistant.id, topic: undefined }}
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

  const assistant = getAssistantQuery(() => search().assistant);

  return (
    <div class="flex size-full flex-row items-center px-1 sm:px-2">
      <button class="icon-button sm:hidden" onClick={() => props.setSidebar(true)}>
        <LucideChevronLeft />
      </button>
      <button class="icon-button">
        <LucideHistory />
      </button>

      <div class="flex grow flex-col items-center">
        <Show when={assistant.isSuccess && assistant.data}>
          {(assistant) => <p class="headline">{assistant().name}</p>}
        </Show>
      </div>

      <Show when={search().topic}>
        <Link
          class="icon-button inline-block"
          to="/"
          search={{ assistant: search().assistant, topic: undefined }}
        >
          <LucideMessageCirclePlus />
        </Link>
      </Show>
      <button class="icon-button">
        <LucideEllipsis />
      </button>
    </div>
  );
}

function ChatArea() {
  const [height, setHeight] = createSignal(160);

  return (
    <div class="grid size-full" style={{ "grid-template-rows": `1fr 0.5rem ${height()}px` }}>
      <div></div>

      <Splitter value={height()} set={setHeight} min={128} max={512} />

      <form class="bg-card flex flex-col gap-2 p-2" onSubmit={(e) => e.preventDefault()}>
        <textarea class="grow resize-none p-2 outline-0" placeholder="输入消息内容" />
        <button
          class="bg-primary flex flex-row items-center gap-2 self-end rounded-md px-3 py-1.5"
          type="submit"
        >
          <LucideSend />
          <span>发送</span>
        </button>
      </form>
    </div>
  );
}

function Splitter(props: { value: number; set(value: number): void; min: number; max: number }) {
  let dragging = false;
  let start = 0;

  return (
    <div
      class="adaptive-hover:bg-surface cursor-row-resize transition-colors"
      onPointerDown={(e) => {
        e.currentTarget.setPointerCapture(e.pointerId);

        dragging = true;
        start = props.value + e.clientY;
      }}
      onPointerMove={(e) => {
        if (dragging) props.set(clamp(props.min, start - e.clientY, props.max));
      }}
      onPointerUp={() => (dragging = false)}
      onPointerCancel={() => (dragging = false)}
    />
  );
}
