import React from "react";
import { Truck, X } from "lucide-react";

const OrderDispatchesModal = ({
  order,
  dispatches,
  onClose,
}) => {
  if (!order) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
      <div className="max-h-[88vh] w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
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

        <div className="max-h-[70vh] space-y-4 overflow-y-auto p-6">
          {dispatches.map((dispatch) => (
            <div
              key={dispatch._id}
              className="rounded-xl border border-slate-200 p-5"
            >
              <div className="flex items-start justify-between">
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
                    className="flex justify-between border-b border-slate-100 px-4 py-2 text-sm last:border-0"
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
