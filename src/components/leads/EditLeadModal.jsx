import React, { useState, useEffect } from 'react';

import {
  User,
  Search,
  Building2,
  X,
  CheckCircle2,
} from 'lucide-react';

import { useUpdateLead } from '../../features/leads/leadHooks';

const EditLeadModal = ({
  isOpen,
  onClose,
  leadData,
}) => {

  const { mutate, isPending } = useUpdateLead();

  // INITIAL EMPTY STATE
  const [formData, setFormData] = useState({
    salutation: "Mr.",
    name: "",
    email: "",
    leadStage: "New",
    leadSource: "",
    leadOwner: "",
    autoConvertToClient: false,
    companyName: "",
    address: "",
    remark: "",
  });

  // SYNC FORM DATA WHEN LEADDATA CHANGES
  useEffect(() => {

    if (leadData) {

      setFormData({

        salutation:
          leadData.salutation || "Mr.",

        name:
          leadData.name || "",

        email:
          leadData.email || "",

        leadStage:
          leadData.leadStage || "New",

        leadSource:
          leadData.leadSource || "",

        leadOwner:
          leadData.leadOwner ||
          "panchalpriyanshu124@gmail.com",

        autoConvertToClient:
          leadData.autoConvertToClient || false,

        companyName:
          leadData.companyName || "",

        address:
          leadData.address || "",

        remark:
          leadData.remark || "",
      });
    }

  }, [leadData]);

  if (!isOpen) return null;

  // HANDLE INPUT CHANGE
  const handleChange = (e) => {

    const {
      name,
      value,
      type,
      checked,
    } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  };

  // HANDLE UPDATE
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

    mutate(
      {
        id: leadData._id,
        data: formData,
      },

      {
        onSuccess: () => {

          alert("Lead updated successfully");

          onClose();
        },

        onError: (error) => {


          alert(
            error?.response?.data?.message ||
            "Something went wrong"
          );
        },
      }
    );
  };

  // SECTION HEADER
  const SectionHeader = ({
    icon: Icon,
    title,
  }) => (
    <div className="flex items-center gap-2 mb-4 mt-2">

      <Icon className="w-4 h-4 text-gray-400" />

      <h3 className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
        {title}
      </h3>
    </div>
  );

  const labelClass =
    "block text-sm font-medium text-gray-700 mb-1.5";

  const inputClass =
    "w-full border border-gray-200 rounded-lg p-2.5 bg-gray-50/50 text-sm focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all placeholder:text-gray-400";

  return (

    <div className="fixed inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center z-50 p-4">

      <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-xl">

        {/* HEADER */}
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-white">

          <h2 className="text-lg font-bold text-gray-900">
            Edit Lead
          </h2>

          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* FORM CONTENT */}
        <div className="flex-1 overflow-y-auto px-8 py-6 space-y-8 custom-scrollbar">

          {/* BASIC INFO */}
          <section>

            <SectionHeader
              icon={User}
              title="Basic Info"
            />

            <div className="grid grid-cols-2 gap-4">

              {/* SALUTATION */}
              <div>

                <label className={labelClass}>
                  Salutation
                </label>

                <select
                  name="salutation"
                  value={formData.salutation}
                  onChange={handleChange}
                  className={inputClass}
                >
                  <option value="Mr.">Mr.</option>
                  <option value="Ms.">Ms.</option>
                  <option value="Mrs.">Mrs.</option>
                </select>
              </div>

              {/* NAME */}
              <div>

                <label className={labelClass}>
                  Name *
                </label>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="Priyanshu"
                />
              </div>

              {/* EMAIL */}
              <div className="col-span-2">

                <label className={labelClass}>
                  Email
                </label>

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="123@gmail.com"
                />
              </div>

            </div>
          </section>

          {/* LEAD INFO */}
          <section>

            <SectionHeader
              icon={Search}
              title="Lead Info"
            />

            <div className="grid grid-cols-2 gap-4">

              {/* LEAD STAGE */}
              <div>

                <label className={labelClass}>
                  Lead Stage
                </label>

                <select
                  name="leadStage"
                  value={formData.leadStage}
                  onChange={handleChange}
                  className={inputClass}
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

                <label className={labelClass}>
                  Lead Source
                </label>

                <input
                  type="text"
                  name="leadSource"
                  value={formData.leadSource}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="e.g. Website, LinkedIn"
                />
              </div>

              {/* LEAD OWNER */}
              <div>

                <label className={labelClass}>
                  Lead Owner
                </label>

                <input
                  type="text"
                  disabled
                  value={formData.leadOwner}
                  className={`${inputClass} bg-gray-100 cursor-not-allowed`}
                />
              </div>

              {/* AUTO CONVERT */}
              <div className="flex items-end pb-3">

                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 cursor-pointer">

                  <input
                    type="checkbox"
                    name="autoConvertToClient"
                    checked={formData.autoConvertToClient}
                    onChange={handleChange}
                    className="w-4 h-4 accent-purple-600 rounded border-gray-300"
                  />

                  Auto convert to client on "Won"
                </label>
              </div>

              {/* REMARK */}
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

          {/* COMPANY DETAILS */}
          <section>

            <SectionHeader
              icon={Building2}
              title="Company Details"
            />

            <div className="space-y-4">

              {/* COMPANY NAME */}
              <div>

                <label className={labelClass}>
                  Company Name
                </label>

                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="abcdef"
                />
              </div>

              {/* ADDRESS */}
              <div>

                <label className={labelClass}>
                  Address
                </label>

                <textarea
                  rows="3"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className={`${inputClass} resize-none`}
                  placeholder="Address details..."
                />
              </div>

            </div>
          </section>
        </div>

        {/* FOOTER */}
        <div className="px-6 py-4 border-t border-gray-100 flex justify-end items-center gap-3 bg-white">

          <button
            onClick={onClose}
            className="px-5 py-2 text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={isPending}
            className="bg-black text-white px-6 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-gray-800 transition-all shadow-sm"
          >
            <CheckCircle2 className="w-4 h-4" />

            {isPending
              ? "Updating..."
              : "Update Lead"}
          </button>

        </div>
      </div>
    </div>
  );
};

export default EditLeadModal;