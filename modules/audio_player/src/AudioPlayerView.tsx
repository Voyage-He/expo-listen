import { requireNativeView } from 'expo';
import * as React from 'react';

import { AudioPlayerViewProps } from './AudioPlayer.types';

const NativeView: React.ComponentType<AudioPlayerViewProps> =
  requireNativeView('AudioPlayer');

export default function AudioPlayerView(props: AudioPlayerViewProps) {
  return <NativeView {...props} />;
}
