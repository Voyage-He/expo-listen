import useStorage from "./useStorage";

export default function usePlaylists(): [Playlist[], {
  addPlaylist: (name: string) => void,
  deletePlaylist: (name: string) => void,
  renamePlaylist: (oldName: string, newName: string) => void,
  addTrackToPlaylist: (name: string, track: string) => void,
  removeTrackFromPlaylist: (name: string, track: string) => void,
}] {
  let [playlists, setPlaylists]= useStorage<Playlist[]>(
    'playlists',
    [
      { name: '我喜欢', tracksId: [] },
    ],
    {
      parser: (value: string): Playlist[] => {
          let playlists: Playlist[] = JSON.parse(value);
          return playlists;
      },
      serializer: (value: Playlist[]) => {
        return JSON.stringify(value);
      }
    }
  );
  
  const addPlaylist = (name: string) => {
    setPlaylists([...playlists, { name: name, tracksId: [] }]);
  }

  const deletePlaylist = (name: string) => {
    setPlaylists(playlists.filter((playlist) => playlist.name !== name));
  }

  const renamePlaylist = (name: string, newname: string) => {
    setPlaylists(playlists.map((playlist) => playlist.name === name ? { ...playlist, name: newname } : playlist));
  }

  const addTrackToPlaylist = (name: string, track_id: string) => {
    setPlaylists(playlists.map((playlist) => playlist.name === name ? { ...playlist, tracksId: [...playlist.tracksId, track_id] } : playlist));
  }

  const removeTrackFromPlaylist = (name: string, track_id: string) => {
    setPlaylists(playlists.map((playlist) => playlist.name === name ? { ...playlist, tracksId: playlist.tracksId.filter((id) => id !== track_id) } : playlist));
  }

  return [playlists, {addPlaylist, deletePlaylist, renamePlaylist, addTrackToPlaylist, removeTrackFromPlaylist}] as const;
}