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
const MainLayout = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Router logic to swap sections
  const renderSection = () => {
    switch (activeSection) {
      case 'dashboard':
        return <DashboardOverview onOpenModal={() => setIsModalOpen(true)} />;
      case 'leads':
        return <LeadsSection onOpenModal={() => setIsModalOpen(true)} />;
      case 'deals':
        return <DealsSection onOpenModal={() => setIsModalOpen(true)} />;
      case 'orders':
        return <OrdersSection />;
      case 'inventory':
        return <InventorySection />;
      case 'settings':
        return <SettingsSection />;
      case "clients":
        return <ClientsSection />;
      case "invoices":
        return <InvoiceSection />;
      case "payments":
        return <PaymentSection />;
      case "reports":
        return <ReportsSection />;
      case "purchaseRequisitions":
        return <PurchaseRequisitionSection />;
      case "vendors":
        return <VendorSection />;
      case "vendorPurchaseOrders":
        return (
          <VendorPurchaseOrderSection />
        );
      case "grn":
        return <GRNSection />;
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