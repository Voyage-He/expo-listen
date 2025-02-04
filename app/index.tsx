import { Pressable, Text, View, StyleSheet, TextInput, Button } from "react-native";
import { useEffect, useState } from "react";
import { useAssets } from "expo-asset"
import { useContext } from "react";

import AudioPlayerContext, { useAudioPlayer } from "../modules/audio_player";
import { Link } from "expo-router";
import TrackControl from "@/components/TrackControl";
import usePlaylists from "@/hooks/usePlaylists";

export default function Index() {
  const [assets, error] = useAssets([require("../assets/audio/test.wav")]);
  const [seekPosition, setSeekPosition] = useState("0");
  const [playbackState, position, duration, play, pause, resume, seek] = useContext(AudioPlayerContext)
  const [playlists, manipulatePlaylists] = usePlaylists()


  return (<View>
    <View>
      <Link href={"/search"} asChild>
        <Button title="to search" />
      </Link>
      <TrackControl />
      
    </View>
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>state: {playbackState}</Text>
      <Text>current :{position}</Text>
      <Text>total:{duration}</Text>
      <TextInput value={seekPosition} onChangeText={setSeekPosition} />
      <Pressable onPress={()=>{seek(parseInt(seekPosition)*1000)}}>
        <Text style={style.space}>seek</Text>
      </Pressable>
      <Pressable onPress={()=>{play(assets![0].localUri!)}}>
        <Text style={style.space}>play</Text>
      </Pressable>
      <Pressable onPress={pause}>
        <Text style={style.space}>pause</Text>
      </Pressable>
      <Pressable onPress={resume}>
        <Text style={style.space}>resume</Text>
      </Pressable>

      <View>
        <Text>Playlists</Text>
        {playlists.map((playlist, index) => (
          <Link href={`/playlist/${playlist.name}`} asChild key={index}>
            <Text>{playlist.name}</Text>
          </Link>
        ))}
      </View>
    </View>
  </View>);
}

const style = StyleSheet.create({
  space: {
    margin: 20
  }
});