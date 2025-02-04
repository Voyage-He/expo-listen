import { Pressable, Text, View, StyleSheet, TextInput, Button, ScrollView } from "react-native";
import { useEffect, useState, useMemo } from "react";
import * as BilibiliAPI from '@/src/lib/bilibiliAPI';

const generateMockData = (count: number): Record<string, string>[] => {
  const mockData: Record<string, string>[] = [];
  for (let i = 1; i <= count; i++) {
    mockData.push({
      id: `id${i}`,
      title: `title${i}`,
      author: `author${i}`,
      pic: `pic${i}`,
    });
  }
  return mockData;
};

const mockData = generateMockData(100);

export default function Search() {
  const [query, setQuery] = useState("fsdf");
  const [tracks, setTracks] = useState<Record<string, string>[]>([]);

  const search = async () => { 
    console.log("search+", query)
    let res = await BilibiliAPI.search(query);
    console.log("search-", res)
    // setTracks(res);
    setTracks(mockData)
  }

  const searchResItem = tracks.map(({ id, title, author, pic }) =>{
    return (
      <View style={{ padding: 10, backgroundColor: "white" }} key={id}>
        <Text>{title}</Text>
        <Text>{author}</Text>
      </View>
    )
  })

  return (
    <View style={{ paddingVertical: 30, paddingHorizontal: 20, maxHeight: "100%" }}>
      <View style={{ display: "flex", flexDirection: "row" }}>
        <TextInput style={{ flex: 1 }} value={query} onChangeText={setQuery} />
        <Button title="search" onPress={search} />
      </View>
      <ScrollView>
        {searchResItem}
      </ScrollView>
    </View>
  );
}