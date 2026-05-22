import { Ionicons } from "@expo/vector-icons";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import {
  Animated,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { shadow } from "../constants/designSystem";
import { useVolunteerTheme } from "./ThemeContext";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((items) => items.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback((toast) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const nextToast = {
      id,
      type: "success",
      duration: 3200,
      ...toast,
    };

    setToasts((items) => [nextToast, ...items].slice(0, 3));
    windowSafeTimeout(() => removeToast(id), nextToast.duration);
    return id;
  }, [removeToast]);

  const value = useMemo(() => ({ showToast, removeToast }), [showToast, removeToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastViewport toasts={toasts} onDismiss={removeToast} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return context;
}

function ToastViewport({ toasts, onDismiss }) {
  const theme = useVolunteerTheme();
  const styles = createStyles(theme.colors);

  if (toasts.length === 0) {
    return null;
  }

  return (
    <View pointerEvents="box-none" style={styles.viewport}>
      {toasts.map((toast) => (
        <ToastMessage
          key={toast.id}
          toast={toast}
          onDismiss={() => onDismiss(toast.id)}
        />
      ))}
    </View>
  );
}

function ToastMessage({ toast, onDismiss }) {
  const theme = useVolunteerTheme();
  const styles = createStyles(theme.colors);
  const opacity = useMemo(() => new Animated.Value(0), []);
  const translateY = useMemo(() => new Animated.Value(-8), []);
  const typeIcon =
    toast.type === "error"
      ? "alert-circle"
      : toast.type === "info"
        ? "information-circle"
        : "checkmark-circle";
  const typeColor =
    toast.type === "error"
      ? theme.colors.danger
      : toast.type === "info"
        ? theme.colors.blue
        : theme.colors.success;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 220,
        useNativeDriver: Platform.OS !== "web",
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 220,
        useNativeDriver: Platform.OS !== "web",
      }),
    ]).start();
  }, [opacity, translateY]);

  return (
    <Animated.View
      style={[
        styles.toast,
        {
          opacity,
          transform: [{ translateY }],
        },
      ]}
    >
      <Ionicons name={typeIcon} size={20} color={typeColor} />
      <View style={styles.toastCopy}>
        <Text style={styles.toastTitle}>{toast.title}</Text>
        {toast.message ? <Text style={styles.toastMessage}>{toast.message}</Text> : null}
      </View>
      <Pressable
        accessibilityLabel="Dismiss notification"
        accessibilityRole="button"
        onPress={onDismiss}
        style={styles.dismissButton}
      >
        <Ionicons name="close" size={18} color={theme.colors.faint} />
      </Pressable>
    </Animated.View>
  );
}

function windowSafeTimeout(callback, duration) {
  return setTimeout(callback, duration);
}

function createStyles(colors) {
  return StyleSheet.create({
    dismissButton: {
      alignItems: "center",
      height: 44,
      justifyContent: "center",
      marginRight: -10,
      width: 44,
    },
    toast: {
      alignItems: "center",
      alignSelf: "flex-end",
      backgroundColor: colors.surfaceStrong,
      borderColor: colors.lineStrong,
      borderRadius: 8,
      borderWidth: 1,
      flexDirection: "row",
      marginBottom: 10,
      maxWidth: 420,
      minHeight: 58,
      paddingLeft: 14,
      paddingRight: 4,
      paddingVertical: 8,
      width: "100%",
      ...shadow(colors, 2),
    },
    toastCopy: {
      flex: 1,
      marginLeft: 10,
      minWidth: 0,
    },
    toastMessage: {
      color: colors.muted,
      fontSize: 12,
      fontWeight: "700",
      lineHeight: 16,
      marginTop: 2,
    },
    toastTitle: {
      color: colors.ink,
      fontSize: 14,
      fontWeight: "900",
      lineHeight: 18,
    },
    viewport: {
      left: 16,
      pointerEvents: "box-none",
      position: "absolute",
      right: 16,
      top: Platform.OS === "web" ? 18 : 48,
      zIndex: 90,
    },
  });
}
