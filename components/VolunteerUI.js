import { Ionicons } from "@expo/vector-icons";
import { useEffect, useMemo, useRef } from "react";
import {
  Animated,
  Easing,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from "react-native";
import {
  backgroundGradient,
  getTone,
  palettes,
  responsiveFlags,
  shadow,
} from "../constants/designSystem";
import { useVolunteerTheme } from "../context/ThemeContext";

export const colors = palettes.light;

export function tone(name = "blue", palette = palettes.light) {
  return getTone(palette, name);
}

export function appGradient(palette = palettes.light) {
  return backgroundGradient(palette);
}

export function softShadow(level = 1, palette = palettes.light) {
  return shadow(palette, level);
}

export function useResponsive() {
  const { width, height } = useWindowDimensions();
  return { width, height, ...responsiveFlags(width) };
}

export function AnimatedEntrance({ children, delay = 0, style }) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(16)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 360,
        delay,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: Platform.OS !== "web",
      }),
      Animated.spring(translateY, {
        toValue: 0,
        delay,
        damping: 20,
        mass: 0.7,
        stiffness: 160,
        useNativeDriver: Platform.OS !== "web",
      }),
    ]).start();
  }, [delay, opacity, translateY]);

  return (
    <Animated.View
      style={[
        style,
        {
          opacity,
          transform: [{ translateY }],
        },
      ]}
    >
      {children}
    </Animated.View>
  );
}

export function BrandMark({ compact = false }) {
  const theme = useVolunteerTheme();
  const styles = useMemo(() => createStyles(theme.colors), [theme.colors]);

  return (
    <View style={styles.brandWrap}>
      <View style={[styles.brandIcon, compact && styles.brandIconCompact]}>
        <Ionicons
          name="sparkles"
          size={compact ? 14 : 16}
          color={theme.colors.textOnAccent}
        />
      </View>
      <Text style={[styles.brandText, compact && styles.brandTextCompact]}>
        VOLUNTEER
      </Text>
    </View>
  );
}

export function DashboardShell({ active = "Home", children, navigation }) {
  const theme = useVolunteerTheme();
  const responsive = useResponsive();
  const styles = useMemo(() => createStyles(theme.colors), [theme.colors]);
  const showRail = responsive.width >= 768;
  const miniRail = responsive.width < 1080;

  return (
    <SafeAreaView
      style={[
        styles.desktopSafeArea,
        responsive.isMobile && styles.desktopSafeAreaMobile,
        appGradient(theme.colors),
      ]}
    >
      <View
        style={[
          styles.desktopFrame,
          responsive.isMobile && styles.desktopFrameMobile,
        ]}
      >
        {showRail ? (
          <Sidebar active={active} navigation={navigation} compact={miniRail} />
        ) : null}
        <ScrollView
          style={responsive.isMobile && styles.scrollViewportMobile}
          contentContainerStyle={[
            styles.desktopContent,
            miniRail && styles.desktopContentCompact,
            responsive.isMobile && styles.desktopContentMobile,
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>
        {!showRail ? <BottomNav active={active} navigation={navigation} /> : null}
      </View>
    </SafeAreaView>
  );
}

function Sidebar({ active, navigation, compact = false }) {
  const theme = useVolunteerTheme();
  const styles = useMemo(() => createStyles(theme.colors), [theme.colors]);
  const navItems = [
    { label: "Home", icon: "home", route: "Home" },
    { label: "Explore", icon: "search", route: "Explore" },
    { label: "Create", icon: "add-circle", route: "VolunteerEvents" },
    {
      label: "Notifications",
      icon: "notifications-outline",
      route: "Notifications",
      badge: "3",
    },
    { label: "Profile", icon: "person-outline", route: "Profile" },
  ];

  return (
    <View style={[styles.sidebar, compact && styles.sidebarCompact]}>
      <View style={styles.sidebarBrand}>
        <BrandMark compact={compact} />
      </View>
      <View style={styles.sidebarNav}>
        {navItems.map((item) => {
          const selected = active === item.label;

          return (
            <Pressable
              key={item.label}
              accessibilityLabel={item.label}
              accessibilityRole="button"
              onPress={() => navigation?.navigate(item.route)}
              style={({ pressed, hovered, focused }) => [
                styles.sidebarItem,
                compact && styles.sidebarItemCompact,
                selected && styles.sidebarItemActive,
                (pressed || hovered) && styles.interactiveHover,
                focused && styles.focusRing,
              ]}
            >
              <Ionicons
                name={item.icon}
                size={21}
                color={selected ? theme.colors.blue : theme.colors.muted}
              />
              {!compact ? (
                <Text
                  style={[
                    styles.sidebarItemText,
                    selected && styles.sidebarItemTextActive,
                  ]}
                  numberOfLines={1}
                >
                  {item.label}
                </Text>
              ) : null}
              {item.badge ? (
                <View style={[styles.sidebarBadge, compact && styles.sidebarBadgeCompact]}>
                  <Text style={styles.sidebarBadgeText}>{item.badge}</Text>
                </View>
              ) : null}
            </Pressable>
          );
        })}
      </View>
      {!compact ? (
        <View style={styles.locationCard}>
          <IconBadge icon="location" toneName="blue" size={38} />
          <View style={styles.locationCopy}>
            <Text style={styles.locationTitle}>Bangalore</Text>
            <Text style={styles.locationMeta}>Open to nearby requests</Text>
          </View>
        </View>
      ) : null}
    </View>
  );
}

export function Avatar({ initials = "PG", size = 42 }) {
  const theme = useVolunteerTheme();
  const styles = useMemo(() => createStyles(theme.colors), [theme.colors]);

  return (
    <View
      style={[
        styles.avatar,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
        },
      ]}
    >
      <Text style={[styles.avatarText, { fontSize: Math.max(12, size * 0.36) }]}>
        {initials}
      </Text>
    </View>
  );
}

export function IconBadge({ icon, toneName = "blue", size = 42 }) {
  const theme = useVolunteerTheme();
  const styles = useMemo(() => createStyles(theme.colors), [theme.colors]);
  const selectedTone = tone(toneName, theme.colors);

  return (
    <View
      style={[
        styles.iconBadge,
        {
          width: size,
          height: size,
          borderRadius: Math.min(8, size / 3),
          backgroundColor: selectedTone.bg,
        },
      ]}
    >
      <Ionicons
        name={icon}
        size={Math.max(18, size * 0.47)}
        color={selectedTone.icon}
      />
    </View>
  );
}

export function PrimaryButton({
  label,
  icon = "add",
  onPress,
  style,
  variant = "gradient",
  disabled = false,
  loading = false,
}) {
  const theme = useVolunteerTheme();
  const styles = useMemo(() => createStyles(theme.colors), [theme.colors]);
  const light = variant === "light";

  return (
    <Pressable
      accessibilityLabel={label}
      accessibilityRole="button"
      accessibilityState={{ disabled: disabled || loading }}
      disabled={disabled || loading}
      onPress={onPress}
      style={({ pressed, hovered, focused }) => [
        styles.primaryButton,
        light && styles.primaryButtonLight,
        !light && styles.primaryButtonGradient,
        (pressed || hovered) && !disabled && styles.interactiveHover,
        pressed && !disabled && styles.interactivePressed,
        focused && styles.focusRing,
        (disabled || loading) && styles.disabledControl,
        style,
      ]}
    >
      <Ionicons
        name={loading ? "hourglass-outline" : icon}
        size={18}
        color={light ? theme.colors.blue : theme.colors.textOnAccent}
      />
      <Text
        style={[
          styles.primaryButtonText,
          light && styles.primaryButtonTextLight,
        ]}
        numberOfLines={1}
      >
        {label}
      </Text>
    </Pressable>
  );
}

export function IconButton({
  icon,
  label,
  onPress,
  style,
  toneName = "blue",
  active = false,
}) {
  const theme = useVolunteerTheme();
  const styles = useMemo(() => createStyles(theme.colors), [theme.colors]);
  const selectedTone = tone(toneName, theme.colors);

  return (
    <Pressable
      accessibilityLabel={label}
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed, hovered, focused }) => [
        styles.iconButton,
        active && { backgroundColor: selectedTone.bg, borderColor: selectedTone.icon },
        (pressed || hovered) && styles.interactiveHover,
        pressed && styles.interactivePressed,
        focused && styles.focusRing,
        style,
      ]}
    >
      <Ionicons
        name={icon}
        size={20}
        color={active ? selectedTone.icon : theme.colors.ink}
      />
    </Pressable>
  );
}

export function ThemeToggle({ compact = false }) {
  const theme = useVolunteerTheme();
  const styles = useMemo(() => createStyles(theme.colors), [theme.colors]);

  return (
    <Pressable
      accessibilityLabel={`Switch to ${theme.isDark ? "light" : "dark"} mode`}
      accessibilityRole="switch"
      accessibilityState={{ checked: theme.isDark }}
      onPress={theme.toggleMode}
      style={({ pressed, hovered, focused }) => [
        styles.themeToggle,
        compact && styles.themeToggleCompact,
        (pressed || hovered) && styles.interactiveHover,
        focused && styles.focusRing,
      ]}
    >
      <Ionicons
        name={theme.isDark ? "moon" : "sunny"}
        size={18}
        color={theme.colors.blue}
      />
      {!compact ? (
        <Text style={styles.themeToggleText}>{theme.isDark ? "Dark" : "Light"}</Text>
      ) : null}
    </Pressable>
  );
}

export function Header({ active = "Home", navigation, onCreatePress, user }) {
  const theme = useVolunteerTheme();
  const responsive = useResponsive();
  const styles = useMemo(() => createStyles(theme.colors), [theme.colors]);
  const compact = responsive.width < 760;
  const items = [
    { label: "Home", route: "Home" },
    { label: "Explore", route: "Explore" },
    { label: "Create", route: "VolunteerEvents", action: onCreatePress },
    { label: "Notifications", route: "Notifications" },
    { label: "Profile", route: "Profile" },
  ];

  return (
    <View style={[styles.header, compact && styles.headerCompact]}>
      <BrandMark compact={compact} />
      {!compact ? (
        <View style={styles.headerNav}>
          {items.map((item) => (
            <Pressable
              key={item.label}
              accessibilityLabel={item.label}
              accessibilityRole="button"
              onPress={() => (item.action ? item.action() : navigation?.navigate(item.route))}
              style={({ pressed, hovered, focused }) => [
                styles.headerNavItem,
                active === item.label && styles.headerNavItemActive,
                (pressed || hovered) && styles.interactiveHover,
                focused && styles.focusRing,
              ]}
            >
              <Text
                style={[
                  styles.headerNavText,
                  active === item.label && styles.headerNavTextActive,
                ]}
              >
                {item.label}
              </Text>
            </Pressable>
          ))}
        </View>
      ) : (
        <View style={styles.headerSpacer} />
      )}
      <View style={styles.headerRight}>
        <IconButton
          icon="search"
          label="Explore causes"
          onPress={() => navigation?.navigate("Explore")}
          style={styles.headerIconButton}
        />
        <ThemeToggle compact />
        <Avatar initials={user?.avatarInitials || "PG"} size={38} />
      </View>
    </View>
  );
}

export function ScreenScaffold({
  active,
  children,
  contentStyle,
  navigation,
  onCreatePress,
  user,
}) {
  const theme = useVolunteerTheme();
  const responsive = useResponsive();
  const styles = useMemo(() => createStyles(theme.colors), [theme.colors]);

  return (
    <SafeAreaView style={[styles.safeArea, appGradient(theme.colors)]}>
      <View style={styles.appFrame}>
        <Header
          active={active}
          navigation={navigation}
          onCreatePress={onCreatePress}
          user={user}
        />
        <ScrollView
          style={responsive.isMobile && styles.scrollViewportMobile}
          contentContainerStyle={[
            styles.scrollContent,
            responsive.isMobile && styles.scrollContentMobile,
            contentStyle,
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>
        {responsive.isMobile ? (
          <BottomNav
            active={active}
            navigation={navigation}
            onCreatePress={onCreatePress}
          />
        ) : null}
      </View>
    </SafeAreaView>
  );
}

export function BottomNav({ active = "Home", navigation, onCreatePress }) {
  const theme = useVolunteerTheme();
  const responsive = useResponsive();
  const styles = useMemo(() => createStyles(theme.colors), [theme.colors]);
  const items = [
    { label: "Home", icon: "home", route: "Home" },
    { label: "Explore", icon: "search", route: "Explore" },
    { label: "Create", icon: "add-circle", route: "VolunteerEvents", action: onCreatePress },
    { label: "Notifications", icon: "notifications", route: "Notifications" },
    { label: "Profile", icon: "person-circle", route: "Profile" },
  ];

  return (
    <View
      style={[
        styles.bottomNav,
        responsive.isTiny && styles.bottomNavTiny,
        { width: Math.max(responsive.width - 24, 0) },
      ]}
    >
      {items.map((item) => {
        const isActive = active === item.label;

        return (
          <Pressable
            key={item.label}
            accessibilityLabel={item.label}
            accessibilityRole="button"
            onPress={() =>
              item.action ? item.action() : navigation?.navigate(item.route)
            }
            style={({ pressed, hovered, focused }) => [
              styles.bottomNavItem,
              isActive && styles.bottomNavItemActive,
              (pressed || hovered) && styles.interactiveHover,
              focused && styles.focusRing,
            ]}
          >
            <Ionicons
              name={item.icon}
              size={item.label === "Create" ? 25 : 21}
              color={isActive ? theme.colors.blue : theme.colors.faint}
            />
            <Text
              style={[
                styles.bottomNavText,
                isActive && styles.bottomNavTextActive,
                responsive.isTiny && styles.bottomNavTextTiny,
              ]}
              numberOfLines={1}
            >
              {item.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

export function Panel({ children, style }) {
  const theme = useVolunteerTheme();
  const styles = useMemo(() => createStyles(theme.colors), [theme.colors]);
  return <View style={[styles.panel, softShadow(1, theme.colors), style]}>{children}</View>;
}

export function SectionTitle({ title, subtitle, action }) {
  const theme = useVolunteerTheme();
  const styles = useMemo(() => createStyles(theme.colors), [theme.colors]);

  return (
    <View style={styles.sectionTitleRow}>
      <View style={styles.sectionTitleCopy}>
        <Text style={styles.sectionTitle}>{title}</Text>
        {subtitle ? <Text style={styles.sectionSubtitle}>{subtitle}</Text> : null}
      </View>
      {action}
    </View>
  );
}

export function SearchBar({
  placeholder = "Search causes, events, or requests...",
  value,
  onChangeText,
  onSubmitEditing,
  rightIcon = "options-outline",
}) {
  const theme = useVolunteerTheme();
  const styles = useMemo(() => createStyles(theme.colors), [theme.colors]);

  return (
    <View style={[styles.searchBar, softShadow(1, theme.colors)]}>
      <Ionicons name="search" size={21} color={theme.colors.ink} />
      <TextInput
        accessibilityLabel={placeholder}
        onChangeText={onChangeText}
        onSubmitEditing={onSubmitEditing}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.faint}
        returnKeyType="search"
        style={styles.searchInput}
        value={value}
      />
      <Ionicons name={rightIcon} size={21} color={theme.colors.faint} />
    </View>
  );
}

export function FilterPill({ item, active, onPress, label }) {
  const theme = useVolunteerTheme();
  const styles = useMemo(() => createStyles(theme.colors), [theme.colors]);
  const selectedTone = tone(item?.tone, theme.colors);

  return (
    <Pressable
      accessibilityLabel={item?.label || label}
      accessibilityRole="button"
      accessibilityState={{ selected: !!active }}
      onPress={onPress}
      style={({ pressed, hovered, focused }) => [
        styles.filterPill,
        active && {
          backgroundColor: selectedTone.bg,
          borderColor: selectedTone.icon,
        },
        (pressed || hovered) && styles.interactiveHover,
        focused && styles.focusRing,
      ]}
    >
      {item?.icon ? (
        <Ionicons name={item.icon} size={17} color={selectedTone.icon} />
      ) : null}
      <Text style={[styles.filterPillText, active && { color: theme.colors.ink }]}>
        {item?.label || label}
      </Text>
    </Pressable>
  );
}

export function ActionRow({ item, onPress }) {
  const theme = useVolunteerTheme();
  const styles = useMemo(() => createStyles(theme.colors), [theme.colors]);

  return (
    <Pressable
      accessibilityLabel={item.title}
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed, hovered, focused }) => [
        styles.actionRow,
        softShadow(1, theme.colors),
        (pressed || hovered) && styles.interactiveHover,
        pressed && styles.interactivePressed,
        focused && styles.focusRing,
      ]}
    >
      <IconBadge icon={item.icon} toneName={item.tone} size={42} />
      <View style={styles.actionTextWrap}>
        <Text style={styles.actionTitle} numberOfLines={1}>{item.title}</Text>
        <Text style={styles.actionSubtitle} numberOfLines={2}>{item.subtitle}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={theme.colors.faint} />
    </Pressable>
  );
}

export function FeedCard({ item, onPress, actions }) {
  const theme = useVolunteerTheme();
  const styles = useMemo(() => createStyles(theme.colors), [theme.colors]);
  const selectedTone = tone(item.tone, theme.colors);

  return (
    <View style={[styles.feedCard, softShadow(1, theme.colors)]}>
      <Pressable
        accessibilityLabel={item.title}
        accessibilityRole="button"
        onPress={onPress}
        style={({ pressed, hovered, focused }) => [
          styles.feedOpenArea,
          (pressed || hovered) && styles.interactiveHover,
          pressed && styles.interactivePressed,
          focused && styles.focusRing,
        ]}
      >
        <IconBadge icon={item.icon} toneName={item.tone} size={46} />
        <View style={styles.feedContent}>
          <View style={styles.feedTopLine}>
            <Text style={styles.feedTitle} numberOfLines={2}>{item.title}</Text>
            <View style={[styles.statusChip, { backgroundColor: selectedTone.bg }]}>
              <Text style={[styles.statusChipText, { color: selectedTone.icon }]}>
                {item.urgency || item.status || "Open"}
              </Text>
            </View>
          </View>
          <Text style={styles.feedSummary} numberOfLines={2}>{item.summary}</Text>
          <View style={styles.feedMetaRow}>
            <Text style={styles.feedMeta}>Posted by {item.postedBy}</Text>
            <Text style={styles.feedMeta}>{item.distance}</Text>
            <Text style={styles.feedMeta}>{item.time}</Text>
          </View>
        </View>
      </Pressable>
      {actions ? <View style={styles.cardActions}>{actions}</View> : null}
    </View>
  );
}

export function MetricTile({ item }) {
  const theme = useVolunteerTheme();
  const styles = useMemo(() => createStyles(theme.colors), [theme.colors]);
  const selectedTone = tone(item.tone, theme.colors);

  return (
    <View style={[styles.metricTile, { backgroundColor: selectedTone.bg }]}>
      <View style={styles.metricTop}>
        <Ionicons name={item.icon} size={24} color={selectedTone.icon} />
        <Text style={[styles.metricValue, { color: selectedTone.icon }]}>
          {item.value}
        </Text>
      </View>
      <Text style={styles.metricLabel}>{item.label}</Text>
    </View>
  );
}

export function FormField({ label, value, icon, toneName = "blue" }) {
  const theme = useVolunteerTheme();
  const styles = useMemo(() => createStyles(theme.colors), [theme.colors]);
  const selectedTone = tone(toneName, theme.colors);

  return (
    <View style={styles.formField}>
      {icon ? <Ionicons name={icon} size={18} color={selectedTone.icon} /> : null}
      <View style={styles.formFieldTextWrap}>
        <Text style={styles.formFieldLabel}>{label}</Text>
        <Text style={styles.formFieldValue}>{value}</Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color={theme.colors.faint} />
    </View>
  );
}

export function LivePulse({ toneName = "green", label = "Live" }) {
  const theme = useVolunteerTheme();
  const styles = useMemo(() => createStyles(theme.colors), [theme.colors]);
  const selectedTone = tone(toneName, theme.colors);
  const pulse = useRef(new Animated.Value(0.55)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 900,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: Platform.OS !== "web",
        }),
        Animated.timing(pulse, {
          toValue: 0.55,
          duration: 900,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: Platform.OS !== "web",
        }),
      ]),
    );
    animation.start();
    return () => animation.stop();
  }, [pulse]);

  return (
    <View style={styles.liveWrap}>
      <Animated.View
        style={[
          styles.liveDot,
          { backgroundColor: selectedTone.icon, opacity: pulse },
        ]}
      />
      <Text style={styles.liveText}>{label}</Text>
    </View>
  );
}

export function EmptyState({
  icon = "sparkles-outline",
  title,
  message,
  actionLabel,
  onAction,
}) {
  const theme = useVolunteerTheme();
  const styles = useMemo(() => createStyles(theme.colors), [theme.colors]);

  return (
    <View style={styles.emptyState}>
      <View style={styles.emptyIcon}>
        <Ionicons name={icon} size={28} color={theme.colors.blue} />
      </View>
      <Text style={styles.emptyTitle}>{title}</Text>
      <Text style={styles.emptyMessage}>{message}</Text>
      {actionLabel ? (
        <PrimaryButton
          icon="arrow-forward"
          label={actionLabel}
          onPress={onAction}
          variant="light"
          style={styles.emptyAction}
        />
      ) : null}
    </View>
  );
}

export function SkeletonLine({ width = "100%", height = 14, style }) {
  const theme = useVolunteerTheme();
  const styles = useMemo(() => createStyles(theme.colors), [theme.colors]);

  return (
    <View
      accessibilityLabel="Loading"
      style={[styles.skeletonLine, { width, height }, style]}
    />
  );
}

export function SkeletonCard() {
  const theme = useVolunteerTheme();
  const styles = useMemo(() => createStyles(theme.colors), [theme.colors]);

  return (
    <View style={[styles.skeletonCard, softShadow(1, theme.colors)]}>
      <SkeletonLine width={48} height={48} style={styles.skeletonAvatar} />
      <View style={styles.skeletonCopy}>
        <SkeletonLine width="72%" />
        <SkeletonLine width="96%" style={styles.skeletonGap} />
        <SkeletonLine width="45%" style={styles.skeletonGap} />
      </View>
    </View>
  );
}

function createStyles(themeColors) {
  const isDark = themeColors.mode === "dark";

  return StyleSheet.create({
    actionRow: {
      alignItems: "center",
      backgroundColor: themeColors.surfaceStrong,
      borderColor: themeColors.line,
      borderRadius: 8,
      borderWidth: 1,
      flexDirection: "row",
      minHeight: 74,
      paddingHorizontal: 16,
      paddingVertical: 13,
    },
    actionSubtitle: {
      color: themeColors.muted,
      fontSize: 12,
      fontWeight: "700",
      lineHeight: 17,
    },
    actionTextWrap: {
      flex: 1,
      marginLeft: 12,
      minWidth: 0,
    },
    actionTitle: {
      color: themeColors.ink,
      fontSize: 16,
      fontWeight: "900",
      marginBottom: 2,
    },
    appFrame: {
      alignSelf: "center",
      flex: 1,
      maxWidth: 1440,
      width: "100%",
    },
    avatar: {
      alignItems: "center",
      backgroundColor: themeColors.yellowSoft,
      borderColor: isDark ? themeColors.lineStrong : "rgba(255,255,255,0.88)",
      borderWidth: 2,
      justifyContent: "center",
      overflow: "hidden",
    },
    avatarText: {
      color: themeColors.ink,
      fontWeight: "900",
    },
    bottomNav: {
      alignItems: "center",
      alignSelf: "center",
      backgroundColor: themeColors.glass,
      borderColor: themeColors.lineStrong,
      borderRadius: 8,
      borderWidth: 1,
      bottom: 12,
      flexDirection: "row",
      justifyContent: "center",
      left: 12,
      minHeight: 64,
      paddingHorizontal: 7,
      paddingVertical: 7,
      position: "absolute",
      right: 12,
      zIndex: 20,
      ...Platform.select({
        web: {
          backdropFilter: "blur(18px)",
        },
        default: {},
      }),
      ...shadow(themeColors, 2),
    },
    bottomNavItem: {
      alignItems: "center",
      borderRadius: 8,
      flex: 1,
      height: 50,
      justifyContent: "center",
      minWidth: 0,
      paddingHorizontal: 2,
    },
    bottomNavItemActive: {
      backgroundColor: isDark ? "rgba(116,167,255,0.16)" : "rgba(37,99,184,0.09)",
    },
    bottomNavText: {
      color: themeColors.faint,
      fontSize: 10.5,
      fontWeight: "800",
      marginTop: 2,
      maxWidth: "100%",
    },
    bottomNavTextActive: {
      color: themeColors.blue,
    },
    bottomNavTextTiny: {
      fontSize: 9,
    },
    bottomNavTiny: {
      left: 8,
      right: 8,
      paddingHorizontal: 4,
    },
    brandIcon: {
      alignItems: "center",
      backgroundColor: themeColors.blue,
      borderRadius: 8,
      height: 32,
      justifyContent: "center",
      width: 32,
      ...shadow(themeColors, 1),
    },
    brandIconCompact: {
      height: 30,
      width: 30,
    },
    brandText: {
      color: themeColors.blue,
      fontSize: 22,
      fontWeight: "900",
      marginLeft: 8,
    },
    brandTextCompact: {
      fontSize: 17,
    },
    brandWrap: {
      alignItems: "center",
      flexDirection: "row",
      minWidth: 0,
    },
    cardActions: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 8,
      marginTop: 12,
    },
    desktopContent: {
      flexGrow: 1,
      padding: 30,
      paddingBottom: 36,
    },
    desktopContentCompact: {
      padding: 22,
    },
    desktopContentMobile: {
      padding: 16,
      paddingBottom: 96,
    },
    desktopFrame: {
      alignSelf: "center",
      backgroundColor: isDark ? "rgba(17, 24, 35, 0.86)" : "rgba(251, 253, 248, 0.75)",
      borderColor: themeColors.line,
      borderRadius: 8,
      borderWidth: 1,
      flex: 1,
      flexDirection: "row",
      maxWidth: 1580,
      overflow: "hidden",
      width: "100%",
      ...shadow(themeColors, 1),
    },
    desktopFrameMobile: {
      borderRadius: 0,
      borderWidth: 0,
    },
    desktopSafeArea: {
      backgroundColor: themeColors.background,
      flex: 1,
      padding: 18,
    },
    desktopSafeAreaMobile: {
      padding: 0,
    },
    disabledControl: {
      opacity: 0.58,
    },
    emptyAction: {
      marginTop: 18,
      minWidth: 180,
    },
    emptyIcon: {
      alignItems: "center",
      backgroundColor: themeColors.blueSoft,
      borderRadius: 8,
      height: 58,
      justifyContent: "center",
      width: 58,
    },
    emptyMessage: {
      color: themeColors.muted,
      fontSize: 14,
      fontWeight: "700",
      lineHeight: 21,
      marginTop: 7,
      maxWidth: 380,
      textAlign: "center",
    },
    emptyState: {
      alignItems: "center",
      backgroundColor: themeColors.glass,
      borderColor: themeColors.line,
      borderRadius: 8,
      borderWidth: 1,
      padding: 26,
    },
    emptyTitle: {
      color: themeColors.ink,
      fontSize: 18,
      fontWeight: "900",
      marginTop: 14,
      textAlign: "center",
    },
    feedCard: {
      alignItems: "flex-start",
      backgroundColor: themeColors.surfaceStrong,
      borderColor: themeColors.line,
      borderRadius: 8,
      borderWidth: 1,
      padding: 16,
    },
    feedContent: {
      flex: 1,
      marginLeft: 14,
      minWidth: 0,
    },
    feedMeta: {
      color: themeColors.faint,
      fontSize: 12,
      fontWeight: "700",
      marginRight: 12,
      marginTop: 2,
    },
    feedMetaRow: {
      flexDirection: "row",
      flexWrap: "wrap",
    },
    feedOpenArea: {
      alignItems: "flex-start",
      borderRadius: 8,
      flexDirection: "row",
    },
    feedSummary: {
      color: themeColors.muted,
      fontSize: 13,
      fontWeight: "700",
      lineHeight: 19,
      marginBottom: 9,
    },
    feedTitle: {
      color: themeColors.ink,
      flex: 1,
      fontSize: 18,
      fontWeight: "900",
      lineHeight: 23,
      minWidth: 0,
    },
    feedTopLine: {
      alignItems: "flex-start",
      flexDirection: "row",
      gap: 8,
      marginBottom: 5,
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
    filterPillText: {
      color: themeColors.muted,
      fontSize: 14,
      fontWeight: "800",
      marginLeft: 7,
    },
    focusRing: {
      borderColor: themeColors.focus,
      borderWidth: 2,
    },
    formField: {
      alignItems: "center",
      backgroundColor: themeColors.surfaceStrong,
      borderColor: themeColors.line,
      borderRadius: 8,
      borderWidth: 1,
      flexDirection: "row",
      minHeight: 58,
      paddingHorizontal: 14,
    },
    formFieldLabel: {
      color: themeColors.faint,
      fontSize: 12,
      fontWeight: "800",
      marginBottom: 2,
    },
    formFieldTextWrap: {
      flex: 1,
      marginLeft: 10,
    },
    formFieldValue: {
      color: themeColors.ink,
      fontSize: 16,
      fontWeight: "800",
    },
    header: {
      alignItems: "center",
      flexDirection: "row",
      minHeight: 74,
      paddingHorizontal: 18,
      paddingTop: 6,
    },
    headerCompact: {
      paddingHorizontal: 14,
    },
    headerIconButton: {
      height: 40,
      width: 40,
    },
    headerNav: {
      alignItems: "center",
      flex: 1,
      flexDirection: "row",
      justifyContent: "flex-end",
      marginHorizontal: 18,
    },
    headerNavItem: {
      borderRadius: 8,
      minHeight: 42,
      justifyContent: "center",
      marginLeft: 4,
      paddingHorizontal: 12,
    },
    headerNavItemActive: {
      backgroundColor: isDark ? "rgba(116,167,255,0.16)" : "rgba(37,99,184,0.08)",
    },
    headerNavText: {
      color: themeColors.muted,
      fontSize: 14,
      fontWeight: "800",
    },
    headerNavTextActive: {
      color: themeColors.blue,
    },
    headerRight: {
      alignItems: "center",
      flexDirection: "row",
      gap: 10,
    },
    headerSpacer: {
      flex: 1,
    },
    iconBadge: {
      alignItems: "center",
      justifyContent: "center",
    },
    iconButton: {
      alignItems: "center",
      backgroundColor: themeColors.glass,
      borderColor: themeColors.line,
      borderRadius: 8,
      borderWidth: 1,
      height: 44,
      justifyContent: "center",
      width: 44,
    },
    interactiveHover: {
      transform: [{ translateY: -1 }],
    },
    interactivePressed: {
      opacity: 0.78,
      transform: [{ scale: 0.99 }],
    },
    liveDot: {
      borderRadius: 4,
      height: 8,
      width: 8,
    },
    liveText: {
      color: themeColors.muted,
      fontSize: 12,
      fontWeight: "900",
      marginLeft: 7,
      textTransform: "uppercase",
    },
    liveWrap: {
      alignItems: "center",
      flexDirection: "row",
    },
    locationCard: {
      alignItems: "center",
      backgroundColor: themeColors.surfaceStrong,
      borderColor: themeColors.line,
      borderRadius: 8,
      borderWidth: 1,
      flexDirection: "row",
      marginTop: "auto",
      minHeight: 74,
      paddingHorizontal: 14,
      ...shadow(themeColors, 1),
    },
    locationCopy: {
      flex: 1,
      marginLeft: 12,
      minWidth: 0,
    },
    locationMeta: {
      color: themeColors.muted,
      fontSize: 12,
      fontWeight: "700",
      marginTop: 3,
    },
    locationTitle: {
      color: themeColors.ink,
      fontSize: 14,
      fontWeight: "900",
    },
    metricLabel: {
      color: themeColors.ink,
      fontSize: 13,
      fontWeight: "700",
      lineHeight: 17,
      marginTop: 5,
    },
    metricTile: {
      borderColor: themeColors.line,
      borderRadius: 8,
      borderWidth: 1,
      flex: 1,
      minHeight: 86,
      minWidth: 124,
      padding: 14,
    },
    metricTop: {
      alignItems: "center",
      flexDirection: "row",
    },
    metricValue: {
      fontSize: 26,
      fontWeight: "900",
      marginLeft: 8,
    },
    panel: {
      backgroundColor: themeColors.glass,
      borderColor: themeColors.line,
      borderRadius: 8,
      borderWidth: 1,
      padding: 18,
    },
    primaryButton: {
      alignItems: "center",
      borderRadius: 8,
      flexDirection: "row",
      justifyContent: "center",
      minHeight: 50,
      minWidth: 148,
      paddingHorizontal: 18,
    },
    primaryButtonGradient: {
      backgroundColor: themeColors.aqua,
      ...Platform.select({
        web: {
          backgroundImage: isDark
            ? "linear-gradient(100deg, #5cd9e7 0%, #9fcfff 100%)"
            : "linear-gradient(100deg, #18afc7 0%, #6caef8 100%)",
        },
        default: {},
      }),
    },
    primaryButtonLight: {
      backgroundColor: themeColors.surfaceStrong,
      borderColor: themeColors.line,
      borderWidth: 1,
    },
    primaryButtonText: {
      color: themeColors.textOnAccent,
      fontSize: 15,
      fontWeight: "900",
      marginLeft: 7,
      maxWidth: 210,
    },
    primaryButtonTextLight: {
      color: themeColors.blue,
    },
    safeArea: {
      flex: 1,
    },
    scrollContent: {
      flexGrow: 1,
      paddingBottom: 30,
      paddingHorizontal: 44,
      paddingTop: 14,
    },
    scrollContentMobile: {
      paddingBottom: 104,
      paddingHorizontal: 16,
    },
    scrollViewportMobile: {
      marginBottom: 88,
    },
    searchBar: {
      alignItems: "center",
      backgroundColor: themeColors.surfaceStrong,
      borderColor: themeColors.line,
      borderRadius: 8,
      borderWidth: 1,
      flexDirection: "row",
      minHeight: 54,
      paddingHorizontal: 16,
    },
    searchInput: {
      color: themeColors.ink,
      flex: 1,
      fontSize: 15,
      fontWeight: "700",
      marginHorizontal: 10,
      minHeight: 44,
      outlineStyle: "none",
    },
    sectionSubtitle: {
      color: themeColors.muted,
      fontSize: 13,
      fontWeight: "700",
      lineHeight: 18,
      marginTop: 4,
    },
    sectionTitle: {
      color: themeColors.ink,
      fontSize: 22,
      fontWeight: "900",
      lineHeight: 28,
    },
    sectionTitleCopy: {
      flex: 1,
      minWidth: 0,
      paddingRight: 12,
    },
    sectionTitleRow: {
      alignItems: "center",
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 14,
    },
    sidebar: {
      backgroundColor: themeColors.glass,
      borderRightColor: themeColors.line,
      borderRightWidth: 1,
      paddingBottom: 24,
      paddingHorizontal: 20,
      paddingTop: 36,
      width: 250,
      ...Platform.select({
        web: {
          backdropFilter: "blur(20px)",
        },
        default: {},
      }),
    },
    sidebarBadge: {
      alignItems: "center",
      backgroundColor: themeColors.danger,
      borderRadius: 10,
      height: 20,
      justifyContent: "center",
      minWidth: 20,
      paddingHorizontal: 5,
    },
    sidebarBadgeCompact: {
      position: "absolute",
      right: 7,
      top: 7,
    },
    sidebarBadgeText: {
      color: themeColors.textOnAccent,
      fontSize: 11,
      fontWeight: "900",
    },
    sidebarBrand: {
      marginBottom: 32,
    },
    sidebarCompact: {
      alignItems: "center",
      paddingHorizontal: 10,
      width: 82,
    },
    sidebarItem: {
      alignItems: "center",
      borderRadius: 8,
      flexDirection: "row",
      minHeight: 48,
      marginBottom: 8,
      paddingHorizontal: 12,
    },
    sidebarItemActive: {
      backgroundColor: isDark ? "rgba(116,167,255,0.16)" : "rgba(37,99,184,0.09)",
    },
    sidebarItemCompact: {
      justifyContent: "center",
      paddingHorizontal: 0,
      width: 52,
    },
    sidebarItemText: {
      color: themeColors.muted,
      flex: 1,
      fontSize: 14,
      fontWeight: "800",
      marginLeft: 14,
    },
    sidebarItemTextActive: {
      color: themeColors.blue,
    },
    sidebarNav: {
      flex: 1,
    },
    skeletonAvatar: {
      borderRadius: 8,
    },
    skeletonCard: {
      alignItems: "center",
      backgroundColor: themeColors.surfaceStrong,
      borderColor: themeColors.line,
      borderRadius: 8,
      borderWidth: 1,
      flexDirection: "row",
      minHeight: 112,
      padding: 16,
    },
    skeletonCopy: {
      flex: 1,
      marginLeft: 14,
    },
    skeletonGap: {
      marginTop: 10,
    },
    skeletonLine: {
      backgroundColor: isDark ? "rgba(255,255,255,0.12)" : "rgba(43,61,92,0.09)",
      borderRadius: 8,
      overflow: "hidden",
    },
    statusChip: {
      borderRadius: 8,
      paddingHorizontal: 10,
      paddingVertical: 5,
    },
    statusChipText: {
      fontSize: 11,
      fontWeight: "900",
      textTransform: "uppercase",
    },
    themeToggle: {
      alignItems: "center",
      backgroundColor: themeColors.surfaceStrong,
      borderColor: themeColors.line,
      borderRadius: 8,
      borderWidth: 1,
      flexDirection: "row",
      minHeight: 40,
      paddingHorizontal: 12,
    },
    themeToggleCompact: {
      height: 40,
      justifyContent: "center",
      paddingHorizontal: 0,
      width: 40,
    },
    themeToggleText: {
      color: themeColors.ink,
      fontSize: 13,
      fontWeight: "900",
      marginLeft: 7,
    },
  });
}
