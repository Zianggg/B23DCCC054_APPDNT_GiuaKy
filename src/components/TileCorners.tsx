import React from 'react';
import { StyleSheet, View } from 'react-native';

// Bốn góc bo tròn như hoạ tiết viên gạch bông
export default function TileCorners({ color }: { color: string }) {
  return (
    <>
      <View style={[styles.corner, styles.tl, { backgroundColor: color }]} />
      <View style={[styles.corner, styles.tr, { backgroundColor: color }]} />
      <View style={[styles.corner, styles.bl, { backgroundColor: color }]} />
      <View style={[styles.corner, styles.br, { backgroundColor: color }]} />
    </>
  );
}

const SIZE = 36;

const styles = StyleSheet.create({
  corner: {
    position: 'absolute',
    width: SIZE,
    height: SIZE,
    borderRadius: SIZE / 2,
  },
  tl: { top: -SIZE / 2, left: -SIZE / 2 },
  tr: { top: -SIZE / 2, right: -SIZE / 2 },
  bl: { bottom: -SIZE / 2, left: -SIZE / 2 },
  br: { bottom: -SIZE / 2, right: -SIZE / 2 },
});
