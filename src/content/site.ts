export const site = {
  name: "VeltrixVault",
  shortName: "Veltrix",
  tagline: "Football analytics, explained.",
  description:
    "Explore public football data, run a transparent Poisson model, and keep your analysis in one calm workspace.",
  email: "hello@veltrixvault.com",
  locale: "en_GB",
  disclaimer:
    "VeltrixVault is a statistical workspace built on public match data. Estimates are for analysis and education only — not betting advice, and never a guarantee of any outcome.",
  dataSource: {
    name: "OpenFootball",
    url: "https://github.com/openfootball/football.json",
    license: "Public domain",
  },
} as const;

export const marketingNav = [
  { href: "/analytics", label: "League explorer" },
  { href: "/match-lab", label: "Match Lab" },
  { href: "/methodology", label: "Methodology" },
  { href: "/pricing", label: "Pricing" },
] as const;

export const footerNav = [
  {
    title: "Explore",
    links: [
      { href: "/analytics", label: "League explorer" },
      { href: "/match-lab", label: "Match Lab" },
      { href: "/methodology", label: "Methodology" },
      { href: "/pricing", label: "Pricing" },
    ],
  },
  {
    title: "Workspace",
    links: [
      { href: "/dashboard", label: "Dashboard" },
      { href: "/dashboard/analyses", label: "Saved analyses" },
      { href: "/dashboard/watchlist", label: "Watchlist" },
      { href: "/dashboard/invite", label: "Invite a friend" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About" },
      { href: "/privacy", label: "Privacy" },
      { href: "/terms", label: "Terms" },
      { href: `mailto:${site.email}`, label: "Contact" },
    ],
  },
] as const;
