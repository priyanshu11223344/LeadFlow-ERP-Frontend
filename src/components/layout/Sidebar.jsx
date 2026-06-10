import React from 'react';
import { LayoutDashboard, Users, Briefcase, Clock, Package, Settings, LogOut, TrendingUp,Receipt } from 'lucide-react';
import {
  Building2,CreditCard,BarChart3,ShoppingCart,Truck,ShoppingBag,ClipboardCheck,ShieldCheck,ClipboardList
} from "lucide-react";
import { useAuth }
  from "../../context/AuthContext";
const Sidebar = ({ activeSection, setActiveSection }) => {
  const { user, logout } =
  useAuth();
  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      id: "users",
      label: "Users",
      icon: ShieldCheck,
    },
    {
      id: "leads",
      label: "Leads",
      icon: Users,
    },
    {
      id: "clients",
      label: "Clients",
      icon: Building2,
    },
    {
      id: "deals",
      label: "Deals",
      icon: Briefcase,
    },
    {
      id: "orders",
      label: "Orders",
      icon: Clock,
    },
    {
      id: "invoices",
      label: "Invoices",
      icon: Receipt,
    },
    {
      id: "payments",
      label: "Payments",
      icon: CreditCard,
    },
    {
      id: "inventory",
      label: "Inventory",
      icon: Package,
    },
    {
      id: "reports",
      label: "Reports",
      icon: BarChart3,
    },
    {
      id: "purchaseRequisitions",
      label: "Purchase Requisitions",
      icon: ShoppingCart,
    },
    {
      id: "vendors",
      label: "Vendors",
      icon: Truck,
    },
    {
      id: "vendorPurchaseOrders",
      label: "Vendor POs",
      icon: ShoppingBag,
    },
    {
      id: "grn",
      label: "GRN",
      icon: ClipboardCheck,
    },
    {
      id: "auditLogs",
      label: "Audit Logs",
      icon: ClipboardList,
    },
    {
      id: "settings",
      label: "Settings",
      icon: Settings,
    },
  ];
  const menuItemsByRole = {
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
      "settings",
    ],
  
    SALES: [
      "dashboard",
      "leads",
      "clients",
      "deals",
      "orders",
    ],
  
    INVENTORY_MANAGER: [
      "dashboard",
      "inventory",
      "orders",
    ],
  
    PROCUREMENT_MANAGER: [
      "dashboard",
      "purchaseRequisitions",
      "vendors",
      "vendorPurchaseOrders",
      "grn",
    ],
  
    FINANCE: [
      "dashboard",
      "invoices",
      "payments",
      "reports",
    ],
  };
  const allowedMenus =
  menuItemsByRole[
    user?.role
  ] || [];

const filteredMenuItems =
  menuItems.filter(
    (item) =>
      allowedMenus.includes(
        item.id
      )
  );

  return (
    <aside className="w-72 bg-white border-r border-gray-100 flex flex-col h-screen">
      <div className="p-6 flex items-center gap-3">
        <div className="bg-black p-1.5 rounded-lg">
          <TrendingUp className="w-6 h-6 text-white" />
        </div>
        <span className="text-xl font-bold tracking-tight text-gray-950">LeadFlow</span>
      </div>

      <nav className="flex-1 px-4 space-y-1.5 mt-4 overflow-y-auto">
        {filteredMenuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveSection(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
              activeSection === item.id
                ? 'bg-[#121212] text-white shadow-md'
                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-950'
            }`}
          >
            <item.icon className={`w-5 h-5 ${activeSection === item.id ? 'text-white' : 'text-gray-400'}`} />
            {item.label}
          </button>
        ))}
      </nav>

      <div className="p-6 border-t border-gray-50">
      <button
  onClick={() => {
    logout();
    window.location.reload();
  }}
  className="flex items-center gap-3 px-4 py-2 text-sm font-bold text-red-500 hover:bg-red-50 w-full rounded-xl transition-colors"
>
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;