import { Ionicons } from "@expo/vector-icons";
import { useMemo, useState } from "react";
import {
  Linking,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import {
  BrandMark,
  IconBadge,
  Panel,
  PrimaryButton,
  ThemeToggle,
  appGradient,
  softShadow,
  useResponsive,
} from "../components/VolunteerUI";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { useVolunteerTheme } from "../context/ThemeContext";
import { exploreCauses } from "../data/mockVolunteerData";

export default function LoginScreen() {
  const theme = useVolunteerTheme();
  const responsive = useResponsive();
  const styles = useMemo(
    () => createStyles(theme.colors, responsive),
    [theme.colors, responsive.width],
  );
  const [loading, setLoading] = useState(false);
  const { signInWithGoogle, continueAsDemo } = useAuth();
  const { showToast } = useToast();

  const enterDemo = () => {
    continueAsDemo();
    showToast({
      title: "Demo mode",
      message: "Welcome into the volunteer dashboard.",
      type: "info",
    });
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      await signInWithGoogle();
      showToast({ title: "Signed in", message: "Your profile is ready." });
    } catch (error) {
      showToast({
        title: "Using demo mode",
        message: "Google sign-in was unavailable, so the demo is open.",
        type: "info",
      });
      continueAsDemo();
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadApp = () => {
    if (Platform.OS === "web") {
      enterDemo();
      return;
    }

    Linking.openURL("https://expo.dev/go");
  };

  return (
    <SafeAreaView style={[styles.safeArea, appGradient(theme.colors)]}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <BrandMark />
          {!responsive.isMobile ? (
            <View style={styles.topLinks}>
              {["Home", "Create", "Notifications", "Profile"].map((label, index) => (
                <Pressable
                  key={label}
                  accessibilityRole="button"
                  onPress={enterDemo}
                  style={({ pressed, hovered, focused }) => [
                    styles.topLinkButton,
                    index === 0 && styles.topLinkButtonActive,
                    (pressed || hovered) && styles.pressed,
                    focused && styles.focusRing,
                  ]}
                >
                  <Text
                    style={[
                      styles.topLink,
                      index === 0 && styles.topLinkActive,
                    ]}
                  >
                    {label}
                  </Text>
                </Pressable>
              ))}
            </View>
          ) : null}
          <View style={styles.headerRight}>
            <ThemeToggle compact />
            <Pressable
              accessibilityLabel="Continue as demo profile"
              accessibilityRole="button"
              onPress={enterDemo}
              style={styles.avatar}
            >
              <Text style={styles.avatarText}>PG</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.heroRow}>
          <View style={styles.heroCopy}>
            <Text style={styles.heroEyebrow}>Community impact platform</Text>
            <Text style={styles.heroTitle}>VOLUNTEER</Text>
            <Text style={styles.heroSubtitle}>
              Connect with urgent blood requests, animal rescue, plantation drives,
              NGOs, and neighbors who are ready to help.
            </Text>
            <View style={styles.statsRow}>
              {[
                ["heart", "51", "lives helped"],
                ["leaf", "88", "trees cared for"],
                ["people", "9", "NGO partners"],
              ].map(([icon, value, label]) => (
                <View key={label} style={styles.statPill}>
                  <Ionicons name={icon} size={17} color={theme.colors.blue} />
                  <Text style={styles.statValue}>{value}</Text>
                  <Text style={styles.statLabel}>{label}</Text>
                </View>
              ))}
            </View>
            <View style={styles.ctaRow}>
              <PrimaryButton
                icon="logo-google"
                label={loading ? "Signing in..." : "Login with Google"}
                onPress={handleGoogleLogin}
                variant="light"
                loading={loading}
              />
              <PrimaryButton
                icon={Platform.OS === "web" ? "sparkles" : "phone-portrait"}
                label={Platform.OS === "web" ? "Enter Demo" : "Download Our App"}
                onPress={handleDownloadApp}
              />
            </View>
          </View>

          <Panel style={styles.explorePanel}>
            <View style={styles.panelHeader}>
              <Text style={styles.panelTitle}>Nearby causes</Text>
              <View style={styles.liveChip}>
                <View style={styles.liveDot} />
                <Text style={styles.liveText}>Live</Text>
              </View>
            </View>
            <View style={styles.causeList}>
              {exploreCauses.map((cause) => (
                <Pressable
                  key={cause.id}
                  accessibilityLabel={cause.label}
                  accessibilityRole="button"
                  onPress={enterDemo}
                  style={({ pressed, hovered, focused }) => [
                    styles.causeRow,
                    (pressed || hovered) && styles.pressed,
                    focused && styles.focusRing,
                  ]}
                >
                  <IconBadge icon={cause.icon} toneName={cause.tone} size={38} />
                  <Text style={styles.causeText} numberOfLines={2}>{cause.label}</Text>
                  <Ionicons name="chevron-forward" size={18} color={theme.colors.faint} />
                </Pressable>
              ))}
            </View>
          </Panel>
        </View>

        <View style={styles.previewDock}>
          {[
            ["home", "Home"],
            ["search", "Explore"],
            ["add-circle", "Create"],
            ["notifications", "Notifications"],
            ["person-circle", "Profile"],
          ].map(([icon, label], index) => (
            <Pressable
              key={label}
              accessibilityRole="button"
              onPress={enterDemo}
              style={({ pressed, hovered, focused }) => [
                styles.previewItem,
                index === 0 && styles.previewItemActive,
                (pressed || hovered) && styles.pressed,
                focused && styles.focusRing,
              ]}
            >
              <Ionicons
                name={icon}
                size={22}
                color={index === 0 ? theme.colors.blue : theme.colors.faint}
              />
              <Text
                style={[
                  styles.previewText,
                  index === 0 && styles.previewTextActive,
                ]}
                numberOfLines={1}
              >
                {label}
              </Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function createStyles(themeColors, responsive) {
  const isDark = themeColors.mode === "dark";

  return StyleSheet.create({
    avatar: {
      alignItems: "center",
      backgroundColor: themeColors.yellowSoft,
      borderColor: themeColors.line,
      borderRadius: 8,
      borderWidth: 1,
      height: 42,
      justifyContent: "center",
      width: 42,
    },
    avatarText: {
      color: themeColors.ink,
      fontSize: 14,
      fontWeight: "900",
    },
    causeList: {
      gap: 8,
      marginTop: 12,
    },
    causeRow: {
      alignItems: "center",
      backgroundColor: themeColors.surfaceStrong,
      borderColor: themeColors.line,
      borderRadius: 8,
      borderWidth: 1,
      flexDirection: "row",
      minHeight: 54,
      paddingHorizontal: 10,
      paddingVertical: 8,
    },
    causeText: {
      color: themeColors.ink,
      flex: 1,
      fontSize: 15,
      fontWeight: "800",
      lineHeight: 20,
      marginLeft: 12,
    },
    ctaRow: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 12,
      marginTop: 30,
    },
    explorePanel: {
      maxWidth: responsive.isCompact ? "100%" : 430,
      minWidth: responsive.isMobile ? 0 : 320,
      width: responsive.isCompact ? "100%" : "34%",
    },
    focusRing: {
      borderColor: themeColors.focus,
      borderWidth: 2,
    },
    header: {
      alignItems: "center",
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: responsive.isMobile ? 28 : 42,
      width: "100%",
    },
    headerRight: {
      alignItems: "center",
      flexDirection: "row",
      gap: 10,
    },
    heroCopy: {
      flex: 1,
      minWidth: 0,
      paddingRight: responsive.isCompact ? 0 : 20,
    },
    heroEyebrow: {
      color: themeColors.blue,
      fontSize: 12,
      fontWeight: "900",
      letterSpacing: 0,
      textTransform: "uppercase",
    },
    heroRow: {
      alignItems: responsive.isCompact ? "stretch" : "center",
      flexDirection: responsive.isCompact ? "column" : "row",
      flexGrow: 1,
      gap: responsive.isMobile ? 22 : 40,
      justifyContent: "space-between",
      minHeight: responsive.isCompact ? 0 : 420,
      width: "100%",
    },
    heroSubtitle: {
      color: themeColors.ink,
      fontSize: responsive.isMobile ? 17 : 20,
      fontWeight: "700",
      lineHeight: responsive.isMobile ? 25 : 30,
      marginTop: 10,
      maxWidth: 680,
    },
    heroTitle: {
      color: isDark ? themeColors.yellow : "#A6B80F",
      fontSize: responsive.isMobile ? 46 : 68,
      fontWeight: "900",
      lineHeight: responsive.isMobile ? 54 : 76,
      marginTop: 8,
      textShadowColor: "rgba(37, 92, 143, 0.18)",
      textShadowOffset: { width: 0, height: 4 },
      textShadowRadius: 8,
    },
    liveChip: {
      alignItems: "center",
      flexDirection: "row",
    },
    liveDot: {
      backgroundColor: themeColors.success,
      borderRadius: 4,
      height: 8,
      width: 8,
    },
    liveText: {
      color: themeColors.muted,
      fontSize: 12,
      fontWeight: "900",
      marginLeft: 6,
      textTransform: "uppercase",
    },
    panelHeader: {
      alignItems: "center",
      flexDirection: "row",
      justifyContent: "space-between",
    },
    panelTitle: {
      color: themeColors.ink,
      fontSize: 18,
      fontWeight: "900",
    },
    pressed: {
      opacity: 0.82,
      transform: [{ scale: 0.99 }],
    },
    previewDock: {
      alignItems: "center",
      backgroundColor: themeColors.glass,
      borderColor: themeColors.line,
      borderRadius: 8,
      borderWidth: 1,
      flexDirection: "row",
      marginTop: 32,
      minHeight: 70,
      paddingHorizontal: 8,
      ...Platform.select({
        web: {
          backdropFilter: "blur(18px)",
        },
        default: {},
      }),
      ...softShadow(1, themeColors),
    },
    previewItem: {
      alignItems: "center",
      borderRadius: 8,
      flex: 1,
      height: 52,
      justifyContent: "center",
      minWidth: 0,
    },
    previewItemActive: {
      backgroundColor: themeColors.blueSoft,
    },
    previewText: {
      color: themeColors.faint,
      fontSize: responsive.isTiny ? 9 : 10.5,
      fontWeight: "800",
      marginTop: 3,
    },
    previewTextActive: {
      color: themeColors.blue,
    },
    safeArea: {
      flex: 1,
    },
    scrollContent: {
      alignSelf: "center",
      flexGrow: 1,
      maxWidth: 1320,
      padding: responsive.isMobile ? 18 : 42,
      width: "100%",
    },
    statLabel: {
      color: themeColors.muted,
      fontSize: 12,
      fontWeight: "800",
      marginLeft: 4,
    },
    statPill: {
      alignItems: "center",
      backgroundColor: themeColors.glass,
      borderColor: themeColors.line,
      borderRadius: 8,
      borderWidth: 1,
      flexDirection: "row",
      minHeight: 42,
      paddingHorizontal: 11,
    },
    statsRow: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 9,
      marginTop: 20,
    },
    statValue: {
      color: themeColors.ink,
      fontSize: 15,
      fontWeight: "900",
      marginLeft: 7,
    },
    topLink: {
      color: themeColors.muted,
      fontSize: 14,
      fontWeight: "800",
    },
    topLinkActive: {
      color: themeColors.blue,
    },
    topLinkButton: {
      borderRadius: 8,
      minHeight: 40,
      justifyContent: "center",
      paddingHorizontal: 12,
    },
    topLinkButtonActive: {
      backgroundColor: themeColors.blueSoft,
    },
    topLinks: {
      alignItems: "center",
      flexDirection: "row",
      gap: 4,
    },
  });
}
