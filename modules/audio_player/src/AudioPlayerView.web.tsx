import * as React from 'react';

import { AudioPlayerViewProps } from './AudioPlayer.types';

export default function AudioPlayerView(props: AudioPlayerViewProps) {
  return (
    <div>
      <iframe
        style={{ flex: 1 }}
        src={props.url}
        onLoad={() => props.onLoad({ nativeEvent: { url: props.url } })}
      />
    </div>
  );
}
