import { Resend } from "resend";

function getResend() {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error("RESEND_API_KEY is not configured.");
  return new Resend(key);
}

export interface ContactEmailPayload {
  name: string;
  email: string;
  company?: string;
  team: "technologies" | "consulting" | "general";
  message: string;
}

const TEAM_LABELS = {
  technologies: "PG Technologies",
  consulting: "PG Consulting",
  general: "General",
};

export async function sendContactEmail(payload: ContactEmailPayload) {
  const { name, email, company, team, message } = payload;
  const teamLabel = TEAM_LABELS[team];

  const to = process.env.CONTACT_TO_EMAIL ?? "connect@pgventures.co";
  const from = process.env.CONTACT_FROM_EMAIL ?? "noreply@pgventures.co";

  const { data, error } = await getResend().emails.send({
    from: `PG Ventures Contact <${from}>`,
    to,
    replyTo: email,
    subject: `[${teamLabel}] New inquiry from ${name}`,
    html: `
      <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto; color: #0a0a0a;">
        <div style="border-bottom: 1px solid #e5e5e5; padding-bottom: 16px; margin-bottom: 24px;">
          <strong style="font-size: 18px;">New contact form submission</strong>
          <br />
          <span style="color: #737373; font-size: 14px;">via pgventures.co</span>
        </div>

        <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
          <tr>
            <td style="padding: 8px 0; color: #737373; font-size: 14px; width: 100px; vertical-align: top;">Name</td>
            <td style="padding: 8px 0; font-size: 14px;">${name}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #737373; font-size: 14px; vertical-align: top;">Email</td>
            <td style="padding: 8px 0; font-size: 14px;"><a href="mailto:${email}" style="color: #0a0a0a;">${email}</a></td>
          </tr>
          ${company ? `<tr><td style="padding: 8px 0; color: #737373; font-size: 14px; vertical-align: top;">Company</td><td style="padding: 8px 0; font-size: 14px;">${company}</td></tr>` : ""}
          <tr>
            <td style="padding: 8px 0; color: #737373; font-size: 14px; vertical-align: top;">Team</td>
            <td style="padding: 8px 0; font-size: 14px;">${teamLabel}</td>
          </tr>
        </table>

        <div style="border-top: 1px solid #e5e5e5; padding-top: 20px;">
          <p style="color: #737373; font-size: 14px; margin: 0 0 8px;">Message</p>
          <p style="font-size: 14px; white-space: pre-wrap; margin: 0;">${message}</p>
        </div>
      </div>
    `,
    text: `
New contact form submission — pgventures.co

Name: ${name}
Email: ${email}${company ? `\nCompany: ${company}` : ""}
Team: ${teamLabel}

Message:
${message}
    `.trim(),
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}
