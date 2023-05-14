import React, { useContext } from "react";
import {
  Text,
  View,
  StyleSheet,
  FlatList,
  Pressable,
  Image,
} from "react-native";
import { ThemeContext } from "../Theme/ThemeManager";
import { imageSource } from "./ImagesSources";

const StoreLogoList = (props) => {
  const { theme } = useContext(ThemeContext);

  return (
    <View
      style={[
        styles.containerStores,
        theme == "light"
          ? { backgroundColor: "white", borderColor: "lightgrey" }
          : { backgroundColor: "#212121", borderColor: "grey" },
      ]}
    >
      <FlatList
        data={props.stores}
        keyExtractor={(item) => item.id}
        horizontal={true}
        renderItem={({ item }) => (
          <Pressable
            onPress={() =>
              props.navigation.navigate("Store", {
                store_id: item.id,
                store_name: item.name,
                store_color: item.color,
              })
            }
          >
            <View style={styles.viewStore}>
              <View style={styles.logoimgcontainer}>
                <Image
                  style={styles.logoimg}
                  resizeMode="contain"
                  source={imageSource[item.name]}
                />
              </View>
              <Text
                style={[
                  styles.logoText,
                  theme == "light" ? { color: "#404040" } : { color: "white" },
                ]}
              >
                {item.name}
              </Text>
            </View>
          </Pressable>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  containerStores: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-start",
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderColor: "lightgrey",
  },
  viewStore: {
    alignItems: "center",
    justifyContent: "center",
    padding: 7,
    marginHorizontal: 5,
  },
  // logoimg: {
  //   width: 70,
  //   height: 70,
  //   alignItems: "center",
  //   justifyContent: "center",
  //   backgroundColor: "#fff",
  //   borderWidth: 3,
  //   borderRadius: 100,
  //   borderColor: "tomato",
  // },
  // logo: {
  //   fontSize: 40,
  //   fontWeight: "500",
  // },
  logoimgcontainer: {
    alignItems: "center",
    justifyContent: "center",
    width: 70,
    height: 70,
    backgroundColor: "#fff",
    borderRadius: 100,
    borderColor: "tomato",
    borderWidth: 3,
  },
  logoimg: {
    width: 45,
    height: 45,
  },
  logoText: {
    color: "#404040",
  },
});

export default StoreLogoList;
