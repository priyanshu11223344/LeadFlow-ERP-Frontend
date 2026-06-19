import React from "react";
import {
  Bell,
  Menu,
  Search,
} from "lucide-react";

import {
  useAuth,
} from "../../context/AuthContext";

const sectionTitles = {
  purchaseRequisitions: "Purchase Requisitions",
  vendorPurchaseOrders: "Vendor Purchase Orders",
  auditLogs: "Audit Logs",
  grn: "Goods Received",
};

const Navbar = ({
  activeSection,
  onMenuClick,
}) => {
  const { user } = useAuth();
  const title =
    sectionTitles[activeSection] ||
    activeSection?.replace(/([A-Z])/g, " $1") ||
    "Dashboard";

  return (
    <header className="leadflow-navbar flex min-h-[72px] items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white text-slate-700 shadow-sm lg:hidden"
          aria-label="Open navigation"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
            Workspace
          </p>
          <h1 className="truncate text-xl font-bold capitalize tracking-tight text-[#202020]">
            {title}
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <label className="relative hidden md:block">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            placeholder="Search workspace"
            className="h-11 w-52 rounded-2xl border-0 bg-white pl-11 pr-4 text-sm outline-none ring-1 ring-black/[0.04] transition-all focus:w-64 focus:ring-[#b7a8f8] xl:w-72"
          />
        </label>

        <button
          type="button"
          className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-slate-600 ring-1 ring-black/[0.04]"
          aria-label="Notifications"
        >
          <Bell className="h-4.5 w-4.5" />
          <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-[#9d87ef] ring-2 ring-white" />
        </button>

        <div className="flex items-center gap-3 rounded-2xl bg-white p-1.5 pr-3 ring-1 ring-black/[0.04]">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#202020] text-xs font-bold uppercase text-white">
            {user?.name?.charAt(0) || "U"}
          </div>
          <div className="hidden text-left sm:block">
            <p className="max-w-28 truncate text-xs font-bold text-slate-900">
              {user?.name}
            </p>
            <p className="text-[9px] font-semibold uppercase tracking-wider text-slate-400">
              {user?.role?.replaceAll("_", " ")}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
