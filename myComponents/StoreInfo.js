import React, { useRef, useContext } from "react";
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  Animated,
  ImageBackground,
  useWindowDimensions,
  Button,
  Dimensions,
  Image,
} from "react-native";
import { ThemeContext } from "../Theme/ThemeManager";
import * as WebBrowser from "expo-web-browser";
import { imageSource } from "./ImagesSources";

const StoreInfo = (props) => {
  const { theme } = useContext(ThemeContext);
  const scrollX = useRef(new Animated.Value(0)).current;
  const { width: windowWidth } = useWindowDimensions();
  const item_logo = imageSource[props.store.name];
  return (
    <View
      style={[
        styles.container,
        theme == "light"
          ? { backgroundColor: "white" }
          : { backgroundColor: "#212121" },
      ]}
    >
      <View style={styles.storeintro}>
        <View style={styles.logoimgcontainer}>
          <Image
            style={styles.logoimg}
            resizeMode="contain"
            source={item_logo}
          />
        </View>
        <View style={styles.storedesc}>
          <Text
            style={[
              styles.descText,
              theme == "light" ? { color: "#404040" } : { color: "white" },
            ]}
          >
            {props.store.description}
          </Text>
        </View>
      </View>
      <View style={styles.storecover}>
        <View style={styles.storebtn}>
          <Button
            onPress={() => WebBrowser.openBrowserAsync(props.store.url)}
            title="Visiter le site web"
            color="#1FA1FF"
            accessibilityLabel="Learn more about this purple button"
          />
        </View>
        <View style={styles.covers}>
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
            {/* <Text> store : {store.name}</Text> */}

            {props.store.cover_img.map((image, imageIndex) => {
              return (
                <View
                  style={{
                    width: windowWidth,
                    height: 200,
                    // paddingHorizontal: 30,
                  }}
                  key={imageIndex}
                >
                  <ImageBackground
                    source={{ uri: image }}
                    style={styles.imgBackground}
                    resizeMode="stretch"
                  >
                    <View style={styles.textContainer}>
                      <Text style={styles.infoText}>
                        {imageIndex + 1 + "/" + props.store.cover_img.length}
                      </Text>
                    </View>
                  </ImageBackground>
                </View>
              );
            })}
          </ScrollView>
          <View style={styles.indicatorContainer}>
            {props.store.cover_img.map((image, imageIndex) => {
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    backgroundColor: "white",
  },
  Button: {
    marginTop: 10,
  },
  storeintro: {
    flexDirection: "row",
    padding: 15,
    width: "100%",
  },
  descText: {
    color: "white",
  },
  storelogo: {
    width: "30%",
    backgroundColor: "grey",
  },
  logoimgcontainer: {
    width: "30%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    borderRadius: (2, 2),
    borderColor: "silver",
    borderWidth: 1,
  },
  logoimg: {
    width: 70,
  },
  storedesc: {
    width: "70%",
    paddingLeft: 10,
  },
  storecover: {
    width: "100%",
  },
  storebtn: {
    padding: 15,
  },
  covers: {
    width: Dimensions.get("window").width,
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
  normalDot: {
    height: 8,
    width: 8,
    borderRadius: 4,
    backgroundColor: "silver",
    marginHorizontal: 4,
  },
  indicatorContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 7,
  },
});

export default StoreInfo;
