import React, { useState } from "react";
import { Plus, Store, User, Mail, Phone, Fingerprint, Users, Loader2 } from "lucide-react";

import {
  useGetVendors,
} from "../../features/vendors/vendorHooks";

import VendorModal from "./vendorModal";

const VendorSection = () => {
  const [isModalOpen, setIsModalOpen] =
    useState(false);

  const {
    data: vendorsData,
    isLoading,
  } = useGetVendors();

  const vendors =
    vendorsData?.data || [];

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3 text-slate-500">
        <Loader2 className="w-8 h-8 text-slate-400 animate-spin" />
        <p className="text-sm font-medium tracking-wide">Loading vendors...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 border-b border-slate-100 pb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight sm:text-3xl">
            Vendors
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            Manage your supply chain, track commercial business partners, and view tax data.
          </p>
        </div>

        <button
          onClick={() =>
            setIsModalOpen(true)
          }
          className="inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-4 py-2.5 rounded-xl font-medium text-sm transition-all shadow-sm shadow-slate-900/10 hover:shadow-md"
        >
          <Plus className="w-4.5 h-4.5" />
          New Vendor
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-slate-50/75 border-b border-slate-200">
                <th className="px-6 py-4.5 text-xs font-semibold tracking-wider text-slate-500">
                  Vendor
                </th>
                <th className="px-6 py-4.5 text-xs font-semibold tracking-wider text-slate-500">
                  Contact Person
                </th>
                <th className="px-6 py-4.5 text-xs font-semibold tracking-wider text-slate-500">
                  Email Address
                </th>
                <th className="px-6 py-4.5 text-xs font-semibold tracking-wider text-slate-500">
                  Phone Number
                </th>
                <th className="px-6 py-4.5 text-xs font-semibold tracking-wider text-slate-500">
                  GSTIN
                </th>
                <th className="px-6 py-4.5 text-xs font-semibold tracking-wider text-slate-500 text-center">
                  Status
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {vendors.length > 0 ? (
                vendors.map((vendor) => (
                  <tr
                    key={vendor._id}
                    className="hover:bg-slate-50/50 transition-colors group"
                  >
                    {/* Vendor Name */}
                    <td className="px-6 py-4 text-sm font-semibold text-slate-900 whitespace-nowrap">
                      <div className="flex items-center gap-2.5">
                        <div className="p-1.5 bg-slate-100 rounded-lg text-slate-500 group-hover:bg-slate-200/70 group-hover:text-slate-700 transition-colors">
                          <Store className="w-4 h-4" />
                        </div>
                        {vendor.vendorName}
                      </div>
                    </td>

                    {/* Contact Person */}
                    <td className="px-6 py-4 text-sm text-slate-600 font-medium whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        {vendor.contactPerson || <span className="text-slate-400">—</span>}
                      </div>
                    </td>

                    {/* Email */}
                    <td className="px-6 py-4 text-sm text-slate-600 font-medium">
                      {vendor.email ? (
                        <div className="flex items-center gap-2 text-slate-500">
                          <Mail className="w-3.5 h-3.5 text-slate-400" />
                          <span className="truncate max-w-[180px]">{vendor.email}</span>
                        </div>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>

                    {/* Phone */}
                    <td className="px-6 py-4 text-sm text-slate-600 font-medium whitespace-nowrap">
                      {vendor.phone ? (
                        <div className="flex items-center gap-2 text-slate-500">
                          <Phone className="w-3.5 h-3.5 text-slate-400" />
                          {vendor.phone}
                        </div>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>

                    {/* GST */}
                    <td className="px-6 py-4 text-sm">
                      {vendor.gstNumber ? (
                        <div className="inline-flex items-center gap-1.5 bg-slate-100 px-2 py-1 rounded-md text-xs font-mono font-semibold text-slate-700">
                          <Fingerprint className="w-3 h-3 text-slate-400" />
                          {vendor.gstNumber}
                        </div>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>

                    {/* Status Badge */}
                    <td className="px-6 py-4 text-center whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                          vendor.status === "ACTIVE"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200/60"
                            : "bg-rose-50 text-rose-700 border-rose-200/60"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                            vendor.status === "ACTIVE" ? "bg-emerald-500" : "bg-rose-500"
                          }`}
                        />
                        {vendor.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center justify-center max-w-xs mx-auto gap-2">
                      <div className="p-3 bg-slate-50 text-slate-400 rounded-2xl mb-1">
                        <Users className="w-6 h-6" />
                      </div>
                      <p className="text-sm font-semibold text-slate-900">No vendors registered</p>
                      <p className="text-xs text-slate-400">Initialize your supplier directory by onboarding your first vendor profile.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <VendorModal
        isOpen={isModalOpen}
        onClose={() =>
          setIsModalOpen(false)
        }
      />

    </div>
  );
};

export default VendorSection;