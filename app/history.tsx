import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { IPlace } from "@/store/types/SearchStoreType";
import EvilIcons from "@expo/vector-icons/EvilIcons";

function History() {
  const [historyList, setHistoryList] = useState<IPlace[]>([]);
  useEffect(() => {
    _renderHistoryList();
  }, []);

  const _renderHistoryList = async () => {
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

  const onPressRemovePlace = async (idx: number) => {
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

  const onPressRemoveAllPlaces = async () => {
    setHistoryList([]);
    await AsyncStorage.removeItem("storedLocation");
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        <TouchableOpacity onPress={onPressRemoveAllPlaces}>
          <Text style={styles.clearAllText}>Clear All</Text>
        </TouchableOpacity>
        {historyList ? (
          historyList.map((item, idx) => (
            <View style={styles.resultContainer}>
              <View style={styles.placeContainer} key={item.id}>
                <Text style={styles.placeName}>{item.displayName.text}</Text>
                <Text style={styles.placeAddress}>{item.formattedAddress}</Text>
              </View>
              <View style={styles.removeIconContainer}>
                <TouchableOpacity onPress={() => onPressRemovePlace(idx)}>
                  <EvilIcons
                    style={styles.removeIcon}
                    name="trash"
                    size={32}
                    color="#000"
                  />
                </TouchableOpacity>
              </View>
            </View>
          ))
        ) : (
          <Text>Oops... You haven't searched any location yet</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F3F3",
  },
  scrollViewContainer: {
    marginHorizontal: 16,
    paddingBottom: 20,
  },
  clearAllText: {
    fontWeight: "bold",
    marginTop: 24,
    marginBottom: 12,
    textAlign: "right"
  },
  resultContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "stretch",
    justifyContent: "space-evenly",
    backgroundColor: "#fafafa",
    borderColor: "rgba(0,0,0,0.1)",
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
});

export default History;
