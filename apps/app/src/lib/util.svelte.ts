import { page } from "$app/state";

/**
 * @example $derived(getUrlQueryParam("name"))
 */
export function getUrlQueryParam(key: string): string | null {
  return page.url.searchParams.get(key);
}
