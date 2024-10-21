import React, { useState, useEffect } from 'react';
import { FlatList, Pressable,  ScrollView, Text, StyleSheet, TextInput, Button, Switch, TouchableOpacity, Alert, View, Image } from 'react-native';
import { casaOracao } from '../database/casaOracao';
// import { Camera, CameraType } from 'expo-camera';
import { useSQLiteContext } from 'expo-sqlite';
import * as FileSystem from 'expo-file-system';


export default function FormScreen({ navigation, route }) {
  const { user, userId, permiSsion } = route.params;
  // console.log(userId);

  // Estados para armazenar os valores dos campos
  // const [id, setId] = useState('');
  const [casaDaOracao, setCasaDaOracao] = useState('');
  const [cooperadorNome, setCooperadorNome] = useState('');
  const [cooperadorJovensNome, setCooperadorJovensNome] = useState('');
  const [responsaveisNomes, setResponsaveisNomes] = useState('');
  const [materialTipo, setMaterialTipo] = useState('');
  const [qtdeMembros, setQtdeMembros] = useState('');
  const [qtdeBatizados, setQtdeBatizados] = useState('');
  const [qtdeSantaCeia2024, setQtdeSantaCeia2024] = useState('');
  const [qtdeSantaCeia2023, setQtdeSantaCeia2023] = useState('');
  const [qtdeSantaCeia2022, setQtdeSantaCeia2022] = useState('');
  const [qtdeCriancas, setQtdeCriancas] = useState('');
  const [qtdeMusicos, setQtdeMusicos] = useState('');
  const [documentacao, setDocumentacao] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [temAguaLuz, setTemAguaLuz] = useState(false);
  const [materialFabrica, setMaterialFabrica] = useState('');
  const [postoAdministrativo, setPostoAdministrativo] = useState('');
  const [endereco, setEndereco] = useState('');
  const [diasCultos, setDiasCultos] = useState('');
  const [horarioCultos, setHorarioCultos] = useState('');
  const [temReuniaoJovens, setTemReuniaoJovens] = useState(false);
  const [casasOracao, setCasasOracao] = useState([]);
  // const [photo, setPhoto] = useState(null); // Armazena a foto tirada
  // const [photoUri, setPhotoUri] = useState(null); 
  // const database = useSQLiteContext();
  const [data, setData] = useState([]);


  const createCasaOracaol = casaOracao();

  const handleSaveCoordinates = (coords) => {
    setLatitude(coords.latitude);
    setLongitude(coords.longitude);
  };








  async function createCasaOracao() {

    if (!casaDaOracao.trim()) {
      Alert.alert("Preencha todos os campos", "O campo 'Nome da Casa da Oração' é obrigatório.");
      return; // Interrompe a execução se o campo estiver vazio
    }
    
    if (!cooperadorNome.trim()) {
      Alert.alert("Preencha todos os campos", "O campo 'Nome do Cooperador' é obrigatório.");
      return;
    }  
    const response = await createCasaOracaol.createCasaOracao({
      userId, // Adicionando o ID do usuário
      casaDaOracao,
      cooperadorNome,
      cooperadorJovensNome,
      responsaveisNomes,
      materialTipo,
      qtdeMembros,
      qtdeBatizados,
      qtdeSantaCeia2024,
      qtdeSantaCeia2023,
      qtdeSantaCeia2022,
      qtdeCriancas,
      qtdeMusicos,
      documentacao,
      latitude, // Adicionando as coordenadas
      longitude,
      temAguaLuz,
      materialFabrica,
      postoAdministrativo,
      endereco,
      diasCultos,
      horarioCultos,
      temReuniaoJovens,
      // photoUri: photoUri
    });

    Alert.alert("Agora tira fotos do lugar e adiciona : " + response.insertedRowId);
     navigation.navigate('Camera', { userId: userId, user: user, permiSsion: permiSsion, idPost: response.insertedRowId });


     setCasaDaOracao('');
     setCooperadorNome('');
     setCooperadorJovensNome('');
     setResponsaveisNomes('');
     setMaterialTipo('');
     setQtdeMembros('');
     setQtdeBatizados('');
     setQtdeSantaCeia2024('');
     setQtdeSantaCeia2023('');
     setQtdeSantaCeia2022('');
     setQtdeCriancas('');
     setQtdeMusicos('');
     setDocumentacao('');
     setLatitude('');
     setLongitude('');
     setTemAguaLuz(false);
     setMaterialFabrica('');
     setPostoAdministrativo('');
     setEndereco('');
     setDiasCultos('');
     setHorarioCultos('');
     setTemReuniaoJovens(false);
 
     // Atualizar a lista de casas
     getStudents(userId);
  }



  
  const database = useSQLiteContext();
  const getStudents = async (userId) => {    
    try {
        const allRows = await database.getAllAsync('SELECT * FROM congregation_data WHERE userId = $userId', { $userId: userId } );
        if (allRows.length > 0) {
          setCasasOracao(allRows);  // Armazenando os dados no estado
        } else {
          console.log('Nenhum dado retornado da consulta');
        }
        setCasasOracao(allRows);
    } catch (error) {
        console.log('Error while loading students : ', error);
    }
};

useEffect(() => {
  getStudents(userId);
}, [userId]);


const handleDelete = async (id) => {
  try {
      await database.runAsync('DELETE FROM congregation_data WHERE id = ?', [id]);
      await getStudents();
  } catch (error) {
      console.log('Error while deleting the student : ', error);
  }
}


 return (
 

    <ScrollView contentContainerStyle={styles.container}>  
    <View style={styles.navContainer}>
      <Text style={styles.navItem}>CCM</Text>
      <TouchableOpacity
        style={styles.navButton}
        onPress={() =>
          navigation.navigate('Home', { userId: userId, user: user, permiSsion: permiSsion })
        }
      >
        <Text style={styles.buttonText}>voltar</Text>
      </TouchableOpacity>
    </View>


<View style={styles.viewForm}>
  <Text style={styles.textHead}>Formulario de Cadastro. Irmão/a {user}  - {userId} </Text>
      <Text style={styles.text}>Nome da Casa da Oracao:</Text>
      <TextInput
        placeholder="Digite o nome do cooperador"
        style={styles.input}
        value={casaDaOracao}
        onChangeText={setCasaDaOracao}
      />
      <Text style={styles.text}>Nome do Cooperador:</Text>
      <TextInput
        placeholder="Digite o nome do cooperador"
        style={styles.input}
        value={cooperadorNome}
        onChangeText={setCooperadorNome}
      />

      <Text style={styles.text}>Nome do Cooperador de Jovens:</Text>
      <TextInput
        placeholder="Digite o nome do cooperador de jovens"
        style={styles.input}
        value={cooperadorJovensNome}
        onChangeText={setCooperadorJovensNome}
      />

      <Text style={styles.text}>Nome dos Irmãos Responsáveis:</Text>
      <TextInput
        placeholder="Escreva os nomes dos responsáveis"
        style={styles.input}
        value={responsaveisNomes}
        onChangeText={setResponsaveisNomes}
      />

      <Text style={styles.text}>Tipo de Material:</Text>
      <TextInput
        placeholder="Digite o tipo de material"
        style={styles.input}
        value={materialTipo}
        onChangeText={setMaterialTipo}
      />

      <Text style={styles.text}>Quantidade de Membros:</Text>
      <TextInput
        placeholder="Digite a quantidade"
        keyboardType="numeric"
        style={styles.input}
        value={qtdeMembros}
        onChangeText={setQtdeMembros}
      />

      <Text style={styles.text}>Quantidade de Batizados:</Text>
      <TextInput
        placeholder="Digite a quantidade de batizados"
        keyboardType="numeric"
        style={styles.input}
        value={qtdeBatizados}
        onChangeText={setQtdeBatizados}
      />

      <Text style={styles.text}>Santa Ceia 2024:</Text>
      <TextInput
        placeholder="Quantidade de participantes"
        keyboardType="numeric"
        style={styles.input}
        value={qtdeSantaCeia2024}
        onChangeText={setQtdeSantaCeia2024}
      />

      <Text style={styles.text}>Santa Ceia 2023:</Text>
      <TextInput
        placeholder="Quantidade de participantes"
        keyboardType="numeric"
        style={styles.input}
        value={qtdeSantaCeia2023}
        onChangeText={setQtdeSantaCeia2023}
      />

      <Text style={styles.text}>Santa Ceia 2022:</Text>
      <TextInput
        placeholder="Quantidade de participantes"
        keyboardType="numeric"
        style={styles.input}
        value={qtdeSantaCeia2022}
        onChangeText={setQtdeSantaCeia2022}
      />

      <Text style={styles.text}>Quantidade de Crianças:</Text>
      <TextInput
        placeholder="Digite a quantidade de crianças"
        keyboardType="numeric"
        style={styles.input}
        value={qtdeCriancas}
        onChangeText={setQtdeCriancas}
      />

      <Text style={styles.text}>Quantidade de Músicos:</Text>
      <TextInput
        placeholder="Digite a quantidade de músicos"
        keyboardType="numeric"
        style={styles.input}
        value={qtdeMusicos}
        onChangeText={setQtdeMusicos}
      />

      <Text style={styles.text}>Documentação:</Text>
      <TextInput
        placeholder="Descrição da documentação"
        style={styles.input}
        value={documentacao}
        onChangeText={setDocumentacao}
      />

      <Text style={styles.text}>Tem Água e Luz:</Text>
      <Switch value={temAguaLuz} onValueChange={setTemAguaLuz} />

      <Text style={styles.text}>Material da Fábrica:</Text>
      <TextInput
        placeholder="Digite o material fabricado"
        style={styles.input}
        value={materialFabrica}
        onChangeText={setMaterialFabrica}
      />

      <Text style={styles.text}>Posto Administrativo:</Text>
      <TextInput
        placeholder="Digite o nome do posto"
        style={styles.input}
        value={postoAdministrativo}
        onChangeText={setPostoAdministrativo}
      />

      <Text style={styles.text}>Endereço:</Text>
      <TextInput
        placeholder="Digite o endereço"
        style={styles.input}
        value={endereco}
        onChangeText={setEndereco}
      />

      <Text style={styles.text}>Dias de Cultos:</Text>
      <TextInput
        placeholder="Digite os dias de culto"
        style={styles.input}
        value={diasCultos}
        onChangeText={setDiasCultos}
      />

      <Text style={styles.text}>Horário dos Cultos:</Text>
      <TextInput
        placeholder="Digite os horários dos cultos"
        style={styles.input}
        value={horarioCultos}
        onChangeText={setHorarioCultos}
      />

      <Text style={styles.text}>Tem Reunião de Jovens:</Text>
      <Switch value={temReuniaoJovens} onValueChange={setTemReuniaoJovens} />

      <Button
        title="Selecionar Localização"
        onPress={() => navigation.navigate('Map', { saveCoordinates: handleSaveCoordinates })}
      />
      {latitude && longitude && (
        <Text style={styles.textoCordennadas}>
          Coordenadas Selecionadas! Lat: {latitude}, Long: {longitude}
        </Text>
      )}

      <TouchableOpacity style={styles.Butao} onPress={createCasaOracao}>
        <Text>Enviar</Text>
      </TouchableOpacity>
      </View>
    </ScrollView>
  );


}
  // export default CasaOracaoScreen;
  


const styles = StyleSheet.create({
  container: {
    // padding: 20,
  },
  input: {
    borderColor: '#000',
    borderWidth: 1,
    padding: 8,
    marginVertical: 5,
    borderRadius: 5,
  },
  text: {
    fontSize: 16,
    marginVertical: 5,
  },
  textHead: {
    fontSize: 16,
    marginVertical: 5,
    fontWeight: 'bold',
    color: 'green',
    marginBottom: 10,
  },
  textoCordennadas: {
    color: 'green',
    fontSize: 18,
    marginVertical: 5,
  },
  Butao: {
    backgroundColor: '#4CAF50',
    padding: 10,
    alignItems: 'center',
    borderRadius: 5,
    marginVertical: 10,
  },
  image: {
    width: 100,
    height: 100,
    marginVertical: 10,
    borderRadius: 10,
  },
  textoRender:
  {
    fontSize: 18,
    marginVertical: 5,
    marginBottom: 10,
    fontWeight: 'bold',
    color: 'green',
    borderBottomWidth: 1,
   },
   button: {
    width: '40%',  // Define a largura do botão (ajuste conforme necessário)
    alignSelf: 'center',  // Centraliza o botão
    marginVertical: 10,  // Espaçamento vertical
  },
  textoRender: {
    fontSize: 16,
    padding: 10,
  },
  viewForm: {
    backgroundColor: '#f2f2f2',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    width: '100%',
    borderWidth: 1,
    borderColor: '#ddd',
    marginTop: 30,
  },
  viewAct: {
    backgroundColor: '#ECE3E3FF',
    padding: 10,
    marginBottom: 10,
    borderRadius: 0,
    borderWidth: 1,
    borderColor: '#ddd',
    marginTop: 10,
  },
  butaofoto:{
    marginBottom: 10,
    padding: 10,
  },


  navContainer: {
    width: '100%',
    flexDirection: 'row',  // Coloca os itens lado a lado
    justifyContent: 'space-between',  // Distribui espaço entre os itens
    alignItems: 'center',  // Alinha verticalmente ao centro
    padding: 15,
    backgroundColor: '#fff',
    // borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    // marginTop: -20
    position: 'absolute', // Fixa a nav na parte superior
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000, 
  },
  navItem: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  navButton: {
    backgroundColor: '#007bff',
    // paddingVertical: 10,
    // paddingHorizontal: 20,
    padding:10,
    borderRadius: 20,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});


