import { LogBox, Image, View } from "react-native";
import React, { useContext } from "react";
import "react-native-gesture-handler";
import {
  NavigationContainer,
  DarkTheme,
  DefaultTheme,
} from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  AntDesign,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
  FontAwesome5,
} from "@expo/vector-icons";

import Home from "./Screens/Home";
import Leez from "./Screens/Leez";
import Search from "./Screens/Search";
import Wishlist from "./Screens/Wishlist";
import Profil from "./Screens/Profil";
import Store from "./Screens/Store";
import Product from "./Screens/Product";
import Compte from "./Screens/Compte";
import EditPass from "./Screens/EditPass";
import { ThemeProvider, ThemeContext } from "./Theme/ThemeManager";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

export default function App() {
  // igonoring the timeout warning
  LogBox.ignoreAllLogs();
  LogBox.ignoreLogs(["Setting a timer for a long period of time"]);
  // TO DO :
  // Firstly you have to find the following file in your project: libraries/Core/Timers/JSTimer;js
  // Open it and you just have to change this const MAX_TIMER_DURATION_MS, to increase above your duration, in your case, above 85000

  function HomeStack() {
    return (
      <Stack.Navigator>
        <Stack.Screen
          name="home"
          component={Home}
          options={{
            title: "DayLeez",
            headerTitleAlign: "center",
            // headerTitleStyle: { fontFamily: "league spartan" },
          }}
        />
        <Stack.Screen
          name="Store"
          component={Store}
          options={{
            title: " ",
            headerTitleAlign: "center",
            // headerStyle: { backgroundColor: "orange" },
          }}
        />
        <Stack.Screen
          name="Product"
          component={Product}
          options={{
            title: "DayLeez",
            headerTitleAlign: "center",
          }}
        />
      </Stack.Navigator>
    );
  }
  function SearchStack() {
    return (
      <Stack.Navigator>
        <Stack.Screen
          name="search"
          component={Search}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="Store"
          component={Store}
          options={{
            title: " ",
            headerTitleAlign: "center",
            // headerStyle: { backgroundColor: "orange" },
          }}
        />
        <Stack.Screen
          name="Product"
          component={Product}
          options={{
            title: "DayLeez",
            headerTitleAlign: "center",
          }}
        />
      </Stack.Navigator>
    );
  }
  function LeezStack() {
    return (
      <Stack.Navigator>
        <Stack.Screen
          name="leez"
          component={Leez}
          options={{
            title: "Leez",
            headerTitleAlign: "center",
          }}
        />
        <Stack.Screen
          name="Store"
          component={Store}
          options={{
            title: " ",
            headerTitleAlign: "center",
            // headerStyle: { backgroundColor: "orange" },
          }}
        />
        <Stack.Screen
          name="Product"
          component={Product}
          options={{
            title: "DayLeez",
            headerTitleAlign: "center",
          }}
        />
      </Stack.Navigator>
    );
  }
  function WishlistStack() {
    return (
      <Stack.Navigator>
        <Stack.Screen
          name="wishlist"
          component={Wishlist}
          options={{
            title: "Mes Favoris",
            headerTitleAlign: "center",
          }}
        />
        <Stack.Screen
          name="Store"
          component={Store}
          options={{
            title: " ",
            headerTitleAlign: "center",
            // headerStyle: { backgroundColor: "orange" },
          }}
        />
        <Stack.Screen
          name="Product"
          component={Product}
          options={{
            title: "DayLeez",
            headerTitleAlign: "center",
          }}
        />
      </Stack.Navigator>
    );
  }
  function ProfilStack() {
    return (
      <Stack.Navigator>
        <Stack.Screen
          name="profil"
          component={Profil}
          options={{
            title: "Paramètres",
            headerTitleAlign: "center",
          }}
        />
        <Stack.Screen
          name="Compte"
          component={Compte}
          options={{
            title: "Compte",
            headerTitleAlign: "center",
          }}
        />
        <Stack.Screen
          name="EditPass"
          component={EditPass}
          options={{
            title: "Compte",
            headerTitleAlign: "center",
          }}
        />
        {/* add edit account page ... */}
      </Stack.Navigator>
    );
  }
  const NavigationWithTheme = () => {
    const { theme } = useContext(ThemeContext);
    return (
      <NavigationContainer theme={theme == "light" ? DefaultTheme : DarkTheme}>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              if (route.name === "Home") {
                // iconName = focused ? "home" : "home2";
                return <AntDesign name="home" size={size} color={color} />;
              } else if (route.name === "Search") {
                return <AntDesign name="search1" size={size} color={color} />;
              } else if (route.name === "Leez") {
                return (
                  <View
                    style={{
                      padding: 2,
                      borderRadius: 100,
                      borderColor: color,
                      borderWidth: 2,
                    }}
                  >
                    <MaterialCommunityIcons
                      name="percent"
                      size={20}
                      color={color}
                    />
                  </View>
                );
              } else if (route.name === "Wishlist") {
                return <AntDesign name="hearto" size={size} color={color} />;
              } else if (route.name === "Profil") {
                return (
                  <Ionicons name="person-outline" size={size} color={color} />
                );
              }
            },
            headerShown: false,
            // route.name == "Leez" || route.name == "Search" ? false : true,
            tabBarActiveTintColor: "tomato",
            tabBarInactiveTintColor: theme == "light" ? "black" : "white",
            tabBarShowLabel: false,
            tabBarVisibilityAnimationConfig: "enable",
            tabBarStyle: [
              {
                display: "flex",
                // backgroundColor: colorScheme,
              },
              null,
            ],
          })}
        >
          <Tab.Screen name="Home" component={HomeStack} />
          <Tab.Screen name="Search" component={SearchStack} />
          <Tab.Screen name="Leez" component={LeezStack} />
          <Tab.Screen name="Wishlist" component={WishlistStack} />
          <Tab.Screen name="Profil" component={ProfilStack} />
        </Tab.Navigator>
      </NavigationContainer>
    );
  };
  return (
    <ThemeProvider>
      <NavigationWithTheme />
    </ThemeProvider>
  );
}
