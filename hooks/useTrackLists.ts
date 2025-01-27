import { Track } from "@lib/track";
import useStorage from "./useStorage";
import useTrackList, { type TrackList } from "./useTrackList";
import { Accessor } from "solid-js";

export type TrackLists = {
  name: string;
  tracks: [Accessor<TrackList>, (track: Track) => void, (track: Track) => void ];
}[];

export default function useTrackLists() {
  let trackLists = useStorage<TrackLists>(
    'trackLists',
    [
      { name: '我喜欢', tracks: useTrackList('我喜欢') },
    ],
    {
      parser: (value: string): TrackLists => {
          let trackListNames: string[] = JSON.parse(value);
          let l = trackListNames.map((trackListName: string) => {
            return {
              name: trackListName,
              tracks: useTrackList(trackListName)
            };
          });
          return l;
      },
      serializer: (value: TrackLists) => {
        return JSON.stringify(value.map(trackList => trackList.name));
      }
    }
  );

  return trackLists;
}