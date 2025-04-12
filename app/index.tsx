import SearchBar from "@/components/SearchBar";
import SearchBar2 from "@/components/SearchBar2";
import { useEffect, useState } from "react";
import {
  Text,
  View,
  KeyboardAvoidingView,
  StyleSheet,
  Dimensions,
  Platform,
} from "react-native";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
import * as Location from "expo-location";
import { useAppStore } from "@/store/useSearchStore";

function Index() {
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const { searchedCoordinates, setSearchedCoordinates } = useAppStore();

  useEffect(() => {
    getDefaultLocation();
  }, []);

  const getDefaultLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== "granted") {
      console.log("error...");
      setErrorMsg("Permission to access location was denied");
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    // console.log(JSON.stringify(location));
    // console.log(location.coords);
    
    setSearchedCoordinates({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    });
  };

  return (
    <KeyboardAvoidingView style={styles.container}>
      {/* <View style={styles.subContainer}>
         <SearchBar />
       </View>
       <View style={styles.mapContainer}>
         <MapView provider={PROVIDER_GOOGLE} style={styles.map} />
       </View> */}
      {searchedCoordinates && (
        <MapView
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          region={{
            latitude: searchedCoordinates.latitude,
            longitude: searchedCoordinates.longitude,
            latitudeDelta: 0.015,
            longitudeDelta: 0.0121,
          }}
        />
      )}
      <View style={{ position: "absolute", top: 10, width: "100%" }}>
        <SearchBar2 />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F3F3",
  },
  subContainer: {
    marginTop: 30,
    paddingHorizontal: 16,
  },
  mapContainer: {
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  map: {
    // height: Dimensions.get("screen").height / 1.5,
    height: "100%",
    width: "100%",
  },
});

export default Index;
