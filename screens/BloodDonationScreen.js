import { Ionicons } from "@expo/vector-icons";
import { useEffect, useMemo, useState } from "react";
import {
  Pressable,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import {
  ActionRow,
  AnimatedEntrance,
  IconBadge,
  Panel,
  PrimaryButton,
  ScreenScaffold,
  SectionTitle,
  softShadow,
  tone,
  useResponsive,
} from "../components/VolunteerUI";
import { useToast } from "../context/ToastContext";
import { useVolunteerTheme } from "../context/ThemeContext";
import {
  bloodRequests,
  currentVolunteer,
  quickActions,
  volunteerEvents,
} from "../data/mockVolunteerData";

const bloodGroups = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];
const urgencyLevels = ["Normal", "High", "Critical"];

const initialForm = {
  bloodGroup: "B+",
  city: "Bangalore",
  contact: "555-0199",
  urgency: "High",
  units: "2",
  note: "Same-day donors preferred",
};

export default function BloodDonationScreen({ navigation }) {
  const theme = useVolunteerTheme();
  const responsive = useResponsive();
  const styles = useMemo(
    () => createStyles(theme.colors, responsive),
    [theme.colors, responsive.width],
  );
  const { showToast } = useToast();
  const [requests, setRequests] = useState(bloodRequests);
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [draftSaved, setDraftSaved] = useState(false);

  useEffect(() => {
    setDraftSaved(false);
    const timer = setTimeout(() => setDraftSaved(true), 650);
    return () => clearTimeout(timer);
  }, [form]);

  const updateForm = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  };

  const validate = () => {
    const nextErrors = {};
    if (!form.city.trim()) {
      nextErrors.city = "Add the hospital or city area.";
    }
    if (!/^[0-9+\-\s()]{7,}$/.test(form.contact.trim())) {
      nextErrors.contact = "Enter a reachable phone number.";
    }
    if (!Number(form.units) || Number(form.units) < 1) {
      nextErrors.units = "Units must be at least 1.";
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const postRequest = () => {
    if (!validate()) {
      showToast({
        title: "Check the form",
        message: "A few fields need attention before posting.",
        type: "error",
      });
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setRequests((current) => [
        {
          id: `br-${Date.now()}`,
          bloodGroup: form.bloodGroup,
          patient: "New Request",
          hospital: "Volunteer Network",
          contact: form.contact,
          units: Number(form.units) || 1,
          urgency: form.urgency,
          location: form.city,
          status: "Open",
        },
        ...current,
      ]);
      setIsSubmitting(false);
      setDraftSaved(true);
      showToast({
        title: "Request posted",
        message: `${form.bloodGroup} request is now visible to nearby donors.`,
      });
    }, 620);
  };

  return (
    <ScreenScaffold
      active="Create"
      navigation={navigation}
      onCreatePress={() => navigation.navigate("VolunteerEvents")}
      user={currentVolunteer}
    >
      <View style={styles.pageGrid}>
        <View style={styles.mainColumn}>
          <View style={styles.backRow}>
            <Pressable
              accessibilityLabel="Back to home"
              accessibilityRole="button"
              onPress={() => navigation.navigate("Home")}
              style={({ pressed, hovered, focused }) => [
                styles.backButton,
                (pressed || hovered) && styles.pressed,
                focused && styles.focusRing,
              ]}
            >
              <Ionicons name="arrow-back" size={22} color={theme.colors.ink} />
            </Pressable>
            <View style={styles.titleCopy}>
              <Text style={styles.pageTitle}>Request Blood</Text>
              <Text style={styles.pageSubtitle}>
                Fast, validated posting for urgent donor matching.
              </Text>
            </View>
          </View>

          <AnimatedEntrance>
            <Panel style={styles.requestPanel}>
              <View style={styles.panelHeader}>
                <View style={styles.bloodRow}>
                  <IconBadge icon="water" toneName="red" size={54} />
                  <View style={styles.bloodDetails}>
                    <Text style={styles.inputLabel}>Blood group</Text>
                    <View style={styles.bloodChips}>
                      {bloodGroups.map((group) => {
                        const selected = form.bloodGroup === group;
                        return (
                          <Pressable
                            key={group}
                            accessibilityLabel={`Blood group ${group}`}
                            accessibilityRole="button"
                            accessibilityState={{ selected }}
                            onPress={() => updateForm("bloodGroup", group)}
                            style={({ pressed, hovered, focused }) => [
                              styles.bloodChip,
                              selected && styles.bloodChipActive,
                              (pressed || hovered) && styles.pressed,
                              focused && styles.focusRing,
                            ]}
                          >
                            <Text
                              style={[
                                styles.bloodChipText,
                                selected && styles.bloodChipTextActive,
                              ]}
                            >
                              {group}
                            </Text>
                          </Pressable>
                        );
                      })}
                    </View>
                  </View>
                </View>
                <View style={styles.draftPill}>
                  <Ionicons
                    name={draftSaved ? "cloud-done-outline" : "sync-outline"}
                    size={15}
                    color={draftSaved ? theme.colors.success : theme.colors.faint}
                  />
                  <Text
                    style={[
                      styles.draftPillText,
                      draftSaved && { color: theme.colors.success },
                    ]}
                  >
                    {draftSaved ? "Draft saved" : "Saving"}
                  </Text>
                </View>
              </View>

              <View style={styles.formGrid}>
                <Field
                  label="Location"
                  value={form.city}
                  onChangeText={(city) => updateForm("city", city)}
                  placeholder="City or hospital area"
                  icon="location-outline"
                  error={errors.city}
                />
                <Field
                  label="Contact"
                  value={form.contact}
                  onChangeText={(contact) => updateForm("contact", contact)}
                  keyboardType="phone-pad"
                  placeholder="Phone number"
                  icon="call-outline"
                  error={errors.contact}
                />
                <Field
                  label="Units"
                  value={form.units}
                  onChangeText={(units) => updateForm("units", units.replace(/[^0-9]/g, ""))}
                  keyboardType="numeric"
                  placeholder="2"
                  icon="medkit-outline"
                  error={errors.units}
                />
                <View style={styles.inputWrap}>
                  <Text style={styles.inputLabel}>Urgency</Text>
                  <View style={styles.urgencyRow}>
                    {urgencyLevels.map((level) => {
                      const selected = form.urgency === level;
                      return (
                        <Pressable
                          key={level}
                          accessibilityRole="button"
                          accessibilityState={{ selected }}
                          onPress={() => updateForm("urgency", level)}
                          style={({ pressed, hovered, focused }) => [
                            styles.urgencyChip,
                            selected && styles.urgencyChipActive,
                            (pressed || hovered) && styles.pressed,
                            focused && styles.focusRing,
                          ]}
                        >
                          <Text
                            style={[
                              styles.urgencyChipText,
                              selected && styles.urgencyChipTextActive,
                            ]}
                          >
                            {level}
                          </Text>
                        </Pressable>
                      );
                    })}
                  </View>
                </View>
              </View>

              <Field
                label="Note"
                value={form.note}
                onChangeText={(note) => updateForm("note", note)}
                placeholder="Patient condition, hospital, or timing"
                icon="document-text-outline"
                multiline
              />

              <PrimaryButton
                icon="send"
                label={isSubmitting ? "Posting Request..." : "Post Request"}
                onPress={postRequest}
                loading={isSubmitting}
                style={styles.submitButton}
              />
            </Panel>
          </AnimatedEntrance>

          <AnimatedEntrance delay={140}>
            <View style={styles.sectionGap}>
              <SectionTitle
                title="Manage Requests"
                subtitle="Open requests are ready for donor matching and outreach."
              />
              <View style={styles.requestList}>
                {requests.map((request) => (
                  <View key={request.id} style={styles.manageCard}>
                    <IconBadge icon="water" toneName="red" size={44} />
                    <View style={styles.manageTextWrap}>
                      <Text style={styles.manageTitle} numberOfLines={2}>
                        {request.bloodGroup} for {request.patient}
                      </Text>
                      <Text style={styles.manageMeta} numberOfLines={2}>
                        {request.hospital} | {request.location} | {request.units} units
                      </Text>
                    </View>
                    <View style={styles.manageActions}>
                      <View style={styles.manageStatus}>
                        <Text style={styles.manageStatusText}>{request.status}</Text>
                      </View>
                      <Pressable
                        accessibilityLabel="Contact donor network"
                        accessibilityRole="button"
                        onPress={() =>
                          showToast({
                            title: "Donor network notified",
                            message: `${request.bloodGroup} donors are being contacted.`,
                            type: "info",
                          })
                        }
                        style={styles.miniAction}
                      >
                        <Ionicons name="call-outline" size={16} color={theme.colors.blue} />
                      </Pressable>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          </AnimatedEntrance>
        </View>

        <View style={styles.sideColumn}>
          <AnimatedEntrance delay={80}>
            <PreviewPanel form={form} />
          </AnimatedEntrance>

          <AnimatedEntrance delay={120}>
            <SectionTitle title="Create Post" />
            <View style={styles.actionStack}>
              {quickActions.map((action) => (
                <ActionRow
                  key={action.id}
                  item={action}
                  onPress={() => navigation.navigate(action.route)}
                />
              ))}
            </View>
          </AnimatedEntrance>

          <AnimatedEntrance delay={180}>
            <Panel style={styles.eventPanel}>
              <View style={styles.eventHeader}>
                <IconBadge icon="leaf" toneName="lime" />
                <View style={styles.eventTextWrap}>
                  <Text style={styles.eventTitle}>{volunteerEvents[1].title}</Text>
                  <Text style={styles.eventMeta}>
                    {volunteerEvents[1].volunteersJoined}/
                    {volunteerEvents[1].volunteersNeeded} volunteers
                  </Text>
                </View>
              </View>
              <View style={styles.progressTrack}>
                <View style={styles.progressFill} />
              </View>
            </Panel>
          </AnimatedEntrance>
        </View>
      </View>
    </ScreenScaffold>
  );
}

function Field({ label, icon, error, style, ...inputProps }) {
  const theme = useVolunteerTheme();
  const responsive = useResponsive();
  const styles = useMemo(
    () => createStyles(theme.colors, responsive),
    [theme.colors, responsive.width],
  );

  return (
    <View style={[styles.inputWrap, style]}>
      <Text style={styles.inputLabel}>{label}</Text>
      <View style={[styles.inputShell, error && styles.inputShellError]}>
        {icon ? <Ionicons name={icon} size={18} color={theme.colors.faint} /> : null}
        <TextInput
          {...inputProps}
          placeholderTextColor={theme.colors.faint}
          style={[styles.input, inputProps.multiline && styles.noteInput]}
        />
      </View>
      {error ? (
        <Text accessibilityRole="alert" style={styles.errorText}>
          {error}
        </Text>
      ) : null}
    </View>
  );
}

function PreviewPanel({ form }) {
  const theme = useVolunteerTheme();
  const responsive = useResponsive();
  const styles = useMemo(
    () => createStyles(theme.colors, responsive),
    [theme.colors, responsive.width],
  );
  const selectedTone = tone("red", theme.colors);

  return (
    <Panel style={styles.previewPanel}>
      <View style={styles.previewHeader}>
        <Text style={styles.previewTitle}>Live Preview</Text>
        <View style={[styles.previewBadge, { backgroundColor: selectedTone.bg }]}>
          <Text style={[styles.previewBadgeText, { color: selectedTone.icon }]}>
            {form.urgency}
          </Text>
        </View>
      </View>
      <View style={styles.previewCard}>
        <IconBadge icon="water" toneName="red" size={54} />
        <Text style={styles.previewBlood}>{form.bloodGroup} Blood Needed</Text>
        <Text style={styles.previewText}>
          {form.units || "1"} unit{Number(form.units) === 1 ? "" : "s"} requested near{" "}
          {form.city || "your location"}.
        </Text>
        <View style={styles.previewMetaRow}>
          <Ionicons name="call-outline" size={14} color={theme.colors.faint} />
          <Text style={styles.previewMeta}>{form.contact || "Add contact"}</Text>
        </View>
        <View style={styles.previewMetaRow}>
          <Ionicons name="document-text-outline" size={14} color={theme.colors.faint} />
          <Text style={styles.previewMeta} numberOfLines={2}>
            {form.note || "Add a short note for donors"}
          </Text>
        </View>
      </View>
    </Panel>
  );
}

function createStyles(themeColors, responsive) {
  const redTone = tone("red", themeColors);

  return StyleSheet.create({
    actionStack: {
      gap: 12,
      marginBottom: 20,
    },
    backButton: {
      alignItems: "center",
      backgroundColor: themeColors.glass,
      borderColor: themeColors.line,
      borderRadius: 8,
      borderWidth: 1,
      height: 44,
      justifyContent: "center",
      marginRight: 12,
      width: 44,
    },
    backRow: {
      alignItems: "center",
      flexDirection: "row",
      marginBottom: 16,
    },
    bloodChip: {
      alignItems: "center",
      backgroundColor: themeColors.surfaceStrong,
      borderColor: themeColors.line,
      borderRadius: 8,
      borderWidth: 1,
      minHeight: 44,
      justifyContent: "center",
      minWidth: 54,
      paddingHorizontal: 12,
    },
    bloodChipActive: {
      backgroundColor: redTone.bg,
      borderColor: redTone.icon,
    },
    bloodChipText: {
      color: themeColors.muted,
      fontSize: 14,
      fontWeight: "900",
    },
    bloodChipTextActive: {
      color: redTone.icon,
    },
    bloodChips: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 8,
      marginTop: 8,
    },
    bloodDetails: {
      flex: 1,
      marginLeft: 14,
      minWidth: 0,
    },
    bloodRow: {
      alignItems: "center",
      flex: 1,
      flexDirection: "row",
      minWidth: responsive.isMobile ? "100%" : 360,
    },
    draftPill: {
      alignItems: "center",
      alignSelf: "flex-start",
      backgroundColor: themeColors.surfaceStrong,
      borderColor: themeColors.line,
      borderRadius: 8,
      borderWidth: 1,
      flexDirection: "row",
      minHeight: 36,
      paddingHorizontal: 10,
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
    eventHeader: {
      alignItems: "center",
      flexDirection: "row",
    },
    eventMeta: {
      color: themeColors.muted,
      fontSize: 13,
      fontWeight: "800",
      marginTop: 3,
    },
    eventPanel: {
      marginTop: 2,
    },
    eventTextWrap: {
      flex: 1,
      marginLeft: 12,
      minWidth: 0,
    },
    eventTitle: {
      color: themeColors.ink,
      fontSize: 16,
      fontWeight: "900",
    },
    focusRing: {
      borderColor: themeColors.focus,
      borderWidth: 2,
    },
    formGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 12,
    },
    input: {
      color: themeColors.ink,
      flex: 1,
      fontSize: 16,
      fontWeight: "800",
      minHeight: 48,
      outlineStyle: "none",
      paddingHorizontal: 10,
      paddingVertical: 10,
      textAlignVertical: "center",
    },
    inputLabel: {
      color: themeColors.muted,
      fontSize: 12,
      fontWeight: "900",
      marginBottom: 7,
      textTransform: "uppercase",
    },
    inputShell: {
      alignItems: "center",
      backgroundColor: themeColors.surfaceStrong,
      borderColor: themeColors.line,
      borderRadius: 8,
      borderWidth: 1,
      flexDirection: "row",
      minHeight: 52,
      paddingLeft: 12,
    },
    inputShellError: {
      borderColor: themeColors.danger,
    },
    inputWrap: {
      flexBasis: responsive.isMobile ? "100%" : 230,
      flexGrow: 1,
      marginBottom: 12,
    },
    mainColumn: {
      flex: 1,
      minWidth: 0,
    },
    manageActions: {
      alignItems: "center",
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 8,
      justifyContent: "flex-end",
    },
    manageCard: {
      alignItems: responsive.isMobile ? "flex-start" : "center",
      backgroundColor: themeColors.surfaceStrong,
      borderColor: themeColors.line,
      borderRadius: 8,
      borderWidth: 1,
      flexDirection: responsive.isMobile ? "column" : "row",
      gap: responsive.isMobile ? 12 : 0,
      minHeight: 78,
      padding: 14,
      ...softShadow(1, themeColors),
    },
    manageMeta: {
      color: themeColors.muted,
      fontSize: 13,
      fontWeight: "700",
      lineHeight: 18,
      marginTop: 4,
    },
    manageStatus: {
      backgroundColor: themeColors.greenSoft,
      borderRadius: 8,
      paddingHorizontal: 10,
      paddingVertical: 6,
    },
    manageStatusText: {
      color: themeColors.green,
      fontSize: 11,
      fontWeight: "900",
      textTransform: "uppercase",
    },
    manageTextWrap: {
      flex: 1,
      marginHorizontal: responsive.isMobile ? 0 : 12,
      minWidth: 0,
      width: responsive.isMobile ? "100%" : undefined,
    },
    manageTitle: {
      color: themeColors.ink,
      fontSize: 16,
      fontWeight: "900",
      lineHeight: 21,
    },
    miniAction: {
      alignItems: "center",
      backgroundColor: themeColors.blueSoft,
      borderRadius: 8,
      height: 36,
      justifyContent: "center",
      width: 36,
    },
    noteInput: {
      minHeight: 88,
      paddingTop: 12,
      textAlignVertical: "top",
    },
    pageGrid: {
      flexDirection: responsive.isCompact ? "column" : "row",
      gap: 24,
    },
    pageSubtitle: {
      color: themeColors.muted,
      fontSize: 13,
      fontWeight: "700",
      lineHeight: 18,
      marginTop: 3,
    },
    pageTitle: {
      color: themeColors.ink,
      fontSize: responsive.isMobile ? 25 : 30,
      fontWeight: "900",
      lineHeight: responsive.isMobile ? 31 : 37,
    },
    panelHeader: {
      alignItems: "flex-start",
      flexDirection: responsive.isMobile ? "column" : "row",
      gap: 12,
      justifyContent: "space-between",
      marginBottom: 18,
    },
    pressed: {
      opacity: 0.8,
      transform: [{ scale: 0.99 }],
    },
    previewBadge: {
      borderRadius: 8,
      paddingHorizontal: 10,
      paddingVertical: 5,
    },
    previewBadgeText: {
      fontSize: 11,
      fontWeight: "900",
      textTransform: "uppercase",
    },
    previewBlood: {
      color: themeColors.ink,
      fontSize: 18,
      fontWeight: "900",
      lineHeight: 24,
      marginTop: 16,
    },
    previewCard: {
      backgroundColor: themeColors.surfaceStrong,
      borderColor: themeColors.line,
      borderRadius: 8,
      borderWidth: 1,
      marginTop: 14,
      padding: 18,
    },
    previewHeader: {
      alignItems: "center",
      flexDirection: "row",
      justifyContent: "space-between",
    },
    previewMeta: {
      color: themeColors.muted,
      flex: 1,
      fontSize: 13,
      fontWeight: "800",
      lineHeight: 18,
      marginLeft: 8,
    },
    previewMetaRow: {
      alignItems: "flex-start",
      flexDirection: "row",
      marginTop: 14,
    },
    previewPanel: {
      marginBottom: 20,
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
    previewText: {
      color: themeColors.muted,
      fontSize: 14,
      fontWeight: "700",
      lineHeight: 20,
      marginTop: 8,
    },
    previewTitle: {
      color: themeColors.ink,
      fontSize: 18,
      fontWeight: "900",
    },
    progressFill: {
      backgroundColor: themeColors.lime,
      borderRadius: 8,
      height: "100%",
      width: "48%",
    },
    progressTrack: {
      backgroundColor: themeColors.limeSoft,
      borderRadius: 8,
      height: 10,
      marginTop: 16,
      overflow: "hidden",
    },
    requestList: {
      gap: 12,
    },
    requestPanel: {
      padding: responsive.isMobile ? 16 : 22,
    },
    sectionGap: {
      marginTop: 26,
    },
    sideColumn: {
      minWidth: 0,
      width: responsive.isCompact ? "100%" : 360,
    },
    submitButton: {
      marginTop: 8,
      width: "100%",
    },
    titleCopy: {
      flex: 1,
      minWidth: 0,
    },
    urgencyChip: {
      alignItems: "center",
      backgroundColor: themeColors.surfaceStrong,
      borderColor: themeColors.line,
      borderRadius: 8,
      borderWidth: 1,
      flex: 1,
      minHeight: 50,
      justifyContent: "center",
      minWidth: 82,
    },
    urgencyChipActive: {
      backgroundColor: redTone.bg,
      borderColor: redTone.icon,
    },
    urgencyChipText: {
      color: themeColors.muted,
      fontSize: 13,
      fontWeight: "900",
    },
    urgencyChipTextActive: {
      color: redTone.icon,
    },
    urgencyRow: {
      flexDirection: "row",
      gap: 8,
    },
  });
}
