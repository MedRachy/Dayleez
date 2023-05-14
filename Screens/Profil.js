import React, { useState, useContext } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Switch } from "react-native";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { signOut } from "firebase/auth";
import { auth } from "../firebase-config";
import LoginUser from "../myComponents/LoginUser";
import SignupUser from "../myComponents/SignupUser";
import { ThemeContext } from "../Theme/ThemeManager";

const Profil = ({ navigation }) => {
  const { theme, toggleTheme, islogin } = useContext(ThemeContext);
  const [tosignUp, setTosignUp] = useState(false);
  const [isEnabledNot, setIsEnabledNot] = useState(true);
  // sign out
  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        setTosignUp(false);
        console.log("disconnected");
      })
      .catch((error) => alert(error.message));
  };
  // render login or signup components
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
  // switch notification
  const switchNotification = () =>
    setIsEnabledNot((previousState) => !previousState);

  return (
    <View
      style={[
        styles.container,
        theme == "light"
          ? { backgroundColor: "white" }
          : { backgroundColor: "#212121" },
      ]}
    >
      {!islogin ? (
        renderComp()
      ) : (
        <View style={styles.paramContainer}>
          <View style={styles.param}>
            <View style={styles.iconTextContainer}>
              <Ionicons
                name="notifications-outline"
                size={20}
                color={theme == "light" ? "black" : "white"}
              />
              <Text
                style={[
                  styles.paramText,
                  theme == "light" ? { color: "#404040" } : { color: "white" },
                ]}
              >
                Notifications
              </Text>
            </View>

            <Switch
              trackColor={{ false: "#767577", true: "silver" }}
              thumbColor={isEnabledNot ? "tomato" : "#f4f3f4"}
              ios_backgroundColor="#3e3e3e"
              onValueChange={switchNotification}
              value={isEnabledNot}
            />
          </View>
          <View style={styles.divider}></View>
          <View style={styles.param}>
            <View style={styles.iconTextContainer}>
              <Ionicons
                name="color-palette-outline"
                size={20}
                color={theme == "light" ? "black" : "white"}
              />
              <Text
                style={[
                  styles.paramText,
                  theme == "light" ? { color: "#404040" } : { color: "white" },
                ]}
              >
                Mode sombre
              </Text>
            </View>
            <Switch
              trackColor={{ false: "#767577", true: "silver" }}
              thumbColor={theme == "dark" ? "tomato" : "#f4f3f4"}
              ios_backgroundColor="#3e3e3e"
              onValueChange={toggleTheme}
              value={theme == "light" ? false : true}
            />
          </View>
          <View style={styles.divider}></View>
          <View style={styles.iconTextContainer}>
            <Ionicons
              name="ios-person-outline"
              size={20}
              color={theme == "light" ? "black" : "white"}
            />
            <Text
              style={[
                styles.paramText,
                theme == "light" ? { color: "#404040" } : { color: "white" },
              ]}
            >
              Compte
            </Text>
          </View>
          <View style={{ marginTop: 10 }}>
            <View style={styles.paramCompte}>
              <TouchableOpacity onPress={() => navigation.navigate("Compte")}>
                <Text style={styles.editText}>Modifier l'adresse email</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.paramCompte}>
              <TouchableOpacity onPress={() => navigation.navigate("EditPass")}>
                <Text style={styles.editText}>
                  Modifier votre mote de passe
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.divider}></View>
          <TouchableOpacity onPress={() => {}}>
            <View style={styles.iconTextContainer}>
              <AntDesign
                name="sound"
                size={17}
                color={theme == "light" ? "black" : "white"}
              />
              <Text
                style={[
                  styles.paramText,
                  theme == "light" ? { color: "#404040" } : { color: "white" },
                ]}
              >
                Publicités
              </Text>
            </View>
          </TouchableOpacity>
          <View style={styles.divider}></View>
          <TouchableOpacity onPress={() => {}}>
            <View style={styles.iconTextContainer}>
              <Ionicons
                name="information-circle-outline"
                size={20}
                color={theme == "light" ? "black" : "white"}
              />
              <Text
                style={[
                  styles.paramText,
                  theme == "light" ? { color: "#404040" } : { color: "white" },
                ]}
              >
                À propos
              </Text>
            </View>
          </TouchableOpacity>
          <View style={styles.divider}></View>

          <TouchableOpacity onPress={handleSignOut}>
            <View style={styles.iconTextContainer}>
              <AntDesign
                name="logout"
                size={17}
                color={theme == "light" ? "black" : "white"}
              />
              <Text
                style={[
                  styles.paramText,
                  theme == "light" ? { color: "#404040" } : { color: "white" },
                ]}
              >
                Se déconnecter
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "white",
    // backgroundColor: theme == "light" ? "white" : "#212121",
  },

  paramContainer: {
    width: "100%",
    paddingHorizontal: 25,
    paddingVertical: 15,
  },
  iconTextContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  param: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  divider: {
    marginVertical: 15,
  },
  paramText: {
    paddingLeft: 5,
    fontSize: 17,
    fontWeight: "600",
    color: "#404040",
    textAlignVertical: "center",
  },
  paramCompte: {
    justifyContent: "center",
    alignItems: "flex-start",
  },
  editText: {
    fontSize: 14,
    paddingVertical: 5,
    color: "#32B5FF",
    fontWeight: "600",
  },
});

export default Profil;
