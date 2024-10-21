import React, { useState, useEffect } from 'react';
import { FlatList, Pressable,  ScrollView, Text, StyleSheet, TextInput, Button, Switch, TouchableOpacity, Alert, View, Image } from 'react-native';
import { casaOracao } from '../database/casaOracao';
// import { Camera, CameraType } from 'expo-camera';
import { useSQLiteContext } from 'expo-sqlite';

export default function SingScreen({ navigation, route }) { 
  const { user, idPost, userId, permiSsion } = route.params;

  const [casasOracao, setCasasOracao] = useState([]);
  const [photos, setPhotos] = useState([]);
  const database = useSQLiteContext();
  const getStudents = async (idPost) => {    
    try {
        const allRows = await database.getAllAsync('SELECT * FROM congregation_data WHERE id = $id', { $id: idPost });
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


const getFotos = async (idPost) => {    
  try {
      const allRows = await database.getAllAsync('SELECT * FROM fotos WHERE idPost = $id', { $id: idPost });
      if (allRows.length > 0) {
        setPhotos(allRows);  // Armazenando os dados no estado
      } else {
        console.log('Nenhum dado retornado da consulta');
      }
      setPhotos(allRows);
  } catch (error) {
      console.log('Error while loading students : ', error);
  }
};

useEffect(() => {
  getStudents(idPost);
  getFotos(idPost);
}, [idPost]);




const handleDelete = async (id) => {
  try {
      await database.runAsync('DELETE FROM congregation_data WHERE id = ?', [id]);
      await getStudents();
  } catch (error) {
      console.log('Error while deleting the student : ', error);
  }
}

return (
    <><View style={styles.navContainer}>
      <Text style={styles.navItem}>CCM</Text>
      <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('Viw', { userId: userId, user: user, permiSsion: permiSsion })}>
        <Text style={styles.buttonText}>voltar</Text>
      </TouchableOpacity>
    </View>
    <ScrollView contentContainerStyle >

        <View style={styles.viewAct}>
          
          {casasOracao.length > 0 ? (
            casasOracao.map((item, index) => (
              <React.Fragment key={index}>
                <Text style={styles.textHead}>DADOS DE CASA DA/E  {item.casadaoracao}</Text>
                <View style={styles.row}>
                    <Text > Casa da Oracao - <Text style={styles.textoRender}> {item.casadaoracao}</Text></Text>
                    <Text> Nome do Cooperador - <Text style={styles.textoRender}>   {item.cooperador_nome} </Text></Text>
                    <Text> Cooperador de jovens - <Text style={styles.textoRender}>   {item.cooperador_jovens_nome}</Text></Text>
                    <Text> Nome dos Responsaveis - <Text style={styles.textoRender}>   {item.responsaveis_nomes}</Text></Text>
                    <Text> Material  - <Text style={styles.textoRender}>   {item.material_tipo} </Text></Text>
                    <Text> Quantidade dos Membros - <Text style={styles.textoRender}>   {item.qtde_membros}</Text></Text>
                    <Text> Quantidade de Batizados - <Text style={styles.textoRender}>   {item.qtde_batizados}</Text></Text>
                    <Text> Quantidade de Santa ceia 2024 - <Text style={styles.textoRender}>   {item.qtde_santa_ceia_2024}</Text></Text>
                    <Text> Quantidade de santa ceia 2023 - <Text style={styles.textoRender}>   {item.qtde_santa_ceia_2023}</Text></Text>
                    <Text> Quantidade de santa ceia 2022 - <Text style={styles.textoRender}>   {item.qtde_santa_ceia_2022}</Text></Text>
                    <Text> Quantidade de Criancas - <Text style={styles.textoRender}>   {item.qtde_criancas} </Text></Text>
                    <Text> Quantidade de Musicos - <Text style={styles.textoRender}>   {item.qtde_musicos}</Text></Text>
                    <Text> Documentacao - <Text style={styles.textoRender}>   {item.documentacao}</Text></Text>
                    {/* <Text> cooperador - <Text style={styles.textoRender}>   {item.latitude}</Text></Text>
                    <Text> cooperador - <Text style={styles.textoRender}>   {item.longitude} </Text></Text> */}
                    <Text> Tem agua e luz- 
                      
                      {item.tem_agua_luz == 1 ?(
                          <Text style={styles.textoRender}>Sim</Text>
                        ) : ( 
                          <Text style={styles.textoRender}>Não</Text>
                        )                      
                      }
                      
                    </Text>
                    <Text> Material de Fabrico - <Text style={styles.textoRender}>   {item.material_fabrica}</Text></Text>

                    {/* <Text> foto - <Text style={styles.textoRender}>   {item.foto_co}</Text></Text> */}

                                  {/* <Text>Foto:</Text>
                    <Image
                      source={{ uri: item.foto_co }}
                      style={{ width: 200, height: 200 }} // Defina a largura e altura da imagem
                    /> */}


                    <Text> Posto Administrativo - <Text style={styles.textoRender}>   {item.posto_administrativo}</Text></Text>
                    <Text> Endereco - <Text style={styles.textoRender}>   {item.endereco}</Text></Text>
                    <Text> Dias de Cultos - <Text style={styles.textoRender}>   {item.dias_cultos} </Text></Text>
                    <Text> horario dos Cultos - <Text style={styles.textoRender}>   {item.horario_cultos}</Text></Text>
                    <Text> Tem reuniao de Jovens -                         
                      {item.tem_reuniao_jovens == 1 ? (
                          <Text style={styles.textoRender}>Sim</Text>
                        ) : ( 
                          <Text style={styles.textoRender}>Não</Text>
                        )                      
                      }
                    </Text>
                    {/* <Text> cooperador - <Text style={styles.textoRender}>   {item.userId}</Text></Text> */}
                      {/* {item.foto_co} */}

                    <TouchableOpacity style={styles.Butao} title="Update" onPress={() => navigation.navigate('Mapa', { userId: userId, user: user, permiSsion:permiSsion, latitude:item.latitude,longitude:item.longitude })}>
                      <Text style={styles.textoBranco}>Ver localiacao</Text>
                    </TouchableOpacity>




                    
                    {/* {photos.length > 0 ? (
                      photos.map((itens, index) => (
                        <View  style={styles.fotoView}>
                        <React.Fragment key={index}>
                          <View style={styles.viewDel}>
                            <View>
                              <Image
                                source={{ uri: itens.foto }} // Acessa diretamente a URI da foto
                                style={{ width: 200, height: 200 }} // Defina a largura e altura da imagem
                              />
                            </View>
                          </View>
                        </React.Fragment>
                        </View>
                      ))
                    ) : (
                      <TouchableOpacity style={styles.Butao5} title="Tirar fotos" onPress={() =>navigation.navigate('Camera', { userId: userId, user: user, permiSsion: permiSsion, idPost: idPost })}>
                        <Text style={styles.textoBranco}>Casa da oracao sem fotos: Tirar fotos</Text>
                      </TouchableOpacity>
                    )} */}

                    {photos.length > 0 ? (
                      <View style={styles.fotoContainer}>
                        {photos.map((itens, index) => (
                          <View style={styles.fotoView} key={index}>
                            <View style={styles.viewDel}>
                              <Image
                                source={{ uri: itens.foto }} // Acessa diretamente a URI da foto
                                style={styles.foto} // Defina a largura e altura da imagem
                              />
                            </View>
                          </View>
                        ))}
                      </View>
                    ) : (
                      <TouchableOpacity
                        style={styles.Butao5}
                        title="Tirar fotos"
                        onPress={() =>
                          navigation.navigate('Camera', {
                            userId: userId,
                            user: user,
                            permiSsion: permiSsion,
                            idPost: idPost
                          })
                        }
                      >
                        <Text style={styles.textoBranco}>Casa da oração sem fotos: Tirar fotos</Text>
                      </TouchableOpacity>
                    )}




















                  <TouchableOpacity style={styles.ButaoDel}
                    title="Delete"
                    onPress={() => handleDelete(item.id)}
                  ><Text style={styles.textoBranco}>Eliminar tudo de {item.casadaoracao}</Text></TouchableOpacity>
                </View>

              </React.Fragment>
            ))
          ) : (
            <Text>Nenhum dado encontrado.</Text>
          )}
        </View>


      </ScrollView></>
  );



}


const styles = StyleSheet.create({
  container: {
    // padding: 20
    
  },
  input: {
    borderColor: '#000',
    borderWidth: 1,
    padding: 8,
    marginVertical: 5,
    borderRadius: 5,
  },
  row: {
    // flexDirection: 'row',  // Coloca os elementos lado a lado
    justifyContent: 'space-between',  // Distribui o espaço entre os elementos
    alignItems: 'left',  // Alinha os itens no centro verticalmente
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
    // flex: 1,  // Permite ao texto ocupar o espaço restante
    // marginRight: 10,
    fontSize: 18,
    color: 'black',
    marginLeft: 10,
    fontWeight: 'bold',
  },
  textHead: {
    fontSize: 16,
    marginVertical: 5,
    fontWeight: 'bold',
    color: 'green',
    margin: 10,
    alignItems: 'center',
    alignContent: 'center',
    alignSelf: 'center',
    marginBottom:20,
    marginTop:20,
  },
  textoBranco: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  }, 

  Butao: {
    width: '50%',
    // height:30,
    padding: 10,
    backgroundColor: '#4CAF50',
    // padding: 10,
    alignItems: 'center',
    borderRadius: 15,
    marginVertical: 10,
    margin:5,
  },
  Butao5: {
    width: '50%',
    // height:30,
    padding: 10,
    backgroundColor: '#4C72AFFF',
    // padding: 10,
    alignItems: 'center',
    borderRadius: 15,
    marginVertical: 10,
    margin:5,
  },
  ButaoDel: {
    width: '50%',
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
  },

  




  fotoContainer: {
    flexDirection: 'row',  // Exibe os itens em linha
    flexWrap: 'wrap',      // Quebra para a próxima linha quando necessário
    justifyContent: 'space-between',  // Espaçamento entre as imagens (opcional)
  },
  fotoView: {
    margin: 1.5, // Espaçamento entre as fotos
  },
  foto: {
    width: 185,  // Defina a largura da imagem
    height: 150, // Defina a altura da imagem
    // borderRadius: 8, // Deixa os cantos arredondados (opcional)
  },
});


