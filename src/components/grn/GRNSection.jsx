import React, { useState } from "react";
import { Plus, Package2, Calendar, FileText, Activity } from "lucide-react";
import { useGetGRNs } from "../../features/grn/grnHooks";
import GRNModal from "./GRNModal";

const GRNSection = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: grnData, isLoading } = useGetGRNs();

  const grns = grnData?.data || [];

  // Elegant skeleton loader that mirrors the actual layout
  if (isLoading) {
    return (
      <div className="max-w-screen-2xl mx-auto space-y-8 animate-pulse p-6">
        <div className="flex justify-between items-end">
          <div className="space-y-3">
            <div className="h-8 w-64 bg-gray-200 rounded-lg"></div>
            <div className="h-4 w-40 bg-gray-100 rounded-lg"></div>
          </div>
          <div className="h-12 w-36 bg-gray-200 rounded-xl"></div>
        </div>
        <div className="h-64 bg-gray-50 border rounded-2xl"></div>
      </div>
    );
  }

  // Helper to color-code status badges dynamically
  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
      case "received":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "pending":
      case "draft":
        return "bg-amber-50 text-amber-700 border-amber-200";
      default:
        return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };

  return (
    <div className="max-w-screen-2xl mx-auto p-6 space-y-6">
      
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Goods Receipt Notes
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Manage and monitor your incoming inventory receipts.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-medium px-5 py-2.5 rounded-xl transition-colors shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 w-full sm:w-auto"
        >
          <Plus className="w-5 h-5" />
          Create GRN
        </button>
      </div>

      {/* Table Section */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                <th className="p-4 pl-6">
                  <span className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-slate-400" /> GRN Number
                  </span>
                </th>
                <th className="p-4">Vendor PO</th>
                <th className="p-4">
                  <span className="flex items-center gap-2">
                    <Package2 className="w-4 h-4 text-slate-400" /> Items
                  </span>
                </th>
                <th className="p-4">
                  <span className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-slate-400" /> Status
                  </span>
                </th>
                <th className="p-4 pr-6">
                  <span className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-slate-400" /> Date
                  </span>
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
              {grns.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-slate-400">
                    <Package2 className="w-10 h-10 mx-auto mb-3 opacity-50" />
                    <p className="font-medium text-slate-500">No GRNs found</p>
                    <p className="text-xs text-slate-400 mt-1">Click "Create GRN" to add your first receipt.</p>
                  </td>
                </tr>
              ) : (
                grns.map((grn) => (
                  <tr
                    key={grn._id}
                    className="hover:bg-slate-50/80 transition-colors"
                  >
                    <td className="p-4 pl-6 font-medium text-slate-900">
                      {grn.grnNumber}
                    </td>

                    <td className="p-4 text-slate-600 font-mono text-xs">
                      {grn.vendorPurchaseOrderId?.poNumber || (
                        <span className="text-slate-400 italic">N/A</span>
                      )}
                    </td>

                    <td className="p-4">
                      <span className="inline-flex items-center justify-center bg-slate-100 text-slate-800 font-medium px-2.5 py-0.5 rounded-full text-xs">
                        {grn.items.length} {grn.items.length === 1 ? 'item' : 'items'}
                      </span>
                    </td>

                    <td className="p-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium border ${getStatusStyle(grn.status)}`}>
                        {grn.status}
                      </span>
                    </td>

                    <td className="p-4 pr-6 text-slate-500 whitespace-nowrap">
                      {new Date(grn.createdAt).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal remains identically structured */}
      <GRNModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default GRNSection;