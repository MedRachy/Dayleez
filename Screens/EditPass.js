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
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "firebase/auth";
import { auth } from "../firebase-config";

const EditPass = () => {
  const user = auth.currentUser;
  const [old_password, setoldPassword] = useState("");
  const [password, setPassword] = useState("");
  const [Confirme_password, setConfirmePassword] = useState("");
  const [LogingError, setloginError] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  // update password : reauthenticate then update
  const Passupdate = () => {
    setLoading(true);
    if (password === "" || Confirme_password === "" || old_password === "") {
      setLoading(false);
      setloginError("Veuillez remplire tout les champs");
    } else if (password != Confirme_password) {
      setLoading(false);
      setloginError("Mot de passe saisi ne correspond pas");
    } else {
      const credential = EmailAuthProvider.credential(user.email, old_password);
      reauthenticateWithCredential(user, credential)
        .then(() => {
          // User re-authenticated.
          updatePassword(user, password)
            .then(() => {
              console.log("password updated");
              setLoading(false);
              setloginError("");
              setModalVisible(true);
              setTimeout(() => {
                setModalVisible(false);
              }, 2000);
            })
            .catch((error) => {
              const errorCode = error.code;
              if (errorCode === "auth/weak-password") {
                setloginError("Mot de passe faible (min 6 caractères)");
                setLoading(false);
              } else {
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
          placeholder="Ancien mot de passe "
          onChangeText={(text) => setoldPassword(text)}
          style={styles.input}
          secureTextEntry
        />
        <TextInput
          placeholder="Nouveau mot de passe "
          onChangeText={(text) => setPassword(text)}
          style={styles.input}
          secureTextEntry
        />
        <TextInput
          placeholder="Confirmer votre nouveau mot de passe"
          onChangeText={(text) => setConfirmePassword(text)}
          style={styles.input}
          secureTextEntry
        />
      </View>
      <View style={styles.buttonContainer}>
        <TouchableHighlight
          onPress={Passupdate}
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

export default EditPass;
