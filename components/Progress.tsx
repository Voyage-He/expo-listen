import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider';

const SeekBar = ({progress, onSeek}: {progress: number, onSeek: (progress: number) => void}) => {
  const [seeking, setSeeking] = useState(false);

  return (
    <View style={styles.container}>
      <Text>进度: {Math.round(progress * 100)}%</Text>
      <Slider
        style={styles.slider}
        minimumValue={0}
        maximumValue={1}
        value={seeking ? undefined: progress}
        onSlidingStart={()=>{setSeeking(true)}}
        onSlidingComplete={(value)=>{onSeek(value);setSeeking(false)}}
        minimumTrackTintColor="blue"
        maximumTrackTintColor="#ddd"
        thumbTintColor="blue"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20 },
  slider: { width: '100%', height: 40 },
});

export default SeekBar;