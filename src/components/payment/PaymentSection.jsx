import React, { useState } from "react";
import { Plus, CreditCard, FileText, Calendar, DollarSign, AlertCircle, Hash } from "lucide-react";

import {
  useGetPayments,
} from "../../features/payments/paymentHooks";

import PaymentModal from "./PaymentModal";

const PaymentSection = () => {
  const [isModalOpen, setIsModalOpen] =
    useState(false);

  const {
    data,
    isLoading,
    isError,
  } = useGetPayments();

  const payments =
    data?.data || [];

  const getMethodBadgeColor = (method) => {
    switch (method?.toUpperCase()) {
      case "CASH":
        return "bg-emerald-50 text-emerald-700 border-emerald-200/60";
      case "BANK_TRANSFER":
      case "TRANSFER":
      case "NEFT":
      case "RTGS":
        return "bg-blue-50 text-blue-700 border-blue-200/60";
      case "CARD":
      case "CREDIT_CARD":
        return "bg-indigo-50 text-indigo-700 border-indigo-200/60";
      case "UPI":
        return "bg-purple-50 text-purple-700 border-purple-200/60";
      default:
        return "bg-slate-50 text-slate-600 border-slate-200";
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3 text-slate-500">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-black rounded-full animate-spin" />
        <p className="text-sm font-medium tracking-wide">Loading payments...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] p-6 max-w-md mx-auto text-center gap-3">
        <div className="p-3 bg-rose-50 text-rose-600 rounded-2xl">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-semibold text-slate-900">Failed to load payments</h3>
        <p className="text-sm text-slate-500">There was an issue fetching your records. Please check your network and try again.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 border-b border-slate-100 pb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight sm:text-3xl">
            Payments
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            Track and manage historical incoming customer payments and transaction records.
          </p>
        </div>

        <button
          onClick={() =>
            setIsModalOpen(true)
          }
          className="inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-4 py-2.5 rounded-xl font-medium text-sm transition-all shadow-sm shadow-slate-900/10 hover:shadow-md"
        >
          <Plus className="w-4 h-4" />
          Record Payment
        </button>
      </div>

      {/* TABLE CONTAINER */}
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-slate-50/75 border-b border-slate-200">
                <th className="px-6 py-4.5 text-xs font-semibold tracking-wider text-slate-500">
                  Payment #
                </th>
                <th className="px-6 py-4.5 text-xs font-semibold tracking-wider text-slate-500">
                  Invoice
                </th>
                <th className="px-6 py-4.5 text-xs font-semibold tracking-wider text-slate-500 text-right">
                  Amount
                </th>
                <th className="px-6 py-4.5 text-xs font-semibold tracking-wider text-slate-500 text-center">
                  Method
                </th>
                <th className="px-6 py-4.5 text-xs font-semibold tracking-wider text-slate-500">
                  Reference
                </th>
                <th className="px-6 py-4.5 text-xs font-semibold tracking-wider text-slate-500 text-right">
                  Date
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {payments.length > 0 ? (
                payments.map((payment) => (
                  <tr
                    key={payment._id}
                    className="hover:bg-slate-50/50 transition-colors group"
                  >
                    {/* Payment ID */}
                    <td className="px-6 py-4 text-sm font-semibold text-slate-900">
                      <div className="flex items-center gap-2.5">
                        <CreditCard className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors" />
                        {payment.paymentNumber}
                      </div>
                    </td>

                    {/* Invoice ID Relation */}
                    <td className="px-6 py-4 text-sm text-slate-600 font-medium">
                      {payment.invoiceId?.invoiceNumber ? (
                        <div className="flex items-center gap-1.5 text-slate-700">
                          <FileText className="w-3.5 h-3.5 text-slate-400" />
                          <span className="font-semibold">{payment.invoiceId.invoiceNumber}</span>
                        </div>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>

                    {/* Amount Received */}
                    <td className="px-6 py-4 text-sm font-bold text-emerald-600 text-right">
                      ₹{Number(payment.amount).toLocaleString()}
                    </td>

                    {/* Payment Method Badges */}
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getMethodBadgeColor(
                          payment.paymentMethod
                        )}`}
                      >
                        {payment.paymentMethod?.replace("_", " ")}
                      </span>
                    </td>

                    {/* Reference Number */}
                    <td className="px-6 py-4 text-sm text-slate-600 font-medium">
                      {payment.referenceNumber ? (
                        <div className="flex items-center gap-1 text-slate-500 font-mono text-xs">
                          <Hash className="w-3 h-3 text-slate-400" />
                          {payment.referenceNumber}
                        </div>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>

                    {/* Payment Date */}
                    <td className="px-6 py-4 text-sm text-right text-slate-500 whitespace-nowrap">
                      {payment.paymentDate ? (
                        <div className="inline-flex items-center justify-end gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          {new Date(payment.paymentDate).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </div>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center justify-center max-w-xs mx-auto gap-2">
                      <div className="p-3 bg-slate-50 text-slate-400 rounded-2xl mb-1">
                        <CreditCard className="w-6 h-6" />
                      </div>
                      <p className="text-sm font-semibold text-slate-900">No payments recorded</p>
                      <p className="text-xs text-slate-400">When you receive customer funds, capture them by clicking "Record Payment".</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <PaymentModal
        isOpen={isModalOpen}
        onClose={() =>
          setIsModalOpen(false)
        }
      />

    </div>
  );
};

export default PaymentSection;