import { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import { EmptyState, appGradient, useResponsive } from "../components/VolunteerUI";
import { useVolunteerTheme } from "../context/ThemeContext";

export default function SignupScreen({ navigation }) {
  const theme = useVolunteerTheme();
  const responsive = useResponsive();
  const styles = useMemo(
    () => createStyles(theme.colors, responsive),
    [theme.colors, responsive.width],
  );

  return (
    <View style={[styles.container, appGradient(theme.colors)]}>
      <View style={styles.content}>
        <Text style={styles.title}>Volunteer</Text>
        <EmptyState
          icon="shield-checkmark-outline"
          title="Sign up is handled with Google"
          message="Use the login screen to continue securely, or enter the demo experience."
          actionLabel="Back to Login"
          onAction={() => navigation?.navigate("Login")}
        />
      </View>
    </View>
  );
}

function createStyles(themeColors, responsive) {
  return StyleSheet.create({
    container: {
      alignItems: "center",
      flex: 1,
      justifyContent: "center",
      padding: responsive.isMobile ? 18 : 28,
    },
    content: {
      maxWidth: 520,
      width: "100%",
    },
    title: {
      color: themeColors.blue,
      fontSize: responsive.isMobile ? 38 : 48,
      fontWeight: "900",
      lineHeight: responsive.isMobile ? 44 : 56,
      marginBottom: 18,
      textAlign: "center",
    },
  });
}
