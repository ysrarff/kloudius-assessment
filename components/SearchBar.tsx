import { useEffect, useState } from "react";
import {
  View,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  StyleSheet,
  Dimensions,
  ScrollView,
  Text,
  TouchableOpacity,
} from "react-native";
import EvilIcons from "@expo/vector-icons/EvilIcons";
import axios from "axios";
import { useAppStore } from "@/store/useSearchStore";
import useDebounce from "@/hooks/useDebounce";
import { IPlace } from "@/store/types/SearchStoreType";
import AsyncStorage from "@react-native-async-storage/async-storage";

function SearchBar2() {
  const {
    searchResult,
    setSearchResult,
    setSelectedCoordinates,
    setSelectedPlace,
  } = useAppStore();
  const [searchText, setSearchText] = useState<string>("");

  useEffect(() => {
    !!searchText && setSearchResult(undefined);
  }, [searchText]);

  useDebounce(() => searchText && _handleSearch(), [searchText], 1600);

  const _handleSearch = async () => {
    let config = {
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": "AIzaSyDjZgyeOotCIdZ7A5YU1yjP6rKcrcUhSY8",
        "X-Goog-FieldMask":
          "places.displayName,places.formattedAddress,places.priceLevel,places.location,places.id",
      },
    };
    let body = {
      textQuery: searchText,
    };

    let req = await axios.post(
      "https://places.googleapis.com/v1/places:searchText",
      body,
      config
    );

    // console.log(req.data);
    req.status === 200 && setSearchResult(req.data);
  };

  const onSelectLocation = async (data: IPlace) => {
    setSelectedCoordinates({
      latitude: data.location.latitude,
      longitude: data.location.longitude,
    });
    setSelectedPlace({
      displayName: data.displayName,
      formattedAddress: data.formattedAddress,
    });

    try {
      const storedLocation = await AsyncStorage.getItem("storedLocation");
      if (storedLocation !== null) {
        const locationArray = JSON.parse(storedLocation);
        locationArray.push(data);
        const reversedLocationArray = locationArray.reverse();
        await AsyncStorage.setItem(
          "storedLocation",
          JSON.stringify(reversedLocationArray)
        );
      } else {
        const locationArray = [];
        locationArray.push(data);
        await AsyncStorage.setItem(
          "storedLocation",
          JSON.stringify(locationArray)
        );
      }

      // const parsedLocation = JSON.stringify(data);
      // await AsyncStorage.setItem(data.id, parsedLocation);
    } catch (e) {
      console.log("error saving location...", e);
    }
    setSearchResult(undefined);
  };

  const onChangeText = (searchText: string) => {
    setSearchText(searchText);
  };

  return (
    <View
      style={{
        backgroundColor: searchResult ? "#F3F3F3" : "none",
      }}
    >
      <View style={styles.searchSection}>
        <EvilIcons
          style={styles.searchIcon}
          name="location"
          size={32}
          color="#000"
        />
        <TextInput
          style={styles.input}
          placeholder={"Search for an address"}
          placeholderTextColor={"#666"}
          textAlign="left"
          onChangeText={onChangeText}
          value={searchText}
        />
      </View>
      {searchResult && (
        <ScrollView
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollViewContainer}
        >
          <Text style={styles.foundLocationText}>
            Found {searchResult?.places.length} results:
          </Text>
          {searchResult?.places.map((item, idx) => {
            return (
              <TouchableOpacity
                key={item?.id}
                onPress={() => onSelectLocation(item)}
              >
                <View
                  style={{
                    ...styles.resultContainer,
                    marginBottom:
                      idx === searchResult?.places.length - 1 ? 20 : 0,
                  }}
                >
                  <Text style={styles.placeName}>
                    {item?.displayName?.text}
                  </Text>
                  <Text style={styles.placeAddress}>
                    {item?.formattedAddress}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  searchSection: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderRadius: 12,
    borderColor: "rgba(0,0,0,0.1)",
    marginHorizontal: 16,
    marginTop: 10,
  },
  searchIcon: {
    padding: 10,
  },
  input: {
    flex: 1,
    paddingTop: 10,
    paddingRight: 10,
    paddingBottom: 10,
    paddingLeft: 0,
    backgroundColor: "#fff",
    color: "#424242",
    marginRight: 10,
    fontSize: 16,
    height: Dimensions.get("screen").height / 17,
  },
  scrollViewContainer: {
    height: "auto",
    marginHorizontal: 16,
  },
  foundLocationText: {
    fontWeight: "bold",
    marginTop: 24,
  },
  placeName: {
    fontSize: 14,
  },
  placeAddress: {
    marginTop: 4,
    fontSize: 10,
  },
  resultContainer: {
    flexDirection: "column",
    alignItems: "flex-start",
    backgroundColor: "#fafafa",
    borderColor: "rgba(0,0,0,0.1)",
    borderRadius: 12,
    borderWidth: 1,
    justifyContent: "space-between",
    marginTop: 8,
    padding: 16,
  },
});

export default SearchBar2;
