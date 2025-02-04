// Reexport the native module. On web, it will be resolved to AudioPlayerModule.web.ts

import { Dispatch, SetStateAction, useEffect, useState, createContext } from 'react';

import AudioPlayerModule from './src/AudioPlayerModule';
import {PlaybackState} from './src/AudioPlayer.types';

// and on native platforms to AudioPlayerModule.ts
// export { default } from './src/AudioPlayerModule';
// export * from  './src/AudioPlayer.types';


// export function useAudioPlayer()
//     : [PlaybackState, number, number, 
//       (url: string) => void, 
//       () => void, 
//       () => void,
//       (posotion: number) => void] {
//   const [playbackState, setPlaybackState] = useState(PlaybackState.IDLE)
//   const [position, setPosition] = useState(0)
//   const [duration, setDuration] = useState(0)

//   useEffect(()=>{
//     AudioPlayerModule.addListener("onPlaybackStateChange", (e)=>{
//       setPlaybackState(e.playbackState)
//     })

//     AudioPlayerModule.addListener("onPositionUpdate", (e)=>{
//       setPosition(e.position);
//     })

//     AudioPlayerModule.addListener("onDurationChange", (e)=>{
//       setDuration(e.duration);
//     })

//     return ()=>{
//       AudioPlayerModule.removeAllListeners('onPlaybackStateChange')
//       AudioPlayerModule.removeAllListeners('onPositionUpdate')
//       AudioPlayerModule.removeAllListeners('onDurationChange')
//     }
//   })

//   const play = (url: string)=>{
//     // console.log(assets![0]);
//     AudioPlayerModule.play(url)
//   }
//   const pause = () => {
//     AudioPlayerModule.pause()
//   }
//   const resume = () => {
//     AudioPlayerModule.resume()
//   } 
//   const seek = (position: number) => {
//     AudioPlayerModule.seek(position)
//   }

//   return [playbackState, position, duration, play, pause, resume, seek]
// }

export function useAudioPlayer()
    : [PlaybackState, number, number, 
      (url: string) => void, 
      () => void, 
      () => void,
      (posotion: number) => void] {
  const [playbackState, setPlaybackState] = useState(PlaybackState.IDLE)
  const [position, setPosition] = useState(0)
  const [duration, setDuration] = useState(0)

  const play = (url: string)=>{
    // console.log(assets![0]);
    AudioPlayerModule.play(url)
  }
  const pause = () => {
    AudioPlayerModule.pause()
  }
  const resume = () => {
    AudioPlayerModule.resume()
  } 
  const seek = (position: number) => {
    AudioPlayerModule.seek(position)
  }

  return [playbackState, position, duration, play, pause, resume, seek]
}

export default createContext(useAudioPlayer())