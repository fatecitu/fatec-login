import React, {useState, useEffect} from 'react'
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image, Dimensions, 
         TouchableOpacity, Alert, Platform } from 'react-native';
import logo from '../assets/ADS.png'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import * as LocalAuthentication from 'expo-local-authentication'

export default function Login() {  
  const [suporteBiometria, setSuporteBiometria] = useState(false)
  //Verificando se o aparelho tem suporte a biometria
  useEffect(() => {
    (async() => {
      const temSuporte = await LocalAuthentication.hasHardwareAsync()
      setSuporteBiometria(temSuporte)
    })()
  })
  /**
   * Cria um alerta que funciona tanto para mobile quanto 
   * para web
   * @param {string} titulo Titulo da Mensagem
   * @param {string} mensagem Conteúdo que será exibido
   * @param {string} btnTxt Texto que será exibido (mobile)
   * @param {string} btnFunc Função que será direcionado
   * @return {Alert} Retorna o alerta correto 
   */
   const alerta = (titulo, mensagem, btnTxt, btnFunc) => {
    if(Platform.OS === 'web'){
      return alert(`${titulo} \n ${mensagem}`)
    } else {
      return Alert.alert(titulo, mensagem, [
        {
          text: btnTxt,
          onPress: btnFunc
        }
      ])
    }
   }
   /*
   * Efetua o login biométrico efetuando as validações
   */
  const loginBiometrico = async() => {
    //O hardware suporta biometria?
    const biometriaDisponivel = await
    LocalAuthentication.hasHardwareAsync()
    //Se a biometria não estiver disponível
    if (!biometriaDisponivel)
    return alerta("Erro",
    "❌Autenticação Biométrica não disponível",
    "OK", ()=> fallBackToDefaultLogin())
    //Verificamos os tipos de biometria disponíveis
    //1-finger 2-face 3-íris
    let biometriasSuportadas
    if (biometriaDisponivel)
      biometriasSuportadas = await LocalAuthentication.
      supportedAuthenticationTypesAsync()
   //Verifica se os dados biométricos estão salvos  
   const biometriaSalva = await LocalAuthentication.
    isEnrolledAsync()
    if(!biometriaSalva)
    return alerta('Biometria não encontrada',
    'Por favor, efetue o login da forma tradicional',
    'OK',
    ()=> fallBackToDefaultLogin()
    )
  //Autentica o usuário com a biometria 
  const autenticaBiometria = await LocalAuthentication.
  authenticateAsync({
    promptMessage: 'Efetue o login com a Biometria',
    cancelLabel: 'Cancelar',
    disableDeviceFallback: false //Desabilita o teclado PIN
  })
  //Em caso de sucesso, faremos o login
  if(autenticaBiometria.success){
    return alerta("🖐Tudo certo",
    "Você será direcionado para a área reservada","OK")
  }
}
  const fallBackToDefaultLogin = () => {
    console.log('Não foi possível fazer o login bio')
    console.log('Implemente o login tradicional')
  }
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
         onPress={() => alerta('Acesso',
        'Aguarde, enquanto lhe direcionamos para o login')}
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