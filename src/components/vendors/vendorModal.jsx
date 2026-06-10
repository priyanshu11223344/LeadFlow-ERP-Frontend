import React, {
    useState,
  } from "react";
  
  import { X } from "lucide-react";
  
  import {
    useCreateVendor,
  } from "../../features/vendors/vendorHooks";
  
  const VendorModal = ({
    isOpen,
    onClose,
  }) => {
    const createVendorMutation =
      useCreateVendor();
  
    const [formData, setFormData] =
      useState({
        vendorName: "",
        contactPerson: "",
        email: "",
        phone: "",
        address: "",
        gstNumber: "",
        status: "ACTIVE",
      });
  
    if (!isOpen) return null;
  
    const handleSubmit =
      async () => {
        try {
          if (
            !formData.vendorName
          ) {
            alert(
              "Vendor name is required"
            );
            return;
          }
  
          await createVendorMutation.mutateAsync(
            formData
          );
  
          onClose();
  
          setFormData({
            vendorName: "",
            contactPerson: "",
            email: "",
            phone: "",
            address: "",
            gstNumber: "",
            status: "ACTIVE",
          });
        } catch (error) {
          alert(
            error?.response?.data
              ?.message ||
              "Failed to create vendor"
          );
        }
      };
  
    return (
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 p-4">
  
        <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl">
  
          <div className="flex justify-between items-center px-8 py-6 border-b">
  
            <div>
              <h2 className="text-xl font-bold">
                New Vendor
              </h2>
  
              <p className="text-sm text-gray-500">
                Create vendor record
              </p>
            </div>
  
            <button
              onClick={onClose}
            >
              <X />
            </button>
  
          </div>
  
          <div className="p-8 space-y-4">
  
            <input
              placeholder="Vendor Name"
              value={
                formData.vendorName
              }
              onChange={(e) =>
                setFormData({
                  ...formData,
                  vendorName:
                    e.target.value,
                })
              }
              className="w-full border rounded-xl px-4 py-3"
            />
  
            <input
              placeholder="Contact Person"
              value={
                formData.contactPerson
              }
              onChange={(e) =>
                setFormData({
                  ...formData,
                  contactPerson:
                    e.target.value,
                })
              }
              className="w-full border rounded-xl px-4 py-3"
            />
  
            <input
              placeholder="Email"
              value={
                formData.email
              }
              onChange={(e) =>
                setFormData({
                  ...formData,
                  email:
                    e.target.value,
                })
              }
              className="w-full border rounded-xl px-4 py-3"
            />
  
            <input
              placeholder="Phone"
              value={
                formData.phone
              }
              onChange={(e) =>
                setFormData({
                  ...formData,
                  phone:
                    e.target.value,
                })
              }
              className="w-full border rounded-xl px-4 py-3"
            />
  
            <input
              placeholder="GST Number"
              value={
                formData.gstNumber
              }
              onChange={(e) =>
                setFormData({
                  ...formData,
                  gstNumber:
                    e.target.value,
                })
              }
              className="w-full border rounded-xl px-4 py-3"
            />
  
            <textarea
              placeholder="Address"
              value={
                formData.address
              }
              onChange={(e) =>
                setFormData({
                  ...formData,
                  address:
                    e.target.value,
                })
              }
              className="w-full border rounded-xl px-4 py-3"
            />
  
            <select
              value={
                formData.status
              }
              onChange={(e) =>
                setFormData({
                  ...formData,
                  status:
                    e.target.value,
                })
              }
              className="w-full border rounded-xl px-4 py-3"
            >
              <option value="ACTIVE">
                ACTIVE
              </option>
  
              <option value="INACTIVE">
                INACTIVE
              </option>
            </select>
  
          </div>
  
          <div className="flex justify-end gap-4 px-8 py-6 border-t">
  
            <button
              onClick={onClose}
            >
              Cancel
            </button>
  
            <button
              onClick={handleSubmit}
              className="bg-black text-white px-6 py-3 rounded-xl"
            >
              Save Vendor
            </button>
  
          </div>
  
        </div>
  
      </div>
    );
  };
  
  export default VendorModal;