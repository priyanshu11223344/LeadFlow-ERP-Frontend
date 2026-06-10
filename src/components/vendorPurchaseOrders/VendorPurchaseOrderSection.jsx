import React, {
  useState,
} from "react";

import { Plus } from "lucide-react";

import {
  useGetVendorPurchaseOrders,
} from "../../features/vendorPurchaseOrders/vendorPurchaseOrderHooks";

import VendorPurchaseOrderModal from "./VendorPurchaseOrderModal";

const VendorPurchaseOrderSection =
  () => {
    const [
      isModalOpen,
      setIsModalOpen,
    ] = useState(false);

    const {
      data: poData,
      isLoading,
    } =
      useGetVendorPurchaseOrders();

    const pos =
      poData?.data || [];

    if (isLoading) {
      return (
        <div className="p-6">
          Loading Vendor Purchase Orders...
        </div>
      );
    }

    return (
      <div className="max-w-screen-2xl mx-auto space-y-8">

        {/* HEADER */}

        <div className="flex justify-between items-end">

          <div>
            <h2 className="text-3xl font-extrabold text-gray-950">
              Vendor Purchase Orders
            </h2>

            <p className="text-gray-500 text-sm">
              Manage procurement orders
            </p>
          </div>

          <button
            onClick={() =>
              setIsModalOpen(true)
            }
            className="bg-black text-white px-6 py-3 rounded-xl flex items-center gap-2 font-semibold"
          >
            <Plus size={18} />
            Create PO
          </button>

        </div>

        {/* TABLE */}

        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">

          <table className="w-full">

            <thead>

              <tr className="border-b border-gray-100 bg-gray-50">

                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">
                  PO Number
                </th>

                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">
                  Vendor
                </th>

                <th className="px-6 py-4 text-center text-xs font-bold text-gray-500 uppercase">
                  Items
                </th>

                <th className="px-6 py-4 text-center text-xs font-bold text-gray-500 uppercase">
                  Amount
                </th>

                <th className="px-6 py-4 text-center text-xs font-bold text-gray-500 uppercase">
                  Status
                </th>

                <th className="px-6 py-4 text-center text-xs font-bold text-gray-500 uppercase">
                  Created
                </th>

              </tr>

            </thead>

            <tbody>

              {pos.length === 0 ? (
                <tr>

                  <td
                    colSpan="6"
                    className="text-center py-10 text-gray-400"
                  >
                    No Vendor Purchase Orders Found
                  </td>

                </tr>
              ) : (
                pos.map((po) => (
                  <tr
                    key={po._id}
                    className="border-b border-gray-50 hover:bg-gray-50"
                  >

                    <td className="px-6 py-4 font-semibold">
                      {po.poNumber}
                    </td>

                    <td className="px-6 py-4">
                      {
                        po.vendorId
                          ?.vendorName
                      }
                    </td>

                    <td className="px-6 py-4 text-center">
                      {
                        po.items
                          ?.length
                      }
                    </td>

                    <td className="px-6 py-4 text-center font-semibold">
                      ₹
                      {po.totalAmount?.toLocaleString()}
                    </td>

                    <td className="px-6 py-4 text-center">

                      <span
                        className={`px-2 py-1 rounded text-xs font-bold
                        ${
                          po.status ===
                          "ORDERED"
                            ? "bg-blue-100 text-blue-700"
                            : po.status ===
                              "PARTIALLY_RECEIVED"
                            ? "bg-yellow-100 text-yellow-700"
                            : po.status ===
                              "RECEIVED"
                            ? "bg-green-100 text-green-700"
                            : po.status ===
                              "CANCELLED"
                            ? "bg-red-100 text-red-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {po.status}
                      </span>

                    </td>

                    <td className="px-6 py-4 text-center text-sm text-gray-500">
                      {new Date(
                        po.createdAt
                      ).toLocaleDateString()}
                    </td>

                  </tr>
                ))
              )}

            </tbody>

          </table>

        </div>

        <VendorPurchaseOrderModal
          isOpen={
            isModalOpen
          }
          onClose={() =>
            setIsModalOpen(false)
          }
        />

      </div>
    );
  };

export default VendorPurchaseOrderSection;