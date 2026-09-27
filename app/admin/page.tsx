import type { Metadata } from "next"
import { Container } from "@/components/container"
import { setOrderStatus } from "@/app/actions"
import { getPackage, getNeighborhood, voteCountries } from "@/lib/data"
import { formatMoney } from "@/lib/pricing"
import { listOrders, listSignups, listPartners, getVotes, type OrderStatus } from "@/lib/store"

export const metadata: Metadata = {
  title: "Admin · 8Mealz",
  robots: { index: false, follow: false },
}

export const dynamic = "force-dynamic"

const statuses: OrderStatus[] = ["reserved", "confirmed", "ready", "collected"]

const statusStyle: Record<OrderStatus, string> = {
  reserved: "bg-secondary text-secondary-foreground",
  confirmed: "bg-accent/20 text-accent-foreground",
  ready: "bg-primary/15 text-primary",
  collected: "bg-muted text-muted-foreground",
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <p className="font-heading text-3xl font-700 text-foreground">{value}</p>
      <p className="mt-1 text-sm text-muted-foreground">{label}</p>
    </div>
  )
}

export default function AdminPage() {
  const orders = listOrders()
  const signups = listSignups()
  const partners = listPartners()
  const votes = getVotes()

  const revenue = orders.reduce((sum, o) => sum + o.totals.total, 0)
  const voteRows = voteCountries
    .map((c) => ({ ...c, count: votes[c.id] ?? 0 }))
    .sort((a, b) => b.count - a.count)

  return (
    <main className="py-12 lg:py-16">
      <Container>
        <header className="mb-8">
          <p className="font-heading text-sm font-600 uppercase tracking-wide text-primary">Operations</p>
          <h1 className="mt-1 text-balance text-3xl sm:text-4xl">Admin dashboard</h1>
          <p className="mt-2 max-w-xl text-pretty text-muted-foreground">
            Live view of reservations, pilot signups, partner applications, and expansion votes.
          </p>
        </header>

        <section className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <Stat label="Orders" value={orders.length} />
          <Stat label="Reservation value" value={formatMoney(revenue)} />
          <Stat label="Pilot signups" value={signups.length} />
          <Stat label="Partner applications" value={partners.length} />
        </section>

        <section className="mt-12">
          <h2 className="font-heading text-xl font-700 text-foreground">Orders</h2>
          {orders.length === 0 ? (
            <p className="mt-3 text-sm text-muted-foreground">No orders yet.</p>
          ) : (
            <div className="mt-4 overflow-x-auto rounded-2xl border border-border">
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead className="bg-secondary/60 text-xs uppercase tracking-wide text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3 font-600">Code</th>
                    <th className="px-4 py-3 font-600">Recipient</th>
                    <th className="px-4 py-3 font-600">Package</th>
                    <th className="px-4 py-3 font-600">Pickup</th>
                    <th className="px-4 py-3 font-600">Total</th>
                    <th className="px-4 py-3 font-600">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {orders.map((o) => {
                    const pkg = getPackage(o.packageId)
                    const hood = getNeighborhood(o.neighborhoodId)
                    return (
                      <tr key={o.id} className="align-middle">
                        <td className="px-4 py-3 font-mono text-xs font-600 text-foreground">{o.code}</td>
                        <td className="px-4 py-3">
                          <div className="font-500 text-foreground">{o.recipientName}</div>
                          <div className="text-xs text-muted-foreground">{o.recipientPhone}</div>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">{pkg?.name ?? o.packageId}</td>
                        <td className="px-4 py-3 text-muted-foreground">{hood?.name ?? o.neighborhoodId}</td>
                        <td className="px-4 py-3 font-600 text-foreground">{formatMoney(o.totals.total)}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <span
                              className={`rounded-full px-2.5 py-1 text-xs font-600 capitalize ${statusStyle[o.status]}`}
                            >
                              {o.status}
                            </span>
                            <form action={setOrderStatus} className="flex items-center gap-1">
                              <input type="hidden" name="code" value={o.code} />
                              <label htmlFor={`status-${o.id}`} className="sr-only">
                                Update status for {o.code}
                              </label>
                              <select
                                id={`status-${o.id}`}
                                name="status"
                                defaultValue={o.status}
                                className="rounded-md border border-border bg-background px-2 py-1 text-xs capitalize text-foreground"
                              >
                                {statuses.map((s) => (
                                  <option key={s} value={s} className="capitalize">
                                    {s}
                                  </option>
                                ))}
                              </select>
                              <button
                                type="submit"
                                className="rounded-md bg-primary px-2.5 py-1 text-xs font-600 text-primary-foreground transition-colors hover:bg-primary/90"
                              >
                                Save
                              </button>
                            </form>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <div className="mt-12 grid gap-8 lg:grid-cols-2">
          <section>
            <h2 className="font-heading text-xl font-700 text-foreground">Pilot signups</h2>
            {signups.length === 0 ? (
              <p className="mt-3 text-sm text-muted-foreground">No signups yet.</p>
            ) : (
              <ul className="mt-4 divide-y divide-border rounded-2xl border border-border">
                {signups.map((s) => (
                  <li key={s.id} className="flex items-start justify-between gap-4 px-4 py-3">
                    <div>
                      <p className="font-500 text-foreground">{s.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {s.email} · {s.phone}
                      </p>
                    </div>
                    <span className="shrink-0 text-xs text-muted-foreground">{s.city}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section>
            <h2 className="font-heading text-xl font-700 text-foreground">Partner applications</h2>
            {partners.length === 0 ? (
              <p className="mt-3 text-sm text-muted-foreground">No applications yet.</p>
            ) : (
              <ul className="mt-4 divide-y divide-border rounded-2xl border border-border">
                {partners.map((p) => (
                  <li key={p.id} className="px-4 py-3">
                    <div className="flex items-start justify-between gap-4">
                      <p className="font-500 text-foreground">{p.business}</p>
                      <span className="shrink-0 text-xs text-muted-foreground">{p.neighborhood}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {p.contact} · {p.email} · {p.phone}
                    </p>
                    {p.message && <p className="mt-1 text-sm text-muted-foreground">{p.message}</p>}
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>

        <section className="mt-12">
          <h2 className="font-heading text-xl font-700 text-foreground">Expansion votes</h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {voteRows.map((c) => (
              <li
                key={c.id}
                className="flex items-center justify-between rounded-xl border border-border bg-card px-4 py-3"
              >
                <span className="font-500 text-foreground">{c.name}</span>
                <span className="font-heading text-lg font-700 text-primary">{c.count}</span>
              </li>
            ))}
          </ul>
        </section>
      </Container>
    </main>
  )
}
