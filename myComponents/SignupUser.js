import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
  TextInput,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase-config";

const SignupUser = (props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [Confirme_email, setConfirmeEmail] = useState("");
  const [Confirme_password, setConfirmePassword] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [LogingError, setloginError] = useState("");
  // sign up
  const handleSignUp = () => {
    setLoading(true);
    if (
      email === "" ||
      password === "" ||
      Confirme_email === "" ||
      Confirme_password === ""
    ) {
      setLoading(false);
      setloginError("Veuillez remplire tout les champs");
    } else if (email != Confirme_email) {
      setLoading(false);
      setloginError("Email saisi ne correspond pas");
    } else if (password != Confirme_password) {
      setLoading(false);
      setloginError("Mot de passe saisi ne correspond pas");
    } else {
      createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          // Signed in
          const user = userCredential.user;
          console.log("Registered with:", user.email);
          setLoading(false);
          if (props.modaleState) {
            props.closeModal();
          }
        })
        .catch((error) => {
          const errorCode = error.code;
          switch (errorCode) {
            case "auth/email-already-in-use":
              setloginError("Adresse Email déja utilisé");
              setLoading(false);
              breack;
            case "auth/invalid-email":
              setloginError("Adresse Email invalide");
              setLoading(false);
              breack;
            case "auth/weak-password":
              setloginError("Mot de passe faible (min 6 caractères)");
              setLoading(false);
              breack;
            default:
              setloginError(
                "un probléme est survenu veuillez réessayer encore une fois"
              );
              setLoading(false);
          }
          console.log(errorCode);
        });
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        {props.modaleState ? (
          <Pressable onPress={props.closeModal} style={styles.closeicon}>
            <AntDesign
              name="close"
              size={18}
              color="#404040"
              style={{ textAlign: "right" }}
            />
          </Pressable>
        ) : (
          <Pressable onPress={props.goTologin} style={styles.closeicon}>
            <AntDesign
              name="close"
              size={18}
              color="#404040"
              style={{ textAlign: "right" }}
            />
          </Pressable>
        )}

        {/* <View style={styles.logocontainer}>
          <Image
            style={styles.logo}
            resizeMode="contain"
            source={require(`../assets/adaptive-icon.png`)}
          />
        </View> */}
        <Text style={styles.logintext}>C'est rapide et facile</Text>
        <Text style={styles.errorText}>{LogingError}</Text>

        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={(text) => setEmail(text)}
          style={styles.input}
        />
        <TextInput
          placeholder="Confirmer votre adresse Email"
          onChangeText={(text) => setConfirmeEmail(text)}
          style={styles.input}
        />
        <View style={styles.divider}></View>
        <TextInput
          placeholder="Mot de passe"
          value={password}
          onChangeText={(text) => setPassword(text)}
          style={styles.input}
          secureTextEntry
        />
        <TextInput
          placeholder="Confirmer votre Mot de passe"
          onChangeText={(text) => setConfirmePassword(text)}
          style={styles.input}
          secureTextEntry
        />

        <View style={styles.buttonContainer}>
          <TouchableHighlight
            onPress={handleSignUp}
            style={styles.button}
            underlayColor={"orangered"}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Text style={styles.buttonText}>S'inscrire</Text>
            )}
          </TouchableHighlight>
        </View>
        <View>
          <Text style={styles.smallText}>
            En vous inscrivant, vous acceptez les{" "}
            <Text style={styles.blueText}>Conditions d'Utilisation</Text> et la{" "}
            <Text style={styles.blueText}>Politique de Confidentialité.</Text>
          </Text>
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
    marginVertical: 15,
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
  smallText: {
    fontSize: 10,
    color: "#404040",
    textAlign: "center",
  },
  blueText: {
    fontWeight: "800",
    color: "#32B5FF",
  },
  divider: {
    marginVertical: 10,
  },
  closeicon: {
    paddingVertical: 5,
  },
});

export default SignupUser;
