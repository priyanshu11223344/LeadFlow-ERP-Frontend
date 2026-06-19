import React from "react";
import {
  ArrowUpRight,
  BadgeIndianRupee,
  Boxes,
  CheckCircle2,
  Clock3,
  Package,
  Plus,
  Sparkles,
  TrendingUp,
  UserRound,
} from "lucide-react";

import {
  useGetDeals,
} from "../../features/deals/dealHooks";
import {
  useGetInventory,
} from "../../features/inventory/inventoryHooks";
import {
  useGetLeads,
} from "../../features/leads/leadHooks";
import {
  useGetOrders,
} from "../../features/orders/orderHooks";

const DashboardOverview = ({
  onOpenModal,
}) => {
  const { data: leadsData } =
    useGetLeads();
  const { data: dealsData } =
    useGetDeals();
  const { data: ordersData } =
    useGetOrders();
  const { data: inventoryData } =
    useGetInventory();

  const leads = leadsData?.data || [];
  const deals = dealsData?.data || [];
  const orders = ordersData?.data || [];
  const inventory =
    inventoryData?.data || [];
  const wonDeals =
    deals.filter(
      (deal) =>
        deal.status === "won"
    );
  const totalPipeline =
    deals.reduce(
      (sum, deal) =>
        deal.status !== "lost" &&
        deal.status !== "won"
          ? sum +
            Number(deal.amount || 0)
          : sum,
      0
    );
  const lowStock =
    inventory.filter((item) =>
      [
        "LOW_STOCK",
        "OUT_OF_STOCK",
        "TO_BE_ORDERED",
      ].includes(item.status)
    );
  const completionRate =
    orders.length > 0
      ? Math.round(
          (
            orders.filter((order) =>
              [
                "DELIVERED",
                "COMPLETED",
              ].includes(order.status)
            ).length /
            orders.length
          ) * 100
        )
      : 0;

  const stats = [
    {
      label: "Active leads",
      value: leads.length,
      note: "Across your pipeline",
      icon: UserRound,
      tone: "bg-[#eeeaff]",
    },
    {
      label: "Pipeline value",
      value: `₹${totalPipeline.toLocaleString("en-IN")}`,
      note: "Open opportunities",
      icon: BadgeIndianRupee,
      tone: "bg-[#f7e8f6]",
    },
    {
      label: "Total orders",
      value: orders.length,
      note: `${completionRate}% fulfilled`,
      icon: Boxes,
      tone: "bg-[#e8f2ff]",
    },
    {
      label: "Stock alerts",
      value: lowStock.length,
      note: "Needs attention",
      icon: Package,
      tone: "bg-[#fff0e3]",
    },
  ];

  const recentLeads =
    leads
      .slice()
      .sort(
        (a, b) =>
          new Date(b.createdAt) -
          new Date(a.createdAt)
      )
      .slice(0, 4);
  const recentOrders =
    orders
      .slice()
      .sort(
        (a, b) =>
          new Date(b.createdAt) -
          new Date(a.createdAt)
      )
      .slice(0, 4);

  return (
    <div className="mx-auto max-w-[1500px] space-y-5">
      <section className="grid gap-5 xl:grid-cols-[1.65fr_0.85fr]">
        <div className="lf-lavender relative min-h-[210px] overflow-hidden rounded-[24px] p-6 sm:p-8">
          <div className="relative z-10 max-w-xl">
            <span className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/60 px-3 py-1.5 text-xs font-bold text-[#51438f] backdrop-blur">
              <Sparkles className="h-3.5 w-3.5" />
              LeadFlow workspace
            </span>
            <h2 className="max-w-lg text-3xl font-bold leading-[1.05] tracking-[-0.045em] text-[#202020] sm:text-4xl">
              Your business works better together.
            </h2>
            <p className="mt-3 max-w-md text-sm leading-6 text-slate-700/80">
              Keep leads, quotations, orders, stock, dispatches, and invoices moving from one calm workspace.
            </p>
            <button
              type="button"
              onClick={onOpenModal}
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#202020] px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-black/10 transition-transform hover:-translate-y-0.5"
            >
              <Plus className="h-4 w-4" />
              Add new lead
            </button>
          </div>
          <div className="lf-orb -right-8 -top-6 hidden sm:block" />
        </div>

        <div className="lf-panel flex min-h-[210px] flex-col justify-between p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
                Performance
              </p>
              <h3 className="mt-2 text-2xl font-bold tracking-tight">
                Order completion
              </h3>
            </div>
            <span className="rounded-full bg-[#202020] px-3 py-1.5 text-xs font-bold text-white">
              {completionRate}%
            </span>
          </div>
          <div>
            <div className="mb-3 flex items-end gap-2">
              <span className="text-5xl font-bold tracking-[-0.06em]">
                {orders.length}
              </span>
              <span className="pb-1 text-sm font-medium text-slate-400">
                total orders
              </span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-[#eeece9]">
              <div
                className="h-full rounded-full bg-[#b9a9f5] transition-all"
                style={{
                  width: `${completionRate}%`,
                }}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <article
              key={stat.label}
              className="lf-panel flex items-center justify-between gap-4 p-5"
            >
              <div>
                <p className="text-xs font-semibold text-slate-500">
                  {stat.label}
                </p>
                <p className="mt-2 text-2xl font-bold tracking-[-0.04em] text-[#202020]">
                  {stat.value}
                </p>
                <p className="mt-1 text-[11px] font-medium text-slate-400">
                  {stat.note}
                </p>
              </div>
              <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${stat.tone}`}>
                <Icon className="h-5 w-5 text-[#202020]" />
              </div>
            </article>
          );
        })}
      </section>

      <section className="grid gap-5 xl:grid-cols-[1fr_1fr_0.78fr]">
        <article className="lf-panel p-5 sm:p-6">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.15em] text-slate-400">
                People
              </p>
              <h3 className="mt-1 text-xl font-bold">
                Recent leads
              </h3>
            </div>
            <ArrowUpRight className="h-5 w-5 text-slate-400" />
          </div>

          <div className="space-y-3">
            {recentLeads.length > 0 ? (
              recentLeads.map((lead, index) => (
                <div
                  key={lead._id}
                  className="lf-soft-panel flex items-center gap-3 p-3"
                >
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                      [
                        "bg-[#d9d0ff]",
                        "bg-[#f5d7ec]",
                        "bg-[#d9edff]",
                        "bg-[#fce4c9]",
                      ][index % 4]
                    }`}
                  >
                    {lead.name?.charAt(0)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold">
                      {lead.name}
                    </p>
                    <p className="truncate text-xs text-slate-400">
                      {lead.companyName || lead.email}
                    </p>
                  </div>
                  <span className="rounded-full bg-white px-2.5 py-1 text-[10px] font-bold text-slate-500">
                    {lead.leadStage}
                  </span>
                </div>
              ))
            ) : (
              <p className="py-8 text-center text-sm text-slate-400">
                No leads yet.
              </p>
            )}
          </div>
        </article>

        <article className="lf-panel p-5 sm:p-6">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.15em] text-slate-400">
                Activity
              </p>
              <h3 className="mt-1 text-xl font-bold">
                Recent orders
              </h3>
            </div>
            <Clock3 className="h-5 w-5 text-slate-400" />
          </div>

          <div className="space-y-3">
            {recentOrders.length > 0 ? (
              recentOrders.map((order) => (
                <div
                  key={order._id}
                  className="flex items-center gap-3 border-b border-black/[0.05] py-3 last:border-0"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#202020] text-white">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold">
                      {order.poNumber}
                    </p>
                    <p className="truncate text-xs text-slate-400">
                      {order.clientId?.clientName || "Client"} · {order.items?.length || 0} items
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold">
                      ₹{Number(order.grandTotal || 0).toLocaleString("en-IN")}
                    </p>
                    <p className="text-[10px] font-semibold text-slate-400">
                      {order.status?.replaceAll("_", " ")}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="py-8 text-center text-sm text-slate-400">
                No orders yet.
              </p>
            )}
          </div>
        </article>

        <div className="space-y-5">
          <article className="overflow-hidden rounded-[22px] bg-[#202020] p-5 text-white">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#d9d0ff] text-[#202020]">
                <TrendingUp className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-white/55">
                  Won opportunities
                </p>
                <p className="text-2xl font-bold">
                  {wonDeals.length}
                </p>
              </div>
            </div>
            <p className="mt-5 text-sm leading-6 text-white/65">
              ₹{wonDeals.reduce((sum, deal) => sum + Number(deal.amount || 0), 0).toLocaleString("en-IN")} closed value.
            </p>
          </article>

          <article className="lf-lavender relative min-h-[190px] overflow-hidden rounded-[22px] p-5">
            <Sparkles className="h-5 w-5 text-[#6856ae]" />
            <h3 className="mt-8 max-w-[180px] text-2xl font-bold leading-7 tracking-tight">
              Turn every signal into progress.
            </h3>
            <div className="absolute -bottom-16 -right-14 h-40 w-40 rounded-full border-[25px] border-white/40" />
          </article>
        </div>
      </section>
    </div>
  );
};

export default DashboardOverview;
