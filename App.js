import React, {useState, useEffect} from 'react'
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image, Dimensions, TouchableOpacity } from 'react-native';
import logo from './assets/ADS.png'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import * as LocalAuthentication from 'expo-local-authentication'

export default function App() {  
  const [suporteBiometria, setSuporteBiometria] = useState(false)
  //Verificando se o aparelho tem suporte a biometria
  useEffect(() => {
    (async() => {
      const temSuporte = await LocalAuthentication.hasHardwareAsync()
      setSuporteBiometria(temSuporte)
    })()
  })
  
  return (
    <View style={styles.container}>
      <StatusBar style="light" backgroundColor='#931610'/>
      <Image
         source={logo}
         resizeMode={'contain'} //cover or contain
         style={{
               width: Dimensions.get('window').width * 0.5,
               height: Dimensions.get('window').height * 0.5,
         }} />
      <Text style={styles.titulo}>Fatec Cripto </Text>
      <TouchableOpacity style={styles.finger}>
        <MaterialCommunityIcons 
            name={suporteBiometria ? 'fingerprint' : 'fingerprint-off'} 
            size={72} 
            color="#931610" />
      </TouchableOpacity>
{suporteBiometria
    ? <Text style={styles.legenda}>Desbloqueie o seu dispositivo</Text>
    : <>
        <Text style={styles.legenda}>Dispositivo não tem suporte para a
         biometria</Text>
       <MaterialCommunityIcons.Button
         name='login' size={32}
         color='#931610' backgroundColor='#FFFFFF'
          > Login </MaterialCommunityIcons.Button>
     </>    
}   
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    backgroundColor: '#BBBBBB',
    alignItems: 'center',
    justifyContent: 'center'
  },
  titulo: {
    fontSize: 24,
    fontWeight: '400',
    color: '#931610'
  },
  finger: {
    marginTop: 16,
    padding: 32,
    borderRadius: 16,
    backgroundColor: '#EEEEEE',
    shadowColor: '#931610',
    // adicionar sombras - somente iOS
    shadowOffset: { width: 5, height: 5},
    shadowOpacity: 0.70,
    // adicionar sombras - somente Android
    elevation: 8
  },
  legenda: {
    marginTop: 8,
    fontSize: 11,
    fontWeight: '300',
    color: '#3E535C'
  }
})