import React, { useState } from "react";
import { Plus, Receipt, FileText, Calendar, DollarSign, AlertCircle } from "lucide-react";

import {
  useDownloadInvoicePdf,
  useGetInvoices,
} from "../../features/invoices/invoiceHooks";

import InvoiceModal from "./InvoiceModal";
import InvoiceViewModal from "./InvoiceViewModal";

const InvoiceSection = () => {
  const [isModalOpen, setIsModalOpen] =
    useState(false);
  const [selectedInvoice, setSelectedInvoice] =
    useState(null);
  const downloadInvoiceMutation =
    useDownloadInvoicePdf();

  const {
    data,
    isLoading,
    isError,
  } = useGetInvoices();

  const invoices =
    data?.data || [];

  const getStatusColor = (
    status
  ) => {
    switch (status) {
      case "PAID":
        return "bg-emerald-50 text-emerald-700 border-emerald-200/60";

      case "PARTIALLY_PAID":
        return "bg-amber-50 text-amber-700 border-amber-200/60";

      case "OVERDUE":
        return "bg-rose-50 text-rose-700 border-rose-200/60";

      default:
        return "bg-slate-50 text-slate-600 border-slate-200";
    }
  };

  const handleDownload = async (
    invoice
  ) => {
    try {
      const blob =
        await downloadInvoiceMutation.mutateAsync(
          invoice._id
        );
      const url =
        window.URL.createObjectURL(
          new Blob([blob])
        );
      const link =
        document.createElement("a");

      link.href = url;
      link.download =
        `${invoice.invoiceNumber}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      alert(
        error?.response?.data?.message ||
        "Failed to download invoice"
      );
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3 text-slate-500">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-black rounded-full animate-spin" />
        <p className="text-sm font-medium tracking-wide">Loading invoices...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] p-6 max-w-md mx-auto text-center gap-3">
        <div className="p-3 bg-rose-50 text-rose-600 rounded-2xl">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-semibold text-slate-900">Failed to load invoices</h3>
        <p className="text-sm text-slate-500">There was an issue fetching your data. Please check your connection and try again.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 border-b border-slate-100 pb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight sm:text-3xl">
            Invoices
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            Manage customer invoices, track outstanding balances, and monitor payments.
          </p>
        </div>

        <button
          onClick={() =>
            setIsModalOpen(true)
          }
          className="inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-4 py-2.5 rounded-xl font-medium text-sm transition-all shadow-sm shadow-slate-900/10 hover:shadow-md"
        >
          <Plus className="w-4 h-4" />
          New Invoice
        </button>
      </div>

      {/* TABLE CONTAINER */}
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-slate-50/75 border-b border-slate-200">
                <th className="px-6 py-4.5 text-xs font-semibold tracking-wider text-slate-500">
                  Invoice #
                </th>
                <th className="px-6 py-4.5 text-xs font-semibold tracking-wider text-slate-500">
                  Order PO
                </th>
                <th className="px-6 py-4.5 text-xs font-semibold tracking-wider text-slate-500 text-right">
                  Amount
                </th>
                <th className="px-6 py-4.5 text-xs font-semibold tracking-wider text-slate-500 text-right">
                  Paid
                </th>
                <th className="px-6 py-4.5 text-xs font-semibold tracking-wider text-slate-500 text-right">
                  Due
                </th>
                <th className="px-6 py-4.5 text-xs font-semibold tracking-wider text-slate-500 text-center">
                  Status
                </th>
                <th className="px-6 py-4.5 text-xs font-semibold tracking-wider text-slate-500 text-right">
                  Due Date
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {invoices.length > 0 ? (
                invoices.map((invoice) => (
                  <tr
                    key={invoice._id}
                    className="hover:bg-slate-50/50 transition-colors group"
                  >
                    {/* Invoice ID */}
                    <td className="px-6 py-4 text-sm font-semibold text-slate-900">
                      <button
                        type="button"
                        onClick={() =>
                          setSelectedInvoice(
                            invoice
                          )
                        }
                        className="flex items-center gap-2.5 text-left text-indigo-700 hover:text-indigo-900 hover:underline"
                      >
                        <FileText className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors" />
                        {invoice.invoiceNumber}
                      </button>
                    </td>

                    {/* Order ID */}
                    <td className="px-6 py-4 text-sm text-slate-600 font-medium">
                      {invoice.orderId?.poNumber ? (
                        <span className="bg-slate-100 px-2 py-1 rounded-md text-xs font-mono text-slate-700">
                          {invoice.orderId.poNumber}
                        </span>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>

                    {/* Amount */}
                    <td className="px-6 py-4 text-sm font-semibold text-slate-900 text-right">
                      ₹{Number(invoice.amount).toLocaleString()}
                    </td>

                    {/* Paid */}
                    <td className="px-6 py-4 text-sm font-medium text-emerald-600 text-right">
                      ₹{Number(invoice.paidAmount).toLocaleString()}
                    </td>

                    {/* Due */}
                    <td className="px-6 py-4 text-sm font-medium text-slate-900 text-right">
                      {Number(invoice.dueAmount) > 0 ? (
                        <span className={invoice.status === "OVERDUE" ? "text-rose-600 font-semibold" : "text-slate-700"}>
                          ₹{Number(invoice.dueAmount).toLocaleString()}
                        </span>
                      ) : (
                        <span className="text-slate-400">₹0</span>
                      )}
                    </td>

                    {/* Status Badges */}
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
                          invoice.status
                        )}`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full mr-1.5 bg-current" />
                        {invoice.status?.replace("_", " ")}
                      </span>
                    </td>

                    {/* Due Date */}
                    <td className="px-6 py-4 text-sm text-right text-slate-500 whitespace-nowrap">
                      {invoice.dueDate ? (
                        <div className="inline-flex items-center justify-end gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          {new Date(invoice.dueDate).toLocaleDateString("en-IN", {
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
                  <td colSpan="7" className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center justify-center max-w-xs mx-auto gap-2">
                      <div className="p-3 bg-slate-50 text-slate-400 rounded-2xl mb-1">
                        <Receipt className="w-6 h-6" />
                      </div>
                      <p className="text-sm font-semibold text-slate-900">No invoices found</p>
                      <p className="text-xs text-slate-400">Get started by creating your very first customer invoice.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <InvoiceModal
        isOpen={isModalOpen}
        onClose={() =>
          setIsModalOpen(false)
        }
      />
      <InvoiceViewModal
        invoice={selectedInvoice}
        onClose={() =>
          setSelectedInvoice(null)
        }
        onDownload={handleDownload}
        isDownloading={
          downloadInvoiceMutation.isPending
        }
      />

    </div>
  );
};

export default InvoiceSection;
