import { NativeModule, requireNativeModule } from 'expo';

import { AudioPlayerModuleEvents } from './AudioPlayer.types';

declare class AudioPlayerModule extends NativeModule<AudioPlayerModuleEvents> {
  play(url: string): Promise<void>;
  pause(): Promise<void>;
  resume(): Promise<void>;
  seek(postion: number): Promise<void>;
}

// This call loads the native module object from the JSI.
// export default requireNativeModule<AudioPlayerModule>('AudioPlayer');
export default {
  play: async (url: string): Promise<void> => {
    const module = await requireNativeModule<AudioPlayerModule>('AudioPlayer');
    return module.play(url);
  },
  pause: async (): Promise<void> => {
    const module = await requireNativeModule<AudioPlayerModule>('AudioPlayer');
    return module.pause();
  },
  resume: async (): Promise<void> => {
    const module = await requireNativeModule<AudioPlayerModule>('AudioPlayer');
    return module.resume();
  },
  seek: async (postion: number): Promise<void> => {
    const module = await requireNativeModule<AudioPlayerModule>('AudioPlayer');
    return module.seek(postion);
  },
  addListener: (event: string, listener: (...args: any[]) => void) => {
    
  },
  removeAllListeners: (event: string) => {
  }
};
