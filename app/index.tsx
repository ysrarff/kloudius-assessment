import SearchBar from "@/components/SearchBar";
import { useEffect, useState } from "react";
import {
  View,
  KeyboardAvoidingView,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import * as Location from "expo-location";
import { useAppStore } from "@/store/useSearchStore";
import { router } from "expo-router";

function Index() {
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const {
    searchResult,
    selectedCoordinates,
    selectedPlace,
    setSelectedCoordinates,
  } = useAppStore();

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
    // console.log(location.coords);

    setSelectedCoordinates({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    });
  };

  const onPressHistory = () => {
    router.navigate("/history");
  };

  // Commenting out provider since react-native-maps (iOS)
  // has issues with Expo SDK 52, will default to Apple Maps
  return (
    <KeyboardAvoidingView style={styles.container}>
      {selectedCoordinates && (
        <MapView
          // provider={PROVIDER_GOOGLE}
          style={styles.map}
          region={{
            latitude: selectedCoordinates.latitude,
            longitude: selectedCoordinates.longitude,
            latitudeDelta: 0.015,
            longitudeDelta: 0.0121,
          }}
        >
          <Marker
            title={selectedPlace?.displayName.text}
            coordinate={{
              latitude: selectedCoordinates.latitude,
              longitude: selectedCoordinates.longitude,
            }}
          />
        </MapView>
      )}
      <SafeAreaView
        style={{
          ...styles.searchBarContainer,
          height:
            searchResult && searchResult?.places.length > 0 ? "100%" : "auto",
        }}
      >
        <SearchBar />
      </SafeAreaView>

      <View style={styles.fabContainer}>
        <TouchableOpacity onPress={onPressHistory}>
          <View style={styles.fabButton}>
            <MaterialIcons name="menu-book" size={32} color="#fff" />
          </View>
        </TouchableOpacity>
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
  searchBarContainer: {
    position: "absolute",
    overflow: "hidden",
    width: "100%",
  },
  fabContainer: {
    position: "absolute",
    bottom: 26,
    right: 26,
  },
  fabButton: {
    backgroundColor: "#22333b",
    padding: 14,
    borderRadius: 50,
  },
});

export default Index;
