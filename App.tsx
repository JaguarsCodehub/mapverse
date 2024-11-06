import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as Location from 'expo-location';
import { FAB, Portal, Provider as PaperProvider } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AddMarkerModal from './components/AddMarkerModal';
import MarkerList from './components/MarkerList';
import ActionButton from './components/ActionButton';
import { Category } from './components/CategorySelector';
import ThemeSelector from './components/ThemeSelector';
import RouteManager from './components/RouteManager';

export type MarkerData = {
  id: string;
  coordinate: {
    latitude: number;
    longitude: number;
  };
  title: string;
  description: string;
  isPublic: boolean;
  category: Category;
  rating?: number;
  visitDuration?: number;
  bestTimeToVisit?: string;
  cost?: string;
};

export default function App() {
  const [markers, setMarkers] = useState<MarkerData[]>([]);
  const [isAddingMarker, setIsAddingMarker] = useState(false);
  const [showMarkerList, setShowMarkerList] = useState(false);
  const [userLocation, setUserLocation] =
    useState<Location.LocationObject | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [isTrackingLocation, setIsTrackingLocation] = useState(false);
  const mapRef = useRef<MapView>(null);
  const [isFabOpen, setIsFabOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [selectedThemes, setSelectedThemes] = useState<string[]>([]);
  const [routes, setRoutes] = useState<Array<MarkerData[]>>([]);
  const [showRouteManager, setShowRouteManager] = useState(false);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.error('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setUserLocation(location);
    })();
  }, []);

  useEffect(() => {
    let locationSubscription: Location.LocationSubscription | null = null;

    const startLocationTracking = async () => {
      if (isTrackingLocation) {
        try {
          locationSubscription = await Location.watchPositionAsync(
            {
              accuracy: Location.Accuracy.High,
              timeInterval: 5000,
              distanceInterval: 10,
            },
            (location) => {
              setUserLocation(location);
            }
          );
        } catch (error) {
          console.error('Error starting location tracking:', error);
        }
      }
    };

    startLocationTracking();

    return () => {
      if (locationSubscription) {
        locationSubscription.remove();
      }
    };
  }, [isTrackingLocation]);

  const addMarker = (newMarker: MarkerData) => {
    setMarkers([...markers, newMarker]);
    setIsAddingMarker(false);
    setSelectedLocation(null);
  };

  const toggleMarkerVisibility = (markerId: string) => {
    setMarkers(
      markers.map((marker) =>
        marker.id === markerId
          ? { ...marker, isPublic: !marker.isPublic }
          : marker
      )
    );
  };

  const handleMapPress = (event: any) => {
    setSelectedLocation(event.nativeEvent.coordinate);
    setIsAddingMarker(true);
  };

  const centerOnUserLocation = () => {
    if (userLocation && mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: userLocation.coords.latitude,
        longitude: userLocation.coords.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      });
    }
  };

  const toggleLocationTracking = () => {
    setIsTrackingLocation(!isTrackingLocation);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const toggleTheme = (themeId: string) => {
    setSelectedThemes(prev => 
      prev.includes(themeId) 
        ? prev.filter(id => id !== themeId)
        : [...prev, themeId]
    );
  };

  const filteredMarkers = markers.filter(marker => 
    selectedThemes.length === 0 || selectedThemes.includes(marker.category.id)
  );

  const handleCreateRoute = (routeMarkers: MarkerData[]) => {
    setRoutes([...routes, routeMarkers]);
    setShowRouteManager(false);
    
    // Animate map to show all route markers
    if (mapRef.current && routeMarkers.length > 0) {
      const coordinates = routeMarkers.map(marker => marker.coordinate);
      mapRef.current.fitToCoordinates(coordinates, {
        edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
        animated: true,
      });
    }
  };

  return (
    <PaperProvider>
      <SafeAreaProvider>
        <View style={styles.container}>
          {userLocation && (
            <>
              <MapView
                ref={mapRef}
                provider={PROVIDER_GOOGLE}
                style={styles.map}
                initialRegion={{
                  latitude: userLocation.coords.latitude,
                  longitude: userLocation.coords.longitude,
                  latitudeDelta: 0.0922,
                  longitudeDelta: 0.0421,
                }}
                onPress={handleMapPress}
                showsUserLocation={isTrackingLocation}
                followsUserLocation={isTrackingLocation}
                customMapStyle={mapStyleDark}
              >
                {filteredMarkers.map((marker) => (
                  <Marker
                    key={marker.id}
                    coordinate={marker.coordinate}
                    title={marker.title}
                    description={marker.description}
                  >
                    <View
                      style={[
                        styles.markerContainer,
                        { backgroundColor: marker.category.icon },
                      ]}
                    >
                      <MaterialCommunityIcons
                        name={marker.category.icon as any}
                        size={24}
                        color='white'
                      />
                    </View>
                  </Marker>
                ))}
                {userLocation && !isTrackingLocation && (
                  <Marker
                    coordinate={{
                      latitude: userLocation.coords.latitude,
                      longitude: userLocation.coords.longitude,
                    }}
                  >
                    <View style={styles.userLocationMarker}>
                      <MaterialCommunityIcons
                        name='square-rounded'
                        size={24}
                        color='#4285F4'
                      />
                    </View>
                  </Marker>
                )}
              </MapView>
            </>
          )}
          <ThemeSelector
            selectedThemes={selectedThemes}
            onThemeToggle={toggleTheme}
          />
          <Portal>
            <FAB.Group
              open={isFabOpen}
              icon={isFabOpen ? 'close' : 'plus'}
              visible
              actions={[
                {
                  icon: 'plus',
                  label: 'Add Marker',
                  onPress: () => setIsAddingMarker(true),
                },
                {
                  icon: 'format-list-checkbox',
                  label: 'Marker List',
                  onPress: () => setShowMarkerList(true),
                },
                {
                  icon: isTrackingLocation ? 'crosshairs-gps' : 'crosshairs',
                  label: 'Toggle Tracking',
                  onPress: toggleLocationTracking,
                },
                {
                  icon: 'target',
                  label: 'Center Map',
                  onPress: centerOnUserLocation,
                },
                {
                  icon: isDarkMode ? 'weather-sunny' : 'weather-night',
                  label: 'Toggle Dark Mode',
                  onPress: toggleDarkMode,
                },
                {
                  icon: 'car',
                  label: 'Create Route',
                  onPress: () => setShowRouteManager(true),
                },
              ]}
              onStateChange={({ open }) => setIsFabOpen(open)}
              fabStyle={styles.fab}
            />
          </Portal>
          <AddMarkerModal
            visible={isAddingMarker}
            onClose={() => {
              setIsAddingMarker(false);
              setSelectedLocation(null);
            }}
            onAddMarker={addMarker}
            userLocation={userLocation}
            selectedLocation={selectedLocation}
          />
          <MarkerList
            visible={showMarkerList}
            onClose={() => setShowMarkerList(false)}
            markers={markers}
            onToggleVisibility={toggleMarkerVisibility}
          />
          <RouteManager
            visible={showRouteManager}
            onClose={() => setShowRouteManager(false)}
            markers={markers}
            selectedThemes={selectedThemes}
            onCreateRoute={handleCreateRoute}
          />
        </View>
      </SafeAreaProvider>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  fab: {
    backgroundColor: '#4285F4',
  },
  markerContainer: {
    borderRadius: 20,
    padding: 8,
  },
  userLocationMarker: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    height: 40,
  },
});

const mapStyleDark = [
  {
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#212121"
      }
    ]
  },
  {
    "elementType": "labels.icon",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#757575"
      }
    ]
  },
  {
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#212121"
      }
    ]
  },
  {
    "featureType": "administrative",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#757575"
      }
    ]
  },
  {
    "featureType": "administrative.country",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#9e9e9e"
      }
    ]
  },
  {
    "featureType": "administrative.land_parcel",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "administrative.locality",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#bdbdbd"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#757575"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#181818"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#616161"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#1b1b1b"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#2c2c2c"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#8a8a8a"
      }
    ]
  },
  {
    "featureType": "road.arterial",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#373737"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#3c3c3c"
      }
    ]
  },
  {
    "featureType": "road.highway.controlled_access",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#4e4e4e"
      }
    ]
  },
  {
    "featureType": "road.local",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#616161"
      }
    ]
  },
  {
    "featureType": "transit",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#757575"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#000000"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#3d3d3d"
      }
    ]
  }
]