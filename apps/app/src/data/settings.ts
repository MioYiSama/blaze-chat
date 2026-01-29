export const PrimaryColorKey = "primary-color";

export const PrimaryColors = [
  "red",
  "orange",
  "yellow",
  "green",
  "mint",
  "teal",
  "cyan",
  "blue",
  "indigo",
  "purple",
  "pink",
  "brown",
] as const;

export type PrimaryColor = (typeof PrimaryColors)[number];

export function getPrimaryColor(): PrimaryColor {
  const result = localStorage.getItem(PrimaryColorKey) as PrimaryColor;

  if (result == null) {
    return setPrimaryColor("blue");
  }

  return result;
}

export function setPrimaryColor<T extends PrimaryColor>(color: T): T {
  localStorage.setItem(PrimaryColorKey, color);

  return setRootPrimaryColor(color);
}

export function setRootPrimaryColor<T extends PrimaryColor>(color: T): T {
  document.documentElement.style.setProperty("--primary", `var(--${color})`);

  return color;
}
