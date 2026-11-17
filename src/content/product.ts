export const leaguePage = {
  eyebrow: "Competition",
  table: {
    eyebrow: "Standings",
    title: "The table, recomputed.",
    copy:
      "Three points for a win, one for a draw, none for a loss. Ties are separated by goal difference, then goals scored. Select a team to open its profile.",
  },
  profile: {
    eyebrow: "Season profile",
    title: "How this league scores.",
    copy:
      "A quick read on home advantage, draw frequency, and goals per match across every finished fixture in the snapshot. Small samples distort these rates, so the match count is always shown.",
  },
  results: {
    eyebrow: "Results",
    title: "Latest finished matches.",
    copy:
      "The most recent results in this archive. Each row is a finished match with a full-time score — no simulated fixtures or projected results.",
  },
  coverage: {
    title: "Coverage is part of the analysis.",
    copy:
      "OpenFootball archives vary in completeness. This table is built only from the matches present in the snapshot, and no competition is marked complete. Check the match count and latest date before treating a rate as stable.",
  },
  cta: {
    title: "Run a fixture from this league.",
    copy: "Pick any two teams from the table and open the model with this competition already selected.",
    label: "Open the Match Lab",
  },
} as const;

export const teamPage = {
  eyebrow: "Team profile",
  record: {
    eyebrow: "Record",
    title: "The season so far.",
    copy: "League position and points come from the recomputed table. Splits show how much of the record was built at home and away.",
  },
  splits: {
    title: "Home and away",
    home: "At home",
    away: "On the road",
    goalsFor: "Goals for",
    goalsAgainst: "Goals against",
    perMatch: "Per match",
  },
  form: {
    title: "Recent form",
    copy: "The last five league results, oldest to newest. Form is a summary, not a forecast.",
  },
  results: {
    title: "Recent matches",
    copy: "Finished matches involving this team, newest first.",
  },
  watchlist: {
    follow: "Follow team",
    following: "Following",
    signIn: "Sign in to follow",
    note: "Following is a bookmark, not a notification or a tip.",
  },
  cta: {
    title: "Put this team in the model.",
    copy: "Open the Match Lab with this competition loaded, then choose an opponent.",
    label: "Analyse a fixture",
  },
} as const;

export const matchLabPage = {
  eyebrow: "Match Lab",
  title: "One fixture. The full distribution.",
  copy:
    "Choose a competition and two teams from the same table. The lab estimates expected goals, result probabilities, over/under 2.5, both teams to score, and the most likely scorelines.",
  form: {
    title: "Build a fixture",
    copy: "Both teams must belong to the same competition so their rates share a league baseline.",
    competition: "Competition",
    home: "Home team",
    away: "Away team",
    submit: "Run the model",
    running: "Running the model",
    swap: "Swap sides",
    reset: "Clear",
    placeholder: "Select a competition first",
    selectTeam: "Select a team",
  },
  save: {
    title: "Save this analysis",
    copy: "Store the output with your own notes. Saved analyses are private to your account.",
    titleLabel: "Title",
    titlePlaceholder: "e.g. Arsenal vs Liverpool — pre-match read",
    notesLabel: "Notes",
    notesPlaceholder: "What are you watching for? Injuries, rotation, a tactical mismatch…",
    submit: "Save analysis",
    saving: "Saving",
    saved: "Analysis saved.",
    openSaved: "Open saved analysis",
    signInTitle: "Sign in to save your work",
    signInCopy: "The Match Lab is free to use. An account lets you keep this analysis with your notes.",
    signIn: "Sign in",
    create: "Create a free account",
  },
  result: {
    eyebrow: "Model output",
    title: "The distribution",
    copy: "These are statistical estimates from historical goals, not forecasts. Read them with the limitations in mind.",
    emptyTitle: "Your fixture goes here.",
    emptyCopy:
      "Pick a competition, then choose a home and away side. The model returns expected goals, result probabilities, goals markets, and the most likely scorelines.",
    error: "The model could not run that fixture. Check the teams and try again.",
    savedTitle: "Saved to the Vault",
    savedCopy:
      "The snapshot is stored with your notes. Open it from your saved analyses whenever you want to revisit the reasoning.",
  },
  how: {
    eyebrow: "How to read it",
    title: "What the numbers mean.",
    items: [
      "Expected goals are the model's λ values for each side — the average goals it assigns across the scoreline matrix.",
      "Win, draw, and loss probabilities sum to 100% across the matrix. Over 2.5 and under 2.5 are complements.",
      "The top scoreline is usually well below 20%. Many low-probability scorelines together carry most of the mass.",
      "The model does not see line-ups, injuries, travel, weather, or motivation. Use it as a structured starting point.",
    ],
  },
  limits: {
    title: "Small samples are pulled toward the league average.",
    copy:
      "Teams with fewer than five home or away matches are flagged. Their rates are shrunk with six pseudo-matches, so an early hot streak cannot dominate the output.",
  },
} as const;

export const authCopy = {
  login: {
    eyebrow: "Welcome back",
    title: "Sign in to the Vault.",
    copy: "Your saved analyses, watchlist, and notes are waiting.",
    submit: "Sign in",
    submitting: "Signing in",
    forgot: "Forgot your password?",
    noAccount: "New to VeltrixVault?",
    create: "Create a free account",
  },
  signup: {
    eyebrow: "Free account",
    title: "Keep your analysis in one place.",
    copy: "Save model outputs with notes, follow teams, and invite people you know. No card, no deposit, no paid picks.",
    submit: "Create account",
    submitting: "Creating account",
    hasAccount: "Already have an account?",
    signIn: "Sign in",
    terms: "I agree to the Terms and Privacy notice.",
  },
  forgot: {
    eyebrow: "Password reset",
    title: "Get back into your account.",
    copy: "Enter the email on your account and we will send a single-use reset link if it exists.",
    submit: "Send reset link",
    submitting: "Sending",
    back: "Back to sign in",
  },
  reset: {
    eyebrow: "Choose a password",
    title: "Set a new password.",
    copy: "Use at least 10 characters with a letter and a number. This will sign out other sessions.",
    submit: "Update password",
    submitting: "Updating",
    back: "Back to sign in",
    invalid: "This reset link is missing or incomplete. Request a new one from the sign-in page.",
  },
  verify: {
    eyebrow: "Email verification",
    title: "Confirming your email.",
    verifying: "Checking the link…",
    success: "Your email is confirmed. You can keep using the Vault.",
    error: "This link is invalid or has expired. Sign in and request a new one from your account page.",
    dashboard: "Go to the dashboard",
    signIn: "Sign in",
    home: "Back to the homepage",
  },
  panel: {
    eyebrow: "Inside the Vault",
    title: "A calmer way to read a fixture.",
    copy:
      "Public match data, an inspectable goals model, and a workspace for the analysis you keep. No betting funnel anywhere in the product.",
    points: [
      "Six competition seasons from public-domain archives",
      "An independent-Poisson model you can audit",
      "Saved analyses, notes, and a team watchlist",
      "No deposits, tips, commissions, or urgency timers",
    ],
    note: "Accounts are free in the current release.",
  },
} as const;

export const dashboardCopy = {
  nav: {
    overview: "Overview",
    analyses: "Saved analyses",
    watchlist: "Watchlist",
    invite: "Invite a friend",
    account: "Account",
  },
  overview: {
    eyebrow: "Workspace",
    title: "The Vault, at a glance.",
    copy: "Your saved analyses, followed teams, and account status in one place.",
    shortcuts: "Quick actions",
  },
  analyses: {
    eyebrow: "Saved analyses",
    title: "Your saved fixtures.",
    copy: "Every saved analysis keeps the model output from the moment you saved it. Re-run the fixture when the picture changes.",
    empty: "No saved analyses yet. Open the Match Lab, run a fixture, and save the output.",
    newAnalysis: "Run a new analysis",
  },
  watchlist: {
    eyebrow: "Watchlist",
    title: "Teams you follow.",
    copy: "A bookmark for the clubs you want to find quickly. Following does not send alerts or imply a recommendation.",
    empty: "Your watchlist is empty. Open a league table and follow a team from its profile.",
    browse: "Browse the leagues",
  },
  invite: {
    eyebrow: "Invite a friend",
    title: "Share the Vault.",
    copy:
      "Your link simply opens the free signup form with your code attached. There are no cash rewards, commissions, or recruitment tiers.",
    linkLabel: "Your invite link",
    codeLabel: "Invite code",
    recentTitle: "People who joined with your link",
    recentEmpty: "No one has joined through your link yet.",
    emailSubject: "An invite to VeltrixVault",
    emailBody:
      "I have been using VeltrixVault to look at football fixtures with public data and a transparent model. It is free, with no deposits or tips. Here is my invite link:",
  },
  account: {
    eyebrow: "Account",
    title: "Your account.",
    copy: "Manage your email, password, and account data. Security changes are recorded in the audit trail.",
    profileTitle: "Profile",
    emailTitle: "Email verification",
    verified: "Your email is verified.",
    unverified: "Your email is not verified yet. Confirm it to secure account recovery.",
    resend: "Resend verification email",
    resending: "Sending",
    passwordTitle: "Change password",
    passwordCopy: "Changing your password signs out every other session.",
    dangerTitle: "Delete account",
    dangerCopy:
      "This removes your account, saved analyses, watchlist, sessions, and referral links. It cannot be undone.",
    deleteSubmit: "Delete my account",
    deleting: "Deleting",
  },
  verificationBanner: {
    title: "Confirm your email.",
    copy: "Verification keeps account recovery working. We can send a fresh link whenever you need one.",
    action: "Verify now",
  },
} as const;

export const notFoundCopy = {
  eyebrow: "404",
  title: "That page is off the pitch.",
  copy: "The link may be old, or the fixture may not exist in this snapshot. Try the league explorer or the Match Lab.",
  home: "Back to the homepage",
  analytics: "Explore the leagues",
} as const;

export const errorCopy = {
  eyebrow: "Something went wrong",
  title: "The Vault hit an unexpected error.",
  copy: "The page could not be rendered. Try again — if it keeps happening, the health endpoint at /api/health can help confirm the service is up.",
  retry: "Try again",
  home: "Back to the homepage",
} as const;
