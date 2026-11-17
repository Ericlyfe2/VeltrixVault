export const env = {
  get appUrl() {
    return (process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000").replace(/\/$/, "");
  },
  get isProduction() {
    return process.env.NODE_ENV === "production";
  },
  get ipHashSecret() {
    const value = process.env.IP_HASH_SECRET;
    if (!value && this.isProduction) {
      throw new Error("IP_HASH_SECRET must be set in production.");
    }
    return value || "development-only-ip-secret";
  },
  get resendApiKey() {
    return process.env.RESEND_API_KEY || "";
  },
  get mailFrom() {
    return process.env.MAIL_FROM || "VeltrixVault <no-reply@example.com>";
  },
};
