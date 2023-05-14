import React, { createContext, useState, useEffect } from "react";
import { StatusBar } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase-config";

export const ThemeContext = createContext();
export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState("light");
  const [islogin, setlogin] = useState(false);
  //   const [loading, setLoading] = useState(true);
  //   to get the user device theme  :
  //   const colorScheme = Appearance.getColorScheme();
  //   const [theme, settheme] = useState(colorScheme);
  //   Appearance.addChangeListener((scheme) => {
  //     settheme(scheme.colorScheme);
  //   });
  useEffect(() => {
    let mounted = true;
    if (mounted) {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
          setlogin(true);
          loadStorageData();
        } else {
          setlogin(false);
        }
      });
      return unsubscribe;
    }
    return () => (mounted = false);
  }, []);

  const loadStorageData = async () => {
    try {
      //Try get the data from Async Storage
      const DataSerialized = await AsyncStorage.getItem("@theme");
      if (DataSerialized) {
        setTheme(DataSerialized);
      }
    } catch (error) {
    } finally {
      // console.log(theme);
    }
  };

  const toggleTheme = () => {
    if (theme === "light") {
      setTheme("dark");
      StatusBar.setBarStyle("light-content");
      AsyncStorage.setItem("@theme", "dark");
    } else {
      setTheme("light");
      StatusBar.setBarStyle("dark-content");
      AsyncStorage.setItem("@theme", "light");
    }
  };
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, islogin }}>
      {children}
    </ThemeContext.Provider>
  );
};
