import { Dialog } from "#components/Dialog.tsx";
import { FieldInfo } from "#components/FieldInfo.tsx";
import {
  ModelIcons,
  ModelSchema,
  ModelTypes,
  useModelMutation,
  useProviderModelsQuery,
  type Model,
  type ModelType,
} from "#data/Model.ts";
import { ProviderSchema, useProviderQuery, type Provider } from "#data/Provider.ts";
import { createForm } from "@tanstack/solid-form";
import { createFileRoute } from "@tanstack/solid-router";
import { createSignal, For, Show } from "solid-js";
import { Dynamic } from "solid-js/web";
import { uuidv7 } from "uuidv7";
import * as v from "valibot";
import LucidePlus from "~icons/lucide/plus";

export const Route = createFileRoute("/settings/providers/provider")({
  staticData: {
    settingsName: "供应商设置",
  },
  validateSearch: v.object({
    id: v.pipe(v.string(), v.uuid()),
  }),
  component: ProviderPage,
});

function ProviderPage() {
  const providerId = Route.useSearch({ select: (search) => search.id });

  const providerQuery = useProviderQuery(providerId);
  const modelsQuery = useProviderModelsQuery(providerId);

  const [dialog, setDialog] = createSignal(false);

  return (
    <div>
      <Show when={providerQuery.data}>{(provider) => <ProviderForm provider={provider()} />}</Show>

      <button class="btn-primary" onClick={() => setDialog(true)}>
        <LucidePlus />
        <span>添加模型</span>
      </button>

      <Dialog open={dialog()} onClose={() => setDialog(false)}>
        <AddModelForm providerId={providerId()} onComplete={() => setDialog(false)} />
      </Dialog>

      <div class="flex flex-row flex-wrap gap-2 overflow-y-scroll">
        <For each={modelsQuery.data}>
          {({ identifier, name, type }) => (
            <div class="bg-surface btn-primary rounded-lg p-6">
              <Dynamic component={ModelIcons[type]} />
              <span>
                {name}
                <br /> ({identifier})
              </span>
            </div>
          )}
        </For>
      </div>
    </div>
  );
}

function ProviderForm(props: { provider: Provider }) {
  // TODO
  const form = createForm(() => ({
    defaultValues: props.provider,
    validators: {
      onSubmit: ProviderSchema,
    },
    onSubmit: async () => {},
  }));

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        e.stopPropagation();
        await form.handleSubmit();
      }}
    >
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
    </form>
  );
}

function AddModelForm(props: { providerId: string; onComplete(): void }) {
  let nameInput: HTMLInputElement;
  let identifierInput: HTMLInputElement;
  let typeSelect: HTMLSelectElement;

  const [errorMessages, setErrorMessages] = createSignal<string[]>([]);
  const mutation = useModelMutation();

  async function onSubmit(e: SubmitEvent) {
    e.preventDefault();

    const data: Model = {
      id: uuidv7(),
      providerId: props.providerId,
      name: nameInput.value,
      identifier: identifierInput.value,
      type: typeSelect.value as ModelType,
    };

    const result = v.safeParse(ModelSchema, data);

    if (!result.success) {
      setErrorMessages(result.issues.map((issue) => issue.message));
      return;
    }

    mutation.mutate(data);
    props.onComplete();
  }

  return (
    <form
      class="grid grid-cols-[max-content_1fr] items-center gap-2 p-2 sm:gap-4 sm:p-4"
      onSubmit={onSubmit}
    >
      <h3 class="title3 col-span-2 text-center">
        <strong>添加模型</strong>
      </h3>

      <label class="text-center" for="identifier">
        ID
      </label>
      <input class="input" id="identifier" ref={(e) => (identifierInput = e)} required />

      <label class="text-center" for="name">
        名称
      </label>
      <input class="input" id="name" ref={(e) => (nameInput = e)} required />

      <label class="text-center" for="type">
        类型
      </label>
      <select class="input" id="type" ref={(e) => (typeSelect = e)}>
        <For each={ModelTypes}>{(type) => <option value={type}>{type}</option>}</For>
      </select>

      <button class="btn-primary col-span-2" type="submit">
        确定
      </button>

      <Show when={errorMessages().length > 0}>
        <ul class="text-error col-span-2 text-center">
          <For each={errorMessages()}>{(message) => <li>{message}</li>}</For>
        </ul>
      </Show>
    </form>
  );
}
