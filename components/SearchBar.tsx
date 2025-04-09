import { useEffect, useState } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import EvilIcons from "@expo/vector-icons/EvilIcons";
import axios from "axios";

import {
  View,
  TextInput,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  Text,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import useDebounce from "@/hooks/useDebounce";

type SearchResult = {
  places: {
    id: string;
    formattedAddress: string;
    location: {
      latitude: number;
      longitude: number;
    };
    displayName: {
      text: string;
      languageCode: string;
    };
  }[];
};

function SearchBar() {
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

    console.log(req.data);
    req.status === 200 && setSearchResult(req.data);
  };

  const onChangeText = async (searchText: string) => {
    setSearchText(searchText);
  };

  const onInputStyleChanged = (isFocused: boolean) => {
    setIsFocused(isFocused);
  };

  const onClearTextInput = () => {
    setSearchText("");
    setSearchResult(undefined);
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <>
        <View style={styles.searchSection}>
          {isFocused || searchText ? (
            <TouchableOpacity onPress={onClearTextInput}>
              <Ionicons
                style={styles.searchIcon}
                name="chevron-back"
                size={32}
                color="#000"
              />
            </TouchableOpacity>
          ) : (
            <EvilIcons
              style={styles.searchIcon}
              name="location"
              size={32}
              color="#000"
            />
          )}
          <TextInput
            placeholder="Search for an address"
            placeholderTextColor={"#666"}
            textAlign="left"
            style={styles.input}
            onChangeText={onChangeText}
            onFocus={() => onInputStyleChanged(true)}
            onBlur={() => onInputStyleChanged(false)}
            value={searchText}
          />
        </View>
        {searchResult && (
          <ScrollView
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.scrollViewContainer}
          >
            {searchResult?.places.map((item) => {
              return (
                <View key={item?.id} style={styles.resultContainer}>
                  <Text>{item?.displayName?.text}</Text>
                </View>
              );
            })}
          </ScrollView>
        )}
      </>
    </TouchableWithoutFeedback>
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
    width: "100%",
  },
  resultContainer: {
    alignItems: "center",
    backgroundColor: "#fafafa",
    borderColor: "rgba(0,0,0,0.1)",
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
    padding: 16,
  },
});

export default SearchBar;
