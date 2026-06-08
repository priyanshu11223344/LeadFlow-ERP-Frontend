import React from 'react';

import {
  Plus, SoapDispenserDroplet,
} from 'lucide-react';

import { useGetDeals } from '../../features/deals/dealHooks';

const DealsSection = ({ onOpenModal }) => {

  const {
    data,
    isLoading,
    isError,
    error,
  } = useGetDeals();

  // BACKEND RETURNS:
  // { success:true, data:[...] }

  const deals = data?.data || [];
  console.log(deals);
  // FORMAT DATE
  const formatDate = (date) => {

    if (!date) return "-";

    return new Date(date).toLocaleDateString(
      "en-GB"
    );
  };

  // FORMAT AMOUNT
  const formatAmount = (amount) => {

    return Number(amount || 0).toLocaleString(
      "en-US",
      {
        style: "currency",
        currency: "USD",
      }
    );
  };

  // STATUS COLOR
  const getStatusColor = (status) => {

    switch (status) {

      case "won":
        return "bg-green-100 text-green-700";

      case "lost":
        return "bg-red-100 text-red-700";

      default:
        return "bg-yellow-100 text-yellow-700";
    }
  };

  if (isLoading) {
    return (
      <div className="p-10 text-center text-gray-500">
        Loading deals...
      </div>
    );
  }

  if (isError) {

    console.log(error);

    return (
      <div className="p-10 text-center text-red-500">
        Failed to load deals
      </div>
    );
  }

  return (

    <div className="max-w-screen-2xl mx-auto space-y-8">

      {/* HEADER */}
      <div className="flex justify-between items-end">

        <div className="space-y-1">

          <h2 className="text-3xl font-extrabold text-gray-950 tracking-tighter">
            Deals
          </h2>

          <p className="text-gray-500 text-sm font-medium">
            Manage your business growth effectively.
          </p>
        </div>

        <button
          onClick={onOpenModal}
          className="bg-black text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2.5 hover:bg-gray-800 transition-all shadow-md"
        >
          <Plus className="w-5 h-5 stroke-[2.5px]" />

          New Deal
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">

        <table className="w-full text-left border-collapse">

          {/* TABLE HEADER */}
          <thead>

            <tr className="bg-gray-50/50 border-b border-gray-100">

              <th className="px-6 py-4 text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">
                Deal Name
              </th>

              <th className="px-6 py-4 text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">
                Lead
              </th>

              <th className="px-6 py-4 text-[10px] font-extrabold text-gray-400 uppercase tracking-widest text-center">
                Status
              </th>

              <th className="px-6 py-4 text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">
                Value
              </th>

              <th className="px-6 py-4 text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">
                Agent
              </th>

              <th className="px-6 py-4 text-[10px] font-extrabold text-gray-400 uppercase tracking-widest text-right">
                Close Date
              </th>
            </tr>
          </thead>

          {/* TABLE BODY */}
          <tbody className="divide-y divide-gray-50">

            {deals.length > 0 ? (

              deals.map((deal) => (

                <tr
                  key={deal._id}
                  className="hover:bg-gray-50/50 transition-colors"
                >

                  {/* DEAL NAME */}
                  <td className="px-6 py-5 font-bold text-gray-950 text-sm">

                    {deal.dealName}
                  </td>

                  {/* LEAD NAME */}
                  <td className="px-6 py-5 text-sm font-semibold text-gray-700">

                    {deal.leadId?.name || "-"}
                  </td>

                  {/* STATUS */}
                  <td className="px-6 py-5 text-center">

                    <span
                      className={`px-2.5 py-1 rounded text-[10px] font-extrabold uppercase ${getStatusColor(
                        deal.status
                      )}`}
                    >
                      {deal.status}
                    </span>
                  </td>

                  {/* VALUE */}
                  <td className="px-6 py-5 font-extrabold text-gray-950 text-sm">

                    {formatAmount(deal.amount)}
                  </td>

                  {/* AGENT */}
                  <td className="px-6 py-5 text-sm font-semibold text-gray-700">

                    {deal.leadId.leadOwner || "-"}
                  </td>

                  {/* CLOSE DATE */}
                  <td className="px-6 py-5 text-right text-xs font-semibold text-gray-400">

                    {formatDate(deal.closeDate)}
                  </td>
                </tr>
              ))

            ) : (

              <tr>

                <td
                  colSpan="6"
                  className="text-center py-10 text-gray-400 font-medium"
                >
                  No deals found
                </td>
              </tr>
            )}

          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DealsSection;