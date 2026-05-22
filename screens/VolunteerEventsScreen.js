import { Ionicons } from "@expo/vector-icons";
import { useEffect, useMemo, useState } from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import {
  AnimatedEntrance,
  IconBadge,
  Panel,
  PrimaryButton,
  ScreenScaffold,
  softShadow,
  tone,
  useResponsive,
} from "../components/VolunteerUI";
import { useToast } from "../context/ToastContext";
import { useVolunteerTheme } from "../context/ThemeContext";
import {
  createPostOptions,
  currentVolunteer,
  wizardSteps,
} from "../data/mockVolunteerData";

const initialDetails = {
  title: "B+ donors needed",
  description: "Same-day donors preferred. Please contact before visiting.",
  location: "Green Clinic, Bangalore",
};

export default function VolunteerEventsScreen({ navigation }) {
  const theme = useVolunteerTheme();
  const responsive = useResponsive();
  const styles = useMemo(
    () => createStyles(theme.colors, responsive),
    [theme.colors, responsive.width],
  );
  const { showToast } = useToast();
  const [selected, setSelected] = useState(createPostOptions[0]);
  const [currentStep, setCurrentStep] = useState(0);
  const [details, setDetails] = useState(initialDetails);
  const [errors, setErrors] = useState({});
  const [isPublishing, setIsPublishing] = useState(false);
  const [draftSaved, setDraftSaved] = useState(true);

  useEffect(() => {
    setDraftSaved(false);
    const timer = setTimeout(() => setDraftSaved(true), 600);
    return () => clearTimeout(timer);
  }, [details, selected]);

  const updateDetail = (field, value) => {
    setDetails((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  };

  const validateStep = () => {
    const nextErrors = {};
    if (currentStep === 1) {
      if (!details.title.trim()) {
        nextErrors.title = "Add a clear post title.";
      }
      if (details.description.trim().length < 12) {
        nextErrors.description = "Add a little more detail for volunteers.";
      }
    }
    if (currentStep === 2 && !details.location.trim()) {
      nextErrors.location = "Add where help is needed.";
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      showToast({
        title: "Almost there",
        message: "Please complete the highlighted fields.",
        type: "error",
      });
      return false;
    }
    return true;
  };

  const goNext = () => {
    if (!validateStep()) {
      return;
    }
    if (currentStep < wizardSteps.length - 1) {
      setCurrentStep((step) => step + 1);
      return;
    }

    setIsPublishing(true);
    setTimeout(() => {
      setIsPublishing(false);
      showToast({
        title: "Post ready",
        message: `${selected.title} was prepared for your community feed.`,
      });
      if (selected.id === "blood") {
        navigation.navigate("BloodDonation");
      } else {
        navigation.navigate("Home");
      }
    }, 650);
  };

  const goBack = () => {
    if (currentStep === 0) {
      navigation.navigate("Home");
      return;
    }
    setCurrentStep((step) => step - 1);
  };

  return (
    <ScreenScaffold active="Create" navigation={navigation} user={currentVolunteer}>
      <View style={styles.backRow}>
        <Pressable
          accessibilityLabel={currentStep === 0 ? "Back home" : "Previous step"}
          accessibilityRole="button"
          onPress={goBack}
          style={({ pressed, hovered, focused }) => [
            styles.backButton,
            (pressed || hovered) && styles.pressed,
            focused && styles.focusRing,
          ]}
        >
          <Ionicons name="arrow-back" size={20} color={theme.colors.ink} />
          <Text style={styles.backText}>{currentStep === 0 ? "Back" : "Previous"}</Text>
        </Pressable>
        <View style={styles.draftPill}>
          <Ionicons
            name={draftSaved ? "cloud-done-outline" : "sync-outline"}
            size={15}
            color={draftSaved ? theme.colors.success : theme.colors.faint}
          />
          <Text
            style={[styles.draftPillText, draftSaved && { color: theme.colors.success }]}
          >
            {draftSaved ? "Draft saved" : "Saving"}
          </Text>
        </View>
      </View>

      <View style={styles.creatorGrid}>
        <AnimatedEntrance style={styles.stepperColumn}>
          <Stepper currentStep={currentStep} onSelect={setCurrentStep} />
        </AnimatedEntrance>

        <AnimatedEntrance delay={80} style={styles.selectionColumn}>
          <Text style={styles.questionTitle}>{wizardSteps[currentStep].title}</Text>
          <Text style={styles.questionSubtitle}>{wizardSteps[currentStep].subtitle}</Text>

          {currentStep === 0 ? (
            <View style={styles.optionGrid}>
              {createPostOptions.map((option, index) => (
                <PostOption
                  key={option.id}
                  option={option}
                  selected={selected.id === option.id}
                  delay={120 + index * 45}
                  onPress={() => setSelected(option)}
                />
              ))}
            </View>
          ) : null}

          {currentStep === 1 ? (
            <View style={styles.formStack}>
              <Field
                label="Title"
                value={details.title}
                onChangeText={(title) => updateDetail("title", title)}
                placeholder="Example: Drivers needed for animal rescue"
                error={errors.title}
              />
              <Field
                label="Details"
                value={details.description}
                onChangeText={(description) => updateDetail("description", description)}
                placeholder="What should volunteers know?"
                multiline
                error={errors.description}
              />
            </View>
          ) : null}

          {currentStep === 2 ? (
            <View style={styles.formStack}>
              <Field
                label="Location"
                value={details.location}
                onChangeText={(location) => updateDetail("location", location)}
                placeholder="Area, landmark, NGO, or hospital"
                error={errors.location}
              />
              <View style={styles.locationAssist}>
                <IconBadge icon="navigate-outline" toneName="blue" size={42} />
                <View style={styles.locationAssistCopy}>
                  <Text style={styles.locationAssistTitle}>Nearby matching is on</Text>
                  <Text style={styles.locationAssistText}>
                    Volunteers will see distance, travel context, and verified contact prompts.
                  </Text>
                </View>
              </View>
            </View>
          ) : null}

          {currentStep === 3 ? (
            <Panel style={styles.reviewPanel}>
              <View style={styles.reviewRow}>
                <Text style={styles.reviewLabel}>Type</Text>
                <Text style={styles.reviewValue}>{selected.title}</Text>
              </View>
              <View style={styles.reviewRow}>
                <Text style={styles.reviewLabel}>Title</Text>
                <Text style={styles.reviewValue}>{details.title}</Text>
              </View>
              <View style={styles.reviewRow}>
                <Text style={styles.reviewLabel}>Location</Text>
                <Text style={styles.reviewValue}>{details.location}</Text>
              </View>
            </Panel>
          ) : null}

          <View style={styles.buttonRow}>
            <PrimaryButton
              icon="arrow-back"
              label="Back"
              onPress={goBack}
              variant="light"
              style={styles.secondaryButton}
            />
            <PrimaryButton
              icon={currentStep === wizardSteps.length - 1 ? "sparkles" : "arrow-forward"}
              label={
                currentStep === wizardSteps.length - 1
                  ? isPublishing
                    ? "Publishing..."
                    : "Publish"
                  : "Continue"
              }
              onPress={goNext}
              loading={isPublishing}
              style={styles.continueButton}
            />
          </View>
        </AnimatedEntrance>

        <AnimatedEntrance delay={160} style={styles.previewColumn}>
          <PreviewPanel selected={selected} details={details} />
        </AnimatedEntrance>
      </View>
    </ScreenScaffold>
  );
}

function Stepper({ currentStep, onSelect }) {
  const theme = useVolunteerTheme();
  const responsive = useResponsive();
  const styles = useMemo(
    () => createStyles(theme.colors, responsive),
    [theme.colors, responsive.width],
  );

  const content = wizardSteps.map((step, index) => {
    const active = index === currentStep;
    const complete = index < currentStep;

    return (
      <Pressable
        key={step.number}
        accessibilityLabel={`${step.title} step`}
        accessibilityRole="button"
        accessibilityState={{ selected: active }}
        onPress={() => onSelect(index)}
        style={({ pressed, hovered, focused }) => [
          styles.stepCard,
          active && styles.stepCardActive,
          (pressed || hovered) && styles.pressed,
          focused && styles.focusRing,
        ]}
      >
        <View
          style={[
            styles.stepNumber,
            active && styles.stepNumberActive,
            complete && styles.stepNumberComplete,
          ]}
        >
          <Ionicons
            name={complete ? "checkmark" : active ? "radio-button-on" : "ellipse-outline"}
            size={complete ? 16 : 14}
            color={active || complete ? theme.colors.textOnAccent : theme.colors.faint}
          />
        </View>
        <View style={styles.stepCopy}>
          <Text style={[styles.stepTitle, active && styles.stepTitleActive]}>
            {step.title}
          </Text>
          <Text style={styles.stepSubtitle} numberOfLines={2}>{step.subtitle}</Text>
        </View>
      </Pressable>
    );
  });

  if (responsive.isMobile) {
    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.mobileStepper}
      >
        {content}
      </ScrollView>
    );
  }

  return <View style={styles.desktopStepper}>{content}</View>;
}

function PostOption({ option, selected, delay, onPress }) {
  const theme = useVolunteerTheme();
  const responsive = useResponsive();
  const styles = useMemo(
    () => createStyles(theme.colors, responsive),
    [theme.colors, responsive.width],
  );
  const selectedTone = tone(option.tone, theme.colors);

  return (
    <AnimatedEntrance delay={delay} style={styles.optionWrap}>
      <Pressable
        accessibilityLabel={option.title}
        accessibilityRole="button"
        accessibilityState={{ selected }}
        onPress={onPress}
        style={({ pressed, hovered, focused }) => [
          styles.optionCard,
          selected && styles.optionCardActive,
          (pressed || hovered) && styles.cardHover,
          pressed && styles.pressed,
          focused && styles.focusRing,
        ]}
      >
        <View style={[styles.optionGlow, { backgroundColor: selectedTone.bg }]} />
        <IconBadge icon={option.icon} toneName={option.tone} size={52} />
        {selected ? (
          <View style={[styles.optionCheck, { backgroundColor: selectedTone.icon }]}>
            <Ionicons name="checkmark" size={13} color={theme.colors.textOnAccent} />
          </View>
        ) : null}
        <Text style={styles.optionTitle}>{option.title}</Text>
        <Text style={styles.optionSubtitle}>{option.subtitle}</Text>
      </Pressable>
    </AnimatedEntrance>
  );
}

function Field({ label, error, multiline, style, ...inputProps }) {
  const theme = useVolunteerTheme();
  const responsive = useResponsive();
  const styles = useMemo(
    () => createStyles(theme.colors, responsive),
    [theme.colors, responsive.width],
  );

  return (
    <View style={[styles.fieldWrap, style]}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        {...inputProps}
        multiline={multiline}
        placeholderTextColor={theme.colors.faint}
        style={[
          styles.input,
          multiline && styles.multilineInput,
          error && styles.inputError,
        ]}
      />
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

function PreviewPanel({ selected, details }) {
  const theme = useVolunteerTheme();
  const responsive = useResponsive();
  const styles = useMemo(
    () => createStyles(theme.colors, responsive),
    [theme.colors, responsive.width],
  );
  const selectedTone = tone(selected.tone, theme.colors);

  return (
    <Panel style={styles.previewPanel}>
      <View style={styles.previewHeader}>
        <Text style={styles.previewTitle}>Preview</Text>
        <View style={[styles.previewBadge, { backgroundColor: selectedTone.bg }]}>
          <Text style={[styles.previewBadgeText, { color: selectedTone.icon }]}>
            {selected.title}
          </Text>
        </View>
      </View>
      <View style={styles.previewCard}>
        <IconBadge icon={selected.icon} toneName={selected.tone} size={58} />
        <Text style={styles.previewPostTitle}>{details.title || selected.title}</Text>
        <Text style={styles.previewDescription}>
          {details.description || selected.subtitle}
        </Text>
        <View style={styles.previewMetaRow}>
          <Ionicons name="location-outline" size={14} color={theme.colors.faint} />
          <Text style={styles.previewMeta}>{details.location || "Add location"}</Text>
        </View>
        <Text style={styles.previewByline}>Posted by you</Text>
      </View>
    </Panel>
  );
}

function createStyles(themeColors, responsive) {
  const isDark = themeColors.mode === "dark";

  return StyleSheet.create({
    backButton: {
      alignItems: "center",
      backgroundColor: themeColors.glass,
      borderColor: themeColors.line,
      borderRadius: 8,
      borderWidth: 1,
      flexDirection: "row",
      gap: 10,
      minHeight: 44,
      paddingHorizontal: 13,
    },
    backRow: {
      alignItems: "center",
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 22,
    },
    backText: {
      color: themeColors.ink,
      fontSize: 14,
      fontWeight: "900",
    },
    buttonRow: {
      flexDirection: responsive.isMobile ? "column" : "row",
      gap: 12,
      justifyContent: "flex-end",
      marginTop: 24,
    },
    cardHover: {
      transform: [{ translateY: -2 }],
    },
    continueButton: {
      minWidth: responsive.isMobile ? "100%" : 170,
    },
    creatorGrid: {
      alignItems: "flex-start",
      flexDirection: responsive.isCompact ? "column" : "row",
      gap: responsive.isMobile ? 20 : 30,
    },
    desktopStepper: {
      gap: 10,
      width: "100%",
    },
    draftPill: {
      alignItems: "center",
      backgroundColor: themeColors.surfaceStrong,
      borderColor: themeColors.line,
      borderRadius: 8,
      borderWidth: 1,
      flexDirection: "row",
      minHeight: 38,
      paddingHorizontal: 11,
    },
    draftPillText: {
      color: themeColors.faint,
      fontSize: 12,
      fontWeight: "900",
      marginLeft: 6,
    },
    errorText: {
      color: themeColors.danger,
      fontSize: 12,
      fontWeight: "800",
      lineHeight: 16,
      marginTop: 6,
    },
    fieldLabel: {
      color: themeColors.muted,
      fontSize: 12,
      fontWeight: "900",
      marginBottom: 7,
      textTransform: "uppercase",
    },
    fieldWrap: {
      width: "100%",
    },
    focusRing: {
      borderColor: themeColors.focus,
      borderWidth: 2,
    },
    formStack: {
      gap: 14,
      marginTop: 28,
    },
    input: {
      backgroundColor: themeColors.surfaceStrong,
      borderColor: themeColors.line,
      borderRadius: 8,
      borderWidth: 1,
      color: themeColors.ink,
      fontSize: 16,
      fontWeight: "800",
      minHeight: 52,
      outlineStyle: "none",
      paddingHorizontal: 14,
      paddingVertical: 10,
    },
    inputError: {
      borderColor: themeColors.danger,
    },
    locationAssist: {
      alignItems: "center",
      backgroundColor: themeColors.blueSoft,
      borderColor: themeColors.line,
      borderRadius: 8,
      borderWidth: 1,
      flexDirection: "row",
      padding: 14,
    },
    locationAssistCopy: {
      flex: 1,
      marginLeft: 12,
      minWidth: 0,
    },
    locationAssistText: {
      color: themeColors.muted,
      fontSize: 13,
      fontWeight: "700",
      lineHeight: 18,
      marginTop: 4,
    },
    locationAssistTitle: {
      color: themeColors.ink,
      fontSize: 15,
      fontWeight: "900",
    },
    mobileStepper: {
      flexDirection: "row",
      gap: 10,
      paddingRight: 18,
    },
    multilineInput: {
      minHeight: 132,
      textAlignVertical: "top",
    },
    optionCard: {
      backgroundColor: themeColors.surfaceStrong,
      borderColor: themeColors.line,
      borderRadius: 8,
      borderWidth: 1,
      minHeight: 166,
      overflow: "hidden",
      padding: 18,
      position: "relative",
      ...softShadow(1, themeColors),
    },
    optionCardActive: {
      borderColor: themeColors.blue,
      borderWidth: 2,
    },
    optionCheck: {
      alignItems: "center",
      borderColor: themeColors.surfaceStrong,
      borderRadius: 8,
      borderWidth: 2,
      height: 24,
      justifyContent: "center",
      position: "absolute",
      right: 12,
      top: 12,
      width: 24,
    },
    optionGlow: {
      bottom: -26,
      height: 82,
      opacity: isDark ? 0.22 : 0.5,
      position: "absolute",
      right: -20,
      width: 82,
    },
    optionGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 16,
      marginTop: 28,
    },
    optionSubtitle: {
      color: themeColors.muted,
      fontSize: 13,
      fontWeight: "700",
      lineHeight: 19,
      marginTop: 6,
    },
    optionTitle: {
      color: themeColors.ink,
      fontSize: 15,
      fontWeight: "900",
      lineHeight: 20,
      marginTop: 18,
    },
    optionWrap: {
      flexBasis: responsive.isMobile ? "100%" : 220,
      flexGrow: 1,
      maxWidth: responsive.isMobile ? "100%" : 290,
      minWidth: responsive.isMobile ? "100%" : 210,
    },
    pressed: {
      opacity: 0.82,
      transform: [{ scale: 0.99 }],
    },
    previewBadge: {
      borderRadius: 8,
      maxWidth: 170,
      paddingHorizontal: 10,
      paddingVertical: 5,
    },
    previewBadgeText: {
      fontSize: 11,
      fontWeight: "900",
      textTransform: "uppercase",
    },
    previewByline: {
      color: themeColors.muted,
      fontSize: 13,
      fontWeight: "700",
      marginTop: 20,
    },
    previewCard: {
      backgroundColor: themeColors.surfaceStrong,
      borderColor: themeColors.line,
      borderRadius: 8,
      borderWidth: 1,
      marginTop: 16,
      padding: 20,
      ...softShadow(1, themeColors),
    },
    previewColumn: {
      width: responsive.isCompact ? "100%" : 330,
      ...Platform.select({
        web: responsive.isCompact
          ? {}
          : {
              position: "sticky",
              top: 18,
            },
        default: {},
      }),
    },
    previewDescription: {
      color: themeColors.muted,
      fontSize: 13,
      fontWeight: "700",
      lineHeight: 19,
      marginTop: 10,
    },
    previewHeader: {
      alignItems: "center",
      flexDirection: "row",
      justifyContent: "space-between",
    },
    previewMeta: {
      color: themeColors.muted,
      flex: 1,
      fontSize: 12,
      fontWeight: "800",
      lineHeight: 17,
      marginLeft: 6,
    },
    previewMetaRow: {
      alignItems: "flex-start",
      flexDirection: "row",
      marginTop: 18,
    },
    previewPanel: {
      width: "100%",
    },
    previewPostTitle: {
      color: themeColors.ink,
      fontSize: 18,
      fontWeight: "900",
      lineHeight: 24,
      marginTop: 18,
    },
    previewTitle: {
      color: themeColors.ink,
      fontSize: 18,
      fontWeight: "900",
    },
    questionSubtitle: {
      color: themeColors.muted,
      fontSize: 14,
      fontWeight: "700",
      lineHeight: 20,
      marginTop: 8,
    },
    questionTitle: {
      color: themeColors.ink,
      fontSize: responsive.isMobile ? 24 : 28,
      fontWeight: "900",
      lineHeight: responsive.isMobile ? 30 : 35,
    },
    reviewLabel: {
      color: themeColors.faint,
      fontSize: 12,
      fontWeight: "900",
      textTransform: "uppercase",
    },
    reviewPanel: {
      gap: 14,
      marginTop: 28,
    },
    reviewRow: {
      borderBottomColor: themeColors.line,
      borderBottomWidth: 1,
      paddingBottom: 12,
    },
    reviewValue: {
      color: themeColors.ink,
      fontSize: 16,
      fontWeight: "900",
      lineHeight: 22,
      marginTop: 4,
    },
    secondaryButton: {
      minWidth: responsive.isMobile ? "100%" : 130,
    },
    selectionColumn: {
      flex: 1,
      maxWidth: responsive.isCompact ? "100%" : 720,
      minWidth: 0,
      width: responsive.isCompact ? "100%" : undefined,
    },
    stepCard: {
      alignItems: "center",
      backgroundColor: themeColors.glass,
      borderColor: themeColors.line,
      borderRadius: 8,
      borderWidth: 1,
      flexDirection: "row",
      minHeight: responsive.isMobile ? 70 : 78,
      minWidth: responsive.isMobile ? 210 : undefined,
      paddingHorizontal: 12,
      paddingVertical: 10,
    },
    stepCardActive: {
      backgroundColor: themeColors.blueSoft,
      borderColor: themeColors.blue,
    },
    stepCopy: {
      flex: 1,
      minWidth: 0,
    },
    stepNumber: {
      alignItems: "center",
      backgroundColor: themeColors.surfaceStrong,
      borderColor: themeColors.lineStrong,
      borderRadius: 8,
      borderWidth: 1,
      height: 34,
      justifyContent: "center",
      marginRight: 12,
      width: 34,
    },
    stepNumberActive: {
      backgroundColor: themeColors.blue,
      borderColor: themeColors.blue,
    },
    stepNumberComplete: {
      backgroundColor: themeColors.success,
      borderColor: themeColors.success,
    },
    stepperColumn: {
      width: responsive.isCompact ? "100%" : 245,
    },
    stepSubtitle: {
      color: themeColors.muted,
      fontSize: 12,
      fontWeight: "700",
      lineHeight: 16,
      marginTop: 4,
    },
    stepTitle: {
      color: themeColors.muted,
      fontSize: 14,
      fontWeight: "900",
    },
    stepTitleActive: {
      color: themeColors.blue,
    },
  });
}
