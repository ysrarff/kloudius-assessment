import { useEffect, useState } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  Dimensions,
  ScrollView,
  Text,
  TouchableOpacity,
  FlatList,
} from "react-native";
import EvilIcons from "@expo/vector-icons/EvilIcons";
import axios from "axios";
import { useAppStore } from "@/store/useSearchStore";
import useDebounce from "@/hooks/useDebounce";
import { IPlace } from "@/store/types/SearchStoreType";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { theme } from "@/constants/Colors";

function SearchBar() {
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
        "X-Goog-Api-Key": process.env.EXPO_PUBLIC_WEB_PLACES_API_KEY,
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

        // Logic to prevent duplicate history
        const tempSet = new Set();
        const uniqueLocationArray = locationArray.filter(
          (item: IPlace) => !tempSet.has(item.id) && tempSet.add(item.id)
        );

        const reversedLocationArray = uniqueLocationArray.reverse();
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
    } catch (e) {
      console.log("error saving location...", e);
    }
    setSearchResult(undefined);
  };

  const onChangeText = (searchText: string) => {
    setSearchText(searchText);
  };

  const _renderResultFlatlist = ({
    item,
    idx,
  }: {
    item: IPlace;
    idx: number;
  }) => (
    <TouchableOpacity onPress={() => onSelectLocation(item)}>
      <View
        style={{
          ...styles.resultContainer,
          marginBottom:
            searchResult && idx === searchResult?.places.length - 1 ? 80 : 0,
        }}
      >
        <Text style={styles.placeName}>{item?.displayName?.text}</Text>
        <Text style={styles.placeAddress}>{item?.formattedAddress}</Text>
      </View>
    </TouchableOpacity>
  );

  const _renderResultHeader = () =>
    searchResult && (
      <Text style={styles.foundLocationText}>
        {searchResult?.places && searchResult?.places.length !== 1
          ? `Found ${searchResult?.places.length} results:`
          : searchResult?.places && searchResult?.places.length === 1
          ? `Found 1 result:`
          : "Found 0 result:"}
      </Text>
    );

  const _renderEmptyResult = () => (
    <View style={styles.emptyResultContainer}>
      <Text style={styles.emptyResultText}>Try another search</Text>
    </View>
  );

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
          color={theme.colors.black}
        />
        <TextInput
          style={styles.input}
          placeholder={"Search for an address"}
          placeholderTextColor={theme.colors.lightGrey}
          textAlign="left"
          onChangeText={onChangeText}
          value={searchText}
        />
      </View>
      {searchResult && (
        <FlatList
          keyExtractor={(item) => item.id}
          data={searchResult?.places}
          renderItem={({ item, index: idx }) =>
            _renderResultFlatlist({ item, idx })
          }
          ListHeaderComponent={_renderResultHeader}
          ListEmptyComponent={_renderEmptyResult}
          style={styles.flatListContainer}
        />
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
    borderColor: theme.colors.transparent,
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
  flatListContainer: {
    height: "100%",
    paddingHorizontal: 16,
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
    borderColor: theme.colors.transparent,
    borderRadius: 12,
    borderWidth: 1,
    justifyContent: "space-between",
    marginTop: 8,
    padding: 16,
  },
  emptyResultContainer: {
    justifyContent: "flex-start",
    alignItems: "flex-start",
    paddingVertical: 30,
  },
  emptyResultText: {
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default SearchBar;
