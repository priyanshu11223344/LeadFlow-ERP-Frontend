import React from "react";
import { Truck, X } from "lucide-react";

const OrderDispatchesModal = ({
  order,
  dispatches,
  onClose,
}) => {
  if (!order) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center bg-slate-900/50 p-0 backdrop-blur-sm sm:items-center sm:p-4">
      <div className="max-h-[96vh] w-full max-w-3xl overflow-hidden rounded-t-[26px] bg-white shadow-2xl sm:max-h-[88vh] sm:rounded-2xl">
        <div className="flex items-start justify-between gap-3 border-b border-slate-200 px-4 py-4 sm:px-6 sm:py-5">
          <div className="min-w-0">
            <h3 className="break-words text-base font-bold text-slate-900 sm:text-lg">
              Dispatches for {order.poNumber}
            </h3>
            <p className="text-sm text-slate-500">
              {dispatches.length} dispatch record{dispatches.length === 1 ? "" : "s"}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="max-h-[80vh] space-y-4 overflow-y-auto p-4 sm:max-h-[70vh] sm:p-6">
          {dispatches.map((dispatch) => (
            <div
              key={dispatch._id}
              className="rounded-xl border border-slate-200 p-4 sm:p-5"
            >
              <div className="flex flex-col gap-3 min-[420px]:flex-row min-[420px]:items-start min-[420px]:justify-between">
                <div className="flex gap-3">
                  <div className="rounded-lg bg-blue-50 p-2 text-blue-600">
                    <Truck className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">
                      {dispatch.dispatchNumber}
                    </p>
                    <p className="text-xs text-slate-500">
                      {new Date(
                        dispatch.dispatchDate ||
                        dispatch.createdAt
                      ).toLocaleString("en-IN")}
                    </p>
                  </div>
                </div>
                <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-700">
                  {dispatch.status}
                </span>
              </div>

              <div className="mt-4 grid gap-3 text-sm text-slate-600 sm:grid-cols-2">
                <p>
                  Tracking:{" "}
                  <strong>
                    {dispatch.trackingNumber || "—"}
                  </strong>
                </p>
                <p>
                  Transporter:{" "}
                  <strong>
                    {dispatch.transporter || "—"}
                  </strong>
                </p>
                <p>
                  E-Way Bill:{" "}
                  <strong>
                    {dispatch.eWayBillNumber || "—"}
                  </strong>
                </p>
                <p>
                  Bill of Lading:{" "}
                  <strong>
                    {dispatch.billOfLadingNumber || "—"}
                  </strong>
                </p>
              </div>

              <div className="mt-4 overflow-hidden rounded-lg border border-slate-100">
                {dispatch.items.map((item) => (
                  <div
                    key={item.sku}
                    className="flex items-start justify-between gap-3 border-b border-slate-100 px-3 py-2 text-sm last:border-0 sm:px-4"
                  >
                    <span>
                      {item.itemName}{" "}
                      <span className="text-slate-400">
                        ({item.sku})
                      </span>
                    </span>
                    <strong>
                      Qty {item.quantity}
                    </strong>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrderDispatchesModal;
