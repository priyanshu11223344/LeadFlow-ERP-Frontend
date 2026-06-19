import React from "react";
import {
  BarChart3,
  Briefcase,
  Building2,
  ClipboardCheck,
  ClipboardList,
  CreditCard,
  FileText,
  LayoutDashboard,
  LifeBuoy,
  LogOut,
  Package,
  Receipt,
  Settings,
  ShieldCheck,
  ShoppingBag,
  ShoppingCart,
  TrendingUp,
  Truck,
  Users,
  X,
  Clock,
} from "lucide-react";

import {
  useAuth,
} from "../../context/AuthContext";

const menuItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "users", label: "Users", icon: ShieldCheck },
  { id: "leads", label: "Leads", icon: Users },
  { id: "quotations", label: "Quotations", icon: FileText },
  { id: "clients", label: "Clients", icon: Building2 },
  { id: "deals", label: "Deals", icon: Briefcase },
  { id: "orders", label: "Orders", icon: Clock },
  { id: "invoices", label: "Invoices", icon: Receipt },
  { id: "payments", label: "Payments", icon: CreditCard },
  { id: "inventory", label: "Inventory", icon: Package },
  { id: "reports", label: "Reports", icon: BarChart3 },
  { id: "purchaseRequisitions", label: "Purchase Requisitions", icon: ShoppingCart },
  { id: "vendors", label: "Vendors", icon: Truck },
  { id: "vendorPurchaseOrders", label: "Vendor POs", icon: ShoppingBag },
  { id: "grn", label: "GRN", icon: ClipboardCheck },
  { id: "auditLogs", label: "Audit Logs", icon: ClipboardList },
  { id: "tickets", label: "Tickets", icon: LifeBuoy },
  { id: "settings", label: "Settings", icon: Settings },
];

const menuItemsByRole = {
  ADMIN: menuItems.map((item) => item.id),
  SALES: ["dashboard", "leads", "clients", "deals", "orders", "invoices", "quotations", "tickets"],
  INVENTORY_MANAGER: ["dashboard", "inventory", "orders", "tickets"],
  PROCUREMENT_MANAGER: ["dashboard", "purchaseRequisitions", "vendors", "vendorPurchaseOrders", "grn", "tickets"],
  FINANCE: ["dashboard", "invoices", "payments", "reports", "tickets"],
};

const Sidebar = ({
  activeSection,
  setActiveSection,
  mobileOpen,
  onMobileClose,
}) => {
  const { user, logout } = useAuth();
  const allowedMenus =
    menuItemsByRole[user?.role] || [];
  const filteredMenuItems =
    menuItems.filter((item) =>
      allowedMenus.includes(item.id)
    );

  const navigate = (id) => {
    setActiveSection(id);
    onMobileClose?.();
  };

  return (
    <>
      {mobileOpen && (
        <button
          type="button"
          aria-label="Close navigation"
          onClick={onMobileClose}
          className="fixed inset-0 z-40 bg-slate-950/35 backdrop-blur-sm lg:hidden"
        />
      )}

      <aside
        className={`leadflow-sidebar fixed inset-y-0 left-0 z-50 flex w-[286px] -translate-x-full flex-col p-3 transition-transform duration-300 lg:static lg:w-[86px] lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : ""
        }`}
      >
        <div className="leadflow-rail flex h-full min-h-0 flex-col rounded-[26px] bg-[#202020] px-3 py-4 text-white shadow-xl shadow-black/10">
          <div className="mb-5 flex items-center justify-between px-1 lg:justify-center">
            <button
              type="button"
              onClick={() => navigate("dashboard")}
              className="flex items-center gap-3"
              aria-label="LeadFlow dashboard"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-[#202020]">
                <TrendingUp className="h-6 w-6 stroke-[2.5]" />
              </span>
              <span className="text-lg font-bold lg:hidden">LeadFlow</span>
            </button>
            <button
              type="button"
              onClick={onMobileClose}
              className="rounded-xl p-2 text-white/60 hover:bg-white/10 hover:text-white lg:hidden"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <nav className="leadflow-nav flex-1 space-y-1 overflow-y-auto overflow-x-hidden">
            {filteredMenuItems.map((item) => {
              const Icon = item.icon;
              const selected =
                activeSection === item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => navigate(item.id)}
                  title={item.label}
                  className={`group relative flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-sm font-semibold transition-all lg:justify-center ${
                    selected
                      ? "bg-[#d9d0ff] text-[#202020]"
                      : "text-white/65 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <Icon className="h-5 w-5 shrink-0 stroke-[1.8]" />
                  <span className="lg:hidden">
                    {item.label}
                  </span>
                  <span className="pointer-events-none absolute left-[62px] z-[70] hidden whitespace-nowrap rounded-xl bg-[#202020] px-3 py-2 text-xs font-semibold text-white opacity-0 shadow-xl transition-all group-hover:opacity-100 lg:group-hover:block">
                    {item.label}
                  </span>
                </button>
              );
            })}
          </nav>

          <button
            type="button"
            onClick={() => {
              logout();
              window.location.reload();
            }}
            title="Logout"
            className="group relative mt-4 flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-sm font-semibold text-white/65 transition-all hover:bg-rose-500/15 hover:text-rose-200 lg:justify-center"
          >
            <LogOut className="h-5 w-5 shrink-0" />
            <span className="lg:hidden">Logout</span>
            <span className="pointer-events-none absolute left-[62px] z-[70] hidden rounded-xl bg-[#202020] px-3 py-2 text-xs font-semibold text-white opacity-0 shadow-xl group-hover:opacity-100 lg:group-hover:block">
              Logout
            </span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
