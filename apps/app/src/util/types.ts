import "solid-js";

import type { ComponentProps, JSXElement } from "solid-js";

declare module "solid-js" {
  namespace JSX {
    interface InputHTMLAttributes<T> extends HTMLAttributes<T> {
      "bool:checked"?: any;
    }
  }
}

export type Icon = (props: ComponentProps<"svg">) => JSXElement;
