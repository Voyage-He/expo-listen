import { useAudioPlayer } from "../modules/audio_player";
import Progress from '@/components/Progress';

export default (() => {
  const [playbackState, position, duration, play, pause, resume, seek] = useAudioPlayer()

  return (<>
    <div>position</div>
    <div className="p-8 w-full">
      <Progress progress={position / duration} onSeek={seek} />
      <p>playBackState</p>
      {/* <p>{ dayjs.duration($playerPosition, 'seconds').format('mm:ss')}/{dayjs.duration($playerDuration, 'seconds').format('mm:ss')}</p>*/}
      {/* <Progress progress={position / duration ? position / duration: 0} onSeekTo={seekTo} />  */}
    </div>

    <div></div>
  </>);
});