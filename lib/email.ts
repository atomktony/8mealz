import "server-only"
import { Resend } from "resend"
import type { Order, Partner } from "./store"
import { getExtra, getNeighborhood, getPackage } from "./data"
import { formatMoney } from "./pricing"
import { site } from "./site"

const resend = new Resend(process.env.RESEND_API_KEY)

// 8mealz.com is not yet verified in Resend, so sending from it returns 403.
// Use the sandbox sender until the DNS records are added, then flip this to
// `orders@${process.env.RESEND_EMAIL_DOMAIN}`. The sandbox can only deliver
// to the Resend account owner's inbox (site.ordersEmail).
function fromAddress(): string {
  return "8Mealz <onboarding@resend.dev>"
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
}

function row(label: string, value: string): string {
  return `<tr><td style="padding:6px 12px 6px 0;color:#6b7280;white-space:nowrap;vertical-align:top">${label}</td><td style="padding:6px 0">${escapeHtml(value) || "—"}</td></tr>`
}

function orderDetails(order: Order) {
  const pkg = getPackage(order.packageId)
  const neighborhood = getNeighborhood(order.neighborhoodId)
  const extras = order.extraIds
    .map((id) => getExtra(id)?.name)
    .filter((name): name is string => Boolean(name))
  const pickup = neighborhood ? `${neighborhood.name}, ${neighborhood.city}` : order.neighborhoodId
  return { pkg, extras, pickup }
}

export async function sendOrderNotification(order: Order): Promise<void> {
  const { pkg, extras, pickup } = orderDetails(order)
  const lines =
    order.totals.lines.map((l) => row(l.label, formatMoney(l.amount))).join("") +
    row("Subtotal", formatMoney(order.totals.subtotal)) +
    row("Service fee", formatMoney(order.totals.serviceFee)) +
    (order.totals.membership > 0 ? row("Annual membership", formatMoney(order.totals.membership)) : "")

  const html = `
    <div style="font-family:Inter,Arial,sans-serif;color:#111827;max-width:600px">
      <h1 style="font-size:20px;margin:0 0 4px">New order ${escapeHtml(order.code)}</h1>
      <p style="margin:0 0 16px;color:#6b7280">${new Date(order.createdAt).toLocaleString("en-GB", { timeZone: "Atlantic/Cape_Verde" })} (Cabo Verde time)</p>
      <h2 style="font-size:14px;text-transform:uppercase;letter-spacing:.05em;color:#6b7280;margin:16px 0 4px">Package</h2>
      <table style="border-collapse:collapse">${row("Package", pkg?.name ?? order.packageId)}${row("Extras", extras.join(", ") || "None")}${row("Pickup", pickup)}${row("Notes", order.notes)}</table>
      <h2 style="font-size:14px;text-transform:uppercase;letter-spacing:.05em;color:#6b7280;margin:16px 0 4px">Recipient</h2>
      <table style="border-collapse:collapse">${row("Name", order.recipientName)}${row("WhatsApp", order.recipientPhone)}</table>
      <h2 style="font-size:14px;text-transform:uppercase;letter-spacing:.05em;color:#6b7280;margin:16px 0 4px">Sender</h2>
      <table style="border-collapse:collapse">${row("Name", order.senderName)}${row("Email", order.senderEmail)}</table>
      <h2 style="font-size:14px;text-transform:uppercase;letter-spacing:.05em;color:#6b7280;margin:16px 0 4px">Totals</h2>
      <table style="border-collapse:collapse">${lines}${row("Total", formatMoney(order.totals.total))}</table>
    </div>`

  const { error } = await resend.emails.send(
    {
      from: fromAddress(),
      to: [site.ordersEmail],
      replyTo: order.senderEmail,
      subject: `New 8Mealz order ${order.code} — ${pkg?.name ?? order.packageId} for ${order.recipientName}`,
      html,
    },
    { idempotencyKey: `order-notification/${order.code}` },
  )
  if (error) throw new Error(`Order notification failed: ${error.message}`)
}

export async function sendOrderConfirmation(order: Order): Promise<void> {
  const { pkg, extras, pickup } = orderDetails(order)
  const html = `
    <div style="font-family:Inter,Arial,sans-serif;color:#111827;max-width:600px">
      <h1 style="font-size:20px;margin:0 0 8px">Your 8Mealz order is reserved</h1>
      <p style="margin:0 0 16px">Hi ${escapeHtml(order.senderName)}, we&apos;ve reserved fresh food for ${escapeHtml(order.recipientName)}. Our team will confirm the details with you on WhatsApp.</p>
      <p style="margin:0 0 4px;color:#6b7280">Pickup code</p>
      <p style="font-size:28px;font-weight:700;letter-spacing:.1em;margin:0 0 16px">${escapeHtml(order.code)}</p>
      <table style="border-collapse:collapse">${row("Package", pkg?.name ?? order.packageId)}${row("Extras", extras.join(", ") || "None")}${row("Pickup", pickup)}${row("Total", formatMoney(order.totals.total))}</table>
      <p style="margin:16px 0 0;color:#6b7280">Share the pickup code with ${escapeHtml(order.recipientName)} — they will need it at the market. Questions? Reply to this email.</p>
    </div>`

  const { error } = await resend.emails.send(
    {
      from: fromAddress(),
      to: [order.senderEmail],
      replyTo: site.ordersEmail,
      subject: `Your 8Mealz pickup code: ${order.code}`,
      html,
    },
    { idempotencyKey: `order-confirmation/${order.code}` },
  )
  if (error) throw new Error(`Order confirmation failed: ${error.message}`)
}

export async function sendPartnerNotification(partner: Partner): Promise<void> {
  const html = `
    <div style="font-family:Inter,Arial,sans-serif;color:#111827;max-width:600px">
      <h1 style="font-size:20px;margin:0 0 16px">New market partner application</h1>
      <table style="border-collapse:collapse">${row("Business", partner.business)}${row("Contact", partner.contact)}${row("Email", partner.email)}${row("WhatsApp", partner.phone)}${row("Neighborhood", partner.neighborhood)}${row("Message", partner.message)}</table>
    </div>`

  const { error } = await resend.emails.send(
    {
      from: fromAddress(),
      to: [site.ordersEmail],
      replyTo: partner.email,
      subject: `Partner application: ${partner.business}`,
      html,
    },
    { idempotencyKey: `partner-application/${partner.id}` },
  )
  if (error) throw new Error(`Partner notification failed: ${error.message}`)
}
