import React, { useState, useEffect, useRef } from "react";
import {
  Text,
  View,
  StyleSheet,
  SafeAreaView,
  FlatList,
  ActivityIndicator,
  Modal,
} from "react-native";
import {
  collection,
  getDocs,
  query,
  limit,
  startAfter,
} from "firebase/firestore";

import { db } from "../firebase-config";
import ProductCard from "../myComponents/ProductCard";
import LoginUser from "../myComponents/LoginUser";
import SignupUser from "../myComponents/SignupUser";

const Leez = ({ navigation }) => {
  const [items, setitems] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [ScrollLoading, setScrollLoading] = useState(true);
  const [lastVisible, setlastVisible] = useState();
  const [modalVisible, setModalVisible] = useState(false);
  const [signupModal, setSignupModal] = useState(false);
  // get all items from database
  const get_all_items = async () => {
    try {
      // Query the first page of docs (add orderby date later)
      const first = query(collection(db, "items"), limit(7));
      const snapshot = await getDocs(first);
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
          startAfter(lastVisible),
          limit(7)
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
        // console.log(lastVisible.data());
      }
    } catch (error) {
      console.error();
    }
  };
  // refresh the flatlist
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
    <SafeAreaView style={styles.screen}>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <LoginUser
          modaleState={modalVisible}
          closeModal={() => {
            setModalVisible(!modalVisible);
          }}
          SignupModal={() => {
            setModalVisible(!modalVisible);
            setSignupModal(true);
          }}
        />
      </Modal>
      <Modal
        animationType="slide"
        transparent={true}
        visible={signupModal}
        onRequestClose={() => {
          setSignupModal(!signupModal);
        }}
      >
        <SignupUser
          modaleState={signupModal}
          closeModal={() => {
            setSignupModal(!signupModal);
          }}
        />
      </Modal>
      {isLoading ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" color="tomato" />
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
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
              <Text style={styles.endScrollText}>The End</Text>
            )
          }
          renderItem={({ item }) => (
            <ProductCard
              item={item}
              navigate_to_store={() => {
                navigation.navigate("Store", {
                  store_name: item.store.name,
                  store_color: item.store.color,
                });
              }}
              openModal={() => setModalVisible(!modalVisible)}
            />
          )}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    width: "100%",
  },
  endScrollText: {
    textAlign: "center",
    color: "grey",
    fontWeight: "500",
    padding: 5,
  },
});

export default Leez;
