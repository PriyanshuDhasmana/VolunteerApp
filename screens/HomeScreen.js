import { Ionicons } from "@expo/vector-icons";
import { useMemo, useState } from "react";
import {
  Pressable,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import {
  AnimatedEntrance,
  Avatar,
  DashboardShell,
  IconBadge,
  IconButton,
  LivePulse,
  PrimaryButton,
  SearchBar,
  ThemeToggle,
  softShadow,
  tone,
  useResponsive,
} from "../components/VolunteerUI";
import { useToast } from "../context/ToastContext";
import { useVolunteerTheme } from "../context/ThemeContext";
import {
  causeCategories,
  currentVolunteer,
  recentRequests,
  urgentRequests,
} from "../data/mockVolunteerData";

const sortOptions = ["Newest", "Nearest", "Urgent"];

export default function HomeScreen({ navigation }) {
  const theme = useVolunteerTheme();
  const responsive = useResponsive();
  const styles = useMemo(
    () => createStyles(theme.colors, responsive),
    [theme.colors, responsive.width],
  );
  const { showToast } = useToast();
  const [activeCategory, setActiveCategory] = useState("all");
  const [nearbyOnly, setNearbyOnly] = useState(true);
  const [sortBy, setSortBy] = useState("Newest");
  const [search, setSearch] = useState("");

  const filteredRequests = useMemo(() => {
    const query = search.trim().toLowerCase();
    return recentRequests.filter((request) => {
      const matchesCategory =
        activeCategory === "all" ||
        request.title.toLowerCase().includes(activeCategory) ||
        request.tone === activeCategory ||
        (activeCategory === "animals" && request.title.toLowerCase().includes("animal")) ||
        (activeCategory === "environment" && request.title.toLowerCase().includes("plantation"));
      const matchesSearch =
        !query ||
        request.title.toLowerCase().includes(query) ||
        request.summary.toLowerCase().includes(query) ||
        request.postedBy.toLowerCase().includes(query);
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, search]);

  const notify = (title, message, type = "success") => {
    showToast({ title, message, type });
  };

  return (
    <DashboardShell active="Home" navigation={navigation}>
      <View style={styles.topBar}>
        <View style={styles.heroCopy}>
          <View style={styles.greetingLine}>
            <Text style={styles.greeting}>Hey Priyanshu</Text>
            <LivePulse toneName="green" label="12 helped today" />
          </View>
          <Text style={styles.subGreeting}>
            Nearby needs, trusted NGOs, and small acts that add up fast.
          </Text>
        </View>
        <View style={styles.topActions}>
          {!responsive.isMobile ? (
            <PrimaryButton
              icon="add"
              label="Create Request"
              onPress={() => navigation.navigate("VolunteerEvents")}
              style={styles.createRequestButton}
            />
          ) : null}
          <IconButton
            icon="notifications-outline"
            label="Notifications"
            onPress={() => navigation.navigate("Notifications")}
            toneName="pink"
          />
          <ThemeToggle compact={responsive.width < 1180} />
          <Pressable
            accessibilityLabel="Open profile"
            accessibilityRole="button"
            onPress={() => navigation.navigate("Profile")}
          >
            <Avatar initials={currentVolunteer.avatarInitials} size={50} />
          </Pressable>
        </View>
      </View>

      <AnimatedEntrance>
        <View style={styles.heroStats}>
          {[
            ["people", "12", "people helped today", "green"],
            ["alert-circle", "3", "urgent nearby", "red"],
            ["calendar", "4", "events this week", "blue"],
          ].map(([icon, value, label, toneName]) => (
            <View key={label} style={styles.heroStat}>
              <IconBadge icon={icon} toneName={toneName} size={38} />
              <View style={styles.heroStatCopy}>
                <Text style={styles.heroStatValue}>{value}</Text>
                <Text style={styles.heroStatLabel}>{label}</Text>
              </View>
            </View>
          ))}
        </View>
      </AnimatedEntrance>

      <AnimatedEntrance delay={70}>
        <View style={styles.urgentPanel}>
          <View style={styles.panelHeader}>
            <View style={styles.panelHeaderLeft}>
              <IconBadge icon="water" toneName="red" size={48} />
              <View style={styles.panelHeaderCopy}>
                <Text style={styles.panelTitle}>Urgent Requests Near You</Text>
                <Text style={styles.panelSubtitle}>
                  Live requests with location and response status.
                </Text>
              </View>
            </View>
            <Pressable
              accessibilityRole="button"
              onPress={() => navigation.navigate("BloodDonation")}
              style={({ pressed, hovered }) => [
                styles.viewAllButton,
                (pressed || hovered) && styles.pressed,
              ]}
            >
              <Text style={styles.viewAllText}>View All</Text>
              <Ionicons name="arrow-forward" size={16} color={theme.colors.red} />
            </Pressable>
          </View>

          <ScrollView
            horizontal={responsive.isMobile}
            showsHorizontalScrollIndicator={false}
            snapToInterval={responsive.isMobile ? Math.max(responsive.width - 52, 268) : undefined}
            decelerationRate="fast"
            contentContainerStyle={[
              styles.urgentCards,
              responsive.isMobile && styles.urgentCardsMobile,
            ]}
          >
            {urgentRequests.map((request, index) => (
              <UrgentCard
                key={request.id}
                request={request}
                delay={index * 70}
                onPress={() => navigation.navigate("BloodDonation")}
                width={responsive.isMobile ? Math.max(responsive.width - 52, 268) : undefined}
              />
            ))}
          </ScrollView>
        </View>
      </AnimatedEntrance>

      <AnimatedEntrance delay={130}>
        <View style={styles.searchFiltersPanel}>
          <View style={styles.searchRow}>
            <SearchBar value={search} onChangeText={setSearch} />
            {!responsive.isMobile ? (
              <PrimaryButton
                icon={nearbyOnly ? "location" : "location-outline"}
                label={nearbyOnly ? "Nearby On" : "Nearby Off"}
                variant="light"
                onPress={() => setNearbyOnly((current) => !current)}
                style={styles.nearbyButton}
              />
            ) : null}
          </View>
          <ScrollView
            horizontal={responsive.isMobile}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filters}
          >
            {causeCategories.map((category) => (
              <Pressable
                key={category.key}
                accessibilityRole="button"
                accessibilityState={{ selected: activeCategory === category.key }}
                onPress={() => setActiveCategory(category.key)}
                style={({ pressed, hovered, focused }) => [
                  styles.filterPill,
                  activeCategory === category.key && styles.filterPillActive(category.tone),
                  (pressed || hovered) && styles.pressed,
                  focused && styles.focusRing,
                ]}
              >
                <Ionicons
                  name={category.icon}
                  size={16}
                  color={
                    activeCategory === category.key
                      ? tone(category.tone, theme.colors).icon
                      : theme.colors.muted
                  }
                />
                <Text
                  style={[
                    styles.filterText,
                    activeCategory === category.key && styles.filterTextActive,
                  ]}
                >
                  {category.label}
                </Text>
              </Pressable>
            ))}
            <Pressable
              accessibilityRole="switch"
              accessibilityState={{ checked: nearbyOnly }}
              onPress={() => setNearbyOnly((current) => !current)}
              style={({ pressed, hovered }) => [
                styles.filterPill,
                nearbyOnly && styles.filterPillActive("blue"),
                (pressed || hovered) && styles.pressed,
              ]}
            >
              <Ionicons
                name={nearbyOnly ? "location" : "location-outline"}
                size={16}
                color={nearbyOnly ? theme.colors.blue : theme.colors.muted}
              />
              <Text style={[styles.filterText, nearbyOnly && styles.filterTextActive]}>
                Nearby
              </Text>
            </Pressable>
          </ScrollView>
          <View style={styles.sortRow}>
            {sortOptions.map((option) => (
              <Pressable
                key={option}
                accessibilityRole="button"
                accessibilityState={{ selected: sortBy === option }}
                onPress={() => setSortBy(option)}
                style={({ pressed, hovered }) => [
                  styles.sortChip,
                  sortBy === option && styles.sortChipActive,
                  (pressed || hovered) && styles.pressed,
                ]}
              >
                <Text
                  style={[
                    styles.sortChipText,
                    sortBy === option && styles.sortChipTextActive,
                  ]}
                >
                  {option}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
      </AnimatedEntrance>

      <AnimatedEntrance delay={190}>
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>Recent Requests & Updates</Text>
            <Text style={styles.sectionSubtitle}>
              Sorted by {sortBy.toLowerCase()}
              {nearbyOnly ? " within your area" : " across the network"}.
            </Text>
          </View>
        </View>
        <View style={styles.recentGrid}>
          {filteredRequests.map((request, index) => (
            <RecentCard
              key={request.id}
              request={request}
              delay={220 + index * 70}
              onOpen={() =>
                request.tone === "red"
                  ? navigation.navigate("BloodDonation")
                  : navigation.navigate("VolunteerEvents")
              }
              onSave={() => notify("Saved", `${request.title} is in your saved list.`)}
              onShare={() => notify("Share link ready", "A shareable update was prepared.", "info")}
              onVolunteer={() => navigation.navigate("VolunteerEvents")}
              onContact={() => notify("Contact opened", "Coordinator details are ready.", "info")}
            />
          ))}
          {filteredRequests.length === 0 ? (
            <View style={styles.emptyList}>
              <Text style={styles.emptyTitle}>No matching requests</Text>
              <Text style={styles.emptyText}>
                Try another cause, turn off nearby, or clear your search.
              </Text>
            </View>
          ) : null}
        </View>
      </AnimatedEntrance>

      {!responsive.isMobile ? (
        <Pressable
          accessibilityLabel="Create quick action"
          accessibilityRole="button"
          onPress={() => navigation.navigate("VolunteerEvents")}
          style={({ pressed, hovered }) => [
            styles.floatingButton,
            (pressed || hovered) && styles.floatingButtonOpen,
          ]}
        >
          <Ionicons name="add" size={30} color={theme.colors.textOnAccent} />
        </Pressable>
      ) : null}
    </DashboardShell>
  );
}

function UrgentCard({ request, delay, onPress, width }) {
  const theme = useVolunteerTheme();
  const responsive = useResponsive();
  const styles = useMemo(
    () => createStyles(theme.colors, responsive),
    [theme.colors, responsive.width],
  );
  const selectedTone = tone(request.tone, theme.colors);

  return (
    <AnimatedEntrance delay={delay} style={[styles.urgentCardWrap, width ? { width } : null]}>
      <Pressable
        accessibilityLabel={`${request.title}, ${request.urgency}`}
        accessibilityRole="button"
        onPress={onPress}
        style={({ pressed, hovered, focused }) => [
          styles.urgentCard,
          { borderLeftColor: selectedTone.icon },
          (pressed || hovered) && styles.cardHover,
          pressed && styles.pressed,
          focused && styles.focusRing,
        ]}
      >
        <IconBadge icon={request.icon} toneName={request.tone} size={54} />
        <View style={styles.requestCopy}>
          <View style={styles.urgentLine}>
            <View style={[styles.badge, { backgroundColor: selectedTone.bg }]}>
              <Text style={[styles.badgeText, { color: selectedTone.icon }]}>
                {request.urgency}
              </Text>
            </View>
            <LivePulse toneName={request.tone} label="live" />
          </View>
          <Text style={styles.requestTitle} numberOfLines={2}>{request.title}</Text>
          <Text style={styles.requestMeta} numberOfLines={1}>{request.person}</Text>
          <View style={styles.requestFooter}>
            <Ionicons name="location-outline" size={13} color={theme.colors.faint} />
            <Text style={styles.footerText}>{request.distance}</Text>
            <Ionicons name="time-outline" size={13} color={theme.colors.faint} />
            <Text style={styles.footerText}>{request.time}</Text>
          </View>
        </View>
        <View style={styles.nextButton}>
          <Ionicons name="chevron-forward" size={20} color={theme.colors.ink} />
        </View>
      </Pressable>
    </AnimatedEntrance>
  );
}

function RecentCard({
  request,
  delay,
  onOpen,
  onSave,
  onShare,
  onVolunteer,
  onContact,
}) {
  const theme = useVolunteerTheme();
  const responsive = useResponsive();
  const styles = useMemo(
    () => createStyles(theme.colors, responsive),
    [theme.colors, responsive.width],
  );

  return (
    <AnimatedEntrance delay={delay} style={styles.recentCardWrap}>
      <View style={styles.recentCard}>
        <Pressable
          accessibilityLabel={request.title}
          accessibilityRole="button"
          onPress={onOpen}
          style={({ pressed, hovered, focused }) => [
            styles.recentOpenArea,
            (pressed || hovered) && styles.cardHover,
            pressed && styles.pressed,
            focused && styles.focusRing,
          ]}
        >
          <View style={styles.recentTop}>
            <IconBadge icon={request.icon} toneName={request.tone} size={42} />
            <View style={styles.recentCopy}>
              <Text style={styles.recentTitle} numberOfLines={2}>{request.title}</Text>
              <Text style={styles.recentSummary} numberOfLines={2}>{request.summary}</Text>
            </View>
          </View>
          <View style={styles.recentDivider} />
          <View style={styles.recentFooter}>
            <Text style={styles.footerText}>Posted by {request.postedBy}</Text>
            <Text style={styles.footerText}>{request.distance}</Text>
            <Text style={styles.footerText}>{request.time}</Text>
          </View>
        </Pressable>
        <View style={styles.actionBar}>
          {[
            ["bookmark-outline", "Save", onSave],
            ["share-social-outline", "Share", onShare],
            ["hand-left-outline", "Volunteer", onVolunteer],
            ["call-outline", "Contact", onContact],
          ].map(([icon, label, handler]) => (
            <Pressable
              key={label}
              accessibilityLabel={label}
              accessibilityRole="button"
              onPress={handler}
              style={({ pressed, hovered }) => [
                styles.cardAction,
                (pressed || hovered) && styles.pressed,
              ]}
            >
              <Ionicons name={icon} size={16} color={theme.colors.blue} />
              <Text style={styles.cardActionText}>{label}</Text>
            </Pressable>
          ))}
        </View>
      </View>
    </AnimatedEntrance>
  );
}

function createStyles(themeColors, responsive) {
  const isDark = themeColors.mode === "dark";

  const base = StyleSheet.create({
    actionBar: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 8,
      marginTop: 14,
    },
    badge: {
      alignSelf: "flex-start",
      borderRadius: 8,
      paddingHorizontal: 10,
      paddingVertical: 4,
    },
    badgeText: {
      fontSize: 11,
      fontWeight: "900",
      textTransform: "uppercase",
    },
    cardAction: {
      alignItems: "center",
      backgroundColor: themeColors.blueSoft,
      borderRadius: 8,
      flexDirection: "row",
      minHeight: 36,
      paddingHorizontal: 10,
    },
    cardActionText: {
      color: themeColors.blue,
      fontSize: 12,
      fontWeight: "900",
      marginLeft: 5,
    },
    cardHover: {
      transform: [{ translateY: -2 }],
    },
    createRequestButton: {
      minWidth: 178,
      ...softShadow(1, themeColors),
    },
    emptyList: {
      alignItems: "center",
      backgroundColor: themeColors.glass,
      borderColor: themeColors.line,
      borderRadius: 8,
      borderWidth: 1,
      padding: 24,
      width: "100%",
    },
    emptyText: {
      color: themeColors.muted,
      fontSize: 14,
      fontWeight: "700",
      lineHeight: 20,
      marginTop: 6,
      textAlign: "center",
    },
    emptyTitle: {
      color: themeColors.ink,
      fontSize: 18,
      fontWeight: "900",
    },
    filterPill: {
      alignItems: "center",
      backgroundColor: themeColors.surfaceStrong,
      borderColor: themeColors.line,
      borderRadius: 8,
      borderWidth: 1,
      flexDirection: "row",
      minHeight: 44,
      paddingHorizontal: 13,
      paddingVertical: 8,
    },
    filters: {
      flexDirection: "row",
      flexWrap: responsive.isMobile ? "nowrap" : "wrap",
      gap: 10,
      paddingRight: responsive.isMobile ? 16 : 0,
    },
    filterText: {
      color: themeColors.muted,
      fontSize: 14,
      fontWeight: "800",
      marginLeft: 8,
    },
    filterTextActive: {
      color: themeColors.ink,
    },
    floatingButton: {
      alignItems: "center",
      backgroundColor: themeColors.blue,
      borderRadius: 8,
      bottom: 34,
      height: 58,
      justifyContent: "center",
      position: "absolute",
      right: 30,
      width: 58,
      ...softShadow(2, themeColors),
    },
    floatingButtonOpen: {
      transform: [{ translateY: -2 }, { scale: 1.02 }],
    },
    focusRing: {
      borderColor: themeColors.focus,
      borderWidth: 2,
    },
    footerText: {
      color: themeColors.faint,
      fontSize: 12,
      fontWeight: "800",
      marginRight: 12,
      marginTop: 2,
    },
    greeting: {
      color: themeColors.ink,
      fontSize: responsive.isMobile ? 28 : 34,
      fontWeight: "900",
      lineHeight: responsive.isMobile ? 34 : 41,
    },
    greetingLine: {
      alignItems: responsive.isMobile ? "flex-start" : "center",
      flexDirection: responsive.isMobile ? "column" : "row",
      gap: 10,
    },
    heroCopy: {
      flex: 1,
      minWidth: 0,
    },
    heroStat: {
      alignItems: "center",
      backgroundColor: themeColors.glass,
      borderColor: themeColors.line,
      borderRadius: 8,
      borderWidth: 1,
      flex: 1,
      flexDirection: "row",
      minHeight: 74,
      minWidth: responsive.isMobile ? "100%" : 188,
      padding: 14,
      ...softShadow(1, themeColors),
    },
    heroStatCopy: {
      flex: 1,
      marginLeft: 12,
      minWidth: 0,
    },
    heroStatLabel: {
      color: themeColors.muted,
      fontSize: 12,
      fontWeight: "800",
      lineHeight: 16,
      marginTop: 2,
    },
    heroStats: {
      flexDirection: responsive.isMobile ? "column" : "row",
      gap: 12,
      marginTop: 22,
    },
    heroStatValue: {
      color: themeColors.ink,
      fontSize: 23,
      fontWeight: "900",
      lineHeight: 28,
    },
    nearbyButton: {
      minWidth: 132,
    },
    nextButton: {
      alignItems: "center",
      backgroundColor: themeColors.surfaceStrong,
      borderColor: themeColors.line,
      borderRadius: 8,
      borderWidth: 1,
      height: 44,
      justifyContent: "center",
      marginLeft: 10,
      width: 44,
      ...softShadow(1, themeColors),
    },
    panelHeader: {
      alignItems: responsive.isMobile ? "flex-start" : "center",
      flexDirection: responsive.isMobile ? "column" : "row",
      gap: 14,
      justifyContent: "space-between",
      marginBottom: 18,
    },
    panelHeaderCopy: {
      flex: 1,
      minWidth: 0,
    },
    panelHeaderLeft: {
      alignItems: "center",
      flex: 1,
      flexDirection: "row",
      gap: 14,
      minWidth: 0,
    },
    panelSubtitle: {
      color: themeColors.muted,
      fontSize: 13,
      fontWeight: "700",
      lineHeight: 18,
      marginTop: 5,
    },
    panelTitle: {
      color: themeColors.ink,
      fontSize: 18,
      fontWeight: "900",
      lineHeight: 23,
    },
    pressed: {
      opacity: 0.82,
      transform: [{ scale: 0.99 }],
    },
    recentCard: {
      backgroundColor: themeColors.surfaceStrong,
      borderColor: themeColors.line,
      borderRadius: 8,
      borderWidth: 1,
      minHeight: 210,
      padding: 16,
      ...softShadow(1, themeColors),
    },
    recentCardWrap: {
      flexBasis: responsive.isMobile ? "100%" : responsive.width < 1160 ? "47%" : "31%",
      flexGrow: 1,
      minWidth: responsive.isMobile ? "100%" : 260,
    },
    recentCopy: {
      flex: 1,
      marginLeft: 13,
      minWidth: 0,
    },
    recentDivider: {
      backgroundColor: themeColors.line,
      height: 1,
      marginVertical: 14,
    },
    recentFooter: {
      flexDirection: "row",
      flexWrap: "wrap",
    },
    recentGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 16,
    },
    recentOpenArea: {
      borderRadius: 8,
    },
    recentSummary: {
      color: themeColors.muted,
      fontSize: 13,
      fontWeight: "700",
      lineHeight: 19,
      marginTop: 5,
    },
    recentTitle: {
      color: themeColors.ink,
      fontSize: 16,
      fontWeight: "900",
      lineHeight: 21,
    },
    recentTop: {
      alignItems: "flex-start",
      flexDirection: "row",
    },
    requestCopy: {
      flex: 1,
      marginLeft: 14,
      minWidth: 0,
    },
    requestFooter: {
      alignItems: "center",
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 3,
      marginTop: 14,
    },
    requestMeta: {
      color: themeColors.muted,
      fontSize: 13,
      fontWeight: "700",
      marginTop: 5,
    },
    requestTitle: {
      color: themeColors.ink,
      fontSize: 16,
      fontWeight: "900",
      lineHeight: 21,
    },
    searchFiltersPanel: {
      backgroundColor: themeColors.glass,
      borderColor: themeColors.line,
      borderRadius: 8,
      borderWidth: 1,
      gap: 12,
      marginTop: 24,
      padding: 14,
      zIndex: 2,
      ...softShadow(1, themeColors),
      ...Platform.select({
        web: {
          backdropFilter: "blur(18px)",
          position: "sticky",
          top: 0,
        },
        default: {},
      }),
    },
    searchRow: {
      alignItems: "center",
      flexDirection: responsive.isMobile ? "column" : "row",
      gap: 12,
    },
    sectionHeader: {
      marginBottom: 18,
      marginTop: 26,
    },
    sectionSubtitle: {
      color: themeColors.muted,
      fontSize: 13,
      fontWeight: "700",
      lineHeight: 18,
      marginTop: 5,
    },
    sectionTitle: {
      color: themeColors.ink,
      fontSize: 21,
      fontWeight: "900",
      lineHeight: 27,
    },
    sortChip: {
      alignItems: "center",
      backgroundColor: isDark ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.5)",
      borderColor: themeColors.line,
      borderRadius: 8,
      borderWidth: 1,
      minHeight: 36,
      paddingHorizontal: 12,
      justifyContent: "center",
    },
    sortChipActive: {
      backgroundColor: themeColors.blueSoft,
      borderColor: themeColors.blue,
    },
    sortChipText: {
      color: themeColors.muted,
      fontSize: 12,
      fontWeight: "900",
    },
    sortChipTextActive: {
      color: themeColors.blue,
    },
    sortRow: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 8,
    },
    subGreeting: {
      color: themeColors.muted,
      fontSize: 15,
      fontWeight: "700",
      lineHeight: 22,
      marginTop: 8,
      maxWidth: 620,
    },
    topActions: {
      alignItems: "center",
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 10,
      justifyContent: responsive.isMobile ? "flex-start" : "flex-end",
    },
    topBar: {
      alignItems: responsive.isMobile ? "flex-start" : "center",
      flexDirection: responsive.isMobile ? "column" : "row",
      gap: 18,
      justifyContent: "space-between",
    },
    urgentCard: {
      alignItems: "center",
      backgroundColor: themeColors.surfaceStrong,
      borderColor: themeColors.line,
      borderLeftWidth: 4,
      borderRadius: 8,
      borderWidth: 1,
      flexDirection: "row",
      minHeight: 144,
      padding: responsive.isMobile ? 15 : 18,
      ...softShadow(1, themeColors),
    },
    urgentCardWrap: {
      flex: 1,
      minWidth: responsive.isMobile ? 268 : 260,
    },
    urgentCards: {
      flexDirection: "row",
      gap: 16,
    },
    urgentCardsMobile: {
      paddingRight: 6,
    },
    urgentLine: {
      alignItems: "center",
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 9,
      marginBottom: 8,
    },
    urgentPanel: {
      backgroundColor: themeColors.redSoft,
      borderColor: isDark ? "rgba(255,124,150,0.22)" : "#FFD1DC",
      borderRadius: 8,
      borderWidth: 1,
      marginTop: 24,
      overflow: "hidden",
      padding: responsive.isMobile ? 16 : 20,
      ...softShadow(1, themeColors),
    },
    viewAllButton: {
      alignItems: "center",
      flexDirection: "row",
      gap: 8,
      minHeight: 44,
      paddingHorizontal: 4,
    },
    viewAllText: {
      color: themeColors.red,
      fontSize: 14,
      fontWeight: "900",
    },
  });

  base.filterPillActive = (toneName) => ({
    backgroundColor: tone(toneName, themeColors).bg,
    borderColor: tone(toneName, themeColors).icon,
  });

  return base;
}
