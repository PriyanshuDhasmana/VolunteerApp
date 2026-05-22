import { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import {
  EmptyState,
  ScreenScaffold,
  softShadow,
  useResponsive,
} from "../components/VolunteerUI";
import { useVolunteerTheme } from "../context/ThemeContext";
import { currentVolunteer } from "../data/mockVolunteerData";

export default function NotFoundScreen({ navigation }) {
  const theme = useVolunteerTheme();
  const responsive = useResponsive();
  const styles = useMemo(
    () => createStyles(theme.colors, responsive),
    [theme.colors, responsive.width],
  );

  return (
    <ScreenScaffold active="Home" navigation={navigation} user={currentVolunteer}>
      <View style={styles.wrapper}>
        <Text style={styles.code}>404</Text>
        <EmptyState
          icon="map-outline"
          title="That page moved"
          message="The route you opened is not available, but the community dashboard is ready."
          actionLabel="Back Home"
          onAction={() => navigation.navigate("Home")}
        />
      </View>
    </ScreenScaffold>
  );
}

function createStyles(themeColors, responsive) {
  return StyleSheet.create({
    code: {
      color: themeColors.blue,
      fontSize: responsive.isMobile ? 54 : 72,
      fontWeight: "900",
      lineHeight: responsive.isMobile ? 62 : 82,
      marginBottom: 18,
      textAlign: "center",
    },
    wrapper: {
      alignSelf: "center",
      backgroundColor: themeColors.glass,
      borderColor: themeColors.line,
      borderRadius: 8,
      borderWidth: 1,
      marginTop: responsive.isMobile ? 28 : 80,
      maxWidth: 620,
      padding: responsive.isMobile ? 18 : 24,
      width: "100%",
      ...softShadow(1, themeColors),
    },
  });
}
