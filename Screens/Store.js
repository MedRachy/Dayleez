import React, { useState, useEffect } from "react";
import {
  Text,
  StyleSheet,
  View,
  SafeAreaView,
  FlatList,
  ActivityIndicator,
  Dimensions,
  Pressable,
  Image,
} from "react-native";
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  getDoc,
  limit,
  startAfter,
} from "firebase/firestore";
import { db } from "../firebase-config";
import StoreInfo from "../myComponents/StoreInfo";

const Store = ({ navigation, route }) => {
  const [items, setitems] = useState([]);
  const [store, setstore] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [ScrollLoading, setScrollLoading] = useState(true);
  const [lastVisible, setlastVisible] = useState();
  /* Get the param */
  const store_id = route.params.store_id;
  const store_name = route.params.store_name;
  const store_color = route.params.store_color;

  // get items of a store
  const get_store_items = async () => {
    try {
      const q = query(
        collection(db, "items"),
        where("store.name", "==", store_name),
        limit(18)
      );
      const snapshot = await getDocs(q);
      setitems(
        snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }))
      );
      // set the last visible document
      setlastVisible(snapshot.docs[snapshot.docs.length - 1]);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      setIsFetching(false);
      setScrollLoading(true);
    }
  };
  // Get the next items.
  const nextload = async () => {
    try {
      if (ScrollLoading) {
        const next = query(
          collection(db, "items"),
          where("store.name", "==", store_name),
          startAfter(lastVisible),
          limit(18)
        );
        const snapshot = await getDocs(next);
        setitems([
          ...items,
          ...snapshot.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id,
          })),
        ]);
        snapshot.docs.length == 0
          ? setScrollLoading(false)
          : setlastVisible(snapshot.docs[snapshot.docs.length - 1]);
      }
    } catch (error) {
      console.error();
    }
  };
  //  get store by id from [home page]
  const get_store_byId = async () => {
    try {
      const docRef = doc(db, "stores", store_id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        // check if the product exsist in the user wishlist
        setstore(docSnap.data());
        get_store_items();
      } else {
        navigation.goBack();
      }
    } catch (error) {
      console.log(error);
    }
  };
  // get store by name from [product page]
  const get_store_byName = async () => {
    try {
      const q = query(
        collection(db, "stores"),
        where("name", "==", store_name)
      );
      const querySnapshot = await getDocs(q);
      if (querySnapshot.docs.length === 1) {
        setstore(querySnapshot.docs[0].data());
        get_store_items();
      } else {
        navigation.goBack();
      }
    } catch (error) {
      console.error(error);
    }
  };
  const refresh = () => {
    setIsFetching(true);
    if (store_id) {
      get_store_byId();
    } else if (store_name) {
      get_store_byName();
    }
  };
  useEffect(() => {
    let mounted = true;

    if (mounted) {
      if (store_id) {
        get_store_byId();
        navigation.setOptions({
          title: store_name,
          headerStyle: { backgroundColor: store_color },
        });
      } else if (store_name) {
        get_store_byName();
        navigation.setOptions({
          title: store_name,
          headerStyle: { backgroundColor: store_color },
        });
      } else {
        navigation.goBack();
      }
    }
    return () => (mounted = false);
  }, []);

  return (
    <SafeAreaView style={styles.screen}>
      {isLoading ? (
        <ActivityIndicator size="large" color="tomato" />
      ) : (
        <View style={styles.flatlistcontainer}>
          <FlatList
            data={items}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={() => <StoreInfo store={store} />}
            numColumns={3}
            refreshing={isFetching}
            onRefresh={refresh}
            onEndReached={nextload}
            // a value of 0.5 will trigger onEndReached when the end of the content
            //  is within half the visible length of the list.
            onEndReachedThreshold={0.8}
            ListFooterComponent={() =>
              ScrollLoading ? (
                <ActivityIndicator size="small" color="tomato" />
              ) : (
                <Text style={styles.endScrollText}>The End </Text>
              )
            }
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
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
  },
  flatlistcontainer: {
    flex: 1,
    justifyContent: "center",
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
  endScrollText: {
    textAlign: "center",
    color: "grey",
    fontWeight: "500",
    padding: 5,
  },
});

export default Store;
