import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  Alert,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useSQLiteContext } from 'expo-sqlite';
import { FontAwesome } from '@expo/vector-icons';

export default function LoginScreen({ navigation }) {
  const db = useSQLiteContext();
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (userName.length === 0 || password.length === 0) {
      Alert.alert('Avertissement', 'Veuillez saisir le nom d\'utilisateur et le mot de passe');
      return;
    }

    try {
      const user = await db.getFirstAsync(
        'SELECT * FROM users WHERE username = ?',
        [userName]
      );

      if (!user) {
        Alert.alert('Erreur', 'Le nom d\'utilisateur n\'existe pas!');
        return;
      }

      const validUser = await db.getFirstAsync(
        'SELECT id, username, permission FROM users WHERE username = ? AND password = ?',
        [userName, password]
      );

      if (validUser) {
        Alert.alert('Succès', 'Connecté avec succès!');
        navigation.navigate('Accueil', {
          user: userName,
          userId: validUser.id,
          permission: validUser.permission,
        });
        setUserName('');
        setPassword('');
      } else {
        Alert.alert('Erreur', 'Mot de passe incorrect');
      }
    } catch (error) {
      console.log('Erreur lors de la connexion:', error);
      Alert.alert('Erreur', 'Erreur lors de la connexion');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.navContainer}>
        <Text style={styles.navItem}>CCM</Text>
      </View>

      <Text style={styles.title}>
        Connectez-vous à votre compte <FontAwesome name="lock" size={24} color="green" />
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Nom d'utilisateur"
        value={userName}
        onChangeText={setUserName}
        placeholderTextColor="#999"
      />

      <TextInput
        style={styles.input}
        placeholder="Mot de passe"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        placeholderTextColor="#999"
      />

      <Pressable style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>
          Connexion <FontAwesome name="lock" size={24} color="white" />
        </Text>
      </Pressable>

      <Pressable
        style={styles.link}
        onPress={() => navigation.navigate('Inscription')}
      >
        <Text style={styles.linkText}>Vous n'avez pas de compte? S'inscrire</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  navContainer: {
    backgroundColor: '#28a745',
    paddingVertical: 15,
    alignItems: 'center',
  },
  navItem: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    marginTop: 30,
    textAlign: 'center',
    color: '#333',
  },
  input: {
    height: 50,
    marginHorizontal: 20,
    marginVertical: 10,
    borderRadius: 8,
    paddingHorizontal: 15,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  button: {
    backgroundColor: '#28a745',
    marginHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  link: {
    alignItems: 'center',
    marginVertical: 10,
  },
  linkText: {
    color: '#28a745',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
});
