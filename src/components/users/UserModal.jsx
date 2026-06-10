import React, {
    useState,
  } from "react";
  
  const UserModal = ({
    onClose,
    onSubmit,
    initialData,
  }) => {
    const [form, setForm] =
    useState({
      name:
        initialData?.name ||
        "",
  
      email:
        initialData?.email ||
        "",
  
      password: "",
  
      role:
        initialData?.role ||
        "SALES",
    });
  
    const handleChange = (e) => {
      setForm({
        ...form,
        [e.target.name]:
          e.target.value,
      });
    };
  
    return (
      <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white p-8 rounded-3xl w-full max-w-md shadow-2xl border border-slate-100 space-y-6 animate-in fade-in-50 zoom-in-95 duration-150">
          
          {/* Modal Header */}
          <div className="flex justify-between items-center border-b border-slate-100 pb-4">
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            {initialData
  ? "Edit User"
  : "Create User"}
            </h2>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 p-1.5 rounded-xl hover:bg-slate-50 transition-all duration-200"
              aria-label="Close modal"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
  
          {/* Form Fields */}
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 tracking-wider uppercase ml-1">
                Full Name
              </label>
              <input
                name="name"
                value={form.name}
                placeholder="Name"
                onChange={handleChange}
                className="w-full border border-slate-200 px-4 py-3 rounded-2xl text-slate-900 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200 text-sm"
              />
            </div>
  
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 tracking-wider uppercase ml-1">
                Email Address
              </label>
              <input
                name="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                className="w-full border border-slate-200 px-4 py-3 rounded-2xl text-slate-900 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200 text-sm"
              />
            </div>
  
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 tracking-wider uppercase ml-1">
                Password
              </label>
              <input
                type="password"
                name="password"
                placeholder="Password"
                onChange={handleChange}
                className="w-full border border-slate-200 px-4 py-3 rounded-2xl text-slate-900 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200 text-sm"
              />
            </div>
  
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 tracking-wider uppercase ml-1">
                Role
              </label>
              <div className="relative">
                <select
                  name="role"
                  onChange={handleChange}
                  value={form.role}
                  className="w-full border border-slate-200 px-4 py-3 rounded-2xl text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200 text-sm appearance-none cursor-pointer"
                >
                  <option>SALES</option>
                  <option>
                    INVENTORY_MANAGER
                  </option>
                  <option>
                    PROCUREMENT_MANAGER
                  </option>
                  <option>FINANCE</option>
                  <option>ADMIN</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
                  <svg
                    className="fill-current h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
  
          {/* Footer Actions */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-2xl text-sm font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-50 active:scale-[0.98] transition-all duration-200"
            >
              Cancel
            </button>
            <button
              onClick={() =>
                onSubmit(form)
              }
              className="bg-slate-900 hover:bg-slate-800 active:scale-[0.98] text-white px-6 py-2.5 rounded-2xl font-semibold shadow-lg shadow-slate-950/10 hover:shadow-xl hover:shadow-slate-950/20 transition-all duration-200 text-sm"
            >
              {initialData
  ? "Update"
  : "Create"}
            </button>
          </div>
  
        </div>
      </div>
    );
  };
  
  export default UserModal;