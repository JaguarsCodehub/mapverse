import React from 'react';
import { Modal, View, StyleSheet, FlatList, Text, Image } from 'react-native';
import { List, Switch, IconButton } from 'react-native-paper';
import { MarkerData } from '../App';

type MarkerListProps = {
  visible: boolean;
  onClose: () => void;
  markers: MarkerData[];
  onToggleVisibility: (markerId: string) => void;
};

export default function MarkerList({
  visible,
  onClose,
  markers,
  onToggleVisibility,
}: MarkerListProps) {
  return (
    <Modal
      visible={visible}
      animationType='slide'
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <View style={styles.header}>
            <Text style={styles.title}>Your Markers</Text>
            <IconButton
              icon='close'
              size={24}
              onPress={onClose}
              containerColor="#007AFF"
              iconColor='white'
            />
          </View>
          {markers.length > 0 ? (
            <FlatList
              data={markers}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <List.Item
                  title={<Text style={styles.markerTitle}>{item.title}</Text>}
                  description={<Text style={styles.markerDescription}>{item.description}</Text>}
                  left={props => <List.Icon {...props} icon="map-marker" color="#007AFF" />}
                  right={() => (
                    <Switch
                      value={item.isPublic}
                      onValueChange={() => onToggleVisibility(item.id)}
                      trackColor={{ false: '#E0E0E0', true: '#007AFF' }}
                      thumbColor={'#FFFFFF'}
                      ios_backgroundColor="#E0E0E0"
                    />
                  )}
                  style={styles.listItem}
                />
              )}
              contentContainerStyle={styles.listContent}
            />
          ) : (
            <View style={styles.emptyStateContainer}>
              <Image
                source={{ uri: 'https://cdn-icons-png.flaticon.com/512/854/854878.png' }}
                style={styles.emptyStateImage}
              />
              <Text style={styles.emptyStateTitle}>No Markers Yet</Text>
              <Text style={styles.emptyStateDescription}>
                Start by adding your first marker! Tap on the map or use your current location to create a new marker.
              </Text>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    width: '100%',
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#333333',
  },
  listContent: {
    paddingBottom: 24,
  },
  listItem: {
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  markerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
  },
  markerDescription: {
    fontSize: 14,
    color: '#666666',
    marginTop: 4,
  },
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    height: '100%',
  },
  emptyStateImage: {
    width: 120,
    height: 120,
    marginBottom: 24,
    tintColor: '#007AFF',
  },
  emptyStateTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333333',
    marginBottom: 12,
  },
  emptyStateDescription: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 24,
  },
});
