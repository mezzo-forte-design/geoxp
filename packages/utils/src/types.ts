/**
 * @hidden
 * @module
 * */

export type Key<K, T> = T extends [never] ? string | symbol : K | keyof T;

type ListenerFunction<K, T, F> = T extends [never]
  ? F
  : K extends keyof T
    ? T[K] extends unknown[]
      ? (...args: T[K]) => void
      : never
    : never;

export type Listener<K, T> = ListenerFunction<K, T, (...args: unknown[]) => void>;
