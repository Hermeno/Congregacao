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
import FotosCasaScreen from "./screens/FotosCasaScreen";
import FotosCroquiScreen from "./screens/FotosCroquiScreen";
import FotosDocumentoScreen from "./screens/FotosDocumentoScreen";
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
          idPost INTEGER,
          foto TEXT,
          tipo TEXT
        )`
    );

    await db.execAsync(
        `CREATE TABLE IF NOT EXISTS congregation_data (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          userId INTEGER,
          casadaoracao TEXT,
          cooperador_nome TEXT,
          cooperador_numero TEXT,
          cooperador_jovens_nome TEXT,
          porteiros_nomes TEXT,
          auxiliares_admin TEXT,
          obra_irmas TEXT,
          responsaveis_nomes TEXT,
          foto_co BLOB,
          material_tipo TEXT,
          qtde_membros INTEGER,
          qtde_batizados INTEGER,
          qtde_santa_ceia_2024 INTEGER,
          qtde_santa_ceia_2025 INTEGER,
          qtde_santa_ceia_2026 INTEGER,
          qtde_criancas INTEGER,
          qtde_musicos INTEGER,
          qtde_musicistas INTEGER,
          documentacao TEXT,
          latitude REAL,
          longitude REAL,
          croqui BLOB,
          tem_agua BOOLEAN,
          tem_luz BOOLEAN,
          material_fabrica TEXT,
          material_local TEXT,
          posto_administrativo TEXT,
          rua TEXT,
          bairro TEXT,
          cidade TEXT,
          dias_reuniao_jovens TEXT,
          dias_cultos TEXT,
          data_batismo TEXT,
          denominacao_outra TEXT,
          observacao TEXT,
          data_inicio TEXT,
          qtde_habitantes INTEGER,
          ccm_terreno TEXT,
          ccm_imovel TEXT
        )`
    );

    // Adiciona colunas que podem estar faltando
    try {
        await db.execAsync(`
          ALTER TABLE congregation_data ADD COLUMN cooperador_numero TEXT;
          ALTER TABLE congregation_data ADD COLUMN porteiros_nomes TEXT;
          ALTER TABLE congregation_data ADD COLUMN auxiliares_admin TEXT;
          ALTER TABLE congregation_data ADD COLUMN obra_irmas TEXT;
          ALTER TABLE congregation_data ADD COLUMN qtde_musicistas INTEGER;
          ALTER TABLE congregation_data ADD COLUMN material_local TEXT;
          ALTER TABLE congregation_data ADD COLUMN bairro TEXT;
          ALTER TABLE congregation_data ADD COLUMN dias_reuniao_jovens TEXT;
          ALTER TABLE congregation_data ADD COLUMN data_batismo TEXT;
          ALTER TABLE congregation_data ADD COLUMN denominacao_outra TEXT;
          ALTER TABLE congregation_data ADD COLUMN observacao TEXT;
          ALTER TABLE congregation_data ADD COLUMN data_inicio TEXT;
          ALTER TABLE congregation_data ADD COLUMN qtde_habitantes INTEGER;
          ALTER TABLE congregation_data ADD COLUMN ccm_terreno TEXT;
          ALTER TABLE congregation_data ADD COLUMN ccm_imovel TEXT;
          ALTER TABLE congregation_data ADD COLUMN tem_agua BOOLEAN;
          ALTER TABLE congregation_data ADD COLUMN tem_luz BOOLEAN;
          ALTER TABLE congregation_data ADD COLUMN rua TEXT;
          ALTER TABLE congregation_data ADD COLUMN cidade TEXT;
          ALTER TABLE congregation_data ADD COLUMN qtde_santa_ceia_2025 INTEGER;
          ALTER TABLE congregation_data ADD COLUMN qtde_santa_ceia_2026 INTEGER;
        `);
    } catch (error) {
        // As colunas já existem, não há problema
        console.log('Colunas já existem na tabela');
    }
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
                <Stack.Screen name='FotosCasa' component={FotosCasaScreen}/>
                <Stack.Screen name='FotosCroqui' component={FotosCroquiScreen}/>
                <Stack.Screen name='FotosDocumento' component={FotosDocumentoScreen}/>
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
