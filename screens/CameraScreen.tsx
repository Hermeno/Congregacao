import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { useState } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View, Alert } from 'react-native';
import * as FileSystem from 'expo-file-system';
import { useSQLiteContext } from 'expo-sqlite'; // Hook para utilizar o SQLite

export default function CameraScreen({ navigation, route }) {
  const { userId,user,  idPost, permiSsion } = route.params; // Obtendo o ID do usuário e o ID da postagem
  const database = useSQLiteContext();

  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [photos, setPhotos] = useState<string[]>([]); // Armazena múltiplas fotos

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>Precisamos da sua permissão para acessar a câmera</Text>
        <Button onPress={requestPermission} title="Conceder Permissão" />
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
      const fileUri = `${FileSystem.documentDirectory}${Date.now()}.jpg`; // Cria um nome único para o arquivo

      // Salva a imagem no sistema de arquivos
      await FileSystem.moveAsync({
        from: photoData.uri,
        to: fileUri,
      });

      setPhotos((prevPhotos) => [...prevPhotos, fileUri]); // Adiciona nova foto ao array
      Alert.alert('Foto tirada!', 'Você pode continuar tirando mais fotos ou salvar as atuais.');
    }
  };

  const savePhotosToDatabase = async () => {
    try {
      // Verifica se há fotos para salvar
      if (photos.length === 0) {
        Alert.alert("Nenhuma foto para salvar!");
        return;
      }

      // Itera sobre todas as fotos e insere cada uma no banco de dados
      for (const photoUri of photos) {
        // Prepara a declaração SQL para inserir a foto
        const statement = await database.prepareAsync(
          "INSERT INTO fotos (idPost, foto) VALUES ($idPost, $foto)"
        );

        // Executa a inserção
        await statement.executeAsync({
          $idPost: idPost,  // ID da postagem
          $foto: photoUri, // Caminho do arquivo da foto
        });

        // Finaliza a declaração
        // await statement.finalize();
      }

      Alert.alert("Fotos salvas com sucesso!");
      navigation.navigate('Form', { userId: userId, user: user, permiSsion: permiSsion });
      // Redirecionar para a página anterior ou outra após salvar
      // navigation.goBack(); // ou navigation.navigate('OutraPagina');
    } catch (error) {
      console.error("Erro ao salvar fotos:", error);
      Alert.alert("Erro ao salvar fotos!", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} ref={(ref) => { cameraRef = ref }} facing={facing}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
            <Text style={styles.text}>Trocar Câmera</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={takePicture}>
            <Text style={styles.text}>Tirar Foto</Text>
          </TouchableOpacity>
        </View>
      </CameraView>
      <View style={styles.saveButtonContainer}>
        <TouchableOpacity style={styles.saveButton} onPress={savePhotosToDatabase}>
          <Text style={styles.saveText}>Salvar Fotos</Text>
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
