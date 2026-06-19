import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import DashboardOverview from '../dashboard/DashboardOverview';
import LeadsSection from '../leads/LeadsSection';
import DealsSection from '../deals/DealsSection';
import OrdersSection from '../orders/OrderSection';
import InventorySection from '../inventory/InventorySection';
import SettingsSection from '../settings/SettingsSection';
import LeadModal from '../leads/LeadModal';
import ClientsSection from "../clients/ClientsSection";
import InvoiceSection from "../invoices/InvoiceSection";
import PaymentSection
  from "../payment/PaymentSection";
import ReportsSection
  from "../reports/ReportsSection";
import PurchaseRequisitionSection
  from "../purchaseRequisition/PurchaseRequisitionSection";
import VendorSection from '../vendors/vendorSection';
import VendorPurchaseOrderSection
  from "../vendorPurchaseOrders/VendorPurchaseOrderSection";
import GRNSection
  from "../grn/GRNSection";
import {
  useAuth,
} from "../../context/AuthContext";
import UsersSection
  from "../users/UsersSection";
import RoleGuard
  from "../auth/RoleGuard";
import AuditLogsSection
  from "../auditLogs/AuditLogsSection";
import QuotationSection
  from "../quotations/QuotationSection";
import TicketsSection
  from "../tickets/TicketsSection";
const MainLayout = () => {
  const { user } =
    useAuth();
  const getDefaultSection =
    () => {
      switch (
      user?.role
      ) {
        case "SALES":
          return "leads";

        case "INVENTORY_MANAGER":
          return "inventory";

        case "PROCUREMENT_MANAGER":
          return "purchaseRequisitions";

        case "FINANCE":
          return "invoices";


        default:
          return "dashboard";
      }
    };
  const [
    activeSection,
    setActiveSection,
  ] = useState(
    getDefaultSection()
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const allowedSections = {
    ADMIN: [
      "dashboard",
      "users",
      "leads",
      "clients",
      "deals",
      "orders",
      "inventory",
      "purchaseRequisitions",
      "vendors",
      "vendorPurchaseOrders",
      "grn",
      "invoices",
      "payments",
      "reports",
      "auditLogs",
      "tickets",
      "settings",
      "quotations",
    ],

    SALES: [
      "dashboard",
      "leads",
      "clients",
      "deals",
      "orders",
      "invoices",
      "quotations",
      "tickets",
    ],

    INVENTORY_MANAGER: [
      "dashboard",
      "inventory",
      "orders",
      "tickets",
    ],

    PROCUREMENT_MANAGER: [
      "dashboard",
      "purchaseRequisitions",
      "vendors",
      "vendorPurchaseOrders",
      "grn",
      "tickets",
    ],

    FINANCE: [
      "dashboard",
      "invoices",
      "payments",
      "reports",
      "tickets",
    ],
  };
  // Router logic to swap sections
  const renderSection = () => {
    if (
      !allowedSections[
        user?.role
      ]?.includes(
        activeSection
      )
    ) {
      return (
        <DashboardOverview
          onOpenModal={() =>
            setIsModalOpen(true)
          }
        />
      );
    }
    switch (activeSection) {
      case 'dashboard':
        return <DashboardOverview onOpenModal={() => setIsModalOpen(true)} />;
      case "leads":
        return (
          <RoleGuard
            allowedRoles={[
              "ADMIN",
              "SALES",
            ]}
          >
            <LeadsSection
              onOpenModal={() =>
                setIsModalOpen(true)
              }
            />
          </RoleGuard>
        );
      case 'deals':
        return <DealsSection onOpenModal={() => setIsModalOpen(true)} />;
      case 'orders':
        return <OrdersSection />;
      case "inventory":
        return (
          <RoleGuard
            allowedRoles={[
              "ADMIN",
              "INVENTORY_MANAGER",
            ]}
          >
            <InventorySection />
          </RoleGuard>
        );
      case 'settings':
        return <SettingsSection />;
      case "clients":
        return <ClientsSection />;
        case "quotations":
  return (
    <RoleGuard
      allowedRoles={[
        "ADMIN",
        "SALES",
      ]}
    >
      <QuotationSection />
    </RoleGuard>
  );
      case "invoices":
        return <InvoiceSection />;
      case "payments":
        return (
          <RoleGuard
            allowedRoles={[
              "ADMIN",
              "FINANCE",
            ]}
          >
            <PaymentSection />
          </RoleGuard>
        );
      case "reports":
        return <ReportsSection />;
      case "purchaseRequisitions":
        return (
          <RoleGuard
            allowedRoles={[
              "ADMIN",
              "PROCUREMENT_MANAGER",
            ]}
          >
            <PurchaseRequisitionSection />
          </RoleGuard>
        );
      case "vendors":
        return <VendorSection />;
      case "vendorPurchaseOrders":
        return (
          <VendorPurchaseOrderSection />
        );
      case "grn":
        return <GRNSection />;
      case "users":
        return (
          <RoleGuard
            allowedRoles={[
              "ADMIN",
            ]}
          >
            <UsersSection />
          </RoleGuard>
        );
      case "auditLogs":
        return (
          <RoleGuard
            allowedRoles={[
              "ADMIN",
            ]}
          >
            <AuditLogsSection />
          </RoleGuard>
        );
      case "tickets":
        return <TicketsSection />;
      default:
        return <DashboardOverview onOpenModal={() => setIsModalOpen(true)} />;
    }
  };

  return (
    <div className="flex h-screen bg-[#F9FAFB] overflow-hidden font-sans">
      <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Navbar activeSection={activeSection} />

        <main className="flex-1 overflow-y-auto p-8 scroll-smooth">
          {renderSection()}
        </main>
      </div>

      {isModalOpen && <LeadModal onClose={() => setIsModalOpen(false)} />}
    </div>
  );
};

export default MainLayout;
