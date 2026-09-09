import nodemailer from "nodemailer";

export interface ContactEmailData {
  name: string;
  email: string;
  subject?: string;
  message: string;
  projectType?: string;
  budget?: string;
}

export async function sendContactEmail(data: ContactEmailData) {
  const gmailUser = process.env.GMAIL_USER;
  const gmailAppPassword = process.env.GMAIL_APP_PASSWORD;
  const toEmail = process.env.TO_EMAIL || gmailUser;

  if (!gmailUser || !gmailAppPassword) {
    console.warn(
      "⚠️ Gmail SMTP credentials (GMAIL_USER / GMAIL_APP_PASSWORD) not configured in .env.local. Email notification skipped."
    );
    return false;
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: gmailUser,
      pass: gmailAppPassword,
    },
  });

  const emailSubject = data.subject
    ? `[Portfolio Contact] ${data.subject}`
    : `New Portfolio Inquiry from ${data.name}`;

  const htmlContent = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #0a0a0a; color: #ffffff; padding: 32px; border-radius: 16px; border: 1px solid #222222;">
      <h2 style="color: #ffffff; font-size: 22px; font-weight: 800; border-bottom: 1px solid #222222; padding-bottom: 16px; margin-top: 0; letter-spacing: -0.5px;">
        New Contact Inquiry
      </h2>
      
      <table style="width: 100%; border-collapse: collapse; margin-top: 16px; margin-bottom: 24px; font-size: 14px;">
        <tr>
          <td style="padding: 10px 0; color: #888888; width: 130px; font-weight: 600; text-transform: uppercase; font-size: 11px; letter-spacing: 1px;">Client Name</td>
          <td style="padding: 10px 0; color: #ffffff; font-weight: 600;">${data.name}</td>
        </tr>
        <tr>
          <td style="padding: 10px 0; color: #888888; font-weight: 600; text-transform: uppercase; font-size: 11px; letter-spacing: 1px;">Client Email</td>
          <td style="padding: 10px 0; color: #ffffff;"><a href="mailto:${data.email}" style="color: #ffffff; font-weight: 600; text-decoration: underline;">${data.email}</a></td>
        </tr>
        ${
          data.projectType
            ? `
        <tr>
          <td style="padding: 10px 0; color: #888888; font-weight: 600; text-transform: uppercase; font-size: 11px; letter-spacing: 1px;">Project Type</td>
          <td style="padding: 10px 0; color: #ffffff;">${data.projectType}</td>
        </tr>`
            : ""
        }
        ${
          data.budget
            ? `
        <tr>
          <td style="padding: 10px 0; color: #888888; font-weight: 600; text-transform: uppercase; font-size: 11px; letter-spacing: 1px;">Budget Range</td>
          <td style="padding: 10px 0; color: #ffffff;">${data.budget}</td>
        </tr>`
            : ""
        }
        ${
          data.subject
            ? `
        <tr>
          <td style="padding: 10px 0; color: #888888; font-weight: 600; text-transform: uppercase; font-size: 11px; letter-spacing: 1px;">Subject</td>
          <td style="padding: 10px 0; color: #ffffff;">${data.subject}</td>
        </tr>`
            : ""
        }
      </table>

      <div style="background-color: #141414; padding: 20px; border-radius: 12px; border-left: 3px solid #ffffff; margin-top: 20px;">
        <p style="margin: 0; color: #888888; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 10px; font-weight: 600;">Message / Comments</p>
        <p style="margin: 0; color: #eeeeee; font-size: 15px; line-height: 1.6; white-space: pre-wrap;">${data.message}</p>
      </div>

      <div style="margin-top: 32px; padding-top: 16px; border-top: 1px solid #222222; text-align: center;">
        <a href="mailto:${data.email}?subject=Re: ${encodeURIComponent(data.subject || "Your inquiry")}" style="display: inline-block; background-color: #ffffff; color: #000000; font-weight: 700; font-size: 13px; padding: 12px 24px; border-radius: 9999px; text-decoration: none; margin-bottom: 16px;">
          Reply to Client Directly
        </a>
        <p style="margin: 0; font-size: 11px; color: #555555;">Sent automatically from your VisualCraft Portfolio website</p>
      </div>
    </div>
  `;

  await transporter.sendMail({
    from: `"VisualCraft Portfolio" <${gmailUser}>`,
    to: toEmail,
    replyTo: data.email,
    subject: emailSubject,
    html: htmlContent,
  });

  return true;
}
