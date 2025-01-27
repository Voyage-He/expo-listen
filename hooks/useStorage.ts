import { createSignal, onMount, createEffect, Signal } from "solid-js";
import { renderHook } from "@solidjs/testing-library"
import { Preferences } from "@capacitor/preferences";

function useStorage(key: string, initValue: string): Signal<string>;
function useStorage<T>(
  key: string,
  initValue: T,
  options: {
    parser: (value: string) => T,
    serializer: (value: T) => string,
}): Signal<T>;

function useStorage<T>(
  key: string,
  initValue: T,
  options?: {
      parser: (value: string) => T,
      serializer: (value: T) => string,
  }
): Signal<T> {
  key = key + "_storage";
  let [storage, setStorage] = createSignal<T>(initValue);

  if (!options && typeof initValue !== "string") {
      throw new Error("useStorage: options is required when value is not a string");
  }

  if (!options && typeof initValue === "string") {
      options = {
          parser: (value: string) => value as T,
          serializer: (value: T) => value as string,
      };
  }

  let { parser, serializer } = options!;

  Preferences.get({ key }).then(({ value: storageString }) => {
    if (storageString == null) {
      Preferences.set({ key, value: serializer(initValue) });
    }
    else {
      try {
        setStorage(()=>parser(storageString));
      } catch (error) {
        if (error instanceof Error) {
          
        }
      }
    }
  });

  createEffect(async () => {
    await Preferences.set({ key, value: serializer(storage()) });
    
    // TODO crash because of infinite loop
    // let { value: localStorage } = await Preferences.get({ key });
    // console.log(localStorage);
    // if (localStorage != storage()) {
    //   setStorage(()=>parser(localStorage!));
    // }
  });

  return [storage, setStorage];
}

export default useStorage;