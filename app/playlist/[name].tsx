import { useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";
import usePlaylists from "@/hooks/usePlaylists";
import useTrack from "@/hooks/useTrack";

export default function Playlist() {
  const { name } = useLocalSearchParams<{name: string}>();
  const [playlists, manipulatePlaylists] = usePlaylists()
  const playlist = playlists.find((playlist) => playlist.name === name);

  return (
    <View>
      <Text>{name}</Text>
      {playlist!.tracksId.map((trackId) => <Item key={trackId} trackId={trackId} />)}
    </View>
  );
}

const Item = ({trackId}: {trackId: string}) => {
  const [track] = useTrack(trackId);

  return (
    <View>
      { track && (
        <>
          <Text>{track.title}</Text>
          <Text>{track.author}</Text>
        </>
      )}
    </View>
  )
}