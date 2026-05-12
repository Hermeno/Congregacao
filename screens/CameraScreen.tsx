import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { useState } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View, Alert } from 'react-native';
import * as FileSystem from 'expo-file-system';
import { useSQLiteContext } from 'expo-sqlite'; // Hook pour utiliser SQLite

export default function CameraScreen({ navigation, route }) {
  const { userId,user,  idPost, permiSsion } = route.params; // Obtenant l'ID de l'utilisateur et l'ID du message
  const database = useSQLiteContext();

  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [photos, setPhotos] = useState<string[]>([]); // Stocke plusieurs photos

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>Nous avons besoin de votre permission pour accéder à la caméra</Text>
        <Button onPress={requestPermission} title="Accorder la permission" />
      </View>
    );
  }

  const toggleCameraFacing = () => {
    setFacing((current) => (current === 'back' ? 'front' : 'back'));
  };

  let cameraRef: CameraView | null = null;

  const takePicture = async () => {
    if (cameraRef) {
      const photoData = await cameraRef.takePictureAsync();
      const fileUri = `${FileSystem.documentDirectory}${Date.now()}.jpg`; // Crée un nom unique pour le fichier

      // Enregistre l'image dans le système de fichiers
      await FileSystem.moveAsync({
        from: photoData.uri,
        to: fileUri,
      });

      setPhotos((prevPhotos) => [...prevPhotos, fileUri]); // Ajoute la nouvelle photo au tableau
      Alert.alert('Photo prise!', 'Vous pouvez continuer à prendre plus de photos ou enregistrer les actuelles.');
    }
  };

  const savePhotosToDatabase = async () => {
    try {
      // Vérifie s'il y a des photos à enregistrer
      if (photos.length === 0) {
        Alert.alert("Aucune photo à enregistrer!");
        return;
      }

      // Itère sur toutes les photos et insère chacune dans la base de données
      for (const photoUri of photos) {
        // Prépare la déclaration SQL pour insérer la photo
        const statement = await database.prepareAsync(
          "INSERT INTO fotos (idPost, foto) VALUES ($idPost, $foto)"
        );

        // Exécute l'insertion
        await statement.executeAsync({
          $idPost: idPost,  // ID du message
          $foto: photoUri, // Chemin du fichier photo
        });

        // Finalise la déclaration
        // await statement.finalize();
      }

      Alert.alert("Photos enregistrées avec succès!");
      navigation.navigate('Formulaire', { userId: userId, user: user, permiSsion: permiSsion });
      // Rediriger vers la page précédente ou une autre après l'enregistrement
      // navigation.goBack(); // ou navigation.navigate('AutrePage');
    } catch (error) {
      console.error("Erreur lors de l'enregistrement des photos:", error);
      Alert.alert("Erreur lors de l'enregistrement des photos!", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} ref={(ref) => { cameraRef = ref }} facing={facing}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
            <Text style={styles.text}>Changer de caméra</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={takePicture}>
            <Text style={styles.text}>Prendre une photo</Text>
          </TouchableOpacity>
        </View>
      </CameraView>
      <View style={styles.saveButtonContainer}>
        <TouchableOpacity style={styles.saveButton} onPress={savePhotosToDatabase}>
          <Text style={styles.saveText}>Enregistrer les photos</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    margin: 64,
    justifyContent: 'space-around',
  },
  button: {
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  saveButtonContainer: {
    margin: 20,
    alignItems: 'center',
  },
  saveButton: {
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 5,
  },
  saveText: {
    color: 'white',
    fontSize: 18,
  },
});
