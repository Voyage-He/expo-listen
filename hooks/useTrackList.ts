import { Accessor } from "solid-js";
import type { Track } from "@lib/track";
import useStorage from "./useStorage";

export type TrackList = string[];

export default function useTrackList(key: string): [Accessor<TrackList>, (track: Track) => void, (track: Track) => void ] {
  
  let [trackList, setTrackList] = useStorage<string[]>(
    key + "TrackList",
    [],
    {
      parser: (value: string) => {
        return JSON.parse(value);
      },
      serializer: (value: string[]) => {
        return JSON.stringify(value);
      }
    }
  );

  const addTrack = (track: Track) => {
    if (trackList().includes(track.id)) return;
    setTrackList([...trackList(), track.id]);
  };

  const removeTrack = (track: Track) => {
    setTrackList(trackList().filter((id) => id !== track.id));
  };

  return [trackList, addTrack, removeTrack];
}