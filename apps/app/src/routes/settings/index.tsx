import {
  getPrimaryColor,
  PrimaryColors,
  setPrimaryColor,
  type PrimaryColor,
} from "#data/settings.ts";
import { createFileRoute } from "@tanstack/solid-router";
import { createSignal, For } from "solid-js";

export const Route = createFileRoute("/settings/")({
  staticData: {
    settingsName: "通用设置",
  },
  component: CommonSettingsPage,
});

function CommonSettingsPage() {
  return (
    <div>
      <PrimaryColorForm />
    </div>
  );
}

function PrimaryColorForm() {
  const [color, setColor] = createSignal(getPrimaryColor());

  function onChange(e: Event) {
    if (e.target instanceof HTMLInputElement) {
      const color = e.target.value as PrimaryColor;

      setPrimaryColor(color);
      setColor(color);
    }
  }

  return (
    <form class="flex flex-row flex-wrap items-center gap-2" onChange={onChange}>
      <h3 class="title3 shrink-0">主题色</h3>

      <For each={PrimaryColors}>
        {(c) => (
          <label
            class="circle has-checked:border-foreground block size-8 cursor-pointer has-checked:border-2"
            style={{ "background-color": `var(--${c})` }}
            title={c}
          >
            <input
              class="appearance-none"
              type="radio"
              name="primary-color"
              value={c}
              bool:checked={c === color()}
            />
          </label>
        )}
      </For>
    </form>
  );
}
