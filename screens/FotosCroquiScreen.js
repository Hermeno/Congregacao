import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Alert, FlatList } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as FileSystem from 'expo-file-system';
import { useSQLiteContext } from 'expo-sqlite';

export default function FotosCroquiScreen({ navigation, route }) {
  const { registroId, userId, user, permiSsion, patrimonioNumero, cooperadorNome } = route.params;
  const database = useSQLiteContext();
  const [permission, requestPermission] = useCameraPermissions();
  const [photos, setPhotos] = useState([]);
  const [hasPhotos, setHasPhotos] = useState(false);
  const cameraRef = React.useRef(null);

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text>Permissão de câmera necessária</Text>
        <TouchableOpacity onPress={requestPermission}>
          <Text>Conceder permissão</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photoData = await cameraRef.current.takePictureAsync();
        const fileUri = `${FileSystem.documentDirectory}${Date.now()}.jpg`;
        
        await FileSystem.moveAsync({
          from: photoData.uri,
          to: fileUri,
        });

        setPhotos((prevPhotos) => [...prevPhotos, fileUri]);
        Alert.alert('Sucesso', 'Foto capturada!');
      } catch (error) {
        Alert.alert('Erro', 'Erro ao capturar foto');
      }
    }
  };

  const savePhotos = async () => {
    try {
      for (const photoUri of photos) {
        const base64 = await FileSystem.readAsStringAsync(photoUri, { encoding: FileSystem.EncodingType.Base64 });
        
        await database.execAsync(
          `INSERT INTO fotos (idPost, foto, tipo) VALUES (?, ?, ?)`,
          [registroId, base64, 'croqui']
        );
      }
      
      setHasPhotos(true);
      if (photos.length > 0) {
        Alert.alert('Sucesso', 'Fotos do croqui salvas!');
        navigation.navigate('FotosDocumento', { 
          registroId, 
          userId, 
          user, 
          permiSsion,
          patrimonioNumero,
          cooperadorNome
        });
      }
    } catch (error) {
      console.error('Erro:', error);
      Alert.alert('Erro', 'Erro ao salvar fotos');
    }
  };

  const goToDocuments = () => {
    navigation.navigate('FotosDocumento', { 
      registroId, 
      userId, 
      user, 
      permiSsion,
      patrimonioNumero,
      cooperadorNome
    });
  };

  const deletePhoto = (index) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} ref={cameraRef} facing="back" />
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
          <Text style={styles.buttonText}>Trocar Câmera</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.photoButton} onPress={takePicture}>
          <Text style={styles.buttonText}>Tirar Foto</Text>
        </TouchableOpacity>
      </View>

      {photos.length > 0 && (
        <ScrollView style={styles.photoList}>
          <FlatList
            data={photos}
            renderItem={({ item, index }) => (
              <View style={styles.photoItem}>
                <Image source={{ uri: item }} style={styles.photo} />
                <TouchableOpacity 
                  style={styles.deleteButton}
                  onPress={() => deletePhoto(index)}
                >
                  <Text style={styles.deleteText}>X</Text>
                </TouchableOpacity>
              </View>
            )}
            keyExtractor={(item, index) => index.toString()}
            numColumns={2}
          />
        </ScrollView>
      )}

      <View style={styles.bottomButtons}>
        <TouchableOpacity style={styles.saveButton} onPress={savePhotos}>
          <Text style={styles.saveButtonText}>Salvar Fotos</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.noPhotosButton} onPress={goToDocuments}>
          <Text style={styles.noPhotosButtonText}>Nao tenho fotos</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.title}>Tirar fotos do Croqui</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingVertical: 20,
  },
  captureButton: {
    backgroundColor: '#555',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  photoButton: {
    backgroundColor: '#555',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  photoList: {
    maxHeight: 150,
    backgroundColor: '#f0f0f0',
  },
  photoItem: {
    flex: 1,
    margin: 5,
    position: 'relative',
  },
  photo: {
    width: '100%',
    height: 100,
    borderRadius: 8,
  },
  deleteButton: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'red',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  bottomButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 10,
    paddingVertical: 10,
    backgroundColor: '#f5f5f5',
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#28a745',
    paddingVertical: 12,
    marginRight: 5,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  noPhotosButton: {
    flex: 1,
    backgroundColor: '#ffc107',
    paddingVertical: 12,
    marginLeft: 5,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noPhotosButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  title: {
    textAlign: 'center',
    color: '#28a745',
    fontSize: 16,
    fontWeight: 'bold',
    paddingVertical: 10,
    backgroundColor: '#f5f5f5',
  },
});
