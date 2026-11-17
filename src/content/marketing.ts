export const home = {
  hero: {
    eyebrow: "Public-data football analytics",
    title: "Read the game",
    titleAccent: "in numbers.",
    copy:
      "VeltrixVault turns open football results into a clean, inspectable workspace. Browse league tables, run a Poisson model on any fixture, and keep your analysis in one place.",
    primaryCta: { href: "/match-lab", label: "Open the Match Lab" },
    secondaryCta: { href: "/analytics", label: "Explore the leagues" },
    trust: ["No deposits", "No tips", "No commissions"],
  },
  features: {
    eyebrow: "What is inside",
    title: "A calm workspace for football data.",
    copy:
      "Everything is built around match results you can trace, not someone else's claims. No locked picks, no urgency timers, no affiliate funnels.",
    items: [
      {
        icon: "table" as const,
        title: "League explorer",
        copy: "Full tables, home and away splits, recent form, and the results behind every position.",
      },
      {
        icon: "flask" as const,
        title: "Match Lab",
        copy: "Choose two teams from the same competition and run the independent-Poisson model on the spot.",
      },
      {
        icon: "vault" as const,
        title: "Saved analyses",
        copy: "Store a fixture analysis with your own notes, then return to it when the picture changes.",
      },
      {
        icon: "eye" as const,
        title: "Watchlist",
        copy: "Follow the teams you care about and keep their form, record, and upcoming context close.",
      },
      {
        icon: "book" as const,
        title: "Methodology, in the open",
        copy: "Every input, formula, and limitation is written down. The model is simple enough to audit.",
      },
      {
        icon: "shield" as const,
        title: "No monetised predictions",
        copy: "Accounts are free. There are no deposits, no paid picks, and no commission on anyone's bets.",
      },
    ],
  },
  workflow: {
    eyebrow: "How it works",
    title: "A fixture. Three moves.",
    copy: "Start with a real result set, run the numbers, and leave with something you can revisit.",
    steps: [
      {
        number: "01",
        title: "Pick a competition",
        copy: "Five completed 2025/26 leagues and the opening weeks of 2026/27. Choose two teams from the same table.",
      },
      {
        number: "02",
        title: "Run the model",
        copy: "The Match Lab blends each side's attack and defence rates with league scoring averages and a small-sample adjustment.",
      },
      {
        number: "03",
        title: "Keep the analysis",
        copy: "Signed-in accounts can save the output with notes, follow teams, and compare saved fixtures later.",
      },
    ],
  },
  model: {
    eyebrow: "The model",
    title: "Transparent by design.",
    copy:
      "VeltrixVault uses an independent-Poisson goals model. Two Poisson distributions — one for each side's expected goals — combine into a scoreline matrix.",
    points: [
      {
        title: "Built from goals",
        copy: "Attack and defence rates come from each team's home and away goal splits, not from opinion or proprietary ratings.",
      },
      {
        title: "Shrunk for small samples",
        copy: "Early-season records are pulled toward the league average, so a two-match hot streak cannot dominate the output.",
      },
      {
        title: "Shown as a distribution",
        copy: "Win, draw, loss, over 2.5, both teams to score, and the most likely scorelines are reported together.",
      },
    ],
    cta: { href: "/methodology", label: "Read the full methodology" },
  },
  coverage: {
    eyebrow: "Data provenance",
    title: "Open data, with the gaps left visible.",
    copy:
      "Match archives come from OpenFootball, a public-domain collection. VeltrixVault normalises the results, recomputes every table, and reports the latest match date rather than pretending a season is complete.",
    bullets: [
      "Six competition seasons, 116 teams, and 1,683 finished matches in the current snapshot.",
      "Tables are derived from results — not copied from a live provider.",
      "Upstream archives vary in completeness. Missing fixtures stay missing; the interface says so.",
      "No scraping of paywalled pages, no invented statistics, and no result data attributed to a source that did not publish it.",
    ],
    cta: { href: "/about", label: "Why this exists" },
  },
  faq: [
    {
      question: "Is this a tipping service?",
      answer:
        "No. VeltrixVault does not sell picks, publish guaranteed outcomes, or take a share of any wager. The model produces a statistical distribution for analysis and education.",
    },
    {
      question: "Do I need to pay or deposit?",
      answer:
        "No. Creating an account is free, and there is no deposit flow anywhere in the product. You do not need a card to explore leagues or run the Match Lab.",
    },
    {
      question: "What do referrals actually do?",
      answer:
        "An invite link simply shares access with someone you know. There are no cash rewards, commissions, or recruitment tiers — only the option to invite people to the same free workspace.",
    },
    {
      question: "Can the model tell me who will win?",
      answer:
        "It can estimate a probability distribution from historical goals. It cannot know line-ups, injuries, travel, weather, or motivation, and a probability is not a promise.",
    },
    {
      question: "How current is the data?",
      answer:
        "Each competition card shows its latest match date and match count. The 2025/26 archives are the deepest; the 2026/27 Premier League snapshot covers only the opening weeks.",
    },
  ],
  cta: {
    eyebrow: "Start with the numbers",
    title: "Your next fixture deserves a clearer read.",
    copy: "Browse the leagues without an account. Create one when you want to save an analysis and follow teams.",
    primary: { href: "/signup", label: "Create a free account" },
    secondary: { href: "/match-lab", label: "Try the Match Lab first" },
  },
} as const;

export const pricing = {
  eyebrow: "Pricing",
  title: "Free while the Vault is open.",
  copy:
    "VeltrixVault is an independent analytics project. The current release is free to use, with no card, no deposit, and no paid prediction product hiding behind it.",
  plan: {
    name: "Full Vault",
    price: "£0",
    cadence: "per month",
    description: "Everything in the current release, for as long as this release stays free.",
    features: [
      "League explorer across six competition seasons",
      "Unlimited Match Lab calculations",
      "Saved analyses with your own notes",
      "Team watchlist",
      "Invite links for friends",
      "Full methodology and data provenance",
    ],
    note: "No card required. No deposit flow. No betting account.",
  },
  commitments: {
    title: "What we will never add",
    copy:
      "These are product boundaries, not marketing lines. If the model cannot be explained, it does not ship.",
    items: [
      "Deposits, wallets, or any way to stake money",
      "Paid 'sure' predictions or guaranteed-return claims",
      "Affiliate commissions on bets or bookmaker signups",
      "Fabricated testimonials or invented win rates",
      "Urgency timers, recruitment tiers, or hidden charges",
    ],
  },
  questions: [
    {
      question: "Why is it free?",
      answer:
        "The dataset is public, the infrastructure is lean, and the project is intended as a useful analytics tool. If that changes, existing pages will say so plainly before anything is charged.",
    },
    {
      question: "Will there be a paid tier?",
      answer:
        "There is no paid tier today. Any future supporter option would be optional, clearly priced, and separate from access to the core data and model.",
    },
    {
      question: "Do referrals unlock more features?",
      answer:
        "No. Invite links are a convenient way to share a free product. They do not create earnings, commissions, or different access levels.",
    },
  ],
} as const;

export const about = {
  eyebrow: "About VeltrixVault",
  title: "A quieter way to look at football.",
  copy:
    "VeltrixVault began with a simple frustration: most football 'analytics' on the open web is really a sales funnel. The numbers are hidden, the claims are loud, and the only thing being measured is how many people click through to a bet.",
  principles: [
    {
      title: "Show the working",
      copy: "Every scoreline probability comes from a formula that is written down in the methodology. There is no black box and no proprietary rating to take on faith.",
    },
    {
      title: "Respect the data",
      copy: "Results come from public-domain archives. We recompute the tables, report the number of matches, and show the latest date rather than implying a complete season.",
    },
    {
      title: "Do not monetise the outcome",
      copy: "No deposits, no affiliate links, no paid tips. The product is a workspace for reading the game, not a place to place a wager.",
    },
  ],
  story: {
    title: "What this is",
    copy:
      "A football analytics workspace: league tables, team profiles, a transparent goals model, saved analyses, and a watchlist. It is designed for people who enjoy the reasoning — the kind of supporter who wants to see why a fixture looks tight, not just be told who to back.",
  },
  not: {
    title: "What this is not",
    items: [
      "Not a bookmaker, tipping service, or affiliate site.",
      "Not a live-odds product, and not connected to any betting account.",
      "Not a claim that historical goals predict a specific result.",
      "Not affiliated with any league, club, or data provider beyond the credited public archive.",
    ],
  },
  data: {
    title: "Data credit",
    copy:
      "Match archives are sourced from OpenFootball's football.json collection, released into the public domain. Competition names and club names remain the property of their respective owners and are used here for identification only.",
  },
} as const;

export const methodology = {
  eyebrow: "Methodology",
  title: "The whole model, on one page.",
  copy:
    "VeltrixVault uses a deliberately small independent-Poisson model. It is not the most advanced model in football, but it is one you can follow from input to output.",
  sections: [
    {
      id: "data",
      title: "1. The data",
      paragraphs: [
        "Every table starts from finished match results: date, home team, away team, and full-time score. The current snapshot covers the 2025/26 Premier League, La Liga, Bundesliga, Serie A, and Ligue 1, plus the opening weeks of the 2026/27 Premier League.",
        "Points follow the standard rule: three for a win, one for a draw, none for a loss. Goal difference and goals scored break ties in that order. Form shows the last five results, oldest to newest.",
      ],
      note: "Upstream archives are not guaranteed to be complete. Each competition shows its match count and latest match date so the coverage is visible.",
    },
    {
      id: "averages",
      title: "2. League scoring averages",
      paragraphs: [
        "The model first estimates how many goals the average home side and the average away side score in the competition. Home and away goals are summed across all teams, then divided by the number of home and away fixtures respectively.",
      ],
      formula: "homeAvg = total home goals ÷ total home fixtures\nawayAvg = total away goals ÷ total away fixtures",
    },
    {
      id: "shrinkage",
      title: "3. Team rates, with shrinkage",
      paragraphs: [
        "A team's attack rate is its goals scored per match in the relevant venue; its defence rate is goals conceded per match. Small samples are unstable, so each rate is shrunk toward the league average using six pseudo-matches.",
        "With a full season the adjustment is small. After two matches it keeps a lucky result from taking over the output.",
      ],
      formula: "shrunkRate = (goals + 6 × leagueAverage) ÷ (matches + 6)",
    },
    {
      id: "expected-goals",
      title: "4. Expected goals",
      paragraphs: [
        "Expected home goals combine the home side's attack rate with the away side's defence rate, scaled by the league's home scoring average. Expected away goals do the same for the away attack and home defence.",
        "A floor of 0.05 prevents impossible inputs from producing a zero-goal distribution.",
      ],
      formula: "λhome = homeAvg × (homeAttack ÷ homeAvg) × (awayDefence ÷ homeAvg)\nλaway = awayAvg × (awayAttack ÷ awayAvg) × (homeDefence ÷ awayAvg)",
    },
    {
      id: "matrix",
      title: "5. The scoreline matrix",
      paragraphs: [
        "Goals for each side are treated as independent Poisson variables. Multiplying the probability of h home goals by the probability of a away goals gives the probability of that exact scoreline.",
        "The matrix runs from 0 to 10 goals per side. Summing the relevant cells produces the win, draw, loss, over 2.5, under 2.5, and both-teams-to-score estimates.",
      ],
      formula: "P(h, a) = e^(−λhome) λhome^h ÷ h! × e^(−λaway) λaway^a ÷ a!",
    },
    {
      id: "outputs",
      title: "6. What the output means",
      paragraphs: [
        "A 48% home-win estimate means the model assigns 48% of its probability mass to home victories across the scoreline matrix. It does not mean the home side 'should' win, and it is not a price, edge, or recommended bet.",
        "The five most likely scorelines are listed for orientation. Many low-probability scorelines together carry most of the distribution, which is why the top scoreline is often well below 20%.",
      ],
    },
    {
      id: "limits",
      title: "7. Limitations",
      paragraphs: [
        "The model sees goals and results only. It does not see line-ups, injuries, suspensions, managerial changes, European fixtures, travel, weather, pitch condition, or motivation.",
        "Independent Poisson ignores correlation between the two sides' scoring — for example, game state effects. It also treats home advantage as a league-wide constant rather than a club-specific one.",
        "Use it as a structured starting point for analysis. Combine it with context, and treat every estimate as uncertain.",
      ],
    },
    {
      id: "responsible-use",
      title: "8. Responsible use",
      paragraphs: [
        "VeltrixVault does not accept deposits, sell picks, or earn commission from betting. Nothing here is financial or betting advice.",
        "If gambling is affecting you or someone you know, seek local support. In the UK, GamCare offers confidential help on 0808 8020 133.",
      ],
    },
  ],
  glossary: [
    { term: "λ (lambda)", definition: "The expected number of goals for one side in one match." },
    { term: "Poisson distribution", definition: "A probability distribution for counting events in a fixed interval, often used for goals." },
    { term: "Shrinkage", definition: "Pulling a small-sample estimate toward a broader average to reduce noise." },
    { term: "BTTS", definition: "Both teams to score." },
    { term: "Over 2.5", definition: "Three or more total goals in the match." },
  ],
} as const;
