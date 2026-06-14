import React from "react";
import { 
  X, 
  FileText, 
  User, 
  Building2, 
  Calendar, 
  Clock, 
  ArrowUpRight, 
  CheckCircle2, 
  AlertTriangle, 
  Ban, 
  FileSpreadsheet,
  AlertCircle
} from "lucide-react";

const QuotationViewModal = ({
  isOpen,
  onClose,
  quotation,
}) => {
  if (!isOpen || !quotation) return null;

  const formatCurrency = (value) =>
    `₹${Number(value || 0).toLocaleString(
      "en-IN",
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }
    )}`;

  const getStatusBadge = (status) => {
    const s = status?.toUpperCase();
    switch (s) {
      case "DRAFT":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-50 text-slate-600 border border-slate-200/80">
            <Clock className="w-3.5 h-3.5" />
            Draft
          </span>
        );
      case "SENT":
      case "PENDING":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-600 border border-blue-100">
            <ArrowUpRight className="w-3.5 h-3.5" />
            Sent
          </span>
        );
      case "ACCEPTED":
      case "APPROVED":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Accepted
          </span>
        );
      case "EXPIRED":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-100">
            <AlertTriangle className="w-3.5 h-3.5" />
            Expired
          </span>
        );
      case "REJECTED":
      case "DECLINED":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-600 border border-rose-100">
            <Ban className="w-3.5 h-3.5" />
            Rejected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-50 text-slate-500 border border-slate-200">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md flex justify-center items-center z-50 p-4 sm:p-6 md:p-10 animate-fade-in">

      <div className="bg-white w-full max-w-5xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] border border-slate-100">

        {/* HEADER */}
        <div className="flex justify-between items-center px-8 py-5 border-b border-slate-100 bg-slate-50/50">

          <div>
            <h2 className="text-xl font-bold flex items-center gap-2 text-slate-800 tracking-tight">
              <FileText className="w-5 h-5 text-indigo-600" />
              {quotation.quotationNumber}
            </h2>

            <p className="text-xs font-medium text-slate-400 mt-1">
              Version {quotation.version || 1}
            </p>
          </div>

          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors focus:outline-none"
          >
            <X className="w-5 h-5" />
          </button>

        </div>

        {/* BODY */}
        <div className="p-8 space-y-6 overflow-y-auto custom-scrollbar flex-1">

          {/* BASIC INFO */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            <div className="border border-slate-150 rounded-xl p-5 bg-white shadow-sm space-y-4">

              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Lead Information
              </h3>

              <div className="space-y-3.5 text-sm">

                <div className="flex items-center gap-2.5 text-slate-700">
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0">
                    <User className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400 font-semibold uppercase">Client Name</div>
                    <div className="font-semibold text-slate-700">{quotation.leadId?.name || "-"}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 text-slate-700">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
                    <Building2 className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400 font-semibold uppercase">Company</div>
                    <div className="font-semibold text-slate-700">{quotation.leadId?.companyName || "-"}</div>
                  </div>
                </div>

              </div>

            </div>

            <div className="border border-slate-150 rounded-xl p-5 bg-white shadow-sm space-y-4">

              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Quotation Details
              </h3>

              <div className="space-y-3 text-sm">

                <div className="flex items-center justify-between py-1 border-b border-slate-100 last:border-0">
                  <span className="text-slate-400 font-medium">Status</span>
                  <span>{getStatusBadge(quotation.status)}</span>
                </div>

                <div className="flex items-center justify-between py-1 border-b border-slate-100 last:border-0">
                  <span className="text-slate-400 font-medium">Valid Till</span>
                  <div className="flex items-center gap-1.5 font-semibold text-slate-700">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    <span>
                      {quotation.validityDate
                        ? new Date(
                            quotation.validityDate
                          ).toLocaleDateString(
                            "en-IN"
                          )
                        : "-"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between py-1 border-b border-slate-100 last:border-0">
                  <span className="text-slate-400 font-medium">Created Date</span>
                  <div className="flex items-center gap-1.5 font-semibold text-slate-700">
                    <Clock className="w-4 h-4 text-slate-400" />
                    <span>
                      {quotation.createdAt
                        ? new Date(
                            quotation.createdAt
                          ).toLocaleDateString(
                            "en-IN"
                          )
                        : "-"}
                    </span>
                  </div>
                </div>

              </div>

            </div>

          </div>

          {/* PRODUCTS TABLE */}
          <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm bg-white">

            <div className="px-5 py-4 border-b border-slate-200/80 bg-slate-50/50 flex items-center gap-2">
              <FileSpreadsheet className="w-4.5 h-4.5 text-indigo-500" />
              <h3 className="font-bold text-sm text-slate-700">
                Products Summary
              </h3>
              <span className="ml-auto bg-indigo-50 text-indigo-700 text-xs px-2.5 py-0.5 rounded-full font-bold">
                {quotation.items?.length || 0} {quotation.items?.length === 1 ? 'item' : 'items'}
              </span>
            </div>

            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full border-collapse">

                <thead>

                  <tr className="bg-slate-50/20 border-b border-slate-200/80 text-[10px] font-bold text-slate-400 uppercase tracking-wider">

                    <th className="px-5 py-3 text-left">
                      Product details
                    </th>

                    <th className="px-4 py-3 text-center w-24">
                      Qty
                    </th>

                    <th className="px-4 py-3 text-right">
                      Unit Price
                    </th>

                    <th className="px-4 py-3 text-center w-32">
                      Discount
                    </th>

                    <th className="px-4 py-3 text-center w-24">
                      GST
                    </th>

                    <th className="px-5 py-3 text-right">
                      Total
                    </th>

                  </tr>

                </thead>

                <tbody className="divide-y divide-slate-150/60 text-slate-700 text-sm">

                  {quotation.items?.map(
                    (item, index) => (
                      <tr
                        key={index}
                        className="hover:bg-slate-50/20 transition-colors"
                      >

                        <td className="px-5 py-4">
                          <div>
                            <div className="font-semibold text-slate-700 text-sm">
                              {item.itemName}
                            </div>

                            <div className="text-xs text-slate-400 font-mono mt-1">
                              {item.sku}
                            </div>
                          </div>
                        </td>

                        <td className="px-4 py-4 text-center font-semibold text-slate-700">
                          {item.quantity}
                        </td>

                        <td className="px-4 py-4 text-right font-medium text-slate-700">
                          {formatCurrency(
                            item.unitPrice
                          )}
                        </td>

                        <td className="px-4 py-4 text-center">
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-emerald-50 text-emerald-700">
                            {item.discountPercent}%
                          </span>
                        </td>

                        <td className="px-4 py-4 text-center text-slate-500 font-medium">
                          {item.gstPercent}%
                        </td>

                        <td className="px-5 py-4 text-right font-bold text-slate-800">
                          {formatCurrency(
                            item.totalAmount
                          )}
                        </td>

                      </tr>
                    )
                  )}

                </tbody>

              </table>
            </div>

          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-start">
            
            {/* TERMS */}
            <div className="border border-slate-200/80 rounded-xl p-5 bg-white shadow-sm space-y-3">

              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-slate-400" />
                Terms & Conditions
              </h3>

              <div className="h-px bg-slate-100" />

              <p className="text-sm text-slate-600 whitespace-pre-wrap leading-relaxed">
                {quotation.termsAndConditions ||
                  "No terms specified"}
              </p>

            </div>

            {/* SUMMARY */}
            <div className="border border-slate-200 rounded-xl p-5 bg-slate-50/60 shadow-sm space-y-4">

              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Financial Summary
              </h3>

              <div className="h-px bg-slate-200/60" />

              <div className="space-y-3 text-sm">

                <div className="flex justify-between text-slate-500">
                  <span>Subtotal</span>
                  <span className="font-semibold text-slate-700">
                    {formatCurrency(
                      quotation.subTotal
                    )}
                  </span>
                </div>

                <div className="flex justify-between text-slate-500">
                  <span>Discount</span>
                  <span className="font-semibold text-emerald-600">
                    -{formatCurrency(
                      quotation.totalDiscount
                    )}
                  </span>
                </div>

                <div className="flex justify-between text-slate-500">
                  <span>Tax (GST)</span>
                  <span className="font-semibold text-slate-700">
                    +{formatCurrency(
                      quotation.totalTax
                    )}
                  </span>
                </div>

                <div className="h-px bg-dashed bg-slate-250" />

                <div className="flex justify-between text-base font-bold text-slate-700 pt-1.5">
                  <span>Grand Total</span>
                  <span className="text-lg font-extrabold text-slate-900">
                    {formatCurrency(
                      quotation.grandTotal
                    )}
                  </span>
                </div>

              </div>

            </div>

          </div>

        </div>

        {/* FOOTER */}
        <div className="flex justify-end gap-3 px-8 py-5 border-t border-slate-100 bg-slate-50/50">

          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 hover:text-slate-800 rounded-xl font-semibold text-sm shadow-sm transition-colors"
          >
            Close
          </button>

        </div>

      </div>

    </div>
  );
};

export default QuotationViewModal;