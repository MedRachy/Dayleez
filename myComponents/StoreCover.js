import React, { useRef, useContext } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableHighlight,
  Animated,
  useWindowDimensions,
  Dimensions,
  ScrollView,
  ImageBackground,
  Image,
} from "react-native";
import { ThemeContext } from "../Theme/ThemeManager";
import { MaterialIcons } from "@expo/vector-icons";
import { imageSource } from "./ImagesSources";

const StoreCover = (props) => {
  const { theme } = useContext(ThemeContext);
  const scrollX = useRef(new Animated.Value(0)).current;
  const { width: windowWidth } = useWindowDimensions();
  const item_logo = imageSource[props.item.name];

  return (
    <View
      style={[
        styles.containerCovers,
        theme == "light"
          ? { backgroundColor: "white" }
          : { backgroundColor: "#212121" },
      ]}
    >
      <View style={styles.covers}>
        <View style={styles.coverHeader}>
          <View style={styles.logoimgcontainer}>
            {/* <Text>{props.item.logo}</Text> */}
            <Image
              style={styles.logoimg}
              resizeMode="contain"
              source={item_logo}
            />
          </View>
          <Text
            style={[
              styles.textlogo,
              theme == "light" ? { color: "#404040" } : { color: "white" },
            ]}
          >
            {props.item.name}
          </Text>
        </View>
        <View style={styles.coverBody}>
          <View style={styles.imgcover}>
            <ScrollView
              horizontal={true}
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onScroll={Animated.event(
                [
                  {
                    nativeEvent: {
                      contentOffset: {
                        x: scrollX,
                      },
                    },
                  },
                ],
                { useNativeDriver: false }
              )}
              scrollEventThrottle={1}
            >
              {props.item.cover_img.map((image, imageIndex) => {
                return (
                  <View
                    style={{ width: windowWidth, height: 200 }}
                    key={imageIndex}
                  >
                    <ImageBackground
                      source={{ uri: image }}
                      style={styles.imgBackground}
                      resizeMode="stretch"
                    >
                      <View style={styles.textContainer}>
                        <Text style={styles.infoText}>
                          {imageIndex + 1 + "/" + props.item.cover_img.length}
                        </Text>
                      </View>
                    </ImageBackground>
                  </View>
                );
              })}
            </ScrollView>
          </View>
        </View>
        <TouchableHighlight onPress={props.navigate_to_store}>
          <View style={styles.coverFooter}>
            <Text style={styles.buttontext}>Offres de la journée</Text>
            <MaterialIcons
              name="keyboard-arrow-right"
              size={27}
              color="white"
            />
          </View>
        </TouchableHighlight>
        <View style={styles.indicatorContainer}>
          {props.item.cover_img.map((image, imageIndex) => {
            const width = scrollX.interpolate({
              inputRange: [
                windowWidth * (imageIndex - 1),
                windowWidth * imageIndex,
                windowWidth * (imageIndex + 1),
              ],
              outputRange: [8, 16, 8],
              extrapolate: "clamp",
            });
            return (
              <Animated.View
                key={imageIndex}
                style={[styles.normalDot, { width }]}
              />
            );
          })}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  // ---------- covers list --------
  containerCovers: {
    flex: 3,
    alignItems: "center",
    backgroundColor: "white",
    width: "100%",
  },
  covers: {
    width: "100%",
  },
  coverHeader: {
    flexDirection: "row",
    padding: 10,
    justifyContent: "flex-start",
    alignItems: "center",
    width: Dimensions.get("window").width,
  },
  logoimgcontainer: {
    alignItems: "center",
    justifyContent: "center",
    width: 40,
    height: 40,
    backgroundColor: "#fff",
    borderRadius: 100,
    borderColor: "silver",
    borderWidth: 1,
  },
  logoimg: {
    width: 27,
    height: 27,
  },
  textlogo: {
    fontSize: 17,
    fontWeight: "300",
    marginHorizontal: 5,
    color: "white",
  },
  coverBody: {
    // justifyContent: "center",
  },
  imgcover: {
    width: Dimensions.get("window").width,
    // height: 200,
    backgroundColor: "grey",
  },
  coverFooter: {
    flexDirection: "row",
    padding: 10,
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#32B5FF",
  },
  buttontext: {
    color: "white",
    fontWeight: "200",
    fontSize: 15,
  },
  imgBackground: {
    flex: 1,
    overflow: "hidden",
    alignItems: "flex-end",
    justifyContent: "flex-start",
  },
  textContainer: {
    backgroundColor: "rgba(0,0,0, 0.7)",
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginTop: 5,
    marginRight: 5,
    borderRadius: 100,
  },
  infoText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  indicatorContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 7,
  },
  normalDot: {
    height: 8,
    width: 8,
    borderRadius: 4,
    backgroundColor: "silver",
    marginHorizontal: 4,
  },
});

export default StoreCover;
