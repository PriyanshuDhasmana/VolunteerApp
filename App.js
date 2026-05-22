import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ActivityIndicator, Text, View } from "react-native";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ThemeProvider, useVolunteerTheme } from "./context/ThemeContext";
import { ToastProvider } from "./context/ToastContext";
import { shadow } from "./constants/designSystem";
import LoginScreen from "./screens/LoginScreen";
import BloodDonationScreen from "./screens/BloodDonationScreen";
import ExploreScreen from "./screens/ExploreScreen";
import HomeScreen from "./screens/HomeScreen";
import NotFoundScreen from "./screens/NotFoundScreen";
import NotificationsScreen from "./screens/NotificationsScreen";
import ProfileScreen from "./screens/ProfileScreen";
import VolunteerEventsScreen from "./screens/VolunteerEventsScreen";

const Stack = createNativeStackNavigator();

function AuthStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
    </Stack.Navigator>
  );
}

function AppStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Explore" component={ExploreScreen} />
      <Stack.Screen name="BloodDonation" component={BloodDonationScreen} />
      <Stack.Screen name="VolunteerEvents" component={VolunteerEventsScreen} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="NotFound" component={NotFoundScreen} />
    </Stack.Navigator>
  );
}

const linking = {
  prefixes: ["volunteerapp://", "http://localhost:8081", "http://localhost:19006"],
  config: {
    screens: {
      Login: "login",
      Home: "",
      Explore: "explore",
      BloodDonation: "blood",
      VolunteerEvents: "create",
      Notifications: "notifications",
      Profile: "profile",
      NotFound: "*",
    },
  },
};

function RootNavigator() {
  const { user, loading, error } = useAuth();
  const theme = useVolunteerTheme();

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: theme.colors.background,
        }}
      >
        <View
          style={{
            backgroundColor: theme.colors.surfaceStrong,
            borderColor: theme.colors.line,
            borderRadius: 8,
            borderWidth: 1,
            padding: 22,
            ...shadow(theme.colors, 1),
          }}
        >
          <ActivityIndicator size="large" color={theme.colors.blue} />
          <Text
            style={{
              color: theme.colors.muted,
              fontSize: 13,
              fontWeight: "800",
              marginTop: 14,
            }}
          >
            Preparing your impact dashboard...
          </Text>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: theme.colors.background,
          padding: 20,
        }}
      >
        <Text style={{ color: theme.colors.danger, fontSize: 16, textAlign: "center" }}>
          Error: {error.message}
        </Text>
      </View>
    );
  }

  return (
    <NavigationContainer key={user ? "app" : "auth"} linking={linking}>
      {user ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <RootNavigator />
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}
