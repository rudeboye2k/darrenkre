/**
 * Cloudflare Worker for darrenkre.com
 *
 * - Serves the static site through the ASSETS binding.
 * - Accepts form submissions at POST /api/valuation and POST /api/contact,
 *   and emails them to the office using the Resend API.
 *
 * Configuration (env vars / secrets):
 *   RESEND_API_KEY  (secret, required)  -> `npx wrangler secret put RESEND_API_KEY`
 *   TO_EMAIL        (var, optional)     -> where submissions are sent
 *   FROM_EMAIL      (var, optional)     -> verified Resend sender
 */

// Defaults — overridable via [vars] in wrangler.toml without touching this file.
const DEFAULT_TO = "edward.weir@weirenot.com"; // TESTING recipient. Change to darren@darrenkre.com when live.
const DEFAULT_FROM = "Darren K Real Estate <onboarding@resend.dev>"; // Resend test sender. Replace with a verified darrenkre.com address for production.

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (request.method === "POST" && url.pathname === "/api/valuation") {
      return handleForm(request, env, "Home Valuation Request");
    }
    if (request.method === "POST" && url.pathname === "/api/contact") {
      return handleForm(request, env, "Contact Message");
    }

    // Everything else: serve the static site.
    return env.ASSETS.fetch(request);
  },
};

async function handleForm(request, env, kind) {
  let data;
  try {
    data = await request.json();
  } catch {
    return json({ error: "Invalid request body." }, 400);
  }

  // Honeypot: real users never fill the hidden "company" field. Silently accept bots.
  if (data.company) return json({ ok: true });

  const name = String(data.name || "").trim();
  const email = String(data.email || "").trim();
  if (!name || !email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return json({ error: "Please provide a valid name and email." }, 400);
  }

  if (!env.RESEND_API_KEY) {
    return json({ error: "Email is not configured on the server." }, 500);
  }

  const to = env.TO_EMAIL || DEFAULT_TO;
  const from = env.FROM_EMAIL || DEFAULT_FROM;
  const { text, html } = formatEmail(kind, data);

  let res;
  try {
    res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: email,
        subject: `[darrenkre.com] ${kind} — ${name}`,
        text,
        html,
      }),
    });
  } catch (err) {
    console.log("Email request failed:", err);
    return json({ error: "Could not send. Please try again later." }, 502);
  }

  if (!res.ok) {
    console.log("Resend error", res.status, await res.text());
    return json({ error: "Could not send. Please try again later." }, 502);
  }

  return json({ ok: true });
}

function formatEmail(kind, data) {
  const fields = [
    ["Name", data.name],
    ["Email", data.email],
    ["Phone", data.phone],
    ["Looking to", data.intent],
    ["Property address", data.address],
    ["City", data.city],
    ["ZIP", data.zip],
    ["Property type", data.propertyType],
    ["Condition", data.condition],
    ["Bedrooms", data.bedrooms],
    ["Bathrooms", data.bathrooms],
    ["Approx. sq ft", data.squareFeet],
    ["Year built", data.yearBuilt],
    ["Message", data.message],
  ].filter(([, v]) => v !== undefined && v !== null && String(v).trim() !== "");

  const text =
    `New ${kind} from darrenkre.com\n\n` +
    fields.map(([k, v]) => `${k}: ${v}`).join("\n");

  const rows = fields
    .map(
      ([k, v]) =>
        `<tr><td style="padding:6px 14px;font-weight:600;color:#0f2742;border-bottom:1px solid #eee;">${esc(
          k
        )}</td><td style="padding:6px 14px;color:#1c2530;border-bottom:1px solid #eee;">${esc(
          String(v)
        )}</td></tr>`
    )
    .join("");

  const html =
    `<div style="font-family:Arial,Helvetica,sans-serif;max-width:560px;">` +
    `<h2 style="color:#0f2742;margin:0 0 12px;">New ${esc(kind)}</h2>` +
    `<table style="border-collapse:collapse;width:100%;">${rows}</table>` +
    `<p style="color:#5d6b7a;font-size:12px;margin-top:16px;">Sent automatically from darrenkre.com</p>` +
    `</div>`;

  return { text, html };
}

function esc(s) {
  return s.replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])
  );
}

function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}
