import React, { useState, useEffect, useContext } from "react";
import {
  Text,
  View,
  StyleSheet,
  SafeAreaView,
  Image,
  ActivityIndicator,
  FlatList,
  Dimensions,
  Pressable,
} from "react-native";
import { collection, onSnapshot, where, query } from "firebase/firestore";
import { db, auth } from "../firebase-config";
import LoginUser from "../myComponents/LoginUser";
import SignupUser from "../myComponents/SignupUser";
import { ThemeContext } from "../Theme/ThemeManager";

const Wishlist = ({ navigation, route }) => {
  const { theme, islogin } = useContext(ThemeContext);
  const [items, setitems] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [tosignUp, setTosignUp] = useState(false);
  // get all items from a user wishlist
  const get_wishlist_items = async () => {
    try {
      const user = auth.currentUser;
      const q = query(
        collection(db, "wishlist"),
        where("user_id", "==", user.uid)
      );
      const unsub = onSnapshot(q, (querySnapshot) => {
        setitems([]);
        setitems(
          querySnapshot.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id,
          }))
        );
      });
      return unsub;
    } catch (error) {
      console.error(error);
    } finally {
      setIsFetching(false);
      setLoading(false);
    }
  };
  const wishlistheader = () => (
    <View
      style={[
        styles.headercontainer,
        theme == "light"
          ? { backgroundColor: "white" }
          : { backgroundColor: "#212121" },
      ]}
    >
      {/* <Text
        style={[
          styles.title,
          theme == "light" ? { color: "#404040" } : { color: "white" },
        ]}
      >
        Tous vos favoris dans une seule endroit
      </Text> */}
      <View style={styles.info}>
        <Text style={styles.textinfo}>Votre liste de favoris</Text>
      </View>
    </View>
  );
  const refresh = () => {
    setIsFetching(true);
    get_wishlist_items();
  };
  // render Login or signup components
  const renderComp = () => {
    if (tosignUp === false) {
      return (
        <LoginUser
          SignupModal={() => {
            setTosignUp(true);
          }}
        />
      );
    } else if (tosignUp) {
      return (
        <SignupUser
          goTologin={() => {
            setTosignUp(false);
          }}
        />
      );
    }
  };
  useEffect(() => {
    let mounted = true;
    // get the user auth state
    if (mounted) {
      if (islogin) {
        get_wishlist_items();
      }
    }
    return () => (mounted = false);
  }, []);

  return (
    <SafeAreaView style={styles.screen}>
      {!islogin ? (
        renderComp()
      ) : (
        <View style={styles.container}>
          <View
            style={[
              styles.flatlistcontainer,
              theme == "light"
                ? { borderColor: "lightgrey" }
                : { borderColor: "grey" },
            ]}
          >
            {isLoading ? (
              <ActivityIndicator size="large" color="tomato" />
            ) : (
              <FlatList
                numColumns={3}
                data={items}
                refreshing={isFetching}
                onRefresh={refresh}
                ListHeaderComponent={wishlistheader}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => (
                  <Pressable
                    style={styles.imgcontainer}
                    onPress={() =>
                      navigation.navigate("Product", {
                        wishlist_id: item.id,
                        item_id: item.item_id,
                        route_name: route.name,
                      })
                    }
                  >
                    <Image
                      style={styles.img_product}
                      resizeMode="contain"
                      source={{ uri: item.img_url }}
                    />
                  </Pressable>
                )}
              />
            )}
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    width: "100%",
  },
  container: {
    flex: 1,
    justifyContent: "center",
  },
  headercontainer: {
    padding: 15,
    justifyContent: "center",
    alignContent: "center",
    backgroundColor: "white",
  },
  title: {
    fontSize: 17,
    fontWeight: "800",
    textAlign: "center",
    color: "white",
  },
  info: {
    backgroundColor: "skyblue",
    padding: 10,
    borderRadius: (5, 5),
  },
  textinfo: {
    textAlign: "center",
    fontWeight: "800",
  },
  flatlistcontainer: {
    flex: 1,
    justifyContent: "center",
    borderTopWidth: 1,
    borderColor: "lightgrey",
    backgroundColor: "white",
  },
  img_product: {
    margin: 5,
    width: Dimensions.get("window").width / 3,
    height: Dimensions.get("window").width / 3,
  },
  imgcontainer: {
    flex: 1,
    margin: 1,
    justifyContent: "center",
    alignItems: "center",
    height: Dimensions.get("window").width / 3,
  },
});

export default Wishlist;
