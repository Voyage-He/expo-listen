import { useState, useEffect } from "react";
import { Paths, File } from "expo-file-system/next";
import * as BilibiliAPI from "@/src/lib/bilibiliAPI";
import useStorage from "./useStorage";
import {useContext} from "react";
import AudioPlayerContext from "@/modules/audio_player";

export default function useTrack(id: string): [Track | null, (newValue: Track | null) => Promise<void>] {
  const audioFile = new File(Paths.document, 'audio_file', id);
  let [track, saveTrack, isStorageNull] = useStorage<Track | null>(
    `track-${id}`,
    null,
    {
      parser: (value: string) => JSON.parse(value),
      serializer: (value: Track | null) => JSON.stringify(value),
    }
  );

  const fetchTrack = async () => {
    let track = await BilibiliAPI.getTrackInfo(id);
    saveTrack(track as Track);
  };

  const fetchAudio = async () => {
    audioFile.create();
    let audio = await BilibiliAPI.getAudioFile(id);
    audioFile.write(new Uint8Array(audio));
  }

  const playTrack = async () => {
    if (!audioFile.exists) {
      await fetchAudio();
    }

    const [playbackState, position, duration, play, pause, resume, seek] = useContext(AudioPlayerContext)
    play(audioFile.uri);
  }

  useEffect(() => {
    if (isStorageNull !== null && isStorageNull) {
      fetchTrack();
    };
  }, [isStorageNull]);

  return [track, playTrack];
}