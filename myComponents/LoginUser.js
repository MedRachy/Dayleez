import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
  TextInput,
  Image,
  Pressable,
  ActivityIndicator,
  Alert,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth } from "../firebase-config";

const LoginUser = (props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [LogingError, setloginError] = useState("");

  // sign in
  const handleLogin = () => {
    setLoading(true);
    if (email === "") {
      setloginError("Entrer votre adresse email");
      setLoading(false);
    } else if (password === "") {
      setloginError("Entrer votre mot de passe");
      setLoading(false);
    } else {
      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          // Signed in
          const user = userCredential.user;
          console.log("Logged in with:", user.email);
          setLoading(false);
          // close the modal after login [product page]
          if (props.modaleState) {
            props.closeModal();
          }
        })
        .catch((error) => {
          const errorCode = error.code;
          // const errorMessage = error.message;
          switch (errorCode) {
            case "auth/invalid-email":
              setloginError("Adresse Email invalide");
              setLoading(false);
              breack;
            case "auth/wrong-password":
              setloginError("Mot de passe incorrect");
              setLoading(false);
              breack;
            default:
              setloginError("Email ou mot de passe incorrect");
              setLoading(false);
          }
          console.log(errorCode);
        });
    }
  };
  // reset password
  const handleresetpass = () => {
    if (email === "") {
      setloginError("Entrer votre adresse email");
    } else {
      sendPasswordResetEmail(auth, email)
        .then(() => {
          Alert.alert(
            "Email envoyé",
            "Vous allez recevoir un email dans quelques instants pour rénisialiser votre mot de passe"
          );
          console.log("reset email sent");
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log(errorCode);
        });
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        {props.modaleState ? (
          <Pressable onPress={props.closeModal}>
            <AntDesign
              name="close"
              size={18}
              color="#404040"
              style={{ textAlign: "right" }}
            />
          </Pressable>
        ) : (
          <Text></Text>
        )}

        <View style={styles.logocontainer}>
          <Image
            style={styles.logo}
            resizeMode="contain"
            source={require(`../assets/adaptive-icon.png`)}
          />
        </View>
        {/* <Text style={styles.logintext}>
          Veuillez vous connectez pour continuer
        </Text> */}
        <Text style={styles.errorText}>{LogingError}</Text>
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={(text) => setEmail(text)}
          style={styles.input}
        />
        <TextInput
          placeholder="Mot de passe"
          value={password}
          onChangeText={(text) => setPassword(text)}
          style={styles.input}
          secureTextEntry
        />
        <Pressable onPress={handleresetpass}>
          <Text style={styles.forgetpassLink}>Mot de passe oublié ?</Text>
        </Pressable>
        <View style={styles.buttonContainer}>
          <TouchableHighlight
            onPress={handleLogin}
            style={styles.button}
            underlayColor={"orangered"}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Text style={styles.buttonText}>Connexion</Text>
            )}
          </TouchableHighlight>
        </View>
        <View style={styles.signupContainer}>
          <Text style={styles.signuptext}>Pas encore inscrit ?</Text>
          <Pressable onPress={props.SignupModal}>
            <Text style={styles.signupLink}>Créer un compte</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  logocontainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 150,
    height: 150,
  },
  logintext: {
    color: "#404040",
    textAlign: "center",
    fontSize: 20,
    fontWeight: "800",
    paddingVertical: 20,
  },
  errorText: {
    textAlign: "center",
    color: "red",
    fontSize: 12,
    fontWeight: "600",
  },
  inputContainer: {
    width: "80%",
    padding: 20,
    backgroundColor: "white",
    borderRadius: 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,
    elevation: 10,
  },
  input: {
    backgroundColor: "#E8E6E6",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 5,
    marginTop: 5,
  },
  buttonContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  button: {
    backgroundColor: "tomato",
    width: "100%",
    height: 40,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginVertical: 5,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "700",
    fontSize: 16,
  },
  signupContainer: {
    paddingVertical: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  signupLink: { paddingLeft: 5, color: "#32B5FF", fontWeight: "700" },
  forgetpassLink: {
    paddingTop: 5,
    textAlign: "right",
    color: "#32B5FF",
    fontWeight: "700",
  },
  signuptext: {
    color: "#404040",
  },
});

export default LoginUser;
