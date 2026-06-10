import React, { useState } from "react";
import { CheckCircle, Package, Layers, ClipboardList, Edit3, X, Loader2 } from "lucide-react";

import {
  useGetPurchaseRequisitions,
  useUpdatePurchaseRequisition,
} from "../../features/purchaseRequisition/purchaseRequisitionHooks";

const PurchaseRequisitionSection = () => {
  const { data, isLoading } = useGetPurchaseRequisitions();
  const updateMutation = useUpdatePurchaseRequisition();

  const requisitions = data?.data || [];

  const [selectedPR, setSelectedPR] = useState(null);
  const [procuredQuantity, setProcuredQuantity] = useState("");
  const [status, setStatus] = useState("");

  const handleUpdate = async () => {
    try {
      await updateMutation.mutateAsync({
        id: selectedPR._id,
        data: {
          procuredQuantity: Number(procuredQuantity),
          status,
        },
      });

      setSelectedPR(null);
      setProcuredQuantity("");
      setStatus("");
    } catch (error) {
      console.log(error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "PROCURED":
        return "bg-emerald-50 text-emerald-700 border-emerald-200/60";

      case "PARTIALLY_PROCURED":
        return "bg-amber-50 text-amber-700 border-amber-200/60";

      case "CANCELLED":
        return "bg-rose-50 text-rose-700 border-rose-200/60";

      default:
        return "bg-slate-50 text-slate-600 border-slate-200";
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3 text-slate-500">
        <Loader2 className="w-8 h-8 text-slate-400 animate-spin" />
        <p className="text-sm font-medium tracking-wide">Loading requisitions...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* HEADER */}
      <div className="border-b border-slate-100 pb-6">
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight sm:text-3xl">
          Purchase Requisitions
        </h2>
        <p className="text-slate-500 text-sm mt-1">
          Track, update, and manage inventory procurement items and verification cycles.
        </p>
      </div>

      {/* TABLE */}
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-slate-50/75 border-b border-slate-200">
                <th className="px-6 py-4.5 text-xs font-semibold tracking-wider text-slate-500">
                  Item Details
                </th>
                <th className="px-6 py-4.5 text-xs font-semibold tracking-wider text-slate-500">
                  SKU
                </th>
                <th className="px-6 py-4.5 text-xs font-semibold tracking-wider text-slate-500 text-center">
                  Required
                </th>
                <th className="px-6 py-4.5 text-xs font-semibold tracking-wider text-slate-500 text-center">
                  Procured
                </th>
                <th className="px-6 py-4.5 text-xs font-semibold tracking-wider text-slate-500 text-center">
                  Status
                </th>
                <th className="px-6 py-4.5 text-xs font-semibold tracking-wider text-slate-500 text-right">
                  Action
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {requisitions.length > 0 ? (
                requisitions.map((pr) => (
                  <tr key={pr._id} className="hover:bg-slate-50/50 transition-colors group">
                    {/* Item Name */}
                    <td className="px-6 py-4 text-sm font-semibold text-slate-900">
                      <div className="flex items-center gap-2.5">
                        <Package className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors" />
                        {pr.itemName}
                      </div>
                    </td>

                    {/* SKU */}
                    <td className="px-6 py-4 text-sm text-slate-600 font-mono text-xs">
                      {pr.sku ? (
                        <span className="bg-slate-100 px-2 py-1 rounded-md text-slate-700">
                          {pr.sku}
                        </span>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>

                    {/* Required Quantity */}
                    <td className="px-6 py-4 text-sm font-semibold text-slate-900 text-center">
                      {pr.requiredQuantity}
                    </td>

                    {/* Procured Quantity */}
                    <td className="px-6 py-4 text-sm font-semibold text-slate-600 text-center">
                      {pr.procuredQuantity}
                    </td>

                    {/* Status Badges */}
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getStatusColor(
                          pr.status
                        )}`}
                      >
                        {pr.status?.replace("_", " ")}
                      </span>
                    </td>

                    {/* Action Button */}
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => {
                          setSelectedPR(pr);
                          setProcuredQuantity(pr.procuredQuantity);
                          setStatus(pr.status);
                        }}
                        className="inline-flex items-center gap-1.5 bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors shadow-sm"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-slate-400" />
                        Update
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center justify-center max-w-xs mx-auto gap-2">
                      <div className="p-3 bg-slate-50 text-slate-400 rounded-2xl mb-1">
                        <ClipboardList className="w-6 h-6" />
                      </div>
                      <p className="text-sm font-semibold text-slate-900">No requisitions found</p>
                      <p className="text-xs text-slate-400">There are currently no active internal purchase workflows logged.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL */}
      {selectedPR && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex justify-center items-center z-50 p-4 transition-opacity animate-fade-in">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-xl w-full max-w-md overflow-hidden transform transition-all scale-100">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100 bg-slate-50/50">
              <h3 className="text-base font-bold text-slate-900">
                Update Requisition
              </h3>
              <button 
                onClick={() => setSelectedPR(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                  Procured Quantity
                </label>
                <input
                  type="number"
                  value={procuredQuantity}
                  onChange={(e) => setProcuredQuantity(e.target.value)}
                  className="w-full border border-slate-200 focus:border-slate-400 focus:ring-1 focus:ring-slate-400 rounded-xl px-3.5 py-2.5 text-sm outline-none transition-all placeholder:text-slate-400"
                  placeholder="Enter total units received"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                  Status Indicator
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full border border-slate-200 focus:border-slate-400 focus:ring-1 focus:ring-slate-400 rounded-xl px-3.5 py-2.5 text-sm bg-white outline-none transition-all"
                >
                  <option value="PENDING">PENDING</option>
                  <option value="PARTIALLY_PROCURED">PARTIALLY PROCURED</option>
                  <option value="PROCURED">PROCURED</option>
                  <option value="CANCELLED">CANCELLED</option>
                </select>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end gap-2.5 px-6 py-4 border-t border-slate-100 bg-slate-50/50">
              <button
                onClick={() => setSelectedPR(null)}
                className="px-4 py-2 border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-xl font-medium text-xs transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                disabled={updateMutation.isPending}
                className="inline-flex items-center justify-center bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 text-white px-4 py-2 rounded-xl font-medium text-xs transition-colors shadow-sm"
              >
                {updateMutation.isPending ? "Saving..." : "Save Changes"}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default PurchaseRequisitionSection;