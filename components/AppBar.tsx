import { Image, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AntDesign from "react-native-vector-icons/AntDesign"

const AppBar = ({ navigation }: { navigation?: any }) => {


  const signOut = async () => {
    try {
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();
      AsyncStorage.removeItem("user", () => {
        navigation.replace("Auth")
      })// Remember to remove the user from your app's state as well
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.appBar}>
      <View style={styles.logoContainer}>
        <Image source={{ uri: "https://imgs.search.brave.com/ZKiRY-P-Qk9TbLX6NGDWdtd-ciSULAlQSBwWwyDrw40/rs:fit:860:0:0/g:ce/aHR0cHM6Ly9jbGlw/YXJ0LWxpYnJhcnku/Y29tL25ld19nYWxs/ZXJ5LzIxMC0yMTAz/NTcwX3RyYW5zcGFy/ZW50LWhlYWx0aGNh/cmUtY2FkdWNldXMt/bWVkaWNpbmUucG5n" }} style={styles.logo} />
        <Text style={styles.text}>NearbyHospitals</Text>
      </View>
      <AntDesign onPress={signOut} name='logout' size={24} color={"black"} />
    </View>
  )
}

export default AppBar

const styles = StyleSheet.create({
  appBar: {
    width: "100%",
    height: "9%",
    backgroundColor: "white",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: "5%"
  },
  logoContainer: {
    width: "auto",
    height: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start"
  },
  logo: {
    height: 55,
    width: 35,
    resizeMode: "contain"
  },
  text: {
    color: "black",
    fontSize: 20,
    fontWeight: "400",
    marginLeft: 10,
    elevation: 10
  }
})