
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import { StyleSheet, Text, View, PermissionsAndroid, Pressable, ImageBackground, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import Geolocation from 'react-native-geolocation-service';
import FW6 from 'react-native-vector-icons/FontAwesome6'
import MaterialIcon from "react-native-vector-icons/MaterialCommunityIcons"
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppBar from '../components/AppBar';


const HomeScreen = ({ navigation }: any) => {
  const [location, setLocation] = useState<any>(null);
  const [hasAccess, setHasAccess] = useState<boolean>(false);
  const [hospitals, setHospitals] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false)
  const [user, setUser] = useState<any>({})


  const requestLocationPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
      if (granted === 'granted') {
        setHasAccess(true)
        return true;
      } else {
        setHasAccess(false)
        return false;
      }
    } catch (err) {
      return false;
    }
  };

  const getUser = async() => {
    const userData = await AsyncStorage.getItem("user")!
    if(userData){
      setUser(JSON.parse(userData!))
    }
  }


  const getLocation = () => {
    setLoading(true)
    const result = requestLocationPermission();
    result.then(res => {
      if (res) {

        Geolocation.getCurrentPosition(
          (position) => {
            fetchHospitals(position.coords.longitude, position.coords.latitude)
            setLocation(position)
          },
          (error) => {
            setLocation(null)
            console.log(error.code, error.message);
          },
          { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
        );
      }
    });
  };


  const fetchHospitals = async (longitude: any, latitude: any) => {
    const url = `https://api.geoapify.com/v2/places?categories=healthcare.hospital&bias=proximity:${longitude},${latitude}&limit=10&apiKey=d80112d504774c2bbb2b3c524b539659`
    try {
      const hospitalsData = await AsyncStorage.getItem('hospitals')!;
      if (!hospitalsData) {
        const res = await fetch(url)
        const data = await res.json()
        setHospitals(data.features)
        await AsyncStorage.setItem('hospitals', JSON.stringify(data.features));
        setLoading(false)
      }
      else {
        setHospitals(JSON.parse(hospitalsData!))
        setLoading(false)
      }
    } catch (error) {
      console.log(error)
      setLoading(false)
    }
  }


  useEffect(() => {
    getUser()
  }, [])

  const backgroundImgUrl = "https://imgs.search.brave.com/pT0wdDQZMlI2BJL-66qdMrK9pI7w3faNFu6dUWZl070/rs:fit:860:0:0/g:ce/aHR0cHM6Ly93YWxs/cGFwZXJhY2Nlc3Mu/Y29tL2Z1bGwvMTI4/Mjg1NC5qcGc"

  if (!hasAccess) {
    return (
      <View style={styles.container}>
        <AppBar navigation={navigation} />
        <ImageBackground source={{ uri: backgroundImgUrl }} style={styles.imageBackground}>
          <Text style={styles.desc} >Hi <Text style={{color:"#d834eb"}}>{user?.user?.givenName??""}</Text>, We need your location to find the nearby hospitals and we ensure you're never far from medical assistance</Text>
          <Pressable onPress={() => {
            if (!loading) getLocation()
          }} style={styles.btn}>
            {
              loading ? <ActivityIndicator size={"small"} color={"white"} /> : <Text style={{ color: "white" }}>Find Nearby Hospitals</Text>
            }
          </Pressable>
        </ImageBackground>
      </View>
    )
  }
  else if (location) {
    return (
      <View style={styles.container}>
        <AppBar navigation={navigation} />
        {
          loading ? (
            <View style={[styles.container, { justifyContent: "center" }]}>
              <ActivityIndicator color={"black"} size={45} />
            </View>
          ) : (
            <MapView
              mapType='standard'
              provider={PROVIDER_GOOGLE} // remove if not using Google Maps
              style={styles.map}
              region={{
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: 0.07,
                longitudeDelta: 0.1,
              }}
            >
              <Marker style={styles.marker} title='Your Location' coordinate={{ latitude: location.coords.latitude, longitude: location.coords.longitude }}>
                <Text style={[styles.locationTitle, { color: "blue" }]}>current Location</Text>
                <FW6 name='location-crosshairs' size={26} color={"blue"} />
              </Marker>
              {
                hospitals.map((hospital, i) => {
                  return (
                    <Marker style={styles.marker} key={i} title='hospitals' coordinate={{ latitude: hospital.properties.lat, longitude: hospital.properties.lon }}>
                      <Text style={[styles.locationTitle, { color: "red" }]}>{hospital.properties.name}</Text>
                      <MaterialIcon name='hospital-marker' size={40} color={"red"} />
                    </Marker>
                  )
                })
              }
            </MapView>
          )
        }
      </View>
    )
  }
  else {
    return (
      <View style={styles.container}>
        <AppBar navigation={navigation} />
        <Text style={{ color: "black" }}></Text>
      </View>
    )
  }
}

export default HomeScreen

const styles = StyleSheet.create({
  container: {
    height: "100%",
    width: "100%",
    flexDirection: "column",
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: "white"
  },
  map: {
    height: "91%",
    width: "100%"
  },
  marker: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    position: "relative"
  },
  locationTitle: {
    fontSize: 12,
    marginBottom: 2,
    fontWeight: "600"
  },
  imageBackground: {
    height: "100%",
    width: "100%",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center"
  },
  btn: {
    backgroundColor: "black",
    width: 180,
    height: 50,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center"
  },
  desc: {
    color: "white",
    fontSize: 24,
    marginBottom: 20,
    textShadowColor: "#000",
    textShadowOffset: {
      width: 0,
      height: 2,
    },
    textShadowRadius: 3.84,
    elevation: 5,
    maxWidth: "90%",
    textAlign: "center",
    marginTop: -100
  }
});