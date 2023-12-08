import { ActivityIndicator, Image, StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import AsyncStorage from '@react-native-async-storage/async-storage';
const SplashScreen = ({navigation}:any) => {

    const isSignedIn = async () => {
        const isSignedIn = await GoogleSignin.isSignedIn()
        const userData = await AsyncStorage.getItem("user")!
        if (isSignedIn && userData) {
           navigation.replace("Home")
        }
        else {
            navigation.replace("Auth")
        }
    }

    useEffect(() => {
      setTimeout(() => {
        isSignedIn()
      }, 3000);
    }, [])

    return (
        <View style={styles.container}>
            <View style={styles.logoContainer}>
                <Image source={{ uri: "https://imgs.search.brave.com/ZKiRY-P-Qk9TbLX6NGDWdtd-ciSULAlQSBwWwyDrw40/rs:fit:860:0:0/g:ce/aHR0cHM6Ly9jbGlw/YXJ0LWxpYnJhcnku/Y29tL25ld19nYWxs/ZXJ5LzIxMC0yMTAz/NTcwX3RyYW5zcGFy/ZW50LWhlYWx0aGNh/cmUtY2FkdWNldXMt/bWVkaWNpbmUucG5n" }} style={styles.logo} />
                <Text style={styles.text}>NearbyHospitals</Text>
            </View>
            <ActivityIndicator color={"black"} size={40} />
        </View>
    )
}

export default SplashScreen

const styles = StyleSheet.create({
    container: {
        width: "100%",
        height: "100%",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "white"
    },
    logoContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        width: "80%",
        height: "10%",

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
    }
})