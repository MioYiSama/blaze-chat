import { children, createEffect, onMount, type JSXElement } from "solid-js";

export function Dialog(props: { open: boolean; children: JSXElement; onClose(): void }) {
  const resolved = children(() => props.children);

  let dialog: HTMLDialogElement;

  onMount(() => {
    createEffect(() => {
      if (props.open) {
        dialog.showModal();
      } else {
        dialog.close();
      }
    });
  });

  function onClick(e: MouseEvent) {
    if (e.target === dialog) {
      props.onClose();
    }
  }

  return (
    <dialog class="rounded-xl" ref={(e) => (dialog = e)} onClick={onClick}>
      {resolved()}
    </dialog>
  );
}
