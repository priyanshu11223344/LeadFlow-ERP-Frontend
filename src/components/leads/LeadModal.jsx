import React, { useState } from 'react';
import {
  User,
  Search,
  FileText,
  Building2,
  X,
  Plus,
} from 'lucide-react';
import { useAuth }
  from "../../context/AuthContext";
import { useCreateLead } from '../../features/leads/leadHooks';

const LeadModal = ({ onClose }) => {
  const { user } =
  useAuth();
  const { mutate, isPending } = useCreateLead();

  const [formData, setFormData] = useState({
    salutation: "Mr.",
    name: "",
    email: "",

    leadStage: "New",
    leadSource: "",
    leadOwner: user?.email || "",

    createDeal: true,
    autoConvertToClient: true,

    remark: "",

    dealName: "",
    amount: 0,
    closeDate: "",

    companyName: "",
    address: "",
  });

  const SectionHeader = ({ icon: Icon, title }) => (
    <h3 className="text-xs font-bold text-gray-400 mb-6 tracking-widest flex items-center gap-2.5 uppercase">
      <Icon className="w-5 h-5 text-gray-400 stroke-[1.5px]" />
      {title}
    </h3>
  );

  const inputClass =
    "w-full border border-gray-100 rounded-xl p-3.5 bg-gray-50 text-sm font-medium focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all";

  const labelClass =
    "block text-xs font-semibold text-gray-900 mb-1.5";

  const handleChange = (e) => {

    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = () => {

    // REMARK VALIDATION
    if (
      (formData.leadStage === "Lost" ||
        formData.leadStage === "Dead") &&
      !formData.remark.trim()
    ) {
      alert("Remark is required");
      return;
    }

    mutate(formData, {

      onSuccess: () => {

        alert("Lead created successfully");

        onClose();
      },

      onError: (error) => {

        alert(
          error?.response?.data?.message ||
          "Something went wrong"
        );
      },
    });
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-6 backdrop-blur-sm">

      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">

        {/* HEADER */}
        <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center">

          <h2 className="text-2xl font-extrabold text-gray-950 tracking-tighter">
            Add New Lead & Deal
          </h2>

          <button
            onClick={onClose}
            className="text-gray-400 hover:text-black transition-colors"
          >
            <X className="w-6 h-6 stroke-[1.5px]" />
          </button>
        </div>

        {/* CONTENT */}
        <div className="flex-1 overflow-y-auto px-8 py-10 space-y-12">

          {/* BASIC INFO */}
          <section>

            <SectionHeader icon={User} title="BASIC INFO" />

            <div className="grid grid-cols-2 gap-6">

              {/* SALUTATION */}
              <div>
                <label className={labelClass}>Salutation</label>

                <select
                  name="salutation"
                  value={formData.salutation}
                  onChange={handleChange}
                  className={`${inputClass} appearance-none`}
                >
                  <option value="Mr.">Mr.</option>
                  <option value="Ms.">Ms.</option>
                </select>
              </div>

              {/* NAME */}
              <div>
                <label className={labelClass}>Name *</label>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className={inputClass}
                />
              </div>

              {/* EMAIL */}
              <div className="col-span-2">
                <label className={labelClass}>Email</label>

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john@example.com"
                  className={inputClass}
                />
              </div>

            </div>
          </section>

          {/* LEAD INFO */}
          <section>

            <SectionHeader icon={Search} title="LEAD INFO" />

            <div className="grid grid-cols-2 gap-6">

              {/* LEAD STAGE */}
              <div>
                <label className={labelClass}>Lead Stage</label>

                <select
                  name="leadStage"
                  value={formData.leadStage}
                  onChange={handleChange}
                  className={`${inputClass} appearance-none`}
                >
                  <option value="New">New</option>
                  <option value="Close">Close</option>
                  <option value="Won">Won</option>
                  <option value="Lost">Lost</option>
                  <option value="Dead">Dead</option>
                </select>
              </div>

              {/* LEAD SOURCE */}
              <div>
                <label className={labelClass}>Lead Source</label>

                <input
                  type="text"
                  name="leadSource"
                  value={formData.leadSource}
                  onChange={handleChange}
                  placeholder="e.g. Website, LinkedIn"
                  className={inputClass}
                />
              </div>

              {/* LEAD OWNER */}
              <div>
                <label className={labelClass}>Lead Owner</label>

                <input
                  type="text"
                  disabled
                  value={formData.leadOwner}
                  className={`${inputClass} bg-gray-100 text-gray-500`}
                />
              </div>

              {/* CHECKBOXES */}
              <div className="flex items-center gap-5 mt-7">

                {/* CREATE DEAL */}
                <label className="flex items-center gap-2.5 text-xs font-semibold text-gray-900 cursor-pointer">

                  <input
                    type="checkbox"
                    name="createDeal"
                    checked={formData.createDeal}
                    onChange={handleChange}
                    className="w-4 h-4 accent-purple-600 rounded"
                  />

                  Create Deal
                </label>

                {/* AUTO CONVERT */}
                <label className="flex items-center gap-2.5 text-xs font-semibold text-gray-900 cursor-pointer">

                  <input
                    type="checkbox"
                    name="autoConvertToClient"
                    checked={formData.autoConvertToClient}
                    onChange={handleChange}
                    className="w-4 h-4 accent-purple-600 rounded"
                  />

                  Auto convert to Client on Won
                </label>
              </div>

              {/* REMARK FIELD */}
              {(formData.leadStage === "Lost" ||
                formData.leadStage === "Dead") && (

                  <div className="col-span-2">

                    <label className="block text-sm font-semibold text-red-600 mb-2">

                      Remarks (Required for {formData.leadStage})
                    </label>

                    <textarea
                      rows="4"
                      name="remark"
                      value={formData.remark}
                      onChange={handleChange}
                      placeholder="Provide reason..."
                      className="w-full border border-red-200 rounded-xl p-4 bg-red-50 text-sm focus:outline-none focus:border-red-400"
                    />
                  </div>
                )}

            </div>
          </section>

          {/* DEAL SECTION */}
          {formData.createDeal && (

            <section className="bg-gray-50 p-7 rounded-2xl border border-gray-100 transition-all">

              <SectionHeader
                icon={FileText}
                title="ASSOCIATED DEAL"
              />

              <div className="space-y-6">

                {/* DEAL NAME */}
                <div>
                  <label className={labelClass}>Deal Name</label>

                  <input
                    type="text"
                    name="dealName"
                    value={formData.dealName}
                    onChange={handleChange}
                    className={`${inputClass} border border-white`}
                  />
                </div>

                <div className="grid grid-cols-2 gap-6">

                  {/* AMOUNT */}
                  <div>
                    <label className={labelClass}>Amount</label>

                    <input
                      type="number"
                      name="amount"
                      value={formData.amount}
                      onChange={handleChange}
                      className={`${inputClass} border border-white`}
                    />
                  </div>

                  {/* CLOSE DATE */}
                  <div>
                    <label className={labelClass}>Close Date</label>

                    <input
                      type="date"
                      name="closeDate"
                      value={formData.closeDate}
                      onChange={handleChange}
                      className={`${inputClass} border border-white`}
                    />
                  </div>

                </div>
              </div>
            </section>
          )}

          {/* COMPANY DETAILS */}
          <section>

            <SectionHeader
              icon={Building2}
              title="COMPANY DETAILS"
            />

            <div className="space-y-6">

              {/* COMPANY NAME */}
              <div>
                <label className={labelClass}>Company Name</label>

                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>

              {/* ADDRESS */}
              <div>
                <label className={labelClass}>Address</label>

                <textarea
                  rows="4"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className={`${inputClass} resize-none`}
                />
              </div>

            </div>
          </section>
        </div>

        {/* FOOTER */}
        <div className="px-8 py-6 border-t border-gray-100 flex justify-end gap-3.5 bg-white">

          <button
            onClick={onClose}
            className="px-7 py-3 text-sm font-semibold border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={isPending}
            className="px-7 py-3 text-sm font-semibold bg-black text-white rounded-xl flex items-center gap-2.5 hover:bg-gray-800 transition-colors shadow-lg"
          >
            <Plus className="w-5 h-5 stroke-white stroke-[2px]" />

            {isPending
              ? "Saving..."
              : formData.createDeal
                ? "Save Lead & Deal"
                : "Save Lead"}
          </button>

        </div>
      </div>
    </div>
  );
};

export default LeadModal;