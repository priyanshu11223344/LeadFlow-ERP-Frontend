import React, {
    useEffect,
    useState,
  } from "react";
  
  import { X } from "lucide-react";
  
  import {
    useGetDispatches,
  } from "../../features/dispatch/dispatchHooks";
  
  import {
    useCreateInvoice,
  } from "../../features/invoices/invoiceHooks";
  
  const InvoiceModal = ({
    isOpen,
    onClose,
  }) => {
    const {
      data: dispatchData,
    } = useGetDispatches();
  
    const createInvoiceMutation =
      useCreateInvoice();
  
    const dispatches =
      dispatchData?.data || [];
  
    const [dispatchId, setDispatchId] =
      useState("");
  
    const [orderId, setOrderId] =
      useState("");
      const [orderNumber, setOrderNumber] =
      useState("");
    const [dueDate, setDueDate] =
      useState("");
  
    useEffect(() => {
      if (!dispatchId) return;
  
      const selectedDispatch =
        dispatches.find(
          (dispatch) =>
            dispatch._id === dispatchId
        );
  
        if (selectedDispatch) {
            setOrderId(
              selectedDispatch.orderId?._id
            );
          
            setOrderNumber(
              selectedDispatch.orderId?.poNumber ||
                ""
            );
          }
    }, [dispatchId, dispatches]);
  
    if (!isOpen) return null;
  
    const handleSubmit =
      async () => {
        try {
          if (
            !dispatchId ||
            !orderId ||
            !dueDate
          ) {
            alert(
              "Please fill all fields"
            );
            return;
          }
  
          await createInvoiceMutation.mutateAsync(
            {
              orderId,
              dispatchId,
              dueDate,
            }
          );
  
          onClose();
  
          setDispatchId("");
          setOrderId("");
          setOrderNumber("");
          setDueDate("");
        } catch (error) {
          alert(
            error?.response?.data
              ?.message ||
              "Failed to create invoice"
          );
        }
      };
  
    return (
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 p-4">
  
        <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl">
  
          {/* HEADER */}
  
          <div className="flex justify-between items-center px-8 py-6 border-b border-gray-100">
  
            <div>
              <h2 className="text-xl font-bold">
                Create Invoice
              </h2>
  
              <p className="text-sm text-gray-500">
                Generate a new invoice
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
  
            {/* DISPATCH */}
  
            <div>
              <label className="block text-xs font-bold uppercase text-gray-600 mb-2">
  
                Dispatch
  
              </label>
  
              <select
                value={dispatchId}
                onChange={(e) =>
                  setDispatchId(
                    e.target.value
                  )
                }
                className="w-full border border-gray-200 rounded-xl px-4 py-3"
              >
  
                <option value="">
                  Select Dispatch
                </option>
  
                {dispatches.map(
                  (dispatch) => (
                    <option
                      key={
                        dispatch._id
                      }
                      value={
                        dispatch._id
                      }
                    >
                      {
                        dispatch.dispatchNumber
                      }
                    </option>
                  )
                )}
  
              </select>
  
            </div>
  
            {/* ORDER */}
  
            <div>
  
              <label className="block text-xs font-bold uppercase text-gray-600 mb-2">
  
                Order
  
              </label>
  
              <input
                value={orderNumber}
                readOnly
                className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-gray-50"
              />
  
            </div>
  
            {/* DUE DATE */}
  
            <div>
  
              <label className="block text-xs font-bold uppercase text-gray-600 mb-2">
  
                Due Date
  
              </label>
  
              <input
                type="date"
                value={dueDate}
                onChange={(e) =>
                  setDueDate(
                    e.target.value
                  )
                }
                className="w-full border border-gray-200 rounded-xl px-4 py-3"
              />
  
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
              onClick={handleSubmit}
              disabled={
                createInvoiceMutation.isPending
              }
              className="bg-black text-white px-6 py-3 rounded-xl font-semibold"
            >
              Create Invoice
            </button>
  
          </div>
  
        </div>
  
      </div>
    );
  };
  
  export default InvoiceModal;