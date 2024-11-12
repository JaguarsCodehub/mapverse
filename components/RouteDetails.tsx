import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { List, Divider } from 'react-native-paper';
import { MarkerData } from '../App';

type RouteInfo = {
  markers: MarkerData[];
  polyline: string;
  duration: number;
  distance: number;
  steps: Array<{
    instruction: string;
    distance: string;
    duration: string;
  }>;
};

type RouteDetailsProps = {
  route: RouteInfo;
};

export default function RouteDetails({ route }: RouteDetailsProps) {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.summary}>
        <Text style={styles.summaryText}>
          Total Distance: {(route.distance / 1000).toFixed(1)} km
        </Text>
        <Text style={styles.summaryText}>
          Total Time: {Math.round(route.duration / 60)} mins
        </Text>
      </View>

      <Divider />

      <List.Section>
        <List.Subheader>Turn-by-turn directions</List.Subheader>
        {route.steps.map((step, index) => (
          <List.Item
            key={index}
            title={<Text>{step.instruction.replace(/<[^>]*>/g, '')}</Text>}
            description={`${step.distance} • ${step.duration}`}
            left={(props) => <List.Icon {...props} icon='arrow-right' />}
          />
        ))}
      </List.Section>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  summary: {
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  summaryText: {
    fontSize: 16,
    marginBottom: 8,
  },
});
