import { StyleSheet, TouchableOpacity, View } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

import { theme } from "@/constants/Colors";

function FloatingActionButton({ _onPress }: { _onPress: () => void }) {
  return (
    <TouchableOpacity onPress={_onPress}>
      <View style={styles.fabButton}>
        <MaterialIcons name="menu-book" size={32} color="#fff" />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  fabButton: {
    backgroundColor: theme.colors.emeraldGreen,
    padding: 14,
    borderRadius: 50,
  },
});

export default FloatingActionButton;
