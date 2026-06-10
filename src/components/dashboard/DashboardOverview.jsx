import React from 'react';
import { User, DollarSign, Clock, Package, Check, Sparkles, TrendingUp, Plus } from 'lucide-react';
import { useGetLeads } from "../../features/leads/leadHooks";
import { useGetDeals } from "../../features/deals/dealHooks";
import { useGetOrders } from "../../features/orders/orderHooks";
import { useGetInventory } from "../../features/inventory/inventoryHooks";
const DashboardOverview = ({ onOpenModal }) => {
  const { data: leadsData } = useGetLeads();
  const { data: dealsData } = useGetDeals();
  const { data: ordersData } = useGetOrders();
  const { data: inventoryData } = useGetInventory();

  const leads = leadsData?.data || [];
  const deals = dealsData?.data || [];
  const orders = ordersData?.data || [];
  const inventory = inventoryData?.data || [];
  const totalLeads = leads.length;

  const totalOrders = orders.length;

  const lowStockCount = inventory.filter(
    (item) =>
      item.status === "LOW_STOCK" ||
      item.status === "OUT_OF_STOCK" ||
      item.status === "TO_BE_ORDERED"
  ).length;

  const totalPipeline = deals.reduce(
    (sum, deal) =>
      deal.status !== "lost" &&
        deal.status !== "won"
        ? sum + Number(deal.amount || 0)
        : sum,
    0
  );

  const wonDeals = deals.filter(
    (deal) => deal.status === "won"
  ).length;
  const stats = [
    {
      title: "Total Leads",
      value: totalLeads,
      icon: User,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      title: "Total Pipeline",
      value: `$${totalPipeline.toLocaleString()}`,
      icon: DollarSign,
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      title: "Total Orders",
      value: totalOrders,
      icon: Clock,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
    {
      title: "Low Stock",
      value: lowStockCount,
      icon: Package,
      color: "text-red-600",
      bg: "bg-red-50",
    },
  ];

  return (
    <div className="max-w-screen-2xl mx-auto space-y-12">
      {/* Header (Matched exactly to photo) */}
      <div className="flex justify-between items-end gap-4">
        <div className="space-y-1">
          <h2 className="text-3xl font-extrabold text-gray-950 tracking-tighter">Overview</h2>
          <p className="text-gray-500 text-sm font-medium">Manage your business growth effectively.</p>
        </div>
        <button
          onClick={onOpenModal}
          className="bg-black text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2.5 hover:bg-gray-800 transition-all shadow-md group"
        >
          <Plus className="w-5 h-5 group-hover:scale-110 transition-transform stroke-white stroke-[2px]" />
          New Lead
        </button>
      </div>

      {/* Stats Grid & Separated "Won Deals" */}
      <div className="space-y-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div key={i} className="bg-white p-7 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                <div className={`${stat.bg} ${stat.color} w-12 h-12 rounded-xl flex items-center justify-center`}>
                  <Icon className="w-6 h-6 stroke-[1.5px]" />
                </div>
                <div>
                  <p className="text-gray-500 text-sm font-medium">{stat.title}</p>
                  <h3 className="text-3xl font-extrabold mt-1 text-gray-950 tracking-tighter">{stat.value}</h3>
                </div>
              </div>
            );
          })}
        </div>

        {/* The uniquely positioned 'Won Deals' card */}
        <div className="w-full md:w-1/3 lg:w-1/4">
          <div className="bg-white p-7 rounded-2xl border border-gray-100 shadow-sm space-y-4">
            <div className="bg-green-50 text-green-600 w-12 h-12 rounded-xl flex items-center justify-center">
              <Check className="w-6 h-6 stroke-[1.5px]" />
            </div>
            <div>
              <p className="text-gray-500 text-sm font-medium">Won Deals</p>
              <h3 className="text-3xl font-extrabold mt-1 text-gray-950 tracking-tighter">{wonDeals}</h3>
            </div>
          </div>
        </div>
      </div>

      {/* FIXED BOTTOM SECTION: Recent Leads and High Value Deals in the same line */}
      <div className="flex flex-col lg:flex-row gap-8 items-start pb-10">

        {/* RECENT LEADS (Matched width and padding to photo) */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 flex-1 w-full">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-extrabold text-gray-950 tracking-tight flex items-center gap-3">
              Recent Leads
            </h3>
            <span className="text-gray-400 font-bold text-2xl cursor-pointer">›</span>
          </div>
          <div className="space-y-6">
            {leads
              .slice()
              .sort(
                (a, b) =>
                  new Date(b.createdAt) -
                  new Date(a.createdAt)
              )
              .slice(0, 5)
              .map((lead) => (
                <div
                  key={lead._id}
                  className="flex justify-between items-center py-1"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-100 text-gray-700 rounded-full flex items-center justify-center font-bold text-lg uppercase">
                      {lead.name?.charAt(0)}
                    </div>

                    <div>
                      <p className="text-base font-bold text-gray-950">
                        {lead.name}
                      </p>

                      <p className="text-xs text-gray-400 font-medium">
                        {lead.companyName || "No Company"}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-[11px] text-gray-400 uppercase font-extrabold tracking-wider">
                      Created At
                    </p>

                    <p className="text-xs text-gray-600 font-semibold">
                      {new Date(
                        lead.createdAt
                      ).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* HIGH VALUE DEALS (Matched styling and WIN badges to photo) */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 flex-1 w-full">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-extrabold text-gray-950 tracking-tight flex items-center gap-3">
              High Value Deals
            </h3>
            <TrendingUp className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-6">
            {deals
              .filter(
                (deal) =>
                  deal.status === "won"
              )
              .sort(
                (a, b) =>
                  Number(b.amount) -
                  Number(a.amount)
              )
              .slice(0, 5)
              .map((deal) => (
                <div
                  key={deal._id}
                  className="flex justify-between items-center py-1"
                >
                  <div>
                    <p className="text-base font-bold text-gray-950">
                      {deal.dealName}
                    </p>

                    <div className="flex gap-2.5 items-center mt-1.5">
                      <span className="text-[10px] bg-green-100 text-green-800 px-2 py-0.5 rounded font-extrabold tracking-wide">
                        WIN
                      </span>

                      <span className="text-xs text-gray-400 font-medium tracking-tight">
                        Target:{" "}
                        {deal.closeDate
                          ? new Date(
                            deal.closeDate
                          ).toLocaleDateString()
                          : "-"}
                      </span>
                    </div>
                  </div>

                  <p className="text-lg font-bold text-gray-950 tracking-tight">
                    $
                    {Number(
                      deal.amount || 0
                    ).toLocaleString()}
                  </p>
                </div>
              ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default DashboardOverview;