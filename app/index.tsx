import SearchBar from "@/components/SearchBar";
import { Text, View, KeyboardAvoidingView, StyleSheet } from "react-native";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";

function Index() {
  return (
    <KeyboardAvoidingView style={styles.container}>
      <View style={styles.subContainer}>
        <SearchBar />
        <MapView provider={PROVIDER_GOOGLE} style={styles.map} />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F3F3",
    paddingHorizontal: 16,
    paddingVertical: 48,
  },
  subContainer: {
    // flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 30,
  },
  map: {
    width: "100%",
    height: "100%",
  },
});

export default Index;
