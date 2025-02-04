import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import "./usePlaylists"

export default function useStorage<T>(
  key: string,
  initValue: T,
  options?: {
      parser: (value: string) => T,
      serializer: (value: T) => string,
  }
): [T, (newValue: T) => Promise<void>, boolean | null] {
  key = key + "_storage";
  let [storage, setStorage] = useState<T>(initValue);
  let [isNull, setNull] = useState<boolean | null>(null);

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

  AsyncStorage.getItem(key).then((storageString) => {
    if (storageString != null) setStorage(()=>parser(storageString!));
    else {
      AsyncStorage.setItem(key, serializer(initValue));
      setNull(true);
    }
  })

  const saveStorage = async (newValue: T) => {
    setStorage(newValue);
    await AsyncStorage.setItem(key, serializer(newValue))
      .catch(error => {
        AsyncStorage.getItem(key).then((storageString) => {
          setStorage(()=>parser(storageString!));
        })
        let e = new Error("Failed to save storage, error: " + error);
        e.name = "AsyncStorageError";
        throw e;
      })
  };

  return [storage, saveStorage, isNull];
}