import { Resend } from "resend";
import { mediaUrl } from "@/lib/media";
import type { SiteSettings } from "@/lib/types";

/**
 * Transactional email for the Packages inquiry form: one copy to the studio
 * inbox, one confirmation copy back to the customer. Both are best-effort —
 * the inquiry itself is already safely in Postgres by the time these run
 * (see submitInquiry in src/app/actions.ts), so a missing RESEND_API_KEY or
 * a delivery failure is logged, never surfaced to the visitor as an error.
 */

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

// Resend's shared test domain — works out of the box with no DNS setup, but
// is rate-limited and only reliable for getting started. Once a sending
// domain is verified in the Resend dashboard, set EMAIL_FROM to something
// like "Lensaeri Studio <inquiries@lensaeri.com>".
const FROM = process.env.EMAIL_FROM || "Lensaeri Studio <onboarding@resend.dev>";

// Where the admin-facing copy goes. Overridable via env without a code
// change; defaults to the studio's inbox.
const ADMIN_EMAIL = process.env.ADMIN_NOTIFY_EMAIL || "lensaeri@gmail.com";

export type InquiryEmailData = {
  name: string;
  email: string;
  phone: string;
  eventDate: string;
  location: string;
  pkg: string;
  message: string;
};

function esc(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

const SERIF = "Georgia, 'Times New Roman', serif";
const SANS = "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";

/** Shared dark-cinematic shell — logo/wordmark header, ink background, cream type. */
function shell({
  settings,
  preheader,
  body,
}: {
  settings: SiteSettings;
  preheader: string;
  body: string;
}): string {
  const logo = mediaUrl(settings.logo_path);
  const brand = esc(settings.brand_name);
  const location = esc(settings.brand_location);

  return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${brand}</title>
  </head>
  <body style="margin:0;padding:0;background:#0b0b0a;">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;">${esc(preheader)}</div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#0b0b0a;">
      <tr>
        <td align="center" style="padding:40px 16px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#0b0b0a;border:1px solid rgba(244,242,238,0.12);">
            <tr>
              <td align="center" style="padding:40px 32px 28px;border-bottom:1px solid rgba(244,242,238,0.12);">
                ${
                  logo
                    ? `<img src="${logo}" alt="${brand}" width="180" style="display:block;max-width:180px;height:auto;margin:0 auto 14px;border:0;" />`
                    : `<div style="font-family:${SERIF};font-size:26px;letter-spacing:4px;color:#f4f2ee;margin-bottom:14px;">${brand}</div>`
                }
                <div style="font-family:${SANS};font-size:11px;letter-spacing:3px;text-transform:uppercase;color:rgba(244,242,238,0.55);">${location}</div>
              </td>
            </tr>
            <tr>
              <td style="padding:36px 32px;font-family:${SANS};color:#f4f2ee;">
                ${body}
              </td>
            </tr>
            <tr>
              <td style="padding:22px 32px 30px;border-top:1px solid rgba(244,242,238,0.12);font-family:${SANS};font-size:12px;color:rgba(244,242,238,0.45);text-align:center;">
                ${esc(settings.email)}${settings.phone ? ` &middot; ${esc(settings.phone)}` : ""}
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

function detailRows(rows: Array<[string, string]>): string {
  const present = rows.filter(([, value]) => value.trim());
  if (present.length === 0) return "";
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:22px;">
    ${present
      .map(
        ([label, value]) => `<tr>
        <td style="padding:11px 0;border-bottom:1px solid rgba(244,242,238,0.1);font-family:${SANS};font-size:11px;letter-spacing:2px;text-transform:uppercase;color:rgba(244,242,238,0.5);width:130px;vertical-align:top;">${esc(label)}</td>
        <td style="padding:11px 0;border-bottom:1px solid rgba(244,242,238,0.1);font-family:${SANS};font-size:15px;color:#f4f2ee;">${esc(value)}</td>
      </tr>`
      )
      .join("")}
  </table>`;
}

function messageBlock(label: string, message: string): string {
  if (!message.trim()) return "";
  return `<div style="margin-top:22px;">
    <div style="font-family:${SANS};font-size:11px;letter-spacing:2px;text-transform:uppercase;color:rgba(244,242,238,0.5);margin-bottom:8px;">${esc(label)}</div>
    <p style="font-family:${SANS};font-size:15px;line-height:1.7;color:#f4f2ee;margin:0;white-space:pre-wrap;">${esc(message)}</p>
  </div>`;
}

/**
 * Sends the admin notification and the customer confirmation for one
 * inquiry submission. Never throws — failures are logged and swallowed so a
 * Resend outage can't turn a successful database insert into a form error.
 */
export async function sendInquiryEmails(
  settings: SiteSettings,
  data: InquiryEmailData
): Promise<void> {
  if (!resend) {
    console.warn("[email] RESEND_API_KEY not set — skipping inquiry emails");
    return;
  }

  const details = detailRows([
    ["Name", data.name],
    ["Email", data.email],
    ["Phone", data.phone],
    ["Event date", data.eventDate],
    ["Location", data.location],
    ["Package", data.pkg],
  ]);

  const firstName = data.name.trim().split(/\s+/)[0] || data.name;

  const adminBody = `
    <div style="font-family:${SERIF};font-size:22px;margin:0 0 8px;">New inquiry</div>
    <p style="font-family:${SANS};font-size:14px;line-height:1.7;color:rgba(244,242,238,0.75);margin:0;">
      ${esc(data.name)} just sent an inquiry through the Packages page.
    </p>
    ${details}
    ${messageBlock("Message", data.message)}
    <p style="font-family:${SANS};font-size:13px;line-height:1.6;color:rgba(244,242,238,0.5);margin-top:24px;">
      Reply directly to this email to write back to ${esc(firstName)}.
    </p>`;

  const customerBody = `
    <div style="font-family:${SERIF};font-size:22px;margin:0 0 8px;">Thank you, ${esc(firstName)}.</div>
    <p style="font-family:${SANS};font-size:14px;line-height:1.7;color:rgba(244,242,238,0.75);margin:0;">
      We've received your inquiry and will be in touch within 48 hours. Here's what you sent us, for your records:
    </p>
    ${details}
    ${messageBlock("Your message", data.message)}
    <p style="font-family:${SANS};font-size:13px;line-height:1.6;color:rgba(244,242,238,0.75);margin-top:24px;">
      In the meantime, feel free to reply to this email${settings.phone ? ` or reach us at ${esc(settings.phone)}` : ""}.
    </p>
    <p style="font-family:${SERIF};font-size:16px;color:#f4f2ee;margin-top:28px;">Warmly,<br />${esc(settings.brand_name)}</p>`;

  const [adminResult, customerResult] = await Promise.allSettled([
    resend.emails.send({
      from: FROM,
      to: ADMIN_EMAIL,
      replyTo: data.email,
      subject: `New inquiry — ${data.name}`,
      html: shell({
        settings,
        preheader: `New inquiry from ${data.name}`,
        body: adminBody,
      }),
    }),
    resend.emails.send({
      from: FROM,
      to: data.email,
      replyTo: settings.email,
      subject: `We've received your inquiry — ${settings.brand_name}`,
      html: shell({
        settings,
        preheader: "Thank you for reaching out to us.",
        body: customerBody,
      }),
    }),
  ]);

  if (adminResult.status === "rejected") {
    console.error("[email] admin inquiry notification failed:", adminResult.reason);
  }
  if (customerResult.status === "rejected") {
    console.error("[email] customer inquiry confirmation failed:", customerResult.reason);
  }
}
