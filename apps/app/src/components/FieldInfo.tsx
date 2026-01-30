import type { AnyFieldApi } from "@tanstack/solid-form";
import { Show } from "solid-js";

export function FieldInfo(props: { field: AnyFieldApi }) {
  return (
    <Show when={!props.field.state.meta.isValid}>
      <p class="text-error footnote col-span-2 text-center">
        {props.field.state.meta.errors.map((error) => error?.message)}
      </p>
    </Show>
  );
}
