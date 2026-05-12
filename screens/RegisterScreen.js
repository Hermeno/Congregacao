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

export default function RegisterScreen({ navigation }) {
  const db = useSQLiteContext();
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleRegister = async () => {
    if (userName.length === 0 || password.length === 0 || email.length === 0) {
      Alert.alert('Avertissement', 'Veuillez remplir tous les champs');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Erreur', 'Les mots de passe ne correspondent pas');
      return;
    }

    try {
      const existingUser = await db.getFirstAsync(
        'SELECT * FROM users WHERE username = ?',
        [userName]
      );

      if (existingUser) {
        Alert.alert('Erreur', 'Cet utilisateur existe déjà');
        return;
      }

      await db.runAsync(
        'INSERT INTO users (username, email, password, permission) VALUES (?, ?, ?, ?)',
        [userName, email, password, 1]
      );

      Alert.alert('Succès', 'Utilisateur enregistré avec succès!');
      setUserName('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      navigation.navigate('Connexion');
    } catch (error) {
      console.log('Erreur lors de l\'inscription:', error);
      Alert.alert('Erreur', 'Erreur lors de l\'enregistrement de l\'utilisateur');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.navContainer}>
        <Text style={styles.navItem}>CCM - S'inscrire</Text>
      </View>

      <Text style={styles.title}>
        Créez votre compte <FontAwesome name="user-plus" size={24} color="green" />
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
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
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

      <TextInput
        style={styles.input}
        placeholder="Confirmez le mot de passe"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        placeholderTextColor="#999"
      />

      <Pressable style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>
          S'inscrire <FontAwesome name="check" size={24} color="white" />
        </Text>
      </Pressable>

      <Pressable style={styles.link} onPress={() => navigation.navigate('Connexion')}>
        <Text style={styles.linkText}>Vous avez déjà un compte? Connectez-vous</Text>
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
