import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, Pressable, Alert } from 'react-native';
import { SQLiteProvider, useSQLiteContext } from 'expo-sqlite';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as Location from 'expo-location';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { FontAwesome  } from '@expo/vector-icons';
// import Map from './src/Map';
import { useState } from 'react';
import HomeScreen  from "./screens/HomeScreen";
import FormScreen from "./screens/FormScreen";
import CameraScreen from "./screens/CameraScreen";
import MapScreen from "./screens/MapScreen";
import ViewScreen from "./screens/ViewScreen";
import SingScreen from "./screens/SingScreen";
import MapaScreen from "./screens/MapaScreen";
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
        console.log('Database initialized !');
    } catch (error) {
        console.log('Error while initializing the database : ', error);
    }

    await db.execAsync(`       
        CREATE TABLE IF NOT EXISTS fotos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        idPost INTEGER,        -- Relaciona as fotos com o id da postagem
        foto BLOB,             -- Armazena a foto como BLOB
        FOREIGN KEY (idPost) REFERENCES posts(id) -- Relaciona com a tabela de posts
        ); `
    )


    //     await db.execAsync(
    //     `ALTER TABLE users ADD COLUMN permission TEXT`
    //   );
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

    // await db.execAsync(
    //     `ALTER TABLE congregation_data ADD COLUMN casadaoracao TEXT`
    //   );

    
    // const resetDatabase = async (db) => {
    //     try {
    //         await db.execAsync(`
    //             DROP TABLE IF EXISTS users;
    //             DROP TABLE IF EXISTS fotos;
    //             DROP TABLE IF EXISTS congregation_data;
    //         `);
    //         console.log('All tables dropped successfully!');
            
    //         // Recriar as tabelas após excluir
    //         await initializeDatabase(db);
    //     } catch (error) {
    //         console.log('Error while resetting the database: ', error);
    //     }
    // };
    
    // // Exemplo de uso:
    // resetDatabase(db);
    
};

//create a stack navigator that manages the navigation between 3 screens
const Stack = createStackNavigator();

//We'll have 3 screens : Login, Register and Home

export default function App() {
  return (
    <SQLiteProvider databaseName='auth.db' onInit={initializeDatabase}>
        <NavigationContainer>
            <Stack.Navigator initialRouteName='Login'>
                <Stack.Screen name='Login' component={LoginScreen}/>
                <Stack.Screen name='Register' component={RegisterScreen}/>
                <Stack.Screen name='Home' component={HomeScreen}/>
                <Stack.Screen name='Form' component={FormScreen}/>
                <Stack.Screen name='Camera' component={CameraScreen}/>
                <Stack.Screen name='Map' component={MapScreen}/>
                <Stack.Screen name='Viw' component={ViewScreen}/>
                <Stack.Screen name='Sing' component={SingScreen}/>
                <Stack.Screen name='Mapa' component={MapaScreen}/>
            </Stack.Navigator>
        </NavigationContainer>
    </SQLiteProvider>
  );
}

//LoginScreen component
const LoginScreen = ({navigation}) => {

    const db = useSQLiteContext();
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');

    //function to handle login logic
    const handleLogin = async() => {
        if(userName.length === 0 || password.length === 0) {
            Alert.alert('Attention','Please enter both username and password');
            return;
        }
        try {
            const user = await db.getFirstAsync('SELECT * FROM users WHERE username = ?', [userName]);
            if (!user) {
                Alert.alert('Error', 'Nome do usuario nao existe !');
                return;
            }
            const validUser = await db.getFirstAsync('SELECT id, username, permission FROM users WHERE username = ? AND password = ?', [userName, password]);
            if(validUser) {
                const userId = validUser.id;
                const permiSsion = validUser.permission;
                Alert.alert('Success', 'Logado com Sucesso');
                // navigation.navigate('Login');
                navigation.navigate('Home', {user:userName, userId: userId, permiSsion: permiSsion });
                setUserName('');
                setPassword('');
            } else {
                Alert.alert('Error', 'Senha incoreta');
            }
        } catch (error) {
            console.log('Error during login : ', error);
        }
    }
    return (


  
        <View style={styles.container}>
    <View style={styles.navContainer}>
      <Text style={styles.navItem}>CCM</Text>
    </View>




            <Text style={styles.title}>Entre na sua conta <FontAwesome name="lock" size={24} color="green" /></Text>
            <TextInput 
                style={styles.input}
                placeholder='Nome do usuario'
                value={userName}
                onChangeText={setUserName}
            />
            <TextInput 
                style={styles.input}
                placeholder='Password'
                secureTextEntry
                value={password}
                onChangeText={setPassword}
            />
            <Pressable style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText} >Login  <FontAwesome name="lock" size={24} color="white" /></Text>
            </Pressable>
            <Pressable style={styles.link} onPress={() => navigation.navigate('Register')}>
                <Text style={styles.linkText}>Don't have an account? Register</Text>
            </Pressable>
        </View>
    )
}

//RegisterScreenComponent
const RegisterScreen = ({navigation}) => {

    const db = useSQLiteContext();
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [permissions, setPermissions] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    //function to handle registration logic
    const handleRegister = async() => {
        if  (userName.length === 0 || password.length === 0 || confirmPassword.length === 0) {
            Alert.alert('Attention!', 'Please enter all the fields.');
            return;
        }
        if (password !== confirmPassword) {
            Alert.alert('Error', 'Password do not match');
            return;
        }
        try {
            const existingUser = await db.getFirstAsync('SELECT * FROM users WHERE username = ?', [userName]);
            if (existingUser) {
                Alert.alert('Error', 'Username already exists.');
                return;
            }
            const permissions = 1;

            await db.runAsync('INSERT INTO users (username, password, permission) VALUES (?, ?, ?)', [userName, password, permissions]);
            Alert.alert('Success', 'Registration successful!');
            // navigation.navigate('Home', {user : userName});
            navigation.navigate('Login');
        } catch (error) {
            console.log('Error during registration : ', error);
        }
    }

    return (
        <View style={styles.container}>
                <View style={styles.navContainer}>
                <Text style={styles.navItem}>CCM</Text>
                </View>
            <Text style={styles.title}>Registrar - se  <FontAwesome name="user" size={24} color="green" /></Text>
            <TextInput 
                style={styles.input}
                placeholder='Nome do usuario'
                value={userName}
                onChangeText={setUserName}
            />
            <TextInput 
                style={styles.input}
                placeholder='Password'
                secureTextEntry
                value={password}
                onChangeText={setPassword}
            />
            <TextInput 
                style={styles.input}
                placeholder='Confirmar password'
                secureTextEntry
                value={confirmPassword}
                onChangeText={setConfirmPassword}
            />
            <Pressable style={styles.button} onPress={handleRegister}>
                <Text style={styles.buttonText} >Registrar  <FontAwesome name="person-add" size={24} color="white" /></Text>
            </Pressable>
            <Pressable style={styles.link} onPress={() => navigation.navigate('Login')}>
                <Text style={styles.linkText}>Already have an account? Login</Text>
            </Pressable>
        </View>
    )
}

//HomeScreen component
// const HomeScreen = ({navigation, route}) => {

//     //we'll extract the user parameter from route.params
//     const { user } = route.params;
//     return (
//         <View style={styles.container}>
//             <Text style={styles.title}>Home</Text>
//             <Text style={styles.userText}>Welcome {user} !</Text>
//             <Pressable style={styles.button} onPress={() => navigation.navigate('Login')}>
//                 <Text style={styles.buttonText} >Logout</Text>
//             </Pressable>
//         </View>
//     )
// }

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
