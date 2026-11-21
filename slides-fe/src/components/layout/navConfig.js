import {
  DashboardIcon,
  SlidesIcon,
  PartyIcon,
  SetupIcon,
  UsersIcon,
  LockIcon,
  PlanIcon,
} from "../icons";

const BACK_OFFICE = ["admin", "manager"];
const EVERYONE = ["admin", "manager", "user"];

/**
 * Sidebar navigation. `roles` mirrors the route guards in src/routes
 * (UX only — the API enforces access). `match` lists path prefixes that
 * mark an item active, so create/edit screens highlight their section.
 */
export const NAV_ITEMS = [
  {
    key: "dashboard",
    label: "Dashboard",
    icon: DashboardIcon,
    to: "/dashboard",
    roles: BACK_OFFICE,
  },
  {
    key: "slides",
    label: "Slides",
    icon: SlidesIcon,
    roles: BACK_OFFICE,
    children: [
      { label: "All slides", to: "/slides/list", match: ["/slides/list", "/slides/edit"] },
      { label: "Create slide", to: "/slides/create" },
      { label: "Selected for PPTX", to: "/slides/selected_slides" },
    ],
  },
  {
    key: "customerPlans",
    label: "Customer Plans",
    icon: PlanIcon,
    roles: BACK_OFFICE,
    children: [
      { label: "All media plans", to: "/customer-plans/list", match: ["/customer-plans/list", "/customer-plans/edit"] },
      { label: "Create media plan", to: "/customer-plans/create" },
    ],
  },
  {
    key: "party",
    label: "Parties",
    icon: PartyIcon,
    roles: BACK_OFFICE,
    children: [
      { label: "All parties", to: "/party/list" },
      { label: "Create party", to: "/party/create" },
    ],
  },
  {
    key: "setup",
    label: "Setup",
    icon: SetupIcon,
    roles: BACK_OFFICE,
    children: [
      { label: "Provinces", to: "/setup/prov/list", match: ["/setup/prov"] },
      { label: "Cities", to: "/setup/city/list", match: ["/setup/city"] },
      { label: "Areas", to: "/setup/area/list", match: ["/setup/area"] },
      { label: "Sub-areas", to: "/setup/subarea/list", match: ["/setup/subarea"] },
    ],
  },
  {
    key: "users",
    label: "Users",
    icon: UsersIcon,
    roles: ["admin"],
    children: [
      { label: "All users", to: "/user/list" },
      { label: "Create user", to: "/users/create" },
    ],
  },
  {
    key: "password",
    label: "Change password",
    icon: LockIcon,
    to: "/user/pass",
    roles: EVERYONE,
  },
];

export const isPathActive = (pathname, item) =>
  (item.match || [item.to]).some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));

export const visibleNavItems = (role) => NAV_ITEMS.filter((item) => item.roles.includes(role));

/** Page name shown in the header, from the deepest matching nav entry. */
export const currentSectionLabel = (pathname) => {
  for (const item of NAV_ITEMS) {
    if (item.children) {
      const child = item.children.find((c) => isPathActive(pathname, c));
      if (child) return { section: item.label, page: child.label };
    } else if (isPathActive(pathname, item)) {
      return { section: item.label, page: null };
    }
  }
  return null;
};

export const initialsOf = (user) => {
  const source = user?.username || user?.email || "?";
  const parts = source.split(/[\s._@-]+/).filter(Boolean);
  return ((parts[0]?.[0] || "") + (parts[1]?.[0] || "")).toUpperCase() || source[0].toUpperCase();
};
