import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableHighlight,
  ActivityIndicator,
  Modal,
} from "react-native";
import {
  updateEmail,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "firebase/auth";
import { auth } from "../firebase-config";

const Compte = () => {
  const user = auth.currentUser;
  const [email, setEmail] = useState(user.email);
  const [Confirme_email, setConfirmeEmail] = useState("");
  const [password, setPassword] = useState("");
  const [LogingError, setloginError] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  // update email : reauthenticate then update
  const Emailupdate = () => {
    setLoading(true);
    if (email === "" || Confirme_email === "" || password === "") {
      setLoading(false);
      setloginError("Veuillez remplire tout les champs");
    } else if (email != Confirme_email) {
      setLoading(false);
      setloginError("Email saisi ne correspond pas");
    } else if (email === user.email) {
      setLoading(false);
      setloginError("Vous avez saisi la même adresse");
    } else {
      const credential = EmailAuthProvider.credential(user.email, password);
      reauthenticateWithCredential(user, credential)
        .then(() => {
          // User re-authenticated.
          updateEmail(user, email)
            .then(() => {
              console.log("email updated");
              setLoading(false);
              setloginError("");
              setModalVisible(true);
              setTimeout(() => {
                setModalVisible(false);
              }, 2000);
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
                default:
                  setloginError(
                    "un probléme est survenu veuillez réessayer encore une fois"
                  );
                  setLoading(false);
              }
              console.log(errorCode);
            });
        })
        .catch((error) => {
          const errorCode = error.code;
          if (errorCode === "auth/wrong-password") {
            setloginError("Mot de passe incorrect");
            setLoading(false);
          } else {
            setloginError(
              "un probléme est survenu veuillez réessayer encore une fois"
            );
            setLoading(false);
          }
        });
    }
  };

  return (
    <View style={styles.container}>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.modalcontainer}>
          <View style={styles.card}>
            <Text style={styles.modelText}>Enregistré avec succès</Text>
          </View>
        </View>
      </Modal>
      <View style={styles.info}>
        <Text>Vous êtes connecté avec </Text>
        <Text>{user.email}</Text>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.errorText}>{LogingError}</Text>
        <TextInput
          placeholder="Veuillez saisir votre nouvelle adresse email"
          onChangeText={(text) => setEmail(text)}
          style={styles.input}
        />
        <TextInput
          placeholder="Confirmer votre nouvelle adresse email"
          onChangeText={(text) => setConfirmeEmail(text)}
          style={styles.input}
        />
        <TextInput
          placeholder="Veuillez saisir votre mot de passe "
          onChangeText={(text) => setPassword(text)}
          style={styles.input}
          secureTextEntry
        />
      </View>
      <View style={styles.buttonContainer}>
        <TouchableHighlight
          onPress={Emailupdate}
          style={styles.button}
          underlayColor={"orangered"}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Text style={styles.buttonText}>Modifier</Text>
          )}
        </TouchableHighlight>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingHorizontal: 25,
  },
  modalcontainer: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    marginBottom: 100,
  },
  card: {
    // width: "80%",
    padding: 10,
    borderRadius: 2,
    // borderColor: "#404040",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,
    elevation: 5,
    backgroundColor: "#404040",
  },
  modelText: {
    fontSize: 12,
    fontWeight: "700",
    textAlign: "center",
    color: "white",
  },
  info: {
    marginTop: 15,
    alignItems: "center",
  },
  inputContainer: {
    marginVertical: 15,
  },
  errorText: {
    textAlign: "center",
    color: "red",
    fontSize: 12,
    fontWeight: "600",
  },
  input: {
    backgroundColor: "#E8E6E6",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 5,
    marginTop: 5,
  },
  buttonContainer: {
    // width: "60%",
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
});

export default Compte;
