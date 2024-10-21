import React from 'react';
import { View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

const MapScreen = ({ navigation, route }) => {
  const { latitude, longitude } = route.params;  // Recebendo as coordenadas

  return (
    <View style={{ flex: 1 }}>
      <MapView
        style={{ flex: 1 }}
        initialRegion={{
          latitude: latitude,   // Latitude recebida
          longitude: longitude, // Longitude recebida
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        <Marker
          coordinate={{ latitude: latitude, longitude: longitude }}
          title="Localização Selecionada"
          description={`Lat: ${latitude}, Long: ${longitude}`}
        />
      </MapView>
    </View>
  );
};

export default MapScreen;
