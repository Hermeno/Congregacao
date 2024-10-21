import React, { useState, useEffect } from 'react';
import { FlatList, Pressable,  ScrollView, Text, StyleSheet, TextInput, Button, Switch, TouchableOpacity, Alert, View, Image } from 'react-native';
import { casaOracao } from '../database/casaOracao';
// import { Camera, CameraType } from 'expo-camera';
import { useSQLiteContext } from 'expo-sqlite';

export default function ViewScreen({ navigation, route }) {
  const { user, userId, permiSsion } = route.params;

  const [casasOracao, setCasasOracao] = useState([]);
  const database = useSQLiteContext();
  const getStudents = async (userId) => {    
    try {
        const allRows = await database.getAllAsync('SELECT * FROM congregation_data ');
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




const confirmDelete = (id, casadaoracao) => {
  Alert.alert(
    "Confirmação de Exclusão",
    "Tem certeza de que deseja deletar " + casadaoracao ,
    // "Tem certeza de que deseja deletar este registro?",
    [
      {
        text: "Cancelar",
        onPress: () => console.log("Exclusão cancelada"),
        style: "cancel"
      },
      {
        text: "Sim", 
        onPress: () => handleDelete(id, casadaoracao)
      }
    ],
    { cancelable: true }
  );
};



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
      <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('Home', { userId: userId, user: user, permiSsion: permiSsion })}>
        <Text style={styles.buttonText}>voltar</Text>
      </TouchableOpacity>
    </View>
<View style={styles.viewAct}>
<Text style={styles.textHead}>VISUALIZACAO DE TODOS DADOS</Text>
{casasOracao.length > 0 ? (
  casasOracao.map((item, index) => (
    <React.Fragment key={index}>

      <View style={styles.row}> 
        <Text style={styles.textoRender}>
          {item.casadaoracao}{item.userId}
        </Text>
        <TouchableOpacity style={styles.Butao}  
          title="Visualizar"
          onPress={() => navigation.navigate('Sing', { idPost: item.id, user: user, userId: userId, permiSsion:permiSsion })}
        ><Text>Visualizar</Text></TouchableOpacity>

        <TouchableOpacity style={styles.ButaoDel} 
          title="Delete"
          onPress={() => confirmDelete(item.id, item.casadaoracao)}
        ><Text>Del</Text></TouchableOpacity>
      </View>

    </React.Fragment>
  ))
) : (
  <Text>Nenhum dado encontrado.</Text>
)} 
</View>


</ScrollView>
  );



}


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
  row: {
    flexDirection: 'row',  // Coloca os elementos lado a lado
    justifyContent: 'space-between',  // Distribui o espaço entre os elementos
    alignItems: 'center',  // Alinha os itens no centro verticalmente
    padding: 10,  // Espaçamento interno
    borderColor: '#ccc', //
    borderWidth: 1, //
  },
  Butao: {
    backgroundColor: '#007bff',  // Cor de fundo para os botões
    padding: 10,
    borderRadius: 5,
    marginLeft: 10,  // Espaçamento entre os botões
  },
  textoRender: {
    flex: 1,  // Permite ao texto ocupar o espaço restante
    marginRight: 10,
    fontWeight: 'bold',
  },
  textHead: {
    fontSize: 16,
    marginVertical: 5,
    fontWeight: 'bold',
    color: 'green',
    margin: 20,
    marginTop:10,
    marginBottom:20,
    alignItems: 'center',
    alignContent: 'center',
    alignSelf: 'center',
  },
 
  Butao: {
    width: '20%',
    // height:30,
    padding: 10,
    backgroundColor: '#4CAF50',
    // padding: 10,
    alignItems: 'center',
    borderRadius: 15,
    marginVertical: 10,
    margin:5,
  },
  ButaoDel: {
    width: '20%',
    // height:30,
    padding: 10,
    backgroundColor: '#EC1D2EFF',
    // padding: 10,
    alignItems: 'center',
    borderRadius: 15,
    marginVertical: 10,
    margin:5,
  },
  
  viewForm: {
    // backgroundColor: '#f2f2f2',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    width: '100%',
    borderWidth: 1,
    borderColor: '#ddd',
    marginTop: 10,
  },
  viewAct: {
    padding: 10,
    marginBottom: 10,
    borderRadius: 0,
    // borderWidth: 1,
    borderColor: '#ddd',
    marginTop: 60,
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
  }
});


