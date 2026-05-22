import { Ionicons } from "@expo/vector-icons";
import { useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import {
  AnimatedEntrance,
  EmptyState,
  IconBadge,
  PrimaryButton,
  ScreenScaffold,
  SectionTitle,
  softShadow,
  useResponsive,
} from "../components/VolunteerUI";
import { useToast } from "../context/ToastContext";
import { useVolunteerTheme } from "../context/ThemeContext";
import { currentVolunteer, notifications as seedNotifications } from "../data/mockVolunteerData";

export default function NotificationsScreen({ navigation }) {
  const theme = useVolunteerTheme();
  const responsive = useResponsive();
  const styles = useMemo(
    () => createStyles(theme.colors, responsive),
    [theme.colors, responsive.width],
  );
  const { showToast } = useToast();
  const [notifications, setNotifications] = useState(seedNotifications);

  const unreadCount = notifications.filter((item) => item.unread).length;

  const markAllRead = () => {
    setNotifications((items) => items.map((item) => ({ ...item, unread: false })));
    showToast({
      title: "Notifications updated",
      message: "Everything is marked as read.",
    });
  };

  return (
    <ScreenScaffold active="Notifications" navigation={navigation} user={currentVolunteer}>
      <AnimatedEntrance>
        <View style={styles.hero}>
          <View style={styles.heroCopy}>
            <Text style={styles.eyebrow}>Notifications</Text>
            <Text style={styles.title}>Stay close to what needs you.</Text>
            <Text style={styles.subtitle}>
              Donor matches, event changes, NGO updates, and impact milestones in one calm feed.
            </Text>
          </View>
          <View style={styles.unreadCard}>
            <Text style={styles.unreadValue}>{unreadCount}</Text>
            <Text style={styles.unreadLabel}>unread updates</Text>
          </View>
        </View>
      </AnimatedEntrance>

      <AnimatedEntrance delay={80}>
        <SectionTitle
          title="Updates"
          subtitle="Tap any update to jump straight into the relevant workflow."
          action={
            <PrimaryButton
              icon="checkmark-done"
              label="Mark Read"
              onPress={markAllRead}
              variant="light"
              disabled={unreadCount === 0}
              style={styles.markReadButton}
            />
          }
        />
        <View style={styles.list}>
          {notifications.map((notification, index) => (
            <NotificationCard
              key={notification.id}
              notification={notification}
              delay={120 + index * 70}
              onOpen={() => {
                setNotifications((items) =>
                  items.map((item) =>
                    item.id === notification.id ? { ...item, unread: false } : item,
                  ),
                );
                navigation.navigate(notification.route);
              }}
              onDismiss={() => {
                setNotifications((items) =>
                  items.filter((item) => item.id !== notification.id),
                );
                showToast({
                  title: "Dismissed",
                  message: "The update was removed from your feed.",
                  type: "info",
                });
              }}
            />
          ))}
          {notifications.length === 0 ? (
            <EmptyState
              icon="notifications-off-outline"
              title="No notifications"
              message="You are all caught up. New donor matches and event updates will appear here."
              actionLabel="Explore Causes"
              onAction={() => navigation.navigate("Explore")}
            />
          ) : null}
        </View>
      </AnimatedEntrance>
    </ScreenScaffold>
  );
}

function NotificationCard({ notification, delay, onOpen, onDismiss }) {
  const theme = useVolunteerTheme();
  const responsive = useResponsive();
  const styles = useMemo(
    () => createStyles(theme.colors, responsive),
    [theme.colors, responsive.width],
  );

  return (
    <AnimatedEntrance delay={delay}>
      <View style={[styles.card, notification.unread && styles.cardUnread]}>
        <Pressable
          accessibilityLabel={notification.title}
          accessibilityRole="button"
          onPress={onOpen}
          style={({ pressed, hovered, focused }) => [
            styles.cardOpenArea,
            (pressed || hovered) && styles.cardHover,
            focused && styles.focusRing,
          ]}
        >
          <IconBadge icon={notification.icon} toneName={notification.tone} size={46} />
          <View style={styles.cardCopy}>
            <View style={styles.cardTop}>
              <Text style={styles.cardTitle} numberOfLines={2}>{notification.title}</Text>
              {notification.unread ? <View style={styles.unreadDot} /> : null}
            </View>
            <Text style={styles.cardBody} numberOfLines={2}>{notification.body}</Text>
            <Text style={styles.cardTime}>{notification.time}</Text>
          </View>
        </Pressable>
        <Pressable
          accessibilityLabel="Dismiss notification"
          accessibilityRole="button"
          onPress={onDismiss}
          style={({ pressed, hovered }) => [
            styles.dismissButton,
            (pressed || hovered) && styles.pressed,
          ]}
        >
          <Ionicons name="close" size={18} color={theme.colors.faint} />
        </Pressable>
      </View>
    </AnimatedEntrance>
  );
}

function createStyles(themeColors, responsive) {
  return StyleSheet.create({
    card: {
      alignItems: "center",
      backgroundColor: themeColors.surfaceStrong,
      borderColor: themeColors.line,
      borderRadius: 8,
      borderWidth: 1,
      flexDirection: "row",
      minHeight: 94,
      padding: 16,
      ...softShadow(1, themeColors),
    },
    cardBody: {
      color: themeColors.muted,
      fontSize: 13,
      fontWeight: "700",
      lineHeight: 19,
      marginTop: 4,
    },
    cardCopy: {
      flex: 1,
      marginLeft: 14,
      minWidth: 0,
    },
    cardHover: {
      transform: [{ translateY: -2 }],
    },
    cardOpenArea: {
      alignItems: "center",
      borderRadius: 8,
      flex: 1,
      flexDirection: "row",
      minWidth: 0,
    },
    cardTime: {
      color: themeColors.faint,
      fontSize: 12,
      fontWeight: "800",
      marginTop: 8,
    },
    cardTitle: {
      color: themeColors.ink,
      flex: 1,
      fontSize: 16,
      fontWeight: "900",
      lineHeight: 21,
      minWidth: 0,
    },
    cardTop: {
      alignItems: "center",
      flexDirection: "row",
      gap: 8,
    },
    cardUnread: {
      borderColor: themeColors.blue,
    },
    dismissButton: {
      alignItems: "center",
      borderRadius: 8,
      height: 44,
      justifyContent: "center",
      marginLeft: 8,
      width: 44,
    },
    eyebrow: {
      color: themeColors.blue,
      fontSize: 12,
      fontWeight: "900",
      letterSpacing: 0,
      textTransform: "uppercase",
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
      gap: 18,
      justifyContent: "space-between",
      marginBottom: 24,
      padding: responsive.isMobile ? 18 : 24,
      ...softShadow(1, themeColors),
    },
    heroCopy: {
      flex: 1,
      minWidth: 0,
    },
    list: {
      gap: 12,
    },
    markReadButton: {
      minWidth: responsive.isMobile ? 130 : 150,
    },
    pressed: {
      opacity: 0.78,
      transform: [{ scale: 0.99 }],
    },
    subtitle: {
      color: themeColors.muted,
      fontSize: 15,
      fontWeight: "700",
      lineHeight: 22,
      marginTop: 8,
      maxWidth: 720,
    },
    title: {
      color: themeColors.ink,
      fontSize: responsive.isMobile ? 29 : 36,
      fontWeight: "900",
      lineHeight: responsive.isMobile ? 35 : 43,
      marginTop: 6,
    },
    unreadCard: {
      alignItems: "center",
      backgroundColor: themeColors.blueSoft,
      borderColor: themeColors.line,
      borderRadius: 8,
      borderWidth: 1,
      minWidth: responsive.isMobile ? "100%" : 180,
      padding: 18,
    },
    unreadDot: {
      backgroundColor: themeColors.blue,
      borderRadius: 5,
      height: 10,
      width: 10,
    },
    unreadLabel: {
      color: themeColors.blue,
      fontSize: 12,
      fontWeight: "900",
      marginTop: 5,
      textTransform: "uppercase",
    },
    unreadValue: {
      color: themeColors.blue,
      fontSize: 34,
      fontWeight: "900",
      lineHeight: 40,
    },
  });
}
