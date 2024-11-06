import React, { useState, useEffect } from 'react';
import { Modal, View, StyleSheet, Text, ScrollView, TouchableOpacity } from 'react-native';
import { List, IconButton, Button } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { MarkerData } from '../App';

type RouteManagerProps = {
  visible: boolean;
  onClose: () => void;
  markers: MarkerData[];
  selectedThemes: string[];
  onCreateRoute: (routeMarkers: MarkerData[]) => void;
};

export default function RouteManager({
  visible,
  onClose,
  markers,
  selectedThemes,
  onCreateRoute,
}: RouteManagerProps) {
  console.log('RouteManager - All Markers:', markers);
  console.log('RouteManager - Selected Themes:', selectedThemes);

  const [selectedMarkers, setSelectedMarkers] = useState<MarkerData[]>([]);

  useEffect(() => {
    console.log('Selected markers updated:', selectedMarkers.map(m => m.title));
  }, [selectedMarkers]);

  useEffect(() => {
    if (!visible) {
      setSelectedMarkers([]);
      console.log('Reset selected markers');
    }
  }, [visible]);

  const filteredMarkers = markers.filter(marker => 
    selectedThemes.length === 0 || // Show all markers if no theme is selected
    selectedThemes.includes(marker.category.id)
  );

  console.log('Original markers:', markers.length);
  console.log('Filtered markers:', filteredMarkers.length);
  console.log('Selected themes:', selectedThemes);
  console.log('Filtered markers details:', filteredMarkers.map(m => ({
    title: m.title,
    categoryId: m.category.id,
    isMatching: selectedThemes.includes(m.category.id)
  })));

  const toggleMarkerSelection = (marker: MarkerData) => {
    console.log('Toggling marker selection:', marker.title);
    const isSelected = selectedMarkers.some(m => m.id === marker.id);
    if (isSelected) {
      const newSelection = selectedMarkers.filter(m => m.id !== marker.id);
      console.log('Removing marker, new selection:', newSelection.map(m => m.title));
      setSelectedMarkers(newSelection);
    } else {
      const newSelection = [...selectedMarkers, marker];
      console.log('Adding marker, new selection:', newSelection.map(m => m.title));
      setSelectedMarkers(newSelection);
    }
  };

  const handleCreateRoute = () => {
    onCreateRoute(selectedMarkers);
    setSelectedMarkers([]);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <View style={styles.header}>
            <Text style={styles.title}>Create Route</Text>
            <IconButton icon="close" size={24} onPress={onClose} />
          </View>
          
          <Text style={styles.subtitle}>
            Select locations to include in your route (min 2):
          </Text>

          <ScrollView style={styles.markerList}>
            {filteredMarkers.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>No markers available for selected themes</Text>
              </View>
            ) : (
              filteredMarkers.map(marker => {
                console.log('Rendering marker:', marker.title);
                const isSelected = selectedMarkers.some(m => m.id === marker.id);
                console.log('Is selected:', isSelected);
                
                return (
                  <TouchableOpacity
                    key={marker.id}
                    onPress={() => {
                      console.log('Pressed marker:', marker.title);
                      toggleMarkerSelection(marker);
                    }}
                    style={[
                      styles.listItemContainer,
                      isSelected && styles.selectedListItem
                    ]}
                  >
                    <View style={styles.listItemContent}>
                      <MaterialCommunityIcons
                        name={marker.category.icon as any}
                        size={24}
                        color={marker.category.color}
                        style={styles.icon}
                      />
                      <View style={styles.textContainer}>
                        <Text style={styles.listItemTitle}>{marker.title}</Text>
                        <Text style={styles.listItemDescription}>{marker.description}</Text>
                      </View>
                      <IconButton
                        icon={isSelected ? "check-circle" : "circle-outline"}
                        iconColor={isSelected ? "#007AFF" : "#666666"}
                        onPress={() => toggleMarkerSelection(marker)}
                      />
                    </View>
                  </TouchableOpacity>
                );
              })
            )}
          </ScrollView>

          <Button
            mode="contained"
            onPress={() => {
              console.log('Create Route button pressed');
              console.log('Selected markers:', selectedMarkers);
              handleCreateRoute();
            }}
            disabled={selectedMarkers.length < 2}
            style={styles.createButton}
          >
            Create Route ({selectedMarkers.length} locations)
          </Button>
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
    minHeight: '50%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 16,
  },
  markerList: {
    flex: 1,
    marginBottom: 16,
  },
  listItemContainer: {
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    marginBottom: 8,
    overflow: 'hidden',
    padding: 4,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  listItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  textContainer: {
    flex: 1,
    marginLeft: 12,
  },
  listItemTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333333',
  },
  listItemDescription: {
    fontSize: 14,
    color: '#666666',
  },
  selectedListItem: {
    backgroundColor: '#E5F0FF',
    borderColor: '#007AFF',
    borderWidth: 1,
  },
  icon: {
    marginLeft: 8,
  },
  createButton: {
    marginTop: 16,
    backgroundColor: '#007AFF',
  },
  emptyState: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyStateText: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
  },
});