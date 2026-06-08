import React from 'react';
import { User, Bell, Lock, Globe, ShieldCheck, Mail, Save } from 'lucide-react';

const SettingsSection = () => {
  const labelClass = "block text-xs font-bold text-gray-900 mb-2 uppercase tracking-wider";
  const inputClass = "w-full border border-gray-100 rounded-xl p-3 bg-gray-50 text-sm font-medium focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all";

  const SettingRow = ({ title, desc, children }) => (
    <div className="flex flex-col md:flex-row md:items-center justify-between py-6 border-b border-gray-50 last:border-0 gap-4">
      <div className="max-w-md">
        <h4 className="text-sm font-extrabold text-gray-950">{title}</h4>
        <p className="text-xs text-gray-500 font-medium mt-0.5">{desc}</p>
      </div>
      <div className="flex-shrink-0">
        {children}
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      {/* Header */}
      <div className="space-y-1">
        <h2 className="text-3xl font-extrabold text-gray-950 tracking-tighter">Settings</h2>
        <p className="text-gray-500 text-sm font-medium">Manage your account preferences and security.</p>
      </div>

      {/* Profile Card */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-8 space-y-8">
        <div className="flex items-center gap-6 pb-8 border-b border-gray-50">
          <div className="w-20 h-20 bg-slate-500 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-inner">
            P
          </div>
          <div>
            <h3 className="text-lg font-extrabold text-gray-950">Priyanshu Panchal</h3>
            <p className="text-sm text-gray-500 font-medium">panchalpriyanshu124@gmail.com</p>
            <button className="mt-3 text-xs font-bold text-black border border-gray-200 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
              Change Avatar
            </button>
          </div>
        </div>

        {/* Form Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <label className={labelClass}>Full Name</label>
            <input type="text" defaultValue="Priyanshu Panchal" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Email Address</label>
            <input type="email" defaultValue="panchalpriyanshu124@gmail.com" className={inputClass} />
          </div>
        </div>
      </div>

      {/* Notifications & Security */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-8">
        <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
          <Bell className="w-4 h-4" /> Preferences
        </h3>

        <div className="space-y-2">
          <SettingRow 
            title="Email Notifications" 
            desc="Receive daily reports and deal updates via email."
          >
            <input type="checkbox" defaultChecked className="w-5 h-5 accent-black rounded cursor-pointer" />
          </SettingRow>

          <SettingRow 
            title="Two-Factor Authentication" 
            desc="Add an extra layer of security to your account."
          >
            <button className="text-[10px] font-black bg-black text-white px-3 py-1.5 rounded uppercase tracking-widest shadow-sm">
              Enable
            </button>
          </SettingRow>

          <SettingRow 
            title="Language" 
            desc="Select your preferred display language."
          >
            <select className="bg-gray-50 border border-gray-100 rounded-lg p-2 text-xs font-bold focus:outline-none">
              <option>English (US)</option>
              <option>Hindi</option>
            </select>
          </SettingRow>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button className="bg-black text-white px-8 py-3.5 rounded-xl font-bold text-sm flex items-center gap-2.5 hover:bg-gray-800 transition-all shadow-lg active:scale-95">
          <Save className="w-4 h-4 stroke-[2.5px]" />
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default SettingsSection;