import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { useSQLiteContext } from 'expo-sqlite';

export default function MapScreen({ route, navigation }) {
  const [location, setLocation] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const database = useSQLiteContext();
  
  const isRegistration = route.params?.isRegistration || false;
  const registroId = route.params?.registroId;
  const { userId, user, permiSsion } = route.params || {};

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Erro', 'Permissão de localização negada');
        return;
      }

      let currentLocation = await Location.getCurrentPositionAsync({});
      const coords = currentLocation.coords;
      setLocation(coords);
      
      // Se for registration, usa a localização atual automaticamente
      if (isRegistration) {
        setSelectedLocation({
          latitude: coords.latitude,
          longitude: coords.longitude,
        });
      }
    })();
  }, [isRegistration]);

  const handleSelectLocation = (event) => {
    setSelectedLocation(event.nativeEvent.coordinate);
  };

  const handleSaveCoordinates = async () => {
    if (selectedLocation) {
      try {
        if (isRegistration) {
          // Salvar no banco de dados
          await database.execAsync(
            `UPDATE congregation_data SET latitude = ?, longitude = ? WHERE id = ?`,
            [selectedLocation.latitude, selectedLocation.longitude, registroId]
          );
          
          Alert.alert('Sucesso', 'Localização salva com sucesso!');
          
          // Voltar para home
          navigation.navigate('Accueil', { userId, user, permiSsion });
        } else {
          // Modo antigo: passar callback
          if (route.params?.saveCoordinates) {
            route.params.saveCoordinates(selectedLocation);
          }
          navigation.goBack();
        }
      } catch (error) {
        console.error('Erro ao salvar localização:', error);
        Alert.alert('Erro', 'Erro ao salvar localização');
      }
    } else {
      Alert.alert('Erro', 'Selecione uma localização primeiro');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>SALVAR COORDENADAS</Text>
      </View>

      {location && (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          onPress={handleSelectLocation}
        >
          {selectedLocation && (
            <Marker
              coordinate={selectedLocation}
              pinColor="red"
            />
          )}
        </MapView>
      )}

      <TouchableOpacity style={styles.button} onPress={handleSaveCoordinates}>
        <Text style={styles.buttonText}>Salvar Coordenadas</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    backgroundColor: '#007AFF',
    paddingVertical: 15,
    alignItems: 'center',
  },
  headerText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  map: {
    flex: 1,
  },
  button: {
    backgroundColor: '#28a745',
    paddingVertical: 15,
    marginBottom: 20,
    marginHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
