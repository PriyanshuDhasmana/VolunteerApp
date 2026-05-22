export const currentVolunteer = {
  name: "Priyanshu Gupta",
  firstName: "Priyanshu",
  role: "Volunteer",
  email: "priyanshu@example.com",
  phone: "555-0123",
  avatarInitials: "PG",
  bloodGroup: "B+",
  city: "Bangalore",
  interests: ["Blood", "Animals", "Environment"],
};

export const causeCategories = [
  { key: "all", label: "All", icon: "heart", tone: "aqua" },
  { key: "blood", label: "Blood", icon: "water", tone: "red" },
  { key: "animals", label: "Animals", icon: "paw", tone: "green" },
  { key: "environment", label: "Environment", icon: "leaf", tone: "lime" },
  { key: "ngo", label: "NGOs", icon: "people", tone: "blue" },
];

export const exploreCauses = [
  { id: "blood", label: "Blood Donation Nearby", icon: "water", tone: "red" },
  { id: "animals", label: "Animal Rescue & Care", icon: "paw", tone: "green" },
  { id: "plantation", label: "Plantation Drives", icon: "leaf", tone: "lime" },
  { id: "teach", label: "Teach & Support Kids", icon: "school", tone: "yellow" },
  { id: "ngo", label: "Connect with Local NGOs", icon: "people", tone: "blue" },
  { id: "relief", label: "Food & Relief Drives", icon: "cube", tone: "violet" },
];

export const quickActions = [
  {
    id: "blood",
    title: "Request Blood",
    subtitle: "Post urgent blood needs",
    icon: "water",
    route: "BloodDonation",
    tone: "red",
  },
  {
    id: "event",
    title: "Create Event",
    subtitle: "Host a volunteer event",
    icon: "calendar",
    route: "VolunteerEvents",
    tone: "blue",
  },
  {
    id: "volunteer",
    title: "Volunteer Now",
    subtitle: "Match with nearby causes",
    icon: "hand-left",
    route: "Home",
    tone: "green",
  },
  {
    id: "ngo",
    title: "Register NGO",
    subtitle: "Build your organization profile",
    icon: "business",
    route: "VolunteerEvents",
    tone: "violet",
  },
];

export const feedItems = [
  {
    id: "req-101",
    type: "Request Blood",
    title: "Request Blood",
    summary: "B+ donors needed for a same-day transfusion.",
    postedBy: "Rahul",
    distance: "7 km",
    location: "Green Clinic",
    time: "6 min ago",
    urgency: "Critical",
    icon: "water",
    tone: "red",
  },
  {
    id: "evt-207",
    type: "Plantation Drives",
    title: "Plantation Drives",
    summary: "Sapling care drive at the lake trail.",
    postedBy: "Greenwood Shelter",
    distance: "2 km",
    location: "Dove Volunteer App",
    time: "Today",
    urgency: "Open",
    icon: "leaf",
    tone: "lime",
  },
  {
    id: "ngo-320",
    type: "Animal Rescue",
    title: "Animal Rescue Transport",
    summary: "One driver needed for a veterinary drop.",
    postedBy: "Care Animal Shelter",
    distance: "4 km",
    location: "Indiranagar",
    time: "1 hr ago",
    urgency: "Fast",
    icon: "paw",
    tone: "green",
  },
];

export const urgentRequests = [
  {
    id: "urgent-1",
    title: "B+ Blood Needed",
    person: "Rahul, 28 yrs",
    distance: "2.4 km away",
    time: "6 min ago",
    urgency: "Critical",
    icon: "water",
    tone: "red",
  },
  {
    id: "urgent-2",
    title: "O- Blood Needed",
    person: "Priya, 32 yrs",
    distance: "3.1 km away",
    time: "12 min ago",
    urgency: "Critical",
    icon: "water",
    tone: "red",
  },
  {
    id: "urgent-3",
    title: "Animal Rescue",
    person: "Golden Retriever",
    distance: "4.7 km away",
    time: "25 min ago",
    urgency: "Urgent",
    icon: "paw",
    tone: "yellow",
  },
];

export const recentRequests = [
  {
    id: "recent-1",
    title: "Request Blood",
    summary: "B+ donors needed for a same-day transfusion.",
    postedBy: "Rahul",
    distance: "2.4 km away",
    time: "6 min ago",
    icon: "water",
    tone: "red",
  },
  {
    id: "recent-2",
    title: "Plantation Drive",
    summary: "Sapling care drive at the lake trail.",
    postedBy: "Greenwood Shelter",
    distance: "1.8 km away",
    time: "Today",
    icon: "leaf",
    tone: "green",
  },
  {
    id: "recent-3",
    title: "Animal Rescue Transport",
    summary: "Driver needed for a veterinary drop.",
    postedBy: "Care Animal Shelter",
    distance: "4.1 km away",
    time: "1 hr ago",
    icon: "paw",
    tone: "aqua",
  },
];

export const createPostOptions = [
  {
    id: "blood",
    title: "Request Blood",
    subtitle: "Request blood donation for someone in need.",
    icon: "water",
    tone: "red",
  },
  {
    id: "event",
    title: "Create Event",
    subtitle: "Host an event or volunteer activity.",
    icon: "calendar",
    tone: "blue",
  },
  {
    id: "animal",
    title: "Animal Rescue",
    subtitle: "Report or request help for an animal.",
    icon: "paw",
    tone: "green",
  },
  {
    id: "plantation",
    title: "Plantation Drive",
    subtitle: "Organize or join an environment drive.",
    icon: "leaf",
    tone: "green",
  },
  {
    id: "teach",
    title: "Teach & Support Kids",
    subtitle: "Support education and empower children.",
    icon: "school",
    tone: "yellow",
  },
  {
    id: "general",
    title: "Other / General",
    subtitle: "Post any other cause or request.",
    icon: "ellipsis-horizontal",
    tone: "violet",
  },
];

export const wizardSteps = [
  { number: "1", title: "Select Type", subtitle: "Choose the type of post" },
  { number: "2", title: "Details", subtitle: "Provide more information" },
  { number: "3", title: "Location", subtitle: "Where is it needed?" },
  { number: "4", title: "Review", subtitle: "Preview and confirm" },
];

export const bloodRequests = [
  {
    id: "br-1",
    bloodGroup: "B+",
    patient: "Anita Rao",
    hospital: "Green Clinic",
    contact: "555-0199",
    units: 2,
    urgency: "High",
    location: "Bangalore",
    status: "Open",
  },
  {
    id: "br-2",
    bloodGroup: "O-",
    patient: "Sameer Khan",
    hospital: "City Care",
    contact: "555-0184",
    units: 1,
    urgency: "Critical",
    location: "Koramangala",
    status: "Matching",
  },
];

export const volunteerEvents = [
  {
    id: "ev-1",
    title: "Weekend Puppy Adoption",
    host: "Care Animal Shelter",
    date: "Saturday, Sep 8",
    time: "6:10am",
    location: "Greenwood Shelter",
    category: "Animal welfare",
    volunteersJoined: 12,
    volunteersNeeded: 20,
    status: "Active",
    icon: "paw",
    tone: "yellow",
  },
  {
    id: "ev-2",
    title: "Plantation Drive",
    host: "Green Club",
    date: "Sunday, Sep 9",
    time: "7:30am",
    location: "Cubbon Park",
    category: "Environment",
    volunteersJoined: 18,
    volunteersNeeded: 38,
    status: "Open",
    icon: "leaf",
    tone: "lime",
  },
];

export const ngoStats = [
  { label: "Active Events", value: "4", icon: "calendar", tone: "blue" },
  { label: "Volunteers Joined", value: "85", icon: "people", tone: "green" },
  { label: "Environment", value: "88", icon: "leaf", tone: "lime" },
];

export const profileStats = [
  { label: "Events Joined", value: "15" },
  { label: "Requests Sorted", value: "8" },
  { label: "Lives Helped", value: "51" },
  { label: "Hours Contributed", value: "120" },
];

export const impactCards = [
  {
    title: "Blood Hero",
    summary: "5 blood requests fulfilled",
    icon: "water",
    tone: "red",
  },
  {
    title: "Animal Rescuer",
    summary: "3 animal rescues supported",
    icon: "paw",
    tone: "aqua",
  },
  {
    title: "Green Champion",
    summary: "4 plantation drives joined",
    icon: "leaf",
    tone: "green",
  },
  {
    title: "Education Supporter",
    summary: "2 learning programs supported",
    icon: "school",
    tone: "violet",
  },
];

export const recentActivity = [
  "Matched 2 donors for Green Clinic",
  "Joined Weekend Puppy Adoption",
  "Shared Plantation Drive with 4 friends",
];

export const notifications = [
  {
    id: "nt-1",
    title: "B+ donor match found",
    body: "A verified donor is available near Green Clinic.",
    time: "4 min ago",
    icon: "water",
    tone: "red",
    unread: true,
    route: "BloodDonation",
  },
  {
    id: "nt-2",
    title: "Plantation drive update",
    body: "Saplings and gloves are confirmed for Sunday's drive.",
    time: "38 min ago",
    icon: "leaf",
    tone: "lime",
    unread: true,
    route: "VolunteerEvents",
  },
  {
    id: "nt-3",
    title: "Impact milestone",
    body: "You crossed 120 volunteer hours. Keep the momentum going.",
    time: "Yesterday",
    icon: "sparkles",
    tone: "blue",
    unread: false,
    route: "Profile",
  },
];

export const impactSummary = [
  { label: "Lives supported", value: "51", icon: "heart", tone: "red" },
  { label: "Trees cared for", value: "88", icon: "leaf", tone: "lime" },
  { label: "Animals rescued", value: "11", icon: "paw", tone: "green" },
  { label: "NGO partners", value: "9", icon: "business", tone: "blue" },
];
