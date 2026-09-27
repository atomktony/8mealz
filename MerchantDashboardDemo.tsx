"use client";
import React, { useState } from 'react';
import {
  TrendingUp,
  Package,
  CheckCircle2,
  Clock,
  Banknote,
  Search,
  Filter,
  Eye,
  Store,
  Calendar,
  AlertCircle,
  X
} from 'lucide-react';

interface DemoOrder {
  id: string;
  senderName: string;
  senderCity: string;
  recipientName: string;
  recipientPhone: string;
  recipientNeighborhood: string;
  basketType: string;
  items: string[];
  totalValueEur: number;
  totalValueCve: number;
  status: 'ready' | 'preparing' | 'completed';
  timeAgo: string;
  pickupCode: string;
  specialNote?: string;
}

const DEMO_ORDERS: DemoOrder[] = [
  {
    id: '#8M-4921',
    senderName: 'Sarah Mendes',
    senderCity: 'Lisbon, Portugal',
    recipientName: 'Dona Maria Mendes',
    recipientPhone: '+238 991 2345',
    recipientNeighborhood: 'Achada Santo António',
    basketType: 'Elder Care Diabetic Support',
    items: ['1x Leafy Greens (Couve & Espinafre)', '2kg Santiago Sweet Potatoes', '1x Olive Oil 750ml', '1x Farm Eggs 12pk'],
    totalValueEur: 38.00,
    totalValueCve: 4190,
    status: 'ready',
    timeAgo: '12 mins ago',
    pickupCode: '8M-4921',
    specialNote: 'Diabetic care: fresh greens only, no refined sugar items.',
  },
  {
    id: '#8M-4920',
    senderName: 'Carlos Pires',
    senderCity: 'Porto, Portugal',
    recipientName: 'Tia Helena Pires',
    recipientPhone: '+238 985 6712',
    recipientNeighborhood: 'Plateau',
    basketType: 'Weekly Family Pantry & Greens',
    items: ['5kg Arroz Agulha', '2kg Feijão Pedra', '3kg Tomatoes & Onions', '1x Cooking Oil', '1kg Local Bananas'],
    totalValueEur: 52.00,
    totalValueCve: 5730,
    status: 'preparing',
    timeAgo: '45 mins ago',
    pickupCode: '8M-4920',
  },
  {
    id: '#8M-4919',
    senderName: 'Maria Veiga',
    senderCity: 'Paris, France',
    recipientName: 'Vovô João Veiga',
    recipientPhone: '+238 993 4455',
    recipientNeighborhood: 'Palmarejo',
    basketType: 'Fresh Santiago Produce Box',
    items: ['2kg Heirloom Tomatoes', '1.5kg Manioc & Yam', '1kg Local Limes & Papaya', '2 bunches Fresh Spinach'],
    totalValueEur: 32.50,
    totalValueCve: 3580,
    status: 'completed',
    timeAgo: '2 hours ago',
    pickupCode: '8M-4919',
  },
  {
    id: '#8M-4918',
    senderName: 'Antonio Delgado',
    senderCity: 'Rotterdam, Netherlands',
    recipientName: 'Sra. Teresa Delgado',
    recipientPhone: '+238 994 8821',
    recipientNeighborhood: 'Fazenda',
    basketType: 'Elder Care Diabetic Support',
    items: ['1x Green Vegetables Pack', '1kg Oat Flakes & Whole Grains', '1x Olive Oil', '1x Fresh Garlic & Ginger'],
    totalValueEur: 38.00,
    totalValueCve: 4190,
    status: 'completed',
    timeAgo: 'Yesterday',
    pickupCode: '8M-4918',
  },
];

export const MerchantDashboardDemo: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'orders' | 'analytics' | 'payouts'>('orders');
  const [orderFilter, setOrderFilter] = useState<'all' | 'ready' | 'preparing' | 'completed'>('all');
  const [selectedOrder, setSelectedOrder] = useState<DemoOrder | null>(null);
  const [isStoreOnline, setIsStoreOnline] = useState(true);
  const [orders, setOrders] = useState<DemoOrder[]>(DEMO_ORDERS);

  const handleMarkFulfilled = (orderId: string) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: 'completed' } : o))
    );
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder({ ...selectedOrder, status: 'completed' });
    }
  };

  const filteredOrders = orders.filter((o) => {
    if (orderFilter === 'all') return true;
    return o.status === orderFilter;
  });

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden mb-16" id="merchant-dashboard-demo">
      {/* Top Banner / Merchant Navigation bar */}
      <div className="bg-slate-900 text-white px-6 py-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white">
            <Store size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm sm:text-base text-white">
                Demo Market · Plateau (sample data)
              </span>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30">
                Partner #CV-041
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Praia Historic Center • Verified 8Mealz Anchor Merchant
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Online status toggle */}
          <button
            onClick={() => setIsStoreOnline(!isStoreOnline)}
            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
              isStoreOnline
                ? 'bg-emerald-950 text-emerald-300 border border-emerald-700/60'
                : 'bg-slate-800 text-slate-400 border border-slate-700'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${isStoreOnline ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`} />
            <span>{isStoreOnline ? 'Accepting Orders' : 'Store Paused'}</span>
          </button>

          <span className="text-xs text-slate-400 hidden sm:inline-block">
            Currency: EUR (€) / CVE
          </span>
        </div>
      </div>

      {/* Top Analytics Summary Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-100 border-b border-slate-100 bg-slate-50/50">
        <div className="p-5 sm:p-6">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>Total Diaspora Orders</span>
            <span className="p-1 rounded-md bg-emerald-50 text-emerald-600">
              <Package size={14} />
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">38</span>
            <span className="text-[11px] font-semibold text-emerald-600 flex items-center">
              <TrendingUp size={12} className="mr-0.5" /> +14%
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Pilot cohort orders fulfilled</p>
        </div>

        <div className="p-5 sm:p-6">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>Gross Store Revenue</span>
            <span className="p-1 rounded-md bg-emerald-50 text-emerald-600">
              <Banknote size={14} />
            </span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold text-slate-900">€1,482</span>
            <span className="text-xs text-slate-500 font-mono">163,020 CVE</span>
          </div>
          <p className="text-[11px] text-emerald-700 font-medium mt-1">100% shelf price (0% commission)</p>
        </div>

        <div className="p-5 sm:p-6">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>Pickup Success Rate</span>
            <span className="p-1 rounded-md bg-emerald-50 text-emerald-600">
              <CheckCircle2 size={14} />
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">97.4%</span>
            <span className="text-[11px] font-semibold text-slate-500">37 of 38</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Avg pickup time: 3.8 hrs</p>
        </div>

        <div className="p-5 sm:p-6">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>Next BCA Bank Payout</span>
            <span className="p-1 rounded-md bg-emerald-50 text-emerald-600">
              <Clock size={14} />
            </span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold text-emerald-700">€418.00</span>
            <span className="text-xs text-slate-500">46,000 CVE</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Settles Friday • BCA Plateau</p>
        </div>
      </div>

      {/* Interactive Tabs Header */}
      <div className="px-6 border-b border-slate-100 flex items-center justify-between flex-wrap gap-3 bg-white">
        <div className="flex space-x-2 sm:space-x-4">
          <button
            onClick={() => setActiveTab('orders')}
            className={`py-4 text-xs sm:text-sm font-semibold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'orders'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Package size={16} />
            <span>Order Management Tools</span>
            <span className="bg-emerald-100 text-emerald-800 text-[10px] px-1.5 py-0.5 rounded-full font-bold">
              {orders.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`py-4 text-xs sm:text-sm font-semibold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'analytics'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <TrendingUp size={16} />
            <span>Sales & Demand Analytics</span>
          </button>

          <button
            onClick={() => setActiveTab('payouts')}
            className={`py-4 text-xs sm:text-sm font-semibold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'payouts'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Banknote size={16} />
            <span>Bank Settlements (BCA / BCN)</span>
          </button>
        </div>

        <span className="text-[11px] text-slate-400 hidden md:inline-block">
          Interactive Live Demo for Prospective Storekeepers
        </span>
      </div>

      {/* Tab Content 1: Order Management Tools */}
      {activeTab === 'orders' && (
        <div className="p-6">
          {/* Sub-filters */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-medium">
              <button
                onClick={() => setOrderFilter('all')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  orderFilter === 'all' ? 'bg-white text-slate-900 shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All Orders ({orders.length})
              </button>
              <button
                onClick={() => setOrderFilter('ready')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  orderFilter === 'ready' ? 'bg-white text-slate-900 shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Ready for Pickup
              </button>
              <button
                onClick={() => setOrderFilter('preparing')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  orderFilter === 'preparing' ? 'bg-white text-slate-900 shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Assembling
              </button>
              <button
                onClick={() => setOrderFilter('completed')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  orderFilter === 'completed' ? 'bg-white text-slate-900 shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Completed
              </button>
            </div>

            <div className="text-xs text-slate-500 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>Click any order to view physical packing slip & release code</span>
            </div>
          </div>

          {/* Orders Table */}
          <div className="overflow-x-auto border border-slate-200/80 rounded-2xl">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50 text-slate-600 uppercase text-[10px] tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4 font-semibold">Order ID</th>
                  <th className="py-3 px-4 font-semibold">Diaspora Sender</th>
                  <th className="py-3 px-4 font-semibold">Praia Recipient</th>
                  <th className="py-3 px-4 font-semibold">Basket Type</th>
                  <th className="py-3 px-4 font-semibold text-right">Store Payout</th>
                  <th className="py-3 px-4 font-semibold text-center">Status</th>
                  <th className="py-3 px-4 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredOrders.map((order) => (
                  <tr
                    key={order.id}
                    onClick={() => setSelectedOrder(order)}
                    className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                  >
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                      {order.id}
                      <span className="block text-[10px] font-normal text-slate-400 font-sans">{order.timeAgo}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-slate-900 block">{order.senderName}</span>
                      <span className="text-[11px] text-slate-500">{order.senderCity}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-slate-900 block">{order.recipientName}</span>
                      <span className="text-[11px] text-slate-500">{order.recipientNeighborhood}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-medium text-slate-800">{order.basketType}</span>
                      {order.specialNote && (
                        <span className="block text-[11px] text-amber-700 italic truncate max-w-xs">
                          Note: {order.specialNote}
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <span className="font-bold text-slate-900">€{order.totalValueEur.toFixed(2)}</span>
                      <span className="block text-[10px] text-slate-400 font-mono">{order.totalValueCve} CVE</span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
                          order.status === 'ready'
                            ? 'bg-amber-100 text-amber-800'
                            : order.status === 'preparing'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {order.status === 'ready' && <Clock size={12} />}
                        {order.status === 'preparing' && <Package size={12} />}
                        {order.status === 'completed' && <CheckCircle2 size={12} />}
                        <span className="capitalize">{order.status === 'ready' ? 'Ready for Pickup' : order.status}</span>
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedOrder(order);
                        }}
                        className="p-1.5 text-slate-400 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors"
                        title="View Packing Slip"
                      >
                        <Eye size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab Content 2: Sales & Demand Analytics */}
      {activeTab === 'analytics' && (
        <div className="p-6 space-y-8">
          <div className="grid lg:grid-cols-12 gap-8">
            {/* Weekly Volume & Revenue Visual Chart */}
            <div className="lg:col-span-8 bg-slate-50 rounded-2xl p-6 border border-slate-200/80">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Daily Order Revenue Trend (Past 7 Days)</h4>
                  <p className="text-xs text-slate-500">Consistent demand from Portugal and European diaspora</p>
                </div>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200/50">
                  Total: €1,482.00
                </span>
              </div>

              {/* Bar Chart Representation with SVG and CSS */}
              <div className="h-44 flex items-end justify-between gap-3 pt-6 pb-2 px-2 border-b border-slate-200">
                {[
                  { day: 'Mon', eur: 180, pct: 45, orders: 4 },
                  { day: 'Tue', eur: 240, pct: 60, orders: 6 },
                  { day: 'Wed', eur: 195, pct: 48, orders: 5 },
                  { day: 'Thu', eur: 310, pct: 78, orders: 8 },
                  { day: 'Fri', eur: 390, pct: 98, orders: 10 },
                  { day: 'Sat', eur: 110, pct: 28, orders: 3 },
                  { day: 'Sun', eur: 57, pct: 14, orders: 2 },
                ].map((bar, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center group relative">
                    {/* Tooltip on hover */}
                    <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-[10px] rounded-md py-1 px-2 pointer-events-none whitespace-nowrap z-10 shadow-sm">
                      €{bar.eur} ({bar.orders} orders)
                    </div>
                    <div
                      className="w-full max-w-[36px] bg-emerald-600 group-hover:bg-emerald-500 rounded-t-lg transition-all duration-300"
                      style={{ height: `${bar.pct}%` }}
                    />
                    <span className="text-[11px] font-semibold text-slate-600 mt-2">{bar.day}</span>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-400 mt-3">
                <span>Peak ordering days: Thursday & Friday</span>
                <span>Average order size: €39.00</span>
              </div>
            </div>

            {/* Produce Category Sourcing Breakdown */}
            <div className="lg:col-span-4 bg-slate-50 rounded-2xl p-6 border border-slate-200/80 flex flex-col justify-between">
              <div>
                <h4 className="text-sm font-bold text-slate-900 mb-1">Top Produce Demanded</h4>
                <p className="text-xs text-slate-500 mb-5">What diaspora families order most</p>

                <div className="space-y-3 text-xs">
                  <div>
                    <div className="flex justify-between font-semibold text-slate-700 mb-1">
                      <span>Fresh Greens & Kale (Couve)</span>
                      <span>42%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-600 rounded-full" style={{ width: '42%' }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between font-semibold text-slate-700 mb-1">
                      <span>Island Tubers (Batata Doce / Manioc)</span>
                      <span>28%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full" style={{ width: '28%' }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between font-semibold text-slate-700 mb-1">
                      <span>Pantry Staples (Rice, Beans, Olive Oil)</span>
                      <span>18%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-500 rounded-full" style={{ width: '18%' }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between font-semibold text-slate-700 mb-1">
                      <span>Island Fruits & Eggs</span>
                      <span>12%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div className="h-full bg-slate-400 rounded-full" style={{ width: '12%' }}></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-200 text-[11px] text-slate-500">
                <strong>Insight for Storekeepers:</strong> Keeping fresh kale and sweet potatoes in your cooler guarantees high-rating fulfillment.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab Content 3: Settlements & Payouts */}
      {activeTab === 'payouts' && (
        <div className="p-6">
          <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-5 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <span className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                <Banknote size={20} />
              </span>
              <div>
                <h4 className="text-sm font-bold text-slate-900">Direct Deposit via Banco Comercial do Atlântico (BCA)</h4>
                <p className="text-xs text-slate-600 mt-0.5">
                  IBAN: CV00 0000 0000 0000 0000 0000 0 • Account: Demo Market Lda
                </p>
              </div>
            </div>

            <div className="text-right sm:border-l sm:border-emerald-200 sm:pl-6">
              <span className="text-xs text-slate-500 block">Current Pending Payout:</span>
              <span className="text-xl font-bold text-emerald-800">€418.00 (46,000 CVE)</span>
              <span className="text-[10px] text-emerald-700 block font-semibold">Direct transfer scheduled Oct 2</span>
            </div>
          </div>

          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
            Recent Settlement Payout History
          </h4>

          <div className="border border-slate-200/80 rounded-2xl overflow-hidden text-xs sm:text-sm">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-slate-600 uppercase text-[10px] tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4 font-semibold">Reference</th>
                  <th className="py-3 px-4 font-semibold">Payout Period</th>
                  <th className="py-3 px-4 font-semibold">Orders Count</th>
                  <th className="py-3 px-4 font-semibold text-right">Amount (EUR)</th>
                  <th className="py-3 px-4 font-semibold text-right">Amount (CVE)</th>
                  <th className="py-3 px-4 font-semibold text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="py-3.5 px-4 font-mono font-semibold text-slate-900">PAY-2026-0925</td>
                  <td className="py-3.5 px-4 text-slate-600">Sep 18 – Sep 24, 2026</td>
                  <td className="py-3.5 px-4 text-slate-800 font-semibold">14 orders</td>
                  <td className="py-3.5 px-4 text-right font-bold text-slate-900">€546.00</td>
                  <td className="py-3.5 px-4 text-right font-mono text-slate-600">60,060 CVE</td>
                  <td className="py-3.5 px-4 text-center">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                      <CheckCircle2 size={12} /> Settled
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-mono font-semibold text-slate-900">PAY-2026-0918</td>
                  <td className="py-3.5 px-4 text-slate-600">Sep 11 – Sep 17, 2026</td>
                  <td className="py-3.5 px-4 text-slate-800 font-semibold">13 orders</td>
                  <td className="py-3.5 px-4 text-right font-bold text-slate-900">€518.00</td>
                  <td className="py-3.5 px-4 text-right font-mono text-slate-600">56,980 CVE</td>
                  <td className="py-3.5 px-4 text-center">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                      <CheckCircle2 size={12} /> Settled
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Selected Order Packing Slip Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-950/50 backdrop-blur-xs" onClick={() => setSelectedOrder(null)} />
          <div className="relative bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl z-10 border border-slate-100">
            <button
              onClick={() => setSelectedOrder(null)}
              className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100"
            >
              <X size={20} />
            </button>

            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                {selectedOrder.id}
              </span>
              <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full capitalize ${
                selectedOrder.status === 'ready'
                  ? 'bg-amber-100 text-amber-800'
                  : selectedOrder.status === 'preparing'
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-emerald-100 text-emerald-800'
              }`}>
                {selectedOrder.status}
              </span>
            </div>

            <h3 className="text-xl font-bold text-slate-900 mb-1">
              Store Preparation & Packing Slip
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              Assigned to Demo Market Plateau for recipient pickup.
            </p>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs space-y-2 mb-5">
              <div className="flex justify-between">
                <span className="text-slate-500">Diaspora Sender:</span>
                <span className="font-semibold text-slate-900">{selectedOrder.senderName} ({selectedOrder.senderCity})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Praia Recipient:</span>
                <span className="font-semibold text-slate-900">{selectedOrder.recipientName} ({selectedOrder.recipientPhone})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Pickup Neighborhood:</span>
                <span className="font-semibold text-slate-900">{selectedOrder.recipientNeighborhood}</span>
              </div>
              {selectedOrder.specialNote && (
                <div className="pt-2 border-t border-slate-200 text-amber-800 font-medium">
                  <strong>Special Care Instructions:</strong> "{selectedOrder.specialNote}"
                </div>
              )}
            </div>

            {/* Checklist items */}
            <div className="mb-6">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2.5">
                Items to Pack from Counter/Shelves:
              </h4>
              <div className="space-y-2">
                {selectedOrder.items.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2.5 text-xs text-slate-700 p-2 rounded-xl bg-slate-50 border border-slate-100">
                    <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Verification Code Box */}
            <div className="p-4 rounded-2xl bg-slate-900 text-white flex items-center justify-between mb-6">
              <div>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Pickup Security Code</span>
                <span className="text-xl font-mono font-bold text-emerald-400">{selectedOrder.pickupCode}</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 block">Payout Value</span>
                <span className="text-lg font-bold text-white">€{selectedOrder.totalValueEur.toFixed(2)}</span>
              </div>
            </div>

            {selectedOrder.status !== 'completed' ? (
              <button
                onClick={() => handleMarkFulfilled(selectedOrder.id)}
                className="w-full py-3 px-6 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs sm:text-sm transition-all shadow-sm flex items-center justify-center gap-2"
              >
                <CheckCircle2 size={16} />
                <span>Mark Verified & Released to Recipient</span>
              </button>
            ) : (
              <div className="text-center py-2 text-xs text-emerald-700 font-semibold bg-emerald-50 rounded-xl border border-emerald-200">
                ✓ Order has been released and queued for bank payout
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
