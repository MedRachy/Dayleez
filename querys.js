import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  Button,
  SafeAreaView,
  Image,
} from "react-native";
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  doc,
  getDoc,
  getDocs,
  where,
  query,
  addDoc,
  deleteDoc,
  documentId,
} from "firebase/firestore";

const Home = ({ navigation }) => {
  const firebaseConfig = {
    apiKey: "AIzaSyABldGn0NQrV1FPolk9XMKjTaZxZ_UcY4E",
    authDomain: "dayleez-d450e.firebaseapp.com",
    projectId: "dayleez-d450e",
    storageBucket: "dayleez-d450e.appspot.com",
    messagingSenderId: "197816104358",
    appId: "1:197816104358:web:f6b04f30e0a16558464b67",
    measurementId: "G-KGGD1YNJ31",
  };
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  const dataobject = { id: "", val: {} };
  const data = [];
  const [items, setitems] = useState([]);
  const item_id = "9TiKuDO8hDUU3O5bDuzj";
  const user_id = "rachy79";
  const store_name = "Ebay";

  // get all items from database
  const get_all_items = async () => {
    try {
      const snapshot = await getDocs(collection(db, "items"));
      snapshot.forEach((doc) => {
        console.log(doc.id, " => ", doc.data());
        // dataobject.id = doc.id;
        // dataobject.val = doc.data();
        // data.push(dataobject);
      });
      // setitems(data);
      // console.log(items);
    } catch (error) {
      console.error(error);
    }
  };
  // get one item by document id (item id)
  const get_item = async (item_id) => {
    try {
      const docRef = doc(db, "items", item_id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        console.log("Document data:", docSnap.data());
      } else {
        console.log("No such document!");
      }
    } catch (error) {
      console.error(error);
    }
  };
  // get all items of a store
  const get_store_items = async (store_name) => {
    try {
      const q = query(
        collection(db, "items"),
        where("store.name", "==", store_name)
      );
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        console.log(doc.id, " => ", doc.data());
      });
    } catch (error) {
      console.error(error);
    }
  };
  // add item to a user wishlist
  const addto_wishlist = async (item_id) => {
    try {
      const docRef = await addDoc(collection(db, "wishlist"), {
        user_id: "rachy79",
        user_name: "simo",
        item_id: "qfLqszebry3H568",
        img_url:
          "https://ma.jumia.is/unsafe/fit-in/300x300/filters:fill(white)/product/65/107383/1.jpg?5400",
        item_url:
          "https://www.jumia.ma/serum-vitamine-cecollagen-anti-rides-anti-age-pour-blanchiment-de-peau-christelle-paris-mpg945200.html",
        likes: 12,
        name: "CHRISTELLE PARIS Sérum vitamine C+E+COLLAGEN anti-rides anti-âge pour blanchiment de peau Naturelle",
        oldprice: "335.00 Dhs",
        price: "48.40 Dhs",
        review: "3.6 out of 5(457)",
        store: {
          name: "Jumia",
          url: "https://www.jumia.ma",
          description: "description here",
        },
      });
      console.log("Document written with ID: ", docRef.id);
    } catch (error) {
      console.error(error);
    }
  };
  // remove item from a user wishlist
  const removefrom_wishlist = async (user_id, item_id) => {
    try {
      // no need for query if the doc_id is passed as an argument ex :
      // (null,null,doc_id) ...
      const q = query(
        collection(db, "wishlist"),
        where("item_id", "==", item_id),
        where("user_id", "==", user_id)
      );
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach(async (result) => {
        await deleteDoc(doc(db, "wishlist", result.id));
        console.log("delete complete");
      });
    } catch (error) {
      console.error(error);
    }
  };
  // get all items from a user wishlist
  const get_wishlist_items = async (user_id) => {
    try {
      const q = query(
        collection(db, "wishlist"),
        where("user_id", "==", user_id)
      );
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        console.log(doc.id, " => ", doc.data());
      });
    } catch (error) {
      console.error(error);
    }
  };
  // for each store get covers
  const get_covers_stores = async () => {
    try {
      const snapshot = await getDocs(collection(db, "stores"));
      snapshot.forEach((doc) => {
        console.log(doc.id, " => ", doc.data());
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.container}>
        <View style={styles.Button}>
          <Button onPress={() => get_all_items()} title="get all items" />
        </View>
        <View style={styles.Button}>
          <Button onPress={() => get_item(item_id)} title="get item" />
        </View>
        <View style={styles.Button}>
          <Button
            onPress={() => get_store_items(store_name)}
            title="get all items of a store"
          />
        </View>
        <View style={styles.Button}>
          <Button
            onPress={() => addto_wishlist(item_id)}
            title="Add to wishlist"
          />
        </View>
        <View style={styles.Button}>
          <Button
            onPress={() => removefrom_wishlist(user_id, item_id)}
            title="remove from wishlist"
          />
        </View>
        <View style={styles.Button}>
          <Button
            onPress={() => get_wishlist_items(user_id)}
            title="items from a user wishlist"
          />
        </View>
        <View style={styles.Button}>
          <Button
            onPress={() => get_covers_stores()}
            title="for each store get cover "
          />
        </View>
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
  text: {
    textAlign: "center",
    fontSize: 25,
    marginVertical: 5,
  },
  image: {
    backgroundColor: "green",
  },
  Button: {
    marginTop: 10,
  },
});

export default Home;
