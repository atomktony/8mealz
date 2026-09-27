import "server-only";

// Sends a plain email alert to ADMIN_EMAIL through Resend. Skips quietly if not configured.
export async function notifyAdmin(subject: string, fields: Record<string, unknown>) {
  const key = process.env.RESEND_API_KEY;
  const to = process.env.ADMIN_EMAIL;
  if (!key || !to) return;
  const text = Object.entries(fields)
    .map(([k, v]) => `${k}: ${typeof v === "object" ? JSON.stringify(v) : String(v ?? "")}`)
    .join("\n");
  try {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: process.env.EMAIL_FROM || "8Mealz <onboarding@resend.dev>",
        to: [to],
        subject: `[8Mealz] ${subject}`,
        text,
      }),
    });
  } catch (e) {
    console.error("notifyAdmin failed", e);
  }
}
