import "solid-js";

declare module "solid-js" {
  namespace JSX {
    interface InputHTMLAttributes<T> extends HTMLAttributes<T> {
      "bool:checked"?: any;
    }
  }
}
