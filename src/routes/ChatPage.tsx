import { useNavigate, type RouteSectionProps } from "@solidjs/router";
import { Bot, Plus, User } from "lucide-solid";
import { createSignal, For, onMount } from "solid-js";
import Split from "split.js";
import { getAssistants } from "../lib/storage";
import "./splitter.css";

export default function ChatPage(props: RouteSectionProps) {
  const navigate = useNavigate();

  if (!props.location.query["assistant"]) {
    navigate("?assistant=0");
  }

  const id = props.location.query["assistant"] ?? 0;
  let textarea: HTMLTextAreaElement | undefined;

  const [res, setRes] = createSignal("");

  onMount(() => {
    Split(["#left", "#right"], {
      sizes: [100 / 3, 200 / 3],
    });
  });

  async function onClick() {
    if (!textarea) {
      return;
    }

    const message = textarea.value;

    const client = new (await import("openai")).OpenAI({
      baseURL: localStorage.getItem("BASE_URL")!,
      apiKey: localStorage.getItem("API_KEY")!,
      dangerouslyAllowBrowser: true,
    });
    setRes("");
    const response = await client.responses.create({
      model: "gpt-4.1-nano",
      input: message,
      stream: true,
    });

    for await (const element of response) {
      if (element.type == "response.output_text.delta") {
        setRes(res() + element.delta);
      }
    }
  }

  return (
    <div class="flex size-full flex-row">
      <ul
        id="left"
        class="desktop:w-40 desktop:grow-0 flex h-full grow flex-col items-center gap-4 p-4"
      >
        <h1 class="text-3xl font-black">Blaze Chat</h1>
        <For each={getAssistants()}>
          {(assistant) => (
            <a href={`?assistant=${assistant.id}`}>{assistant.name}</a>
          )}
        </For>
        <button class="btn flex flex-row items-center gap-2" onClick={() => {}}>
          <Plus class="text-sm" />
          添加…
        </button>
      </ul>
      <section
        id="right"
        class="desktop:flex desktop:grow hidden h-full flex-col p-4"
      >
        <ul class="m-4 flex grow flex-col gap-4">
          <li class="flex flex-row self-end">
            你好！
            <User />
          </li>
          <li class="flex flex-row">
            <Bot />
            你好！
          </li>
          <li class="flex flex-row self-end">
            你好！
            <User />
          </li>
          <li class="flex flex-row">
            <Bot />
            你好！
          </li>
          <li class="flex flex-row self-end">
            你好！
            <User />
          </li>
          <li class="flex flex-row">
            <Bot />
            你好！
          </li>
          <li class="flex flex-row self-end">
            你好！
            <User />
          </li>
          <li class="flex flex-row">
            <Bot />
            你好！
          </li>
        </ul>
        <div class="m-4 flex flex-col items-center rounded border">
          <textarea
            ref={textarea}
            class="h-32 w-full resize-none p-2 focus:outline-none"
          ></textarea>
          <button onClick={onClick} class="btn m-4 self-end">
            发送
          </button>
        </div>
      </section>
    </div>
  );
}
