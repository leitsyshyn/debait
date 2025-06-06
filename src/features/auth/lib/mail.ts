import { resend } from "@/lib/resend";

export const sendVerificationEmail = async (email: string, token: string) => {
  const verificationLink = `http://localhost:3000/auth/verify-email?token=${token}`;

  await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: "Verify your email",
    html: `<p>Click <a href=${verificationLink}>here</a> to verify your email</p>`,
  });
};

export const sendResetPasswordEmail = async (email: string, token: string) => {
  const resetLink = `http://localhost:3000/auth/reset-password?token=${token}`;

  await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: "Reset your password",
    html: `<p>Click <a href=${resetLink}>here</a> to reset your password</p>`,
  });
};

export const sendTwoFactorEmail = async (email: string, token: string) => {
  await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: "Your 2FA secret",
    text: `Your 2FA secret is ${token}`,
  });
};
