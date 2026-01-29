export type Key<T extends object> = keyof T & string;
export type Keys<T extends object> = readonly Key<T>[];
export type KeyOrKeys<T extends object> = Key<T> | Keys<T>;

export type ValidKey<T extends object> = keyof {
  [K in Key<T> as T[K] extends IDBValidKey ? K : never]: void;
} &
  string;
export type ValidKeys<T extends object> = readonly ValidKey<T>[];
export type ValidKeyOrKeys<T extends object> = ValidKey<T> | ValidKeys<T>;

export type PickKeyOrKeys<T extends object, Ks extends KeyOrKeys<T>> =
  Ks extends Key<T> ? Pick<T, Ks> : Ks extends Keys<T> ? Pick<T, Ks[number]> : never;

export type InferTKey<T extends object, Ks extends KeyOrKeys<T>> =
  Ks extends Key<T>
    ? T[Ks]
    : Ks extends Keys<T>
      ? {
          [K in keyof Ks]: T[Ks[number]];
        }
      : never;
