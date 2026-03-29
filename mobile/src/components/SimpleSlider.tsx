import React from 'react';
import { View, StyleSheet, PanResponder, LayoutChangeEvent } from 'react-native';
import { colors } from '../lib/colors';

interface Props {
  value: number;
  min: number;
  max: number;
  onValueChange: (val: number) => void;
}

export default function SimpleSlider({ value, min, max, onValueChange }: Props) {
  const [width, setWidth] = React.useState(0);
  const pct = ((value - min) / (max - min)) * 100;

  const panResponder = React.useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt) => handleTouch(evt.nativeEvent.locationX),
      onPanResponderMove: (evt) => handleTouch(evt.nativeEvent.locationX),
    })
  ).current;

  const handleTouch = (x: number) => {
    if (width === 0) return;
    const ratio = Math.max(0, Math.min(1, x / width));
    const newVal = Math.round(min + ratio * (max - min));
    onValueChange(newVal);
  };

  const onLayout = (e: LayoutChangeEvent) => setWidth(e.nativeEvent.layout.width);

  return (
    <View style={styles.container} onLayout={onLayout} {...panResponder.panHandlers}>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${pct}%` }]} />
      </View>
      <View style={[styles.thumb, { left: `${pct}%` }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { height: 40, justifyContent: 'center', marginVertical: 8 },
  track: { height: 6, backgroundColor: colors.slate[200], borderRadius: 3, overflow: 'hidden' },
  fill: { height: '100%', backgroundColor: colors.primary[600], borderRadius: 3 },
  thumb: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#fff',
    borderWidth: 3,
    borderColor: colors.primary[600],
    marginLeft: -12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 4,
  },
});
