import { Image, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import AsyncStorage from '@react-native-async-storage/async-storage';


GoogleSignin.configure({
  webClientId: "563706821839-utnml40n9658ofhkob5qr4ofkl7riq0e.apps.googleusercontent.com",
});

const AuthScreen = ({ navigation }: any) => {

  const [user, setUser] = useState<any>({})

  const signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      if (userInfo) {
        await AsyncStorage.setItem("user", JSON.stringify(userInfo))
        setUser(userInfo)
        navigation.replace("Home")
      }
    } catch (error: any) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log("Sign in cancelled")
      } else if (error.code === statusCodes.IN_PROGRESS) {
        console.log("Sign in progress")
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        console.log("play services outdated")
      } else {
        console.log(error.message)
      }
    }
  };

  const isSignedIn = async () => {
    const isSignedIn = await GoogleSignin.isSignedIn()
    const userData = await AsyncStorage.getItem("user")!
    if (isSignedIn && userData) {
      setUser(JSON.parse(userData!))
    }
    else {
      console.log("Please login")
    }
  }



  useEffect(() => {
    isSignedIn()
  }, [])
  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image source={{ uri: "https://imgs.search.brave.com/ZKiRY-P-Qk9TbLX6NGDWdtd-ciSULAlQSBwWwyDrw40/rs:fit:860:0:0/g:ce/aHR0cHM6Ly9jbGlw/YXJ0LWxpYnJhcnku/Y29tL25ld19nYWxs/ZXJ5LzIxMC0yMTAz/NTcwX3RyYW5zcGFy/ZW50LWhlYWx0aGNh/cmUtY2FkdWNldXMt/bWVkaWNpbmUucG5n" }} style={styles.logo} />
        <Text style={styles.text}>NearbyHospitals</Text>
      </View>
      <GoogleSigninButton
        style={styles.signin}
        size={GoogleSigninButton.Size.Wide}
        color={GoogleSigninButton.Color.Dark}
        onPress={signIn}
      />
    </View>
  )
}

export default AuthScreen

const styles = StyleSheet.create({
  container: {
    height: "100%",
    width: "100%",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: "30%",
    backgroundColor: "white"
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "80%",
    height: "20%",
  },
  logo: {
    height: 80,
    width: 50,
    resizeMode: "contain"
  },
  text: {
    color: "black",
    fontSize: 26,
    fontWeight: "800",
    marginLeft: 10,
    fontStyle: "italic"
  },
  signin: {
    width: 200,
    height: 50,
    position:"absolute",
    bottom:"20%"
  }
})