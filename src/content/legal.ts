export const legalUpdated = "16 November 2026";

export const privacy = {
  eyebrow: "Privacy",
  title: "What we keep, and why.",
  intro:
    "This notice explains the personal data VeltrixVault processes to run your account and the analytics workspace. It describes the current release; if the product changes materially, this page will be updated first.",
  sections: [
    {
      title: "Data we collect",
      items: [
        "Account details: your name, email address, a scrypt password hash, and an auto-generated referral code.",
        "Session data: an HTTP-only session cookie, its expiry, your browser user agent, and a keyed hash of your IP address.",
        "Workspace content: saved analyses, notes, watchlist teams, and referral relationships.",
        "Security records: audit events such as sign-in, password changes, email verification, and analysis creation. These help detect abuse and recover accounts.",
      ],
    },
    {
      title: "How we use it",
      items: [
        "To authenticate you, keep you signed in, and protect your account.",
        "To store and display the analyses, notes, and watchlist you create.",
        "To attribute an invite when you sign up through a referral link.",
        "To send transactional email such as verification and password-reset messages.",
        "To rate-limit abuse and investigate security incidents.",
      ],
    },
    {
      title: "Cookies and storage",
      items: [
        "The only required cookie is the session cookie. It is HTTP-only, SameSite=Lax, and becomes Secure in production.",
        "Your theme preference is stored in your browser's local storage. It is not sent to the server.",
        "There are no advertising cookies, third-party analytics scripts, or cross-site trackers in the current release.",
      ],
    },
    {
      title: "Sharing and processors",
      items: [
        "Transactional email may be delivered through Resend when an API key is configured. The message includes your email address and the verification or reset link.",
        "Infrastructure providers may process data on our behalf to host the application and database. They are not permitted to use it for their own purposes.",
        "We do not sell personal data, share it with bookmakers, or use it to build advertising profiles.",
      ],
    },
    {
      title: "Retention",
      items: [
        "Account and workspace data are kept while your account exists.",
        "Expired sessions are removed. Verification and reset tokens are single-use and expire automatically.",
        "Deleting your account removes your sessions, tokens, analyses, watchlist items, referrals, and account record. Minimal security logs may remain with the account link removed.",
      ],
    },
    {
      title: "Your choices",
      items: [
        "You can update your password from the account page. Changing it signs out other sessions.",
        "You can request a fresh verification email or reset link at any time.",
        "You can delete your account from the account page. You will need your current password to confirm.",
        `For access, correction, export, or other privacy questions, contact ${"hello@veltrixvault.com"}.`,
      ],
    },
    {
      title: "Security",
      items: [
        "Passwords are hashed with scrypt and never stored in plain text.",
        "Session tokens are stored as SHA-256 hashes; the raw token exists only in your cookie.",
        "Authentication endpoints are rate-limited, same-origin checked, and protected by strict response headers in production.",
        "No system is perfect. If you believe your account is compromised, change your password immediately and contact us.",
      ],
    },
    {
      title: "Children",
      items: [
        "VeltrixVault is not directed at children. Accounts are intended for people aged 16 or older, and we do not knowingly collect data from anyone below that age.",
      ],
    },
  ],
  contact: {
    title: "Contact",
    copy:
      "Privacy questions can be sent to hello@veltrixvault.com. Include the email address on your account so we can locate it.",
  },
} as const;

export const terms = {
  eyebrow: "Terms",
  title: "The rules of the Vault.",
  intro:
    "These terms cover your use of VeltrixVault. By creating an account or using the service, you agree to them. If you do not agree, please do not use the service.",
  sections: [
    {
      title: "1. The service",
      paragraphs: [
        "VeltrixVault is a football analytics workspace built on public match data. It provides league tables, team statistics, a statistical model, saved analyses, and related tools.",
        "The service is provided for analysis and education. Features and data coverage may change as the project develops.",
      ],
    },
    {
      title: "2. Eligibility and accounts",
      items: [
        "You must be at least 16 years old to create an account.",
        "Provide accurate information and keep your password confidential.",
        "You are responsible for activity under your account. Tell us promptly if you believe it has been compromised.",
        "One person should not maintain accounts to evade rate limits or abuse invite links.",
      ],
    },
    {
      title: "3. Acceptable use",
      items: [
        "Do not attempt to break authentication, access another user's data, or probe the service for vulnerabilities without written permission.",
        "Do not scrape, overload, or automate requests in a way that degrades the service for others.",
        "Do not upload unlawful content, malware, or material that infringes someone else's rights.",
        "Do not present model output as guaranteed advice, or use VeltrixVault branding to imply endorsement of a betting product.",
      ],
    },
    {
      title: "4. No betting or financial advice",
      paragraphs: [
        "VeltrixVault does not accept deposits, hold funds, sell predictions, or earn commission from wagers. Nothing in the service is betting, financial, legal, or professional advice.",
        "Statistical estimates describe historical patterns. They do not guarantee any result and should not be treated as a recommendation to stake money.",
      ],
    },
    {
      title: "5. Data and intellectual property",
      paragraphs: [
        "Match archives are credited to OpenFootball and are used under their public-domain release. Competition and club names remain the property of their respective owners and are used for identification only.",
        "The VeltrixVault name, interface, original copy, and software are owned by the project operator. You may use the service for personal analysis, but you may not resell or redistribute it as your own product without permission.",
        "Analyses and notes you create remain yours. You grant us the limited permission needed to store and display them back to you.",
      ],
    },
    {
      title: "6. Availability",
      paragraphs: [
        "The service is provided on an as-is and as-available basis. We do not promise uninterrupted access, complete upstream data, or that every calculation will be free of error.",
        "We may suspend or withdraw features, including for maintenance or security reasons. Where practical, material changes will be noted on the site.",
      ],
    },
    {
      title: "7. Limitation of liability",
      paragraphs: [
        "To the extent permitted by law, VeltrixVault is not liable for indirect or consequential loss, loss of data, or decisions made using the service. Nothing in these terms excludes liability that cannot lawfully be excluded.",
      ],
    },
    {
      title: "8. Termination",
      paragraphs: [
        "You may delete your account at any time from the account page. We may suspend or remove accounts that breach these terms, create security risk, or abuse the service.",
      ],
    },
    {
      title: "9. Changes and contact",
      paragraphs: [
        "We may update these terms as the service evolves. The effective date at the top of this page will change when we do. Continued use after an update means you accept the revised terms.",
        "Questions can be sent to hello@veltrixvault.com.",
      ],
    },
  ],
} as const;
