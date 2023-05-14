import React, { useEffect, useRef, useState, useContext } from "react";
import {
  View,
  StyleSheet,
  SafeAreaView,
  Image,
  TextInput,
  ActivityIndicator,
  FlatList,
  Dimensions,
  Pressable,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { collection, getDocs, onSnapshot, query } from "firebase/firestore";
import { db } from "../firebase-config";
import { ThemeContext } from "../Theme/ThemeManager";

const Search = ({ navigation }) => {
  const { theme } = useContext(ThemeContext);
  const [isLoading, setLoading] = useState(true);
  const [items, setitems] = useState([]);
  const [filteritems, setfilteritems] = useState([]);
  const textInput = useRef(null);
  const [clear, setclear] = useState(true);
  const [isFetching, setIsFetching] = useState(false);

  // get all items
  const get_all_items = async () => {
    try {
      const snapshot = await getDocs(collection(db, "items"));
      setitems(
        snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }))
      );
      setfilteritems(
        snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }))
      );
      // using listner
      // const q = query(collection(db, "items"));
      // const unsubscribe = onSnapshot(q, (snapshot) => {
      //   setitems([]);
      //   setfilteritems([]);
      //   setitems(
      //     snapshot.docs.map((doc) => ({
      //       ...doc.data(),
      //       id: doc.id,
      //     }))
      //   );
      //   setfilteritems(
      //     snapshot.docs.map((doc) => ({
      //       ...doc.data(),
      //       id: doc.id,
      //     }))
      //   );
      // });
      // return unsubscribe;
    } catch (error) {
      console.error(error);
    } finally {
      setIsFetching(false);
      setLoading(false);
    }
  };
  // Search filter
  const searchfilter = async (searchtext) => {
    try {
      if (searchtext) {
        setclear(false);
        const newData = items.filter(function (item) {
          const itemData = item.name
            ? item.name.toUpperCase()
            : "".toUpperCase();
          const textData = searchtext.toUpperCase();

          return itemData.indexOf(textData) > -1;
        });

        setfilteritems(newData);
      } else {
        setfilteritems(items);
        setclear(true);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  // clear inputText
  const cleartext = () => {
    textInput.current.clear();
    setfilteritems(items);
    setclear(true);
  };

  const refresh = () => {
    setIsFetching(true);
    get_all_items();
  };

  useEffect(() => {
    let mounted = true;

    if (mounted) {
      get_all_items();
    }
    return () => (mounted = false);
  }, []);

  return (
    <SafeAreaView
      style={[
        styles.screen,
        theme == "light"
          ? { backgroundColor: "white" }
          : { backgroundColor: "#212121" },
      ]}
    >
      <View style={styles.searchbar}>
        <AntDesign name="search1" size={24} color="black" />
        <TextInput
          ref={textInput}
          style={styles.input}
          placeholder="Search"
          maxLength={40}
          onChangeText={(text) => searchfilter(text)}
        />
        {clear ? (
          <AntDesign name="closecircleo" size={24} color="grey" />
        ) : (
          <Pressable onPress={() => cleartext()}>
            <AntDesign name="closecircleo" size={24} color="black" />
          </Pressable>
        )}
      </View>
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
            data={filteritems}
            refreshing={isFetching}
            onRefresh={refresh}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <Pressable
                style={styles.imgcontainer}
                onPress={() =>
                  navigation.navigate("Product", {
                    item_id: item.id,
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "white",
    // width: "100%",
  },
  searchbar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 50,
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 10,
    backgroundColor: "lightgray",
  },
  input: {
    height: 30,
    width: "80%",
    paddingLeft: 5,
    // backgroundColor: "green",
  },
  flatlistcontainer: {
    flex: 1,
    justifyContent: "center",
    marginTop: 15,
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
    // padding: 2,
    justifyContent: "center",
    alignItems: "center",
    height: Dimensions.get("window").width / 3,
    // backgroundColor: "lightgray",
  },
});

export default Search;
