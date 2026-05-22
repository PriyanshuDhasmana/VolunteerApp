import { Ionicons } from "@expo/vector-icons";
import { useMemo } from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import {
  AnimatedEntrance,
  DashboardShell,
  IconBadge,
  PrimaryButton,
  softShadow,
  tone,
  useResponsive,
} from "../components/VolunteerUI";
import { useToast } from "../context/ToastContext";
import { useVolunteerTheme } from "../context/ThemeContext";
import {
  currentVolunteer,
  impactCards,
  profileStats,
  recentActivity,
} from "../data/mockVolunteerData";

const achievementMeta = [
  { rarity: "Gold", progress: 0.84 },
  { rarity: "Silver", progress: 0.62 },
  { rarity: "Bronze", progress: 0.48 },
  { rarity: "Legendary", progress: 0.28 },
];

export default function ProfileScreen({ navigation }) {
  const theme = useVolunteerTheme();
  const responsive = useResponsive();
  const styles = useMemo(
    () => createStyles(theme.colors, responsive),
    [theme.colors, responsive.width],
  );
  const { showToast } = useToast();

  const infoToast = (title, message) => showToast({ title, message, type: "info" });

  return (
    <DashboardShell active="Profile" navigation={navigation}>
      <View style={styles.profileGrid}>
        <View style={styles.mainColumn}>
          <AnimatedEntrance>
            <View style={styles.heroCard}>
              <Pressable
                accessibilityLabel="Edit cover image"
                accessibilityRole="button"
                onPress={() => infoToast("Cover editor", "Cover image tools are ready.")}
                style={styles.coverButton}
              >
                <Ionicons name="image-outline" size={17} color={theme.colors.textOnAccent} />
                <Text style={styles.coverButtonText}>Cover</Text>
              </Pressable>

              <View style={styles.heroTop}>
                <View style={styles.avatarWrap}>
                  <View style={styles.avatarLarge}>
                    <Text style={styles.avatarText}>PG</Text>
                  </View>
                  <Pressable
                    accessibilityLabel="Edit avatar"
                    accessibilityRole="button"
                    onPress={() => infoToast("Avatar editor", "Profile image action opened.")}
                    style={styles.editAvatarButton}
                  >
                    <Ionicons name="create" size={15} color={theme.colors.blue} />
                  </Pressable>
                </View>
                <View style={styles.heroIdentity}>
                  <View style={styles.nameRow}>
                    <Text style={styles.profileName} numberOfLines={2}>
                      {currentVolunteer.name}
                    </Text>
                    <Ionicons name="checkmark-circle" size={20} color={theme.colors.textOnAccent} />
                  </View>
                  <Text style={styles.levelPill}>Level 3 Volunteer</Text>
                  <View style={styles.xpTrack}>
                    <View style={styles.xpFill} />
                  </View>
                  <Text style={styles.xpText}>320 / 500 XP toward Level 4</Text>
                </View>
                <PrimaryButton
                  icon="create-outline"
                  label="Edit Profile"
                  onPress={() => infoToast("Profile editor", "Editable profile panel opened.")}
                  variant="light"
                  style={styles.editProfileButton}
                />
              </View>

              <View style={styles.contactLine}>
                {[
                  ["mail-outline", currentVolunteer.email],
                  ["call-outline", currentVolunteer.phone],
                  ["location-outline", "Bangalore, India"],
                ].map(([icon, label]) => (
                  <View key={label} style={styles.contactItem}>
                    <Ionicons name={icon} size={16} color={theme.colors.textOnAccent} />
                    <Text style={styles.contactText}>{label}</Text>
                  </View>
                ))}
              </View>
            </View>
          </AnimatedEntrance>

          <AnimatedEntrance delay={120}>
            <View style={styles.statsGrid}>
              {profileStats.map((stat, index) => (
                <View key={stat.label} style={styles.statItem}>
                  <Text style={styles.statValue}>{stat.value}</Text>
                  <Text style={styles.statLabel}>{stat.label}</Text>
                  <View style={styles.sparkline}>
                    <View style={[styles.sparkFill, { width: `${52 + index * 10}%` }]} />
                  </View>
                </View>
              ))}
            </View>
          </AnimatedEntrance>

          <AnimatedEntrance delay={180}>
            <View style={styles.impactPanel}>
              <View style={styles.impactHeader}>
                <View style={styles.impactCopy}>
                  <Text style={styles.impactTitle}>My Impact</Text>
                  <Text style={styles.impactSubtitle}>
                    Warm proof that your time is turning into real community momentum.
                  </Text>
                </View>
                <Pressable
                  accessibilityRole="button"
                  onPress={() => infoToast("Insights", "Detailed impact analytics are ready.")}
                  style={({ pressed, hovered, focused }) => [
                    styles.insightsLink,
                    (pressed || hovered) && styles.pressed,
                    focused && styles.focusRing,
                  ]}
                >
                  <Text style={styles.insightsText}>Insights</Text>
                  <Ionicons name="arrow-forward" size={16} color={theme.colors.blue} />
                </Pressable>
              </View>

              <View style={styles.impactCards}>
                {impactCards.map((impact, index) => (
                  <ImpactCard
                    key={impact.title}
                    impact={impact}
                    meta={achievementMeta[index]}
                    delay={240 + index * 70}
                  />
                ))}
              </View>
            </View>
          </AnimatedEntrance>
        </View>

        <View style={styles.sideColumn}>
          <AnimatedEntrance delay={100}>
            <View style={styles.sideCard}>
              <Text style={styles.sideTitle}>Availability</Text>
              <View style={styles.availabilityRow}>
                <IconBadge icon="location" toneName="blue" size={44} />
                <View style={styles.availabilityCopy}>
                  <View style={styles.availabilityTop}>
                    <Text style={styles.availabilityTitle}>Bangalore</Text>
                    <Pressable
                      accessibilityRole="button"
                      onPress={() => infoToast("Location", "Nearby availability controls opened.")}
                    >
                      <Text style={styles.changeText}>Change</Text>
                    </Pressable>
                  </View>
                  <Text style={styles.availabilityMeta}>Open to nearby requests</Text>
                </View>
              </View>
            </View>
          </AnimatedEntrance>

          <AnimatedEntrance delay={160}>
            <View style={styles.sideCard}>
              <View style={styles.bloodCardRow}>
                <IconBadge icon="water" toneName="red" size={44} />
                <View style={styles.bloodCopy}>
                  <Text style={styles.sideTitleSmall}>Blood Group</Text>
                  <Text style={styles.bloodGroup}>B+</Text>
                  <View style={styles.verifiedRow}>
                    <Ionicons name="shield-checkmark" size={14} color={theme.colors.green} />
                    <Text style={styles.verifiedText}>Verified</Text>
                  </View>
                </View>
              </View>
            </View>
          </AnimatedEntrance>

          <AnimatedEntrance delay={220}>
            <View style={styles.sideCard}>
              <Text style={styles.sideTitle}>Recent Activity</Text>
              <View style={styles.activityList}>
                {recentActivity.map((activity, index) => (
                  <View key={activity} style={styles.activityRow}>
                    <View style={styles.activityRail}>
                      <View style={styles.activityDot} />
                      {index < recentActivity.length - 1 ? <View style={styles.activityLine} /> : null}
                    </View>
                    <View style={styles.activityCopy}>
                      <Text style={styles.activityText}>{activity}</Text>
                      <Text style={styles.activityTime}>
                        {index === 0 ? "2 days ago" : index === 1 ? "5 days ago" : "1 week ago"}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
              <Pressable
                accessibilityRole="button"
                onPress={() => infoToast("Activity", "Full activity timeline opened.")}
                style={({ pressed, hovered }) => [
                  styles.activityButton,
                  (pressed || hovered) && styles.pressed,
                ]}
              >
                <Text style={styles.activityButtonText}>View All Activity</Text>
                <Ionicons name="arrow-forward" size={15} color={theme.colors.blue} />
              </Pressable>
            </View>
          </AnimatedEntrance>
        </View>
      </View>
    </DashboardShell>
  );
}

function ImpactCard({ impact, meta, delay }) {
  const theme = useVolunteerTheme();
  const responsive = useResponsive();
  const styles = useMemo(
    () => createStyles(theme.colors, responsive),
    [theme.colors, responsive.width],
  );
  const selectedTone = tone(impact.tone, theme.colors);

  return (
    <AnimatedEntrance delay={delay} style={styles.impactCardWrap}>
      <View style={styles.impactCard}>
        <View style={styles.achievementTop}>
          <IconBadge icon={impact.icon} toneName={impact.tone} size={48} />
          <View style={[styles.rarityPill, { backgroundColor: selectedTone.bg }]}>
            <Text style={[styles.rarityText, { color: selectedTone.icon }]}>
              {meta.rarity}
            </Text>
          </View>
        </View>
        <Text style={styles.impactCardTitle}>{impact.title}</Text>
        <Text style={styles.impactCardSummary}>{impact.summary}</Text>
        <View style={styles.progressTrack}>
          <View
            style={[
              styles.progressFill,
              { width: `${Math.round(meta.progress * 100)}%`, backgroundColor: selectedTone.icon },
            ]}
          />
        </View>
        <Text style={styles.progressLabel}>{Math.round(meta.progress * 100)}% complete</Text>
      </View>
    </AnimatedEntrance>
  );
}

function createStyles(themeColors, responsive) {
  const isDark = themeColors.mode === "dark";

  return StyleSheet.create({
    achievementTop: {
      alignItems: "flex-start",
      flexDirection: "row",
      justifyContent: "space-between",
    },
    activityButton: {
      alignItems: "center",
      backgroundColor: themeColors.blueSoft,
      borderRadius: 8,
      flexDirection: "row",
      minHeight: 44,
      justifyContent: "center",
      marginTop: 20,
    },
    activityButtonText: {
      color: themeColors.blue,
      fontSize: 13,
      fontWeight: "900",
      marginRight: 8,
    },
    activityCopy: {
      flex: 1,
      minWidth: 0,
      paddingBottom: 18,
    },
    activityDot: {
      backgroundColor: themeColors.blue,
      borderRadius: 6,
      height: 12,
      width: 12,
    },
    activityLine: {
      backgroundColor: themeColors.lineStrong,
      flex: 1,
      marginTop: 6,
      width: 2,
    },
    activityList: {
      marginTop: 18,
    },
    activityRail: {
      alignItems: "center",
      marginRight: 12,
      width: 14,
    },
    activityRow: {
      flexDirection: "row",
    },
    activityText: {
      color: themeColors.ink,
      fontSize: 14,
      fontWeight: "800",
      lineHeight: 19,
    },
    activityTime: {
      color: themeColors.faint,
      fontSize: 12,
      fontWeight: "700",
      marginTop: 5,
    },
    avatarLarge: {
      alignItems: "center",
      backgroundColor: isDark ? themeColors.violetSoft : "#D8D1F6",
      borderColor: "rgba(255,255,255,0.82)",
      borderRadius: 54,
      borderWidth: 4,
      height: 108,
      justifyContent: "center",
      width: 108,
    },
    avatarText: {
      color: themeColors.ink,
      fontSize: 34,
      fontWeight: "900",
    },
    avatarWrap: {
      position: "relative",
    },
    availabilityCopy: {
      flex: 1,
      marginLeft: 14,
      minWidth: 0,
    },
    availabilityMeta: {
      color: themeColors.muted,
      fontSize: 13,
      fontWeight: "700",
      marginTop: 6,
    },
    availabilityRow: {
      alignItems: "center",
      flexDirection: "row",
      marginTop: 18,
    },
    availabilityTitle: {
      color: themeColors.ink,
      fontSize: 16,
      fontWeight: "900",
    },
    availabilityTop: {
      alignItems: "center",
      flexDirection: "row",
      justifyContent: "space-between",
    },
    bloodCardRow: {
      alignItems: "center",
      flexDirection: "row",
      gap: 14,
    },
    bloodCopy: {
      flex: 1,
      minWidth: 0,
    },
    bloodGroup: {
      color: themeColors.ink,
      fontSize: 24,
      fontWeight: "900",
      marginTop: 10,
    },
    changeText: {
      color: themeColors.blue,
      fontSize: 13,
      fontWeight: "900",
    },
    contactItem: {
      alignItems: "center",
      flexDirection: "row",
      marginRight: responsive.isMobile ? 0 : 24,
      minHeight: 34,
    },
    contactLine: {
      alignItems: responsive.isMobile ? "flex-start" : "center",
      flexDirection: "row",
      flexWrap: "wrap",
      gap: responsive.isMobile ? 8 : 0,
      justifyContent: responsive.isMobile ? "flex-start" : "center",
      marginTop: 26,
    },
    contactText: {
      color: themeColors.textOnAccent,
      fontSize: 13,
      fontWeight: "800",
      marginLeft: 8,
    },
    coverButton: {
      alignItems: "center",
      alignSelf: "flex-end",
      backgroundColor: "rgba(255,255,255,0.16)",
      borderColor: "rgba(255,255,255,0.24)",
      borderRadius: 8,
      borderWidth: 1,
      flexDirection: "row",
      minHeight: 38,
      paddingHorizontal: 12,
    },
    coverButtonText: {
      color: themeColors.textOnAccent,
      fontSize: 12,
      fontWeight: "900",
      marginLeft: 6,
    },
    editAvatarButton: {
      alignItems: "center",
      backgroundColor: themeColors.surfaceStrong,
      borderRadius: 8,
      bottom: 6,
      height: 34,
      justifyContent: "center",
      position: "absolute",
      right: 2,
      width: 34,
      ...softShadow(1, themeColors),
    },
    editProfileButton: {
      minWidth: responsive.isMobile ? "100%" : 150,
    },
    focusRing: {
      borderColor: themeColors.focus,
      borderWidth: 2,
    },
    heroCard: {
      backgroundColor: themeColors.blue,
      borderRadius: 8,
      minHeight: 310,
      overflow: "hidden",
      padding: responsive.isMobile ? 20 : 28,
      ...Platform.select({
        web: {
          backgroundImage: isDark
            ? "linear-gradient(135deg, #18365f 0%, #1a596a 52%, #153f33 100%)"
            : "linear-gradient(135deg, #2563b8 0%, #18afc7 52%, #258b69 100%)",
        },
        default: {},
      }),
      ...softShadow(1, themeColors),
    },
    heroIdentity: {
      flex: 1,
      marginLeft: responsive.isMobile ? 0 : 24,
      minWidth: 0,
    },
    heroTop: {
      alignItems: responsive.isMobile ? "center" : "center",
      flexDirection: responsive.isMobile ? "column" : "row",
      gap: responsive.isMobile ? 18 : 0,
      marginTop: 16,
    },
    impactCard: {
      backgroundColor: themeColors.surfaceStrong,
      borderColor: themeColors.line,
      borderRadius: 8,
      borderWidth: 1,
      minHeight: 184,
      padding: 16,
      ...softShadow(1, themeColors),
    },
    impactCardSummary: {
      color: themeColors.muted,
      fontSize: 12,
      fontWeight: "700",
      lineHeight: 17,
      marginTop: 7,
    },
    impactCards: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 14,
      marginTop: 24,
    },
    impactCardTitle: {
      color: themeColors.ink,
      fontSize: 15,
      fontWeight: "900",
      lineHeight: 20,
      marginTop: 16,
    },
    impactCardWrap: {
      flexBasis: responsive.isMobile ? "100%" : responsive.width < 1180 ? "47%" : "22%",
      flexGrow: 1,
      minWidth: responsive.isMobile ? "100%" : 170,
    },
    impactCopy: {
      flex: 1,
      minWidth: 0,
      paddingRight: 12,
    },
    impactHeader: {
      alignItems: responsive.isMobile ? "flex-start" : "center",
      flexDirection: responsive.isMobile ? "column" : "row",
      gap: 12,
      justifyContent: "space-between",
    },
    impactPanel: {
      backgroundColor: themeColors.glass,
      borderColor: themeColors.line,
      borderRadius: 8,
      borderWidth: 1,
      marginTop: 24,
      padding: responsive.isMobile ? 18 : 24,
      ...softShadow(1, themeColors),
    },
    impactSubtitle: {
      color: themeColors.muted,
      fontSize: 13,
      fontWeight: "700",
      lineHeight: 19,
      marginTop: 6,
    },
    impactTitle: {
      color: themeColors.ink,
      fontSize: 22,
      fontWeight: "900",
      lineHeight: 28,
    },
    insightsLink: {
      alignItems: "center",
      flexDirection: "row",
      gap: 8,
      minHeight: 44,
    },
    insightsText: {
      color: themeColors.blue,
      fontSize: 13,
      fontWeight: "900",
    },
    levelPill: {
      alignSelf: responsive.isMobile ? "center" : "flex-start",
      backgroundColor: themeColors.yellowSoft,
      borderRadius: 8,
      color: themeColors.warning,
      fontSize: 12,
      fontWeight: "900",
      marginTop: 12,
      paddingHorizontal: 14,
      paddingVertical: 6,
    },
    mainColumn: {
      flex: 1,
      minWidth: 0,
    },
    nameRow: {
      alignItems: "center",
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 8,
      justifyContent: responsive.isMobile ? "center" : "flex-start",
    },
    profileGrid: {
      flexDirection: responsive.isCompact ? "column" : "row",
      gap: 24,
    },
    profileName: {
      color: themeColors.textOnAccent,
      fontSize: responsive.isMobile ? 25 : 29,
      fontWeight: "900",
      lineHeight: responsive.isMobile ? 31 : 36,
      textAlign: responsive.isMobile ? "center" : "left",
    },
    progressFill: {
      borderRadius: 8,
      height: "100%",
    },
    progressLabel: {
      color: themeColors.faint,
      fontSize: 12,
      fontWeight: "800",
      marginTop: 8,
    },
    progressTrack: {
      backgroundColor: themeColors.surfaceMuted,
      borderRadius: 8,
      height: 8,
      marginTop: 16,
      overflow: "hidden",
    },
    rarityPill: {
      borderRadius: 8,
      paddingHorizontal: 10,
      paddingVertical: 5,
    },
    rarityText: {
      fontSize: 11,
      fontWeight: "900",
      textTransform: "uppercase",
    },
    sideCard: {
      backgroundColor: themeColors.surfaceStrong,
      borderColor: themeColors.line,
      borderRadius: 8,
      borderWidth: 1,
      padding: 20,
      ...softShadow(1, themeColors),
    },
    sideColumn: {
      gap: 18,
      width: responsive.isCompact ? "100%" : 350,
    },
    sideTitle: {
      color: themeColors.ink,
      fontSize: 18,
      fontWeight: "900",
    },
    sideTitleSmall: {
      color: themeColors.ink,
      fontSize: 16,
      fontWeight: "900",
    },
    sparkFill: {
      backgroundColor: themeColors.blue,
      borderRadius: 8,
      height: "100%",
    },
    sparkline: {
      backgroundColor: themeColors.blueSoft,
      borderRadius: 8,
      height: 7,
      marginTop: 12,
      overflow: "hidden",
      width: "100%",
    },
    statItem: {
      alignItems: "flex-start",
      backgroundColor: themeColors.surfaceStrong,
      borderColor: themeColors.line,
      borderRadius: 8,
      borderWidth: 1,
      flex: 1,
      minHeight: 112,
      minWidth: responsive.isMobile ? "100%" : 156,
      padding: 16,
      ...softShadow(1, themeColors),
    },
    statLabel: {
      color: themeColors.muted,
      fontSize: 12,
      fontWeight: "800",
      lineHeight: 16,
      marginTop: 5,
    },
    statsGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 12,
      marginTop: responsive.isMobile ? 14 : -34,
      paddingHorizontal: responsive.isMobile ? 0 : 24,
    },
    statValue: {
      color: themeColors.ink,
      fontSize: 27,
      fontWeight: "900",
      lineHeight: 32,
    },
    verifiedRow: {
      alignItems: "center",
      flexDirection: "row",
      marginTop: 10,
    },
    verifiedText: {
      color: themeColors.green,
      fontSize: 12,
      fontWeight: "900",
      marginLeft: 6,
    },
    xpFill: {
      backgroundColor: themeColors.textOnAccent,
      borderRadius: 8,
      height: "100%",
      width: "64%",
    },
    xpText: {
      color: themeColors.textOnAccent,
      fontSize: 13,
      fontWeight: "900",
      marginTop: 8,
      textAlign: responsive.isMobile ? "center" : "left",
    },
    xpTrack: {
      backgroundColor: "rgba(255,255,255,0.24)",
      borderRadius: 8,
      height: 10,
      marginTop: 16,
      maxWidth: responsive.isMobile ? "100%" : 280,
      overflow: "hidden",
      width: responsive.isMobile ? "100%" : undefined,
    },
    pressed: {
      opacity: 0.82,
      transform: [{ scale: 0.99 }],
    },
  });
}
