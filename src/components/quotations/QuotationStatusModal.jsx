import React, {
    useState,
    useEffect,
  } from "react";
  
  import { X } from "lucide-react";
  
  import {
    useUpdateQuotationStatus,
  } from "../../features/quotations/quotationHooks";
  
  const statuses = [
    "DRAFT",
    "SENT",
    "NEGOTIATION",
    "APPROVED",
    "REJECTED",
  ];
  
  const QuotationStatusModal = ({
    isOpen,
    onClose,
    quotation,
  }) => {
    const updateStatusMutation =
      useUpdateQuotationStatus();
  
    const [status, setStatus] =
      useState("");
  
    useEffect(() => {
      if (quotation) {
        setStatus(
          quotation.status
        );
      }
    }, [quotation]);
  
    if (
      !isOpen ||
      !quotation
    )
      return null;
  
    const handleUpdate =
      async () => {
        try {
          await updateStatusMutation.mutateAsync(
            {
              id: quotation._id,
              status,
            }
          );
  
          onClose();
        } catch (error) {
          console.log(error);
        }
      };
  
    return (
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 p-4">
  
        <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl">
  
          {/* HEADER */}
          <div className="flex justify-between items-center px-8 py-6 border-b border-gray-100">
  
            <div>
              <h2 className="text-xl font-bold">
                Update Status
              </h2>
  
              <p className="text-sm text-gray-500">
                {
                  quotation.quotationNumber
                }
              </p>
            </div>
  
            <button
              onClick={onClose}
            >
              <X className="w-5 h-5" />
            </button>
  
          </div>
  
          {/* BODY */}
          <div className="p-8 space-y-6">
  
            <div>
              <label className="block text-xs font-bold uppercase text-gray-600 mb-2">
                Current Status
              </label>
  
              <input
                readOnly
                value={
                  quotation.status
                }
                className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-gray-50"
              />
            </div>
  
            <div>
              <label className="block text-xs font-bold uppercase text-gray-600 mb-2">
                New Status
              </label>
  
              <select
                value={status}
                onChange={(e) =>
                  setStatus(
                    e.target.value
                  )
                }
                className="w-full border border-gray-200 rounded-xl px-4 py-3"
              >
                {statuses.map(
                  (s) => (
                    <option
                      key={s}
                      value={s}
                    >
                      {s}
                    </option>
                  )
                )}
              </select>
            </div>
  
          </div>
  
          {/* FOOTER */}
          <div className="flex justify-end gap-4 px-8 py-6 border-t border-gray-100">
  
            <button
              onClick={onClose}
              className="text-gray-600"
            >
              Cancel
            </button>
  
            <button
              onClick={
                handleUpdate
              }
              disabled={
                updateStatusMutation.isPending
              }
              className="bg-black text-white px-6 py-3 rounded-xl font-semibold"
            >
              Update Status
            </button>
  
          </div>
  
        </div>
  
      </div>
    );
  };
  
  export default QuotationStatusModal;