import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: process.env.SMTP_SECURE === "true", // true for 465, false for 587
  auth: {
    user: process.env.SMTP_MAIL,
    pass: process.env.SMTP_PASSWORD,
  },
});

export async function sendPrivateLinkEmail(
  emails: string[],
  token: string,
  expiry: Date | null
) {
  const link = `${process.env.NEXT_PUBLIC_APP_URL}/shared-link/p/${token}`;
  const expiryText = expiry
    ? `Expires at: ${expiry.toISOString()}`
    : "No expiry";

  for (const email of emails) {
    await transporter.sendMail({
      from: `"VidVault" <${process.env.SMTP_MAIL}>`,
      to: email,
      subject: "A video has been shared with you",
      html: `
        <p>You have been granted access to a video.</p>
        <p><a href="${link}">${link}</a></p>
        <p>${expiryText}</p>
      `,
    });
  }
}
