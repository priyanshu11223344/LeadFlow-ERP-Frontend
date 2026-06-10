import React from "react";

import {
  FileText,
  Package,
  IndianRupee,
  ShoppingCart,
} from "lucide-react";

import {
  useSalesReport,
  useInventoryReport,
  useRevenueReport,
  useProcurementReport,
} from "../../features/reports/reportHooks";

const ReportsSection = () => {
  const {
    data: salesData,
    isLoading: salesLoading,
  } = useSalesReport();

  const {
    data: inventoryData,
    isLoading: inventoryLoading,
  } = useInventoryReport();

  const {
    data: revenueData,
    isLoading: revenueLoading,
  } = useRevenueReport();

  const {
    data: procurementData,
    isLoading: procurementLoading,
  } = useProcurementReport();

  const sales =
    salesData?.data || {};

  const inventory =
    inventoryData?.data || {};

  const revenue =
    revenueData?.data || {};

  const procurement =
    procurementData?.data || {};

  const isLoading =
    salesLoading ||
    inventoryLoading ||
    revenueLoading ||
    procurementLoading;

  if (isLoading) {
    return (
      <div className="p-10 text-center text-gray-500">
        Loading Reports...
      </div>
    );
  }

  return (
    <div className="max-w-screen-2xl mx-auto space-y-8">

      {/* HEADER */}

      <div>
        <h2 className="text-3xl font-extrabold text-gray-950 tracking-tighter">
          Reports
        </h2>

        <p className="text-gray-500 text-sm font-medium">
          Business analytics and performance insights.
        </p>
      </div>

      {/* SALES REPORT */}

      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-8">

        <div className="flex items-center gap-3 mb-6">

          <div className="bg-blue-50 p-3 rounded-xl">
            <FileText className="w-5 h-5 text-blue-600" />
          </div>

          <h3 className="text-xl font-bold">
            Sales Report
          </h3>

        </div>

        <div className="grid md:grid-cols-3 gap-6">

          <div>
            <p className="text-sm text-gray-500">
              Total Invoices
            </p>

            <h4 className="text-3xl font-bold mt-2">
              {sales.totalInvoices || 0}
            </h4>
          </div>

          <div>
            <p className="text-sm text-gray-500">
              Total Revenue
            </p>

            <h4 className="text-3xl font-bold mt-2">
              ₹
              {Number(
                sales.totalRevenue || 0
              ).toLocaleString()}
            </h4>
          </div>

          <div>
            <p className="text-sm text-gray-500">
              Avg Invoice Value
            </p>

            <h4 className="text-3xl font-bold mt-2">
              ₹
              {Number(
                sales.averageInvoiceValue || 0
              ).toLocaleString()}
            </h4>
          </div>

        </div>

      </div>

      {/* INVENTORY REPORT */}

      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-8">

        <div className="flex items-center gap-3 mb-6">

          <div className="bg-green-50 p-3 rounded-xl">
            <Package className="w-5 h-5 text-green-600" />
          </div>

          <h3 className="text-xl font-bold">
            Inventory Report
          </h3>

        </div>

        <div className="grid md:grid-cols-4 gap-6">

          <div>
            <p className="text-sm text-gray-500">
              Total Items
            </p>

            <h4 className="text-3xl font-bold mt-2">
              {inventory.totalItems || 0}
            </h4>
          </div>

          <div>
            <p className="text-sm text-gray-500">
              Low Stock
            </p>

            <h4 className="text-3xl font-bold mt-2 text-yellow-600">
              {inventory.lowStockItems || 0}
            </h4>
          </div>

          <div>
            <p className="text-sm text-gray-500">
              Out Of Stock
            </p>

            <h4 className="text-3xl font-bold mt-2 text-red-600">
              {inventory.outOfStockItems || 0}
            </h4>
          </div>

          <div>
            <p className="text-sm text-gray-500">
              Inventory Value
            </p>

            <h4 className="text-3xl font-bold mt-2">
              ₹
              {Number(
                inventory.inventoryValue || 0
              ).toLocaleString()}
            </h4>
          </div>

        </div>

      </div>

      {/* REVENUE REPORT */}

      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-8">

        <div className="flex items-center gap-3 mb-6">

          <div className="bg-purple-50 p-3 rounded-xl">
            <IndianRupee className="w-5 h-5 text-purple-600" />
          </div>

          <h3 className="text-xl font-bold">
            Revenue Report
          </h3>

        </div>

        <div className="grid md:grid-cols-3 gap-6">

          <div>
            <p className="text-sm text-gray-500">
              Total Revenue
            </p>

            <h4 className="text-3xl font-bold mt-2">
              ₹
              {Number(
                revenue.totalRevenue || 0
              ).toLocaleString()}
            </h4>
          </div>

          <div>
            <p className="text-sm text-gray-500">
              Received Revenue
            </p>

            <h4 className="text-3xl font-bold mt-2 text-green-600">
              ₹
              {Number(
                revenue.receivedRevenue || 0
              ).toLocaleString()}
            </h4>
          </div>

          <div>
            <p className="text-sm text-gray-500">
              Pending Revenue
            </p>

            <h4 className="text-3xl font-bold mt-2 text-red-600">
              ₹
              {Number(
                revenue.pendingRevenue || 0
              ).toLocaleString()}
            </h4>
          </div>

        </div>

      </div>

      {/* PROCUREMENT REPORT */}

      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-8">

        <div className="flex items-center gap-3 mb-6">

          <div className="bg-orange-50 p-3 rounded-xl">
            <ShoppingCart className="w-5 h-5 text-orange-600" />
          </div>

          <h3 className="text-xl font-bold">
            Procurement Report
          </h3>

        </div>

        <div className="grid md:grid-cols-4 gap-6">

          <div>
            <p className="text-sm text-gray-500">
              Total Requisitions
            </p>

            <h4 className="text-3xl font-bold mt-2">
              {procurement.totalRequisitions || 0}
            </h4>
          </div>

          <div>
            <p className="text-sm text-gray-500">
              Pending Requisitions
            </p>

            <h4 className="text-3xl font-bold mt-2 text-red-600">
              {procurement.pendingRequisitions || 0}
            </h4>
          </div>

          <div>
            <p className="text-sm text-gray-500">
              Vendor POs
            </p>

            <h4 className="text-3xl font-bold mt-2">
              {procurement.totalVendorPOs || 0}
            </h4>
          </div>

          <div>
            <p className="text-sm text-gray-500">
              Received Vendor POs
            </p>

            <h4 className="text-3xl font-bold mt-2 text-green-600">
              {procurement.receivedVendorPOs || 0}
            </h4>
          </div>

        </div>

      </div>

    </div>
  );
};

export default ReportsSection;