import { z } from "zod";

export const emailSchema = z
  .string()
  .trim()
  .min(1, "Enter your email address.")
  .max(254, "That email address is too long.")
  .email("Enter a valid email address.")
  .transform((value) => value.toLowerCase());

export const passwordSchema = z
  .string()
  .min(10, "Use at least 10 characters.")
  .max(72, "Use no more than 72 characters.")
  .regex(/[a-zA-Z]/, "Include at least one letter.")
  .regex(/[0-9]/, "Include at least one number.");

export const nameSchema = z
  .string()
  .trim()
  .min(2, "Enter your name.")
  .max(60, "Keep your name under 60 characters.");

export const signupSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  password: passwordSchema,
  referralCode: z.string().trim().max(16).optional().or(z.literal("")),
  acceptTerms: z
    .boolean()
    .refine((value) => value, "Please accept the terms and privacy notice to continue."),
});

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Enter your password."),
  remember: z.boolean().optional().default(false),
});

export const forgotPasswordSchema = z.object({ email: emailSchema });

export const resetPasswordSchema = z.object({
  token: z.string().min(20, "This reset link is not valid."),
  password: passwordSchema,
});

export const verifyEmailSchema = z.object({
  token: z.string().min(20, "This verification link is not valid."),
});

export const resendVerificationSchema = z.object({ email: emailSchema });

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Enter your current password."),
  newPassword: passwordSchema,
});

export const predictSchema = z.object({
  competitionId: z.string().min(1),
  homeTeamId: z.string().min(1),
  awayTeamId: z.string().min(1),
});

export const saveAnalysisSchema = predictSchema.extend({
  title: z.string().trim().max(90).optional(),
  notes: z.string().trim().max(500).optional(),
});

export const watchlistSchema = z.object({
  teamId: z.string().min(1),
});

export const deleteAccountSchema = z.object({
  password: z.string().min(1, "Enter your current password to confirm."),
});

export function fieldErrors(error: z.ZodError): Record<string, string> {
  const result: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path.join(".") || "form";
    if (!result[key]) result[key] = issue.message;
  }
  return result;
}
