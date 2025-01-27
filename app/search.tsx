import { Pressable, Text, View, StyleSheet, TextInput, Button } from "react-native";
import { useEffect, useState, useMemo } from "react";
import { search } from '@/src/lib/bilibiliAPI';

export default function Search() {
  const [query, setQuery] = useState("fsdf");

  const pr = async () => { 
    console.log("AAhjAAA")
    let a = await search("祖娅纳惜")
    console.log(a)
  }

  return (
    <View style={{ paddingVertical: 30, paddingHorizontal: 20 }}>
      <View style={{ display: "flex", flexDirection: "row" }}>
        <TextInput style={{ flex: 1 }} value={query} onChangeText={setQuery} />
        <Button title="search" onPress={pr} />
      </View>
    </View>
  );
}