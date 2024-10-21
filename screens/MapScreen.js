import React, { useState, useEffect } from 'react';
import { View, Button, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';

export default function MapScreen({ route, navigation }) {
  const [location, setLocation] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        return;
      }

      let currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation.coords);
    })();
  }, []);

  const handleSelectLocation = (event) => {
    setSelectedLocation(event.nativeEvent.coordinate);
  };

  const handleSaveCoordinates = () => {
    if (selectedLocation) {
      route.params.saveCoordinates(selectedLocation);
      navigation.goBack(); // Volta para a tela anterior (FormScreen)
    }
  };

  return (
    <View style={styles.container}>
      {location && (
        <MapView
          style={StyleSheet.absoluteFill}
          initialRegion={{
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          onPress={handleSelectLocation}
        >
          {selectedLocation && (
            <Marker coordinate={selectedLocation} />
          )}
        </MapView>
      )}

      <Button title="Salvar Coordenadas" onPress={handleSaveCoordinates} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
