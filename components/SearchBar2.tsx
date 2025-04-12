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
import Ionicons from "@expo/vector-icons/Ionicons";
import EvilIcons from "@expo/vector-icons/EvilIcons";
import axios from "axios";
import { useAppStore } from "@/store/useSearchStore";
import useDebounce from "@/hooks/useDebounce";

type Location = {
  latitude: number;
  longitude: number;
};

type Place = {
  id: string;
  formattedAddress: string;
  location: Location;
  displayName: {
    text: string;
    languageCode: string;
  };
};

type SearchResult = {
  places: Place[];
};

function SearchBar2() {
  const { searchedCoordinates, setSearchedCoordinates } = useAppStore();
  const [searchText, setSearchText] = useState<string>("");
  const [searchResult, setSearchResult] = useState<SearchResult | undefined>();
  const [isFocused, setIsFocused] = useState<boolean>(false);

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

  const onSelectLocation = (data: Location) => {
    setSearchedCoordinates({
      latitude: data.latitude,
      longitude: data.longitude,
    });
    setSearchResult(undefined);
  };

  const onChangeText = (searchText: string) => {
    setSearchText(searchText);
  };

  return (
    <>
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
          {searchResult?.places.map((item, idx) => {
            return (
              <TouchableOpacity
                key={item?.id}
                onPress={() =>
                  onSelectLocation({
                    latitude: item.location.latitude,
                    longitude: item.location.longitude,
                  })
                }
              >
                <View
                  style={{
                    ...styles.resultContainer,
                    marginTop: idx == 0 ? 24 : 8,
                  }}
                >
                  <Text>{item?.displayName?.text}</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      )}
    </>
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
    // fontFamily: "",
    height: Dimensions.get("screen").height / 17,
  },
  scrollViewContainer: {
    flex: 1,
    // width: "100%",
  },
  resultContainer: {
    alignItems: "center",
    backgroundColor: "#fafafa",
    borderColor: "rgba(0,0,0,0.1)",
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 16,
    padding: 16,
  },
});

export default SearchBar2;
