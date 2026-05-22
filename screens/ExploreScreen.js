import { Ionicons } from "@expo/vector-icons";
import { useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import {
  AnimatedEntrance,
  EmptyState,
  FeedCard,
  FilterPill,
  IconBadge,
  MetricTile,
  ScreenScaffold,
  SearchBar,
  SectionTitle,
  softShadow,
  useResponsive,
} from "../components/VolunteerUI";
import { useToast } from "../context/ToastContext";
import { useVolunteerTheme } from "../context/ThemeContext";
import {
  causeCategories,
  currentVolunteer,
  exploreCauses,
  feedItems,
  impactSummary,
} from "../data/mockVolunteerData";

export default function ExploreScreen({ navigation }) {
  const theme = useVolunteerTheme();
  const responsive = useResponsive();
  const styles = useMemo(
    () => createStyles(theme.colors, responsive),
    [theme.colors, responsive.width],
  );
  const { showToast } = useToast();
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  const results = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return feedItems.filter((item) => {
      const matchesQuery =
        !normalized ||
        item.title.toLowerCase().includes(normalized) ||
        item.summary.toLowerCase().includes(normalized) ||
        item.location.toLowerCase().includes(normalized);
      const matchesCategory =
        activeCategory === "all" ||
        item.type.toLowerCase().includes(activeCategory) ||
        item.tone === activeCategory ||
        (activeCategory === "animals" && item.type.toLowerCase().includes("animal")) ||
        (activeCategory === "environment" && item.type.toLowerCase().includes("plantation"));
      return matchesQuery && matchesCategory;
    });
  }, [activeCategory, query]);

  const openItem = (item) => {
    if (item.tone === "red") {
      navigation.navigate("BloodDonation");
      return;
    }
    navigation.navigate("VolunteerEvents");
  };

  return (
    <ScreenScaffold active="Explore" navigation={navigation} user={currentVolunteer}>
      <AnimatedEntrance>
        <View style={styles.hero}>
          <View style={styles.heroCopy}>
            <Text style={styles.eyebrow}>Explore</Text>
            <Text style={styles.title}>Find the right way to help today.</Text>
            <Text style={styles.subtitle}>
              Search live requests, NGO work, animal care, blood needs, and drives near you.
            </Text>
          </View>
          <View style={styles.heroSignal}>
            <IconBadge icon="location" toneName="blue" size={48} />
            <View style={styles.heroSignalCopy}>
              <Text style={styles.heroSignalTitle}>Bangalore</Text>
              <Text style={styles.heroSignalText}>9 trusted causes nearby</Text>
            </View>
          </View>
        </View>
      </AnimatedEntrance>

      <AnimatedEntrance delay={80}>
        <View style={styles.searchPanel}>
          <SearchBar value={query} onChangeText={setQuery} />
          <ScrollView
            horizontal={responsive.isMobile}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filters}
          >
            {causeCategories.map((category) => (
              <FilterPill
                key={category.key}
                item={category}
                active={activeCategory === category.key}
                onPress={() => setActiveCategory(category.key)}
              />
            ))}
          </ScrollView>
        </View>
      </AnimatedEntrance>

      <AnimatedEntrance delay={120}>
        <SectionTitle
          title="Impact Categories"
          subtitle="Swipe on mobile or scan the full grid on larger screens."
        />
        <View style={styles.categoryGrid}>
          {exploreCauses.map((cause, index) => (
            <Pressable
              key={cause.id}
              accessibilityLabel={cause.label}
              accessibilityRole="button"
              onPress={() => {
                setActiveCategory(cause.id === "plantation" ? "environment" : cause.id);
                showToast({
                  title: "Filter applied",
                  message: `${cause.label} is now in focus.`,
                  type: "info",
                });
              }}
              style={({ pressed, hovered, focused }) => [
                styles.categoryCard,
                (pressed || hovered) && styles.cardHover,
                focused && styles.focusRing,
              ]}
            >
              <IconBadge icon={cause.icon} toneName={cause.tone} size={44} />
              <Text style={styles.categoryTitle}>{cause.label}</Text>
              <Text style={styles.categoryMeta}>
                {index + 2} active opportunities
              </Text>
            </Pressable>
          ))}
        </View>
      </AnimatedEntrance>

      <AnimatedEntrance delay={160}>
        <SectionTitle title="Network Impact" />
        <View style={styles.metricGrid}>
          {impactSummary.map((item) => (
            <MetricTile key={item.label} item={item} />
          ))}
        </View>
      </AnimatedEntrance>

      <AnimatedEntrance delay={210}>
        <SectionTitle title="Live Matches" />
        <View style={styles.resultsList}>
          {results.map((item) => (
            <FeedCard
              key={item.id}
              item={item}
              onPress={() => openItem(item)}
              actions={
                <>
                  <ActionChip
                    icon="bookmark-outline"
                    label="Save"
                    onPress={() =>
                      showToast({
                        title: "Saved",
                        message: `${item.title} added to your saved causes.`,
                      })
                    }
                  />
                  <ActionChip
                    icon="share-social-outline"
                    label="Share"
                    onPress={() =>
                      showToast({
                        title: "Share ready",
                        message: "A shareable impact card was prepared.",
                        type: "info",
                      })
                    }
                  />
                </>
              }
            />
          ))}
          {results.length === 0 ? (
            <EmptyState
              icon="search"
              title="No matches yet"
              message="Try a broader category or search by location, NGO, or cause type."
              actionLabel="Clear Search"
              onAction={() => {
                setQuery("");
                setActiveCategory("all");
              }}
            />
          ) : null}
        </View>
      </AnimatedEntrance>
    </ScreenScaffold>
  );
}

function ActionChip({ icon, label, onPress }) {
  const theme = useVolunteerTheme();
  const responsive = useResponsive();
  const styles = useMemo(
    () => createStyles(theme.colors, responsive),
    [theme.colors, responsive.width],
  );

  return (
    <Pressable
      accessibilityLabel={label}
      accessibilityRole="button"
      onPress={(event) => {
        event?.stopPropagation?.();
        onPress();
      }}
      style={({ pressed, hovered }) => [
        styles.actionChip,
        (pressed || hovered) && styles.pressed,
      ]}
    >
      <Ionicons name={icon} size={16} color={theme.colors.blue} />
      <Text style={styles.actionChipText}>{label}</Text>
    </Pressable>
  );
}

function createStyles(themeColors, responsive) {
  return StyleSheet.create({
    actionChip: {
      alignItems: "center",
      backgroundColor: themeColors.blueSoft,
      borderRadius: 8,
      flexDirection: "row",
      minHeight: 36,
      paddingHorizontal: 10,
    },
    actionChipText: {
      color: themeColors.blue,
      fontSize: 12,
      fontWeight: "900",
      marginLeft: 5,
    },
    cardHover: {
      transform: [{ translateY: -2 }],
    },
    categoryCard: {
      backgroundColor: themeColors.surfaceStrong,
      borderColor: themeColors.line,
      borderRadius: 8,
      borderWidth: 1,
      flexBasis: responsive.isMobile ? "100%" : responsive.width < 1100 ? "47%" : "31%",
      flexGrow: 1,
      minHeight: 138,
      minWidth: responsive.isMobile ? "100%" : 220,
      padding: 16,
      ...softShadow(1, themeColors),
    },
    categoryGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 14,
      marginBottom: 26,
    },
    categoryMeta: {
      color: themeColors.muted,
      fontSize: 12,
      fontWeight: "800",
      marginTop: 8,
    },
    categoryTitle: {
      color: themeColors.ink,
      fontSize: 16,
      fontWeight: "900",
      lineHeight: 21,
      marginTop: 16,
    },
    eyebrow: {
      color: themeColors.blue,
      fontSize: 12,
      fontWeight: "900",
      letterSpacing: 0,
      textTransform: "uppercase",
    },
    filters: {
      flexDirection: "row",
      flexWrap: responsive.isMobile ? "nowrap" : "wrap",
      gap: 9,
      paddingRight: responsive.isMobile ? 16 : 0,
    },
    focusRing: {
      borderColor: themeColors.focus,
      borderWidth: 2,
    },
    hero: {
      alignItems: responsive.isMobile ? "stretch" : "center",
      backgroundColor: themeColors.glass,
      borderColor: themeColors.line,
      borderRadius: 8,
      borderWidth: 1,
      flexDirection: responsive.isMobile ? "column" : "row",
      gap: 20,
      justifyContent: "space-between",
      marginBottom: 20,
      padding: responsive.isMobile ? 18 : 24,
      ...softShadow(1, themeColors),
    },
    heroCopy: {
      flex: 1,
      minWidth: 0,
    },
    heroSignal: {
      alignItems: "center",
      backgroundColor: themeColors.surfaceStrong,
      borderColor: themeColors.line,
      borderRadius: 8,
      borderWidth: 1,
      flexDirection: "row",
      minHeight: 84,
      minWidth: responsive.isMobile ? "100%" : 260,
      padding: 16,
    },
    heroSignalCopy: {
      flex: 1,
      marginLeft: 12,
      minWidth: 0,
    },
    heroSignalText: {
      color: themeColors.muted,
      fontSize: 13,
      fontWeight: "700",
      marginTop: 4,
    },
    heroSignalTitle: {
      color: themeColors.ink,
      fontSize: 17,
      fontWeight: "900",
    },
    metricGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 12,
      marginBottom: 26,
    },
    pressed: {
      opacity: 0.82,
      transform: [{ scale: 0.99 }],
    },
    resultsList: {
      gap: 12,
      paddingBottom: 10,
    },
    searchPanel: {
      backgroundColor: themeColors.glass,
      borderColor: themeColors.line,
      borderRadius: 8,
      borderWidth: 1,
      gap: 12,
      marginBottom: 24,
      padding: 14,
      ...softShadow(1, themeColors),
    },
    subtitle: {
      color: themeColors.muted,
      fontSize: 15,
      fontWeight: "700",
      lineHeight: 22,
      marginTop: 8,
      maxWidth: 680,
    },
    title: {
      color: themeColors.ink,
      fontSize: responsive.isMobile ? 29 : 36,
      fontWeight: "900",
      lineHeight: responsive.isMobile ? 35 : 43,
      marginTop: 6,
      maxWidth: 720,
    },
  });
}
