import { useEffect, useState } from "react";
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import EvilIcons from "@expo/vector-icons/EvilIcons";
import { router } from "expo-router";

import { useAppStore } from "@/store/useSearchStore";
import { IPlace } from "@/store/types/SearchStoreType";
import { theme } from "@/constants/Colors";

function History() {
  const { setSearchResult, setSelectedCoordinates, setSelectedPlace } =
    useAppStore();

  const [historyList, setHistoryList] = useState<IPlace[]>([]);

  useEffect(() => {
    _loadHistoryList();
  }, []);

  const _loadHistoryList = async () => {
    try {
      const value = await AsyncStorage.getItem("storedLocation");
      if (value !== null) {
        const parsedLocation = JSON.parse(value);
        setHistoryList(parsedLocation);
      }
    } catch (e) {
      console.log("error fetching location...", e);
    }
  };

  const _onSelectPastLocation = (data: IPlace) => {
    setSelectedCoordinates({
      latitude: data.location.latitude,
      longitude: data.location.longitude,
    });
    setSelectedPlace({
      displayName: data.displayName,
      formattedAddress: data.formattedAddress,
    });

    setSearchResult(undefined);
    router.back();
  };

  const _onPressRemovePlace = async (idx: number) => {
    try {
      const value = await AsyncStorage.getItem("storedLocation");
      if (value !== null) {
        const parsedLocation = JSON.parse(value);
        if (idx > -1) {
          parsedLocation.splice(idx, 1);
          setHistoryList(parsedLocation);
          await AsyncStorage.setItem(
            "storedLocation",
            JSON.stringify(parsedLocation)
          );
        }
      }
    } catch (e) {
      console.log("error fetching location...", e);
    }
  };

  const _onPressRemoveAllPlaces = async () => {
    setHistoryList([]);
    await AsyncStorage.removeItem("storedLocation");
  };

  const _renderHistoryList = ({ item, idx }: { item: IPlace; idx: number }) => (
    <TouchableOpacity onPress={() => _onSelectPastLocation(item)}>
      <View
        style={{
          ...styles.resultContainer,
          marginBottom: idx === historyList.length - 1 ? 80 : 0,
        }}
      >
        <View style={styles.placeContainer} key={item.id}>
          <Text style={styles.placeName}>{item.displayName.text}</Text>
          <Text style={styles.placeAddress}>{item.formattedAddress}</Text>
        </View>
        <View style={styles.removeIconContainer}>
          <TouchableOpacity onPress={() => _onPressRemovePlace(idx)}>
            <EvilIcons
              style={styles.removeIcon}
              name="trash"
              size={32}
              color={theme.colors.black}
            />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  const _renderHistoryHeader = () => (
    <TouchableOpacity onPress={_onPressRemoveAllPlaces}>
      <Text style={styles.clearAllText}>Clear All</Text>
    </TouchableOpacity>
  );

  const _renderEmptyHistory = () => (
    <View style={styles.emptyHistoryContainer}>
      <Text style={styles.emptyHistoryText}>
        Oops... You haven't searched any location yet
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        keyExtractor={(item) => item.id}
        data={historyList}
        renderItem={({ item, index: idx }) => _renderHistoryList({ item, idx })}
        ListHeaderComponent={_renderHistoryHeader}
        ListEmptyComponent={_renderEmptyHistory}
        style={styles.flatListContainer}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.bgGrey,
  },
  flatListContainer: {
    paddingHorizontal: 16,
  },
  clearAllText: {
    fontWeight: "bold",
    marginTop: 24,
    marginBottom: 12,
    textAlign: "right",
  },
  resultContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "stretch",
    justifyContent: "space-evenly",
    backgroundColor: theme.colors.offWhite,
    borderColor: theme.colors.transparent,
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 8,
  },
  placeContainer: {
    flex: 1,
    flexDirection: "column",
    maxWidth: "80%",
    padding: 16,
  },
  placeName: {
    fontSize: 14,
  },
  placeAddress: {
    marginTop: 4,
    fontSize: 10,
  },
  removeIconContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  removeIcon: {
    padding: 10,
  },
  emptyHistoryContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 30,
  },
  emptyHistoryText: {
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default History;
