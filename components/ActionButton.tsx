import React from 'react';
import { StyleSheet } from 'react-native';
import { FAB } from 'react-native-paper';

type ActionButtonProps = {
  icon: string;
  onPress: () => void;
  style?: object;
};

export default function ActionButton({
  icon,
  onPress,
  style,
}: ActionButtonProps) {
  return <FAB style={[styles.fab, style]} icon={icon} onPress={onPress} />;
}

const styles = StyleSheet.create({
  fab: {
    margin: 16,
  },
});
