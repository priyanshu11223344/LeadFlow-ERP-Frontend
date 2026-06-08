import React from 'react';
import { LayoutDashboard, Users, Briefcase, Clock, Package, Settings, LogOut, TrendingUp } from 'lucide-react';

const Sidebar = ({ activeSection, setActiveSection }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'leads', label: 'Leads', icon: Users },
    { id: 'deals', label: 'Deals', icon: Briefcase },
    { id: 'orders', label: 'Orders', icon: Clock },
    { id: 'inventory', label: 'Inventory', icon: Package },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-100 flex flex-col h-full">
      <div className="p-6 flex items-center gap-3">
        <div className="bg-black p-1.5 rounded-lg">
          <TrendingUp className="w-6 h-6 text-white" />
        </div>
        <span className="text-xl font-bold tracking-tight text-gray-950">LeadFlow</span>
      </div>

      <nav className="flex-1 px-4 space-y-1.5 mt-4">
        {menuItems.map((item) => (
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
        <button className="flex items-center gap-3 px-4 py-2 text-sm font-bold text-red-500 hover:bg-red-50 w-full rounded-xl transition-colors">
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;