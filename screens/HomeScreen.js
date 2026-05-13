// import {View, Text, StyleSheet} from 'react-native';
import { StyleSheet, Text, View, TextInput, Pressable, Alert } from 'react-native';
import React, { useState, useEffect, useContext  } from 'react';
import Map from '../src/Map';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
// import { selectHome } from '../database/selectHome';


 
export default function HomeScreen({navigation, route})
{
    const { user, userId, permiSsion } = route.params;
    // const selectById = selectHome();

  // console.log(selectById(userId));

    return (
      <View style={styles.container}>
          <Text style={styles.title}>Congrégation Chrétienne au Mozambique</Text>
          <Text style={styles.userText}>Bienvenue, frère/sœur {user}!</Text>
          {permiSsion == 1 && (
            <Pressable style={styles.button2} onPress={() => navigation.navigate('Vue', { userId: userId, user: user, permiSsion:permiSsion })}>
              <Text style={styles.buttonText}>Voir tous les données!</Text>
            </Pressable>
          )}
          <Pressable style={styles.button1} onPress={() => navigation.navigate('Formulaire', { userId: userId, user: user, permiSsion: permiSsion })}>
              <Text style={styles.buttonText}>Formulaire d'enregistrement +</Text>
          </Pressable>
          <Pressable style={styles.button} onPress={() => navigation.navigate('Connexion')}>
              <Text style={styles.buttonText}>Se déconnecter</Text>
          </Pressable>
      </View>
  )
  // }
}





// const HomeScreen = ({navigation, route}) => {

    //we'll extract the user parameter from route.params
    const styles = StyleSheet.create({
        container: {
          flex: 1,
          backgroundColor: '#cad478',
          alignItems: 'center',
          justifyContent: 'center',
          // marginTop:100,
        },
        title: {
          fontSize: 24,
          fontWeight: 'bold',
          marginBottom: 30,
          color: 'green'
        },
        input: {
          width: '80%',
          padding: 10,
          borderWidth: 1,
          borderColor: '#ccc',
          marginVertical: 5,
        },
        button: {
          backgroundColor: 'red',
          padding: 10,
          marginVertical: 10,
          width: '40%',
          borderRadius: 15,
        },
        button1: {
          backgroundColor: 'green',
          padding: 10,
          marginVertical: 10,
          width: '60%',
          borderRadius: 15,
        },
        button2: {
          backgroundColor: 'darkcyan',
          padding: 10,
          marginVertical: 10,
          width: '60%',
          borderRadius: 15,
        },
        button3: {
          backgroundColor: 'orange',
          padding: 10,
          marginVertical: 10,
          width: '60%',
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
          color: 'green',
        }
      });
      