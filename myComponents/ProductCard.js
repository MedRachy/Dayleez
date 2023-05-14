import React, { useState, useEffect, useContext } from "react";
import {
  Text,
  View,
  StyleSheet,
  Image,
  Pressable,
  TouchableOpacity,
  TouchableHighlight,
  Modal,
  Share,
} from "react-native";
import {
  collection,
  query,
  getDocs,
  where,
  addDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db, auth } from "../firebase-config";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { ThemeContext } from "../Theme/ThemeManager";
import * as WebBrowser from "expo-web-browser";
import { imageSource } from "./ImagesSources";

const ProductCard = (props) => {
  const { theme, islogin } = useContext(ThemeContext);
  const [redheart, isredheart] = useState(false);

  //  check if the product exsist in the user wishlist
  const check_redheart = async () => {
    try {
      const user = auth.currentUser;
      const q = query(
        collection(db, "wishlist"),
        where("item_id", "==", props.item.id),
        where("user_id", "==", user.uid)
      );
      const querySnapshot = await getDocs(q);
      querySnapshot.docs.length === 0 ? isredheart(false) : isredheart(true);
    } catch (error) {
      console.log(error);
    }
  };
  // add item to a user wishlist
  const addto_wishlist = async () => {
    try {
      if (islogin) {
        if (redheart) {
          isredheart(false);
          removefrom_wishlist();
        } else {
          const user = auth.currentUser;
          isredheart(true);
          const docRef = await addDoc(collection(db, "wishlist"), {
            // user auth
            user_id: user.uid,
            user_name: "simo",
            // item data
            item_id: props.item.id,
            img_url: props.item.img_url,
            item_url: props.item.item_url,
            name: props.item.name,
            oldprice: props.item.oldprice,
            price: props.item.price,
            review: props.item.review,
            store: props.item.store,
            add_date: props.item.add_date,
          });
        }
      } else {
        props.openModal();
      }
    } catch (error) {
      console.error(error);
    }
  };
  // remove item from a user wishlist
  const removefrom_wishlist = async () => {
    try {
      const user = auth.currentUser;
      const q = query(
        collection(db, "wishlist"),
        where("item_id", "==", props.item.id),
        where("user_id", "==", user.uid)
      );
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach(async (result) => {
        await deleteDoc(doc(db, "wishlist", result.id));
      });
    } catch (error) {
      console.error(error);
    }
  };
  // sharing the item url
  const onShare = async () => {
    try {
      // to get the platform ::
      // const snapchat = Platform.select({
      //   ios: 'snapchat://add/baconbrix',
      //   default: 'https://snapchat.com/add/baconbrix',
      // });

      const result = await Share.share({
        titel: "DayLeez Top deals of the day",
        message: props.item.item_url,
        // url field only works on IOS
        // url: item.item_url,
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          console.log("shared with activity type of" + result.activityType);
        } else {
          // console.log("shared");
        }
      } else if (result.action === Share.dismissedAction) {
        // console.log("dissmmed");
      }
    } catch (error) {
      alert(error.message);
    }
  };

  useEffect(() => {
    let mounted = true;

    if (mounted) {
      if (islogin) {
        check_redheart();
      } else {
        isredheart(false);
      }
    }
    return () => (mounted = false);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.imgcontainer}>
        <Image
          style={styles.img_product}
          resizeMode="contain"
          source={{ uri: props.item.img_url }}
        />
      </View>

      <View
        style={[
          styles.detailcontainer,
          theme == "light"
            ? { backgroundColor: "white" }
            : { backgroundColor: "#212121" },
        ]}
      >
        <View style={styles.infocontainer}>
          <View style={styles.logocontainer}>
            <Pressable
              onPress={props.navigate_to_store}
              style={{ flexDirection: "row" }}
            >
              <View style={styles.logoimgcontainer}>
                <Image
                  style={styles.logoimg}
                  source={imageSource[props.item.store.name]}
                />
              </View>
              <View style={styles.logotitlecontainer}>
                <Text
                  style={[
                    styles.logotitle,
                    theme == "light"
                      ? { color: "#404040" }
                      : { color: "white" },
                  ]}
                >
                  {props.item.store.name}
                </Text>
              </View>
            </Pressable>
          </View>

          <View style={styles.productinfocontainer}>
            <Text style={styles.price}>
              {props.item.price}{" "}
              <Text style={styles.oldprice}>{props.item.oldprice}</Text>{" "}
            </Text>
            <Text
              style={[
                styles.name,
                theme == "light" ? { color: "black" } : { color: "white" },
              ]}
            >
              {props.item.name}
            </Text>
            <TouchableHighlight
            // onPress={() => {
            //   Linking.openURL(item.item_url);
            // }}
            >
              <Text style={styles.readmore}>Plus de details</Text>
            </TouchableHighlight>
          </View>
        </View>
        <View style={styles.btnicons}>
          <TouchableOpacity
            onPress={() => {
              addto_wishlist();
            }}
          >
            {redheart ? (
              <AntDesign name="heart" size={30} color="tomato" />
            ) : (
              <AntDesign
                name="hearto"
                size={30}
                color={theme == "light" ? "black" : "white"}
              />
            )}
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => WebBrowser.openBrowserAsync(props.item.item_url)}
          >
            <AntDesign
              name="shoppingcart"
              size={30}
              color={theme == "light" ? "black" : "white"}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={onShare}>
            <Ionicons
              name="paper-plane-outline"
              size={30}
              color={theme == "light" ? "black" : "white"}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginVertical: 10,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  imgcontainer: {
    flex: 2,
    paddingVertical: 20,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  img_product: {
    width: 300,
    height: 300,
  },
  detailcontainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: 10,
    marginTop: 10,
    width: "100%",
    height: 200,
  },
  infocontainer: {
    flex: 4,
    padding: 5,
  },
  btnicons: {
    flex: 1,
    justifyContent: "space-around",
    alignItems: "center",
  },
  logocontainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  logoimgcontainer: {
    justifyContent: "center",
    alignItems: "center",
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
  logotitlecontainer: {
    justifyContent: "center",
  },
  logotitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10,
  },
  productinfocontainer: {
    flex: 2,
    paddingVertical: 7,
  },
  price: {
    fontSize: 20,
    color: "tomato",
  },
  oldprice: {
    fontSize: 20,
    color: "grey",
  },
  name: {
    paddingTop: 5,
  },
  readmore: {
    marginTop: 2,
    fontWeight: "bold",
    color: "grey",
  },
  icon: {
    textAlign: "center",
  },
});

export default ProductCard;
