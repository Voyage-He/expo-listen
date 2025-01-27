import { Pressable, Text, View, StyleSheet, TextInput, Button } from "react-native";
import { useEffect, useState } from "react";
import { useAssets } from "expo-asset"

import AudioPlayerModule, { PlaybackState, useAudioPlayer } from "../modules/audio_player";
import { Link } from "expo-router";

export default function Index() {
  const [assets, error] = useAssets([require("../assets/audio/test.wav")]);
  const [seekPosition, setSeekPosition] = useState("0");
  const [playbackState, position, duration, play, pause, resume, seek] = useAudioPlayer()

  return (<>
    <View>
      <Link href={"/search"} asChild>
        <Button title="to search" />
      </Link>
      
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
    </View>
  </>);
}

const style = StyleSheet.create({
  space: {
    margin: 20
  }
});