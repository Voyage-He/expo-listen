import { NativeModule, requireNativeModule } from 'expo';

import { AudioPlayerModuleEvents } from './AudioPlayer.types';

declare class AudioPlayerModule extends NativeModule<AudioPlayerModuleEvents> {
  play(url: string): Promise<void>;
  pause(): Promise<void>;
  resume(): Promise<void>;
  seek(postion: number): Promise<void>;
}

// This call loads the native module object from the JSI.
export default requireNativeModule<AudioPlayerModule>('AudioPlayer');
