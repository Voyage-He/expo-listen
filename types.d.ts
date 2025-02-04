declare global {
  type Track = {
    id: string;
    title: string;
    author: string;
    pic: string;
  }

  type Playlist = {
    name: string,
    tracksId: string[]
  }
}

export {}