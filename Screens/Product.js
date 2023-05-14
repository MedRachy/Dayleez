import React, { useState, useEffect, useContext } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  TouchableOpacity,
  TouchableHighlight,
  ActivityIndicator,
  Pressable,
  Modal,
  Share,
} from "react-native";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import {
  doc,
  getDoc,
  addDoc,
  collection,
  deleteDoc,
  query,
  getDocs,
  where,
} from "firebase/firestore";
import { db, auth } from "../firebase-config";
import LoginUser from "../myComponents/LoginUser";
import SignupUser from "../myComponents/SignupUser";
import { ThemeContext } from "../Theme/ThemeManager";
import * as WebBrowser from "expo-web-browser";
import { imageSource } from "../myComponents/ImagesSources";

const Product = ({ navigation, route }) => {
  const { theme, islogin } = useContext(ThemeContext);
  const [item, setitem] = useState({});
  const [isLoading, setLoading] = useState(true);
  const [redheart, isredheart] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [signupModal, setSignupModal] = useState(false);
  /* Get the param */
  const item_id = route.params.item_id;
  const wishlist_id = route.params.wishlist_id;
  const route_name = route.params.route_name;

  // get item by id
  const get_item = async () => {
    try {
      // check if the request is coming from wishlist page
      const docRef =
        route_name == "wishlist"
          ? doc(db, "wishlist", wishlist_id)
          : doc(db, "items", item_id);

      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setitem(docSnap.data());
      } else {
        console.log("No such document!");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      // check_redheart();
    }
  };
  //  check if the product exsist in the user wishlist
  const check_redheart = async () => {
    try {
      const user = auth.currentUser;
      const q = query(
        collection(db, "wishlist"),
        where("item_id", "==", item_id),
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
        const user = auth.currentUser;
        if (redheart) {
          isredheart(false);
          removefrom_wishlist();
        } else {
          isredheart(true);
          const docRef = await addDoc(collection(db, "wishlist"), {
            // user auth
            user_id: user.uid,
            user_name: "simo",
            // item data
            item_id: item_id,
            img_url: item.img_url,
            item_url: item.item_url,
            name: item.name,
            oldprice: item.oldprice,
            price: item.price,
            review: item.review,
            store: item.store,
            add_date: item.add_date,
          });
          // setaddModel(true);
          // setTimeout(() => {
          //   setaddModel(false);
          // }, 2000);
        }
      } else {
        setModalVisible(true);
      }
    } catch (error) {
      console.error(error);
    }
  };
  // remove item from a user wishlist
  const removefrom_wishlist = async () => {
    try {
      if (route_name == "Wishlist") {
        await deleteDoc(doc(db, "wishlist", wishlist_id));
      } else {
        const user = auth.currentUser;
        const q = query(
          collection(db, "wishlist"),
          where("item_id", "==", item_id),
          where("user_id", "==", user.uid)
        );
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach(async (result) => {
          await deleteDoc(doc(db, "wishlist", result.id));
        });
      }
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
        message: item.item_url,
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
      route_name == "wishlist" ? isredheart(true) : isredheart(false);
      get_item();
      if (islogin) {
        check_redheart();
      } else {
        isredheart(false);
        if (route_name == "wishlist") {
          navigation.goBack();
        }
      }
    }
    return () => (mounted = false);
  }, []);

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.container}>
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
        {/* <Modal
          animationType="fade"
          transparent={true}
          visible={addModal}
          onRequestClose={() => {
            setaddModel(!addModal);
          }}
        >
          <View style={styles.modalcontainer}>
            <View style={styles.card}>
              <Text style={styles.modelText}>
                Ajouté a votre list de favoris
              </Text>
            </View>
          </View>
        </Modal> */}
        {isLoading ? (
          <ActivityIndicator size="large" color="tomato" />
        ) : (
          <View style={styles.souscontainer}>
            <View style={styles.imgcontainer}>
              <Image
                style={styles.img_product}
                resizeMode="contain"
                source={{ uri: item.img_url }}
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
                    onPress={() =>
                      navigation.navigate("Store", {
                        store_name: item.store.name,
                        store_color: item.store.color,
                      })
                    }
                    style={{ flexDirection: "row" }}
                  >
                    <View style={styles.logoimgcontainer}>
                      <Image
                        style={styles.logoimg}
                        source={imageSource[item.store.name]}
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
                        {item.store.name}
                      </Text>
                    </View>
                  </Pressable>
                </View>
                <View style={styles.productinfocontainer}>
                  <Text style={styles.price}>
                    {item.price}{" "}
                    <Text style={styles.oldprice}>{item.oldprice}</Text>{" "}
                  </Text>
                  <Text
                    style={[
                      styles.name,
                      theme == "light"
                        ? { color: "black" }
                        : { color: "white" },
                    ]}
                  >
                    {item.name}
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
                  onPress={() => WebBrowser.openBrowserAsync(item.item_url)}
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
    marginVertical: 10,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  souscontainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  imgcontainer: {
    flex: 2,
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
    // backgroundColor: "green",
  },
  btnicons: {
    flex: 1,
    // backgroundColor: "grey",
    justifyContent: "space-around",
    alignItems: "center",
    // paddingVertical: 20,
  },
  logocontainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    // alignItems: 'center'
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
    color: "#404040",
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
    // textDecorationStyle : ''
  },
  name: {
    color: "black",
    paddingTop: 5,
    // fontSize: 15,
  },
  readmore: {
    marginTop: 2,
    fontWeight: "bold",
    color: "grey",
    // backgroundColor: "tomato",
  },
  icon: {
    textAlign: "center",
    // paddingBottom: 20,
  },
  // modalcontainer: {
  //   flex: 1,
  //   justifyContent: "flex-end",
  //   alignItems: "center",
  //   marginBottom: 100,
  // },
  // card: {
  //   // width: "80%",
  //   padding: 10,
  //   borderRadius: 2,
  //   // borderColor: "#404040",
  //   shadowColor: "#000",
  //   shadowOffset: {
  //     width: 0,
  //     height: 5,
  //   },
  //   shadowOpacity: 0.34,
  //   shadowRadius: 6.27,
  //   elevation: 5,
  //   backgroundColor: "#404040",
  // },
  // modelText: {
  //   fontSize: 12,
  //   fontWeight: "700",
  //   textAlign: "center",
  //   color: "white",
  // },
});

export default Product;
