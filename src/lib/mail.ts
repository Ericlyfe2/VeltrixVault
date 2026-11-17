import "server-only";
import { env } from "@/lib/env";

type MailInput = { to: string; subject: string; html: string; text: string };

export async function deliverMail(input: MailInput): Promise<boolean> {
  if (!env.resendApiKey) {
    console.info(
      `\n[mail] No RESEND_API_KEY configured. Message for ${input.to}:\n${input.subject}\n${input.text}\n`,
    );
    return false;
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.resendApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: env.mailFrom,
      to: [input.to],
      subject: input.subject,
      html: input.html,
      text: input.text,
    }),
  });

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    console.error("Transactional email failed", response.status, body.slice(0, 300));
    return false;
  }

  return true;
}

function shell(title: string, body: string) {
  return `<!doctype html>
<html lang="en">
  <body style="margin:0;padding:32px 16px;background:#f5f1e6;font-family:Inter,Segoe UI,Arial,sans-serif;color:#0c1f18">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
      <tr><td align="center">
        <table role="presentation" width="100%" style="max-width:560px;background:#fffdf7;border:1px solid #d9d2c0;border-radius:20px;overflow:hidden">
          <tr><td style="padding:24px 28px;background:#0d5c43;color:#f4ffe4">
            <div style="font-size:13px;letter-spacing:.18em;text-transform:uppercase;opacity:.8">VeltrixVault</div>
            <div style="font-size:22px;font-weight:700;margin-top:6px">${title}</div>
          </td></tr>
          <tr><td style="padding:28px">${body}</td></tr>
          <tr><td style="padding:0 28px 28px;font-size:12px;line-height:1.6;color:#54655c">
            VeltrixVault is a football analytics workspace built on public data. Statistical estimates are for analysis and education — not betting advice, and never a guarantee of any outcome.
          </td></tr>
        </table>
      </td></tr>
    </table>
  </body>
</html>`;
}

export async function sendVerificationEmail(to: string, name: string, token: string) {
  const url = `${env.appUrl}/verify-email?token=${encodeURIComponent(token)}`;
  const firstName = name.split(" ")[0] || "there";

  return deliverMail({
    to,
    subject: "Confirm your VeltrixVault email",
    text: `Hi ${firstName},\n\nConfirm your email to finish setting up VeltrixVault:\n${url}\n\nThis link expires in 24 hours. If you didn't create an account, ignore this email.\n`,
    html: shell(
      "Confirm your email",
      `<p style="margin:0 0 14px;font-size:15px">Hi ${escapeHtml(firstName)},</p>
       <p style="margin:0 0 20px;font-size:15px;line-height:1.7">Confirm your email address to finish setting up your VeltrixVault account.</p>
       <p style="margin:0 0 20px"><a href="${url}" style="display:inline-block;background:#0d5c43;color:#f4ffe4;text-decoration:none;font-weight:600;padding:12px 20px;border-radius:999px">Confirm email</a></p>
       <p style="margin:0;font-size:13px;color:#54655c">This link expires in 24 hours. If you didn't create an account, you can ignore this email.</p>`,
    ),
  });
}

export async function sendPasswordResetEmail(to: string, name: string, token: string) {
  const url = `${env.appUrl}/reset-password?token=${encodeURIComponent(token)}`;
  const firstName = name.split(" ")[0] || "there";

  return deliverMail({
    to,
    subject: "Reset your VeltrixVault password",
    text: `Hi ${firstName},\n\nReset your password here:\n${url}\n\nThis link expires in 1 hour. If you didn't request it, ignore this email and your password will stay the same.\n`,
    html: shell(
      "Reset your password",
      `<p style="margin:0 0 14px;font-size:15px">Hi ${escapeHtml(firstName)},</p>
       <p style="margin:0 0 20px;font-size:15px;line-height:1.7">Use the button below to choose a new password. The link expires in one hour.</p>
       <p style="margin:0 0 20px"><a href="${url}" style="display:inline-block;background:#0d5c43;color:#f4ffe4;text-decoration:none;font-weight:600;padding:12px 20px;border-radius:999px">Choose a new password</a></p>
       <p style="margin:0;font-size:13px;color:#54655c">If you didn't request this, ignore the email and your password will stay the same.</p>`,
    ),
  });
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (char) => {
    const map: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };
    return map[char];
  });
}
