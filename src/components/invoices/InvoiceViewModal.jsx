import React from "react";
import {
  Download,
  X,
} from "lucide-react";

const money = (value) =>
  `₹${Number(value || 0).toLocaleString(
    "en-IN",
    {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }
  )}`;

const InvoiceViewModal = ({
  invoice,
  onClose,
  onDownload,
  isDownloading,
}) => {
  if (!invoice) return null;

  const order = invoice.orderId;
  const client = order?.clientId;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
      <div className="flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-7 py-5">
          <div>
            <h3 className="text-xl font-bold text-slate-900">
              Invoice {invoice.invoiceNumber}
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              Order {order?.poNumber || "—"}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() =>
                onDownload(invoice)
              }
              disabled={isDownloading}
              className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
            >
              <Download className="h-4 w-4" />
              {isDownloading
                ? "Downloading..."
                : "Download PDF"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              aria-label="Close invoice"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="space-y-7 overflow-y-auto p-7">
          <div className="grid gap-5 md:grid-cols-3">
            <div className="rounded-xl border border-slate-200 p-4">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Bill To
              </p>
              <p className="mt-2 font-bold text-slate-900">
                {client?.clientName || "—"}
              </p>
              <p className="text-sm text-slate-500">
                {client?.companyName}
              </p>
              <p className="text-sm text-slate-500">
                {client?.email}
              </p>
              <p className="mt-2 text-xs font-semibold text-slate-600">
                GSTIN:{" "}
                {invoice.gstNumber ||
                  order?.gstNumber ||
                  "Not provided"}
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 p-4 text-sm">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Invoice Details
              </p>
              <div className="mt-2 space-y-1 text-slate-600">
                <p>
                  Created:{" "}
                  {new Date(
                    invoice.createdAt
                  ).toLocaleDateString(
                    "en-IN"
                  )}
                </p>
                <p>
                  Due:{" "}
                  {invoice.dueDate
                    ? new Date(
                        invoice.dueDate
                      ).toLocaleDateString(
                        "en-IN"
                      )
                    : "—"}
                </p>
                <p>Status: {invoice.status}</p>
              </div>
            </div>

            <div className="rounded-xl bg-slate-900 p-4 text-white">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Balance Due
              </p>
              <p className="mt-2 text-2xl font-extrabold">
                {money(invoice.dueAmount)}
              </p>
              <p className="mt-2 text-xs text-slate-400">
                Paid {money(invoice.paidAmount)}
              </p>
            </div>
          </div>

          <div className="overflow-hidden rounded-xl border border-slate-200">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-4 py-3">Item</th>
                  <th className="px-4 py-3">SKU</th>
                  <th className="px-4 py-3 text-center">
                    Qty
                  </th>
                  <th className="px-4 py-3 text-right">
                    Price
                  </th>
                  <th className="px-4 py-3 text-center">
                    Discount
                  </th>
                  <th className="px-4 py-3 text-right">
                    Net
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {(order?.items || []).map(
                  (item) => (
                    <tr key={item.sku}>
                      <td className="px-4 py-3 font-semibold text-slate-800">
                        {item.itemName}
                      </td>
                      <td className="px-4 py-3 text-slate-500">
                        {item.sku}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {item.quantity}
                      </td>
                      <td className="px-4 py-3 text-right">
                        {money(item.price)}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {item.discountPercent || 0}%
                      </td>
                      <td className="px-4 py-3 text-right font-bold">
                        {money(item.totalAmount)}
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>

          <div className="ml-auto w-full max-w-md space-y-2 rounded-xl bg-slate-50 p-5 text-sm">
            {[
              [
                "Subtotal",
                invoice.subTotal ||
                  order?.subTotal,
              ],
              [
                "Discount",
                -(
                  invoice.totalDiscount ||
                  order?.totalDiscount ||
                  0
                ),
              ],
              [
                "CGST",
                invoice.cgstAmount,
              ],
              [
                "SGST",
                invoice.sgstAmount,
              ],
              [
                "IGST",
                invoice.igstAmount,
              ],
            ].map(([label, value]) => (
              <div
                key={label}
                className="flex justify-between text-slate-600"
              >
                <span>{label}</span>
                <span>{money(value)}</span>
              </div>
            ))}
            <div className="flex justify-between border-t border-slate-200 pt-3 text-lg font-extrabold text-slate-900">
              <span>Total</span>
              <span>{money(invoice.amount)}</span>
            </div>
          </div>

          {invoice.dispatchId && (
            <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-4 text-sm text-slate-600">
              <p className="font-bold text-slate-800">
                Dispatch {invoice.dispatchId.dispatchNumber}
              </p>
              <p className="mt-1">
                Tracking:{" "}
                {invoice.dispatchId.trackingNumber ||
                  "—"}{" "}
                · Transporter:{" "}
                {invoice.dispatchId.transporter ||
                  "—"}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InvoiceViewModal;
