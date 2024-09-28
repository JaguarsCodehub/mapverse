import React, { useState, useEffect } from 'react';
import { Modal, View, TextInput, StyleSheet, Switch, Text, TouchableOpacity } from 'react-native';
import { Button, IconButton } from 'react-native-paper';
import { MarkerData } from '../App';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';

type AddMarkerModalProps = {
  visible: boolean;
  onClose: () => void;
  onAddMarker: (marker: MarkerData) => void;
  userLocation: Location.LocationObject | null;
  selectedLocation: { latitude: number; longitude: number } | null;
};

export default function AddMarkerModal({
  visible,
  onClose,
  onAddMarker,
  userLocation,
  selectedLocation,
}: AddMarkerModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [locationType, setLocationType] = useState('current');

  useEffect(() => {
    if (selectedLocation) {
      setLocationType('selected');
    } else {
      setLocationType('current');
    }
  }, [selectedLocation]);

  const handleAddMarker = () => {
    let coordinate;
    if (locationType === 'current' && userLocation) {
      coordinate = {
        latitude: userLocation.coords.latitude,
        longitude: userLocation.coords.longitude,
      };
    } else if (locationType === 'selected' && selectedLocation) {
      coordinate = selectedLocation;
    } else {
      return; // Don't add marker if no valid location
    }

    const newMarker: MarkerData = {
      id: Date.now().toString(),
      coordinate,
      title,
      description,
      isPublic,
    };
    onAddMarker(newMarker);
    setTitle('');
    setDescription('');
    setIsPublic(false);
  };

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
            <Text style={styles.title}>New Marker</Text>
            <IconButton
              icon="close"
              size={24}
              onPress={onClose}
              style={styles.closeButton}
            />
          </View>
          <View style={styles.inputContainer}>
            <Ionicons name="location" size={24} color="#007AFF" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder='Marker Title'
              value={title}
              onChangeText={setTitle}
              placeholderTextColor="#A0A0A0"
            />
          </View>
          <View style={styles.inputContainer}>
            <Ionicons name="document-text" size={24} color="#007AFF" style={styles.inputIcon} />
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder='Description (optional)'
              value={description}
              onChangeText={setDescription}
              multiline
              placeholderTextColor="#A0A0A0"
            />
          </View>
          <View style={styles.optionContainer}>
            <Text style={styles.optionText}>Make Public</Text>
            <Switch
              value={isPublic}
              onValueChange={setIsPublic}
              trackColor={{ false: '#E0E0E0', true: '#007AFF' }}
              thumbColor={'#FFFFFF'}
              ios_backgroundColor="#E0E0E0"
            />
          </View>
          <View style={styles.optionContainer}>
            <Text style={styles.optionText}>Location</Text>
            <View style={styles.segmentedControl}>
              <TouchableOpacity
                style={[
                  styles.segmentButton,
                  locationType === 'current' && styles.segmentButtonActive
                ]}
                onPress={() => setLocationType('current')}
              >
                <Text style={[
                  styles.segmentButtonText,
                  locationType === 'current' && styles.segmentButtonTextActive
                ]}>Current</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.segmentButton,
                  locationType === 'selected' && styles.segmentButtonActive
                ]}
                onPress={() => setLocationType('selected')}
                disabled={!selectedLocation}
              >
                <Text style={[
                  styles.segmentButtonText,
                  locationType === 'selected' && styles.segmentButtonTextActive
                ]}>Selected</Text>
              </TouchableOpacity>
            </View>
          </View>
          <Button
            mode='contained'
            onPress={handleAddMarker}
            style={styles.addButton}
            labelStyle={styles.addButtonLabel}
          >
            Add Marker
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
    backgroundColor: '#F8F8F8',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333333',
  },
  closeButton: {
    margin: 0,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 12,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333333',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  optionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 16,
  },
  optionText: {
    fontSize: 16,
    color: '#333333',
  },
  segmentedControl: {
    flexDirection: 'row',
    backgroundColor: '#E0E0E0',
    borderRadius: 8,
    overflow: 'hidden',
  },
  segmentButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  segmentButtonActive: {
    backgroundColor: '#007AFF',
  },
  segmentButtonText: {
    fontSize: 14,
    color: '#333333',
  },
  segmentButtonTextActive: {
    color: '#FFFFFF',
  },
  addButton: {
    width: '100%',
    marginTop: 16,
    backgroundColor: '#007AFF',
    borderRadius: 12,
  },
  addButtonLabel: {
    fontSize: 16,
    fontWeight: '600',
    paddingVertical: 8,
  },
});
