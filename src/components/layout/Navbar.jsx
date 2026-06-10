import React from 'react';
import { Search } from 'lucide-react';
import {
  useAuth,
} from "../../context/AuthContext";
const Navbar = ({ activeSection }) => {
  const { user } =
    useAuth();
  return (
    <header className="h-14 bg-white border-b border-gray-100 flex items-center justify-between px-8">
      {/* 1. Dynamic Section Name */}
      <h1 className="text-sm font-bold text-gray-950 capitalize tracking-tight">
        {activeSection}
      </h1>

      {/* 2. Right Side: Search and Profile */}
      <div className="flex items-center gap-4">
        {/* Search Bar Container */}
        <div className="relative group">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Search className="w-4 h-4 text-gray-400 group-focus-within:text-black transition-colors" />
          </div>
          <input
            type="text"
            placeholder="Search..."
            className="bg-gray-50 border border-transparent focus:border-gray-200 focus:bg-white rounded-full py-1.5 pl-10 pr-4 text-xs font-medium focus:outline-none w-48 lg:w-64 transition-all"
          />
        </div>

        {/* Dummy User Avatar (Matched to 'p' circle in screenshot) */}
        <div className="flex items-center justify-center">
          <div className="flex items-center gap-3">

            <div className="text-right">
              <p className="text-xs font-bold text-gray-900">
                {user?.name}
              </p>

              <p className="text-[10px] text-gray-500">
                {user?.role}
              </p>
            </div>

            <div className="w-8 h-8 bg-slate-500 rounded-full flex items-center justify-center text-white text-[11px] font-bold uppercase shadow-sm">
              {user?.name?.charAt(0)}
            </div>

          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;