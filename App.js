import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, Pressable, Alert } from 'react-native';
import { SQLiteProvider, useSQLiteContext } from 'expo-sqlite';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as Location from 'expo-location';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { FontAwesome } from '@expo/vector-icons';
import { useState } from 'react';
import HomeScreen from "./screens/HomeScreen";
import FormScreen from "./screens/FormScreen";
import CameraScreen from "./screens/CameraScreen";
import MapScreen from "./screens/MapScreen";
import ViewScreen from "./screens/ViewScreen";
import SingScreen from "./screens/SingScreen";
import MapaScreen from "./screens/MapaScreen";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
//initialize the database
const initializeDatabase = async(db) => {
    try {
        await db.execAsync(`
            PRAGMA journal_mode = WAL;
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT UNIQUE,
                password TEXT NOT NULL,
                permission INTEGER NOT NULL
            );
        `);
        console.log('Base de données initialisée !');
    } catch (error) {
        console.log("Erreur lors de l'initialisation de la base de données:", error);
    }

    await db.execAsync(`       
        CREATE TABLE IF NOT EXISTS fotos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        idPost INTEGER,        -- Relaciona as fotos com o id da postagem foto BLOB,             -- Armazena a foto como BLOB
        FOREIGN KEY (idPost) REFERENCES posts(id) -- Relaciona com a tabela de posts
        ); `
    )

    await db.execAsync(
        `CREATE TABLE IF NOT EXISTS congregation_data (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          userId INTEGER,
          casadaoracao TEXT,
          cooperador_nome TEXT,
          cooperador_jovens_nome TEXT,
          responsaveis_nomes TEXT,
          foto_co BLOB,                -- Foto da CO (salva como BLOB)
          material_tipo TEXT,
          qtde_membros INTEGER,
          qtde_batizados INTEGER,
          qtde_santa_ceia_2024 INTEGER,
          qtde_santa_ceia_2023 INTEGER,
          qtde_santa_ceia_2022 INTEGER,
          qtde_criancas INTEGER,
          qtde_musicos INTEGER,
          documentacao TEXT,           -- Documentação (anexar fotos dos documentos)
          latitude REAL,               -- Coordenadas de latitude
          longitude REAL,              -- Coordenadas de longitude
          croqui BLOB,                 -- Desenho do local (salvo como BLOB)
          tem_agua_luz BOOLEAN,
          material_fabrica TEXT,
          posto_administrativo TEXT,
          endereco TEXT,
          dias_cultos TEXT,
          horario_cultos TEXT,
          tem_reuniao_jovens BOOLEAN
        )`
    );
    
};

// Créer un navigateur de pile qui gère la navigation
const Stack = createStackNavigator();

// Écrans : Connexion, Inscription et Accueil

export default function App() {
  return (
    <SQLiteProvider databaseName='auth.db' onInit={initializeDatabase}>
        <NavigationContainer>
            <Stack.Navigator initialRouteName='Connexion'>
                <Stack.Screen name='Connexion' component={LoginScreen}/>
                <Stack.Screen name='Inscription' component={RegisterScreen}/>
                <Stack.Screen name='Accueil' component={HomeScreen}/>
                <Stack.Screen name='Formulaire' component={FormScreen}/>
                <Stack.Screen name='Caméra' component={CameraScreen}/>
                <Stack.Screen name='Carte' component={MapScreen}/>
                <Stack.Screen name='Vue' component={ViewScreen}/>
                <Stack.Screen name='Chanter' component={SingScreen}/>
                <Stack.Screen name='CartePlan' component={MapaScreen}/>
            </Stack.Navigator>
        </NavigationContainer>
    </SQLiteProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#cad478',
    alignItems: 'center',
    // justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    color: 'green',
    marginTop: 250,
  },
  input: {
    width: '80%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#fff',
    marginVertical: 5,
    color: '#fff',
  },
  button: {
    backgroundColor: 'blue',
    padding: 10,
    marginVertical: 10,
    width: '80%',
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 18,
  },
  link : {
    marginTop: 10,
  },
  linkText: {
    color: 'blue',
  },
  userText: {
    fontSize: 18,
    marginBottom: 30,
  },

  navContainer: {
    width: '100%',
    // flexDirection: 'row',  // Coloca os itens lado a lado
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
    alignContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  navItem: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'green',
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
