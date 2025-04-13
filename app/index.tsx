import { useEffect, useState } from "react";
import {
  View,
  KeyboardAvoidingView,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import * as Location from "expo-location";
import { router } from "expo-router";

import { useAppStore } from "@/store/useSearchStore";
import { theme } from "@/constants/Colors";
import SearchBar from "@/components/SearchBar";
import FloatingActionButton from "@/components/FloatingActionButton";

function Index() {
  const {
    searchResult,
    selectedCoordinates,
    selectedPlace,
    setSelectedCoordinates,
  } = useAppStore();

  useEffect(() => {
    _getDefaultLocation();
  }, []);

  const _getDefaultLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== "granted") {
      console.log("error...");
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    // console.log(location.coords);

    setSelectedCoordinates({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    });
  };

  const _onPressHistory = () => {
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
        <FloatingActionButton _onPress={_onPressHistory} />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.bgGrey,
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
});

export default Index;
