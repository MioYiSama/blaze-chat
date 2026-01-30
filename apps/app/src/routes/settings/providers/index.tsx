import { Dialog } from "#components/Dialog.tsx";
import {
  ProviderIcons,
  ProviderSchema,
  ProviderTypes,
  useProviderMutation,
  useProvidersQuery,
  type Provider,
  type ProviderType,
} from "#data/Provider.ts";
import { emptyStringAsNull } from "#util/index.ts";
import { createForm, type AnyFieldApi } from "@tanstack/solid-form";
import { createFileRoute, Link } from "@tanstack/solid-router";
import { createSignal, For, Show } from "solid-js";
import { Dynamic } from "solid-js/web";
import { uuidv7 } from "uuidv7";
import LucidePlus from "~icons/lucide/plus";

export const Route = createFileRoute("/settings/providers/")({
  staticData: {
    settingsName: "供应商列表",
  },
  component: ProvidersPage,
});

function ProvidersPage() {
  const providers = useProvidersQuery();
  const [dialog, setDialog] = createSignal(false);

  return (
    <div>
      <button class="btn-primary" onClick={() => setDialog(true)}>
        <LucidePlus />
        <span>添加供应商</span>
      </button>

      <div class="grid grid-cols-1 gap-4 overflow-y-scroll sm:grid-cols-3">
        <For each={providers.data}>
          {({ id, name, type }) => (
            <Link
              to="/settings/providers/provider"
              search={{ id }}
              class="bg-surface btn-primary rounded-lg py-6"
            >
              <Dynamic component={ProviderIcons[type]} />
              <span>{name}</span>
            </Link>
          )}
        </For>
      </div>

      <Dialog open={dialog()} onClose={() => setDialog(false)}>
        <MyForm onComplete={() => setDialog(false)} />
      </Dialog>
    </div>
  );
}

function MyForm(props: { onComplete(): void }) {
  const mutation = useProviderMutation();

  const form = createForm(() => ({
    defaultValues: {
      id: uuidv7(),
      name: "",
      type: "OpenAI",
      apiKey: "",
      baseUrl: null,
    } as Provider,
    validators: {
      onSubmit: ProviderSchema,
    },
    onSubmit: async ({ value }) => {
      mutation.mutate(value);
      props.onComplete();
    },
  }));

  return (
    <form
      class="grid grid-cols-[max-content_1fr] items-center gap-2 p-2 sm:gap-4 sm:p-4"
      onSubmit={async (e) => {
        e.preventDefault();
        e.stopPropagation();
        await form.handleSubmit();
      }}
    >
      <h3 class="title3 col-span-2 text-center">
        <strong>添加供应商</strong>
      </h3>

      <form.Field
        name="name"
        children={(field) => (
          <>
            <label class="text-center" for={field().name}>
              名称
            </label>
            <input
              class="input"
              name={field().name}
              value={field().state.value}
              onBlur={field().handleBlur}
              onInput={(e) => field().handleChange(e.target.value)}
            />
            <FieldInfo field={field()} />
          </>
        )}
      />

      <form.Field
        name="type"
        children={(field) => (
          <>
            <label class="text-center" for={field().name}>
              类型
            </label>
            <select
              class="input"
              name={field().name}
              value={field().state.value}
              onBlur={field().handleBlur}
              onChange={(e) => field().handleChange(e.target.value as ProviderType)}
            >
              <For each={ProviderTypes}>{(type) => <option value={type}>{type}</option>}</For>
            </select>
            <FieldInfo field={field()} />
          </>
        )}
      />

      <form.Field
        name="apiKey"
        children={(field) => (
          <>
            <label class="text-center" for={field().name}>
              API密钥
            </label>
            <input
              class="input"
              name={field().name}
              value={field().state.value}
              onBlur={field().handleBlur}
              onInput={(e) => field().handleChange(e.target.value)}
            />
            <FieldInfo field={field()} />
          </>
        )}
      />

      <form.Field
        name="baseUrl"
        children={(field) => (
          <>
            <label class="text-center" for={field().name}>
              BaseURL
            </label>
            <input
              class="input"
              placeholder="可选"
              name={field().name}
              value={field().state.value ?? ""}
              onBlur={field().handleBlur}
              onInput={(e) => field().handleChange(emptyStringAsNull(e.target.value))}
            />
            <FieldInfo field={field()} />
          </>
        )}
      />

      <button class="btn-primary col-span-2" type="submit">
        确定
      </button>
    </form>
  );
}

function FieldInfo(props: { field: AnyFieldApi }) {
  return (
    <Show when={!props.field.state.meta.isValid}>
      <p class="text-error footnote col-span-2 text-center">
        {props.field.state.meta.errors.map((error) => error?.message)}
      </p>
    </Show>
  );
}
