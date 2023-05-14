import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  SafeAreaView,
  FlatList,
  ActivityIndicator,
} from "react-native";

import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase-config";
import StoreCover from "../myComponents/StoreCover";
import StoreLogoList from "../myComponents/StoreLogoList";
// import { Stores } from "../storesData";

const Home = ({ navigation }) => {
  const [isLoading, setLoading] = useState(true);
  const [stores, setstores] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  // for each store get covers
  const get_covers_stores = async () => {
    try {
      const snapshot = await getDocs(collection(db, "stores"));
      // The number of documents in the QuerySnapshot : console.log(snapshot.size);
      setstores(
        snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }))
      );
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      setIsFetching(false);
    }
  };

  const refresh = () => {
    setIsFetching(true);
    get_covers_stores();
  };
  useEffect(() => {
    let mounted = true;

    if (mounted) {
      get_covers_stores();
    }
    return () => (mounted = false);
  }, []);

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.container}>
        {isLoading ? (
          <ActivityIndicator size="large" color="tomato" />
        ) : (
          <FlatList
            data={stores}
            keyExtractor={(item) => item.id}
            ListHeaderComponent={() => (
              <StoreLogoList stores={stores} navigation={navigation} />
            )}
            refreshing={isFetching}
            onRefresh={refresh}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <StoreCover
                item={item}
                navigate_to_store={() =>
                  navigation.navigate("Store", {
                    store_id: item.id,
                    store_name: item.name,
                    store_color: item.color,
                  })
                }
              />
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
    width: "100%",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Home;
