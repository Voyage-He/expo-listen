import type { StyleProp, ViewStyle } from 'react-native';

export enum PlaybackState {
  IDLE = "IDLE",
  PLAYING = "PLAYING",
  PAUSED = "PAUSED",
  COMPLETED = "COMPLETED",
  ERROR = "ERROR"
}

export type OnPlaybackStateChangeEventLoad = {
  playbackState: PlaybackState
}

export type onDurationChange = {
  duration: number
}

export type onPositionUpdate = {
  position: number
}

export type AudioPlayerModuleEvents = {
  onPlaybackStateChange: (params: OnPlaybackStateChangeEventLoad) => void;
  onDurationChange: (params: onDurationChange) => void;
  onPositionUpdate: (params: onPositionUpdate) => void;
};
