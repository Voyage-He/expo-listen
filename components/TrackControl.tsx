import { Component } from 'solid-js';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
dayjs.extend(duration);

import { audioPlayerStateStore, pauseOrResume, seekTo } from '@lib/audioPlayer';
import Progress from '@components/Progress';

export default (() => {
  let {playBackState, position, duration } = audioPlayerStateStore

  return (<>
    <div>position()</div>
    <div class="p-8 w-full">
      
      <p>playBackState</p>
      {/* <p>{ dayjs.duration($playerPosition, 'seconds').format('mm:ss')}/{dayjs.duration($playerDuration, 'seconds').format('mm:ss')}</p>*/}
      {/* <Progress progress={position / duration ? position / duration: 0} onSeekTo={seekTo} />  */}
    </div>

    <div></div>
  </>);
}) as Component;