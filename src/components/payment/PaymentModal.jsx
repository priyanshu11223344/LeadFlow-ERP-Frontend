import React, {
    useEffect,
    useState,
  } from "react";
  
  import { X } from "lucide-react";
  
  import {
    useGetInvoices,
  } from "../../features/invoices/invoiceHooks";
  
  import {
    useCreatePayment,
  } from "../../features/payments/paymentHooks";
  
  const PaymentModal = ({
    isOpen,
    onClose,
  }) => {
    const {
      data: invoicesData,
    } = useGetInvoices();
  
    const createPaymentMutation =
      useCreatePayment();
  
    const invoices =
      invoicesData?.data || [];
  
    const unpaidInvoices =
      invoices.filter(
        (invoice) =>
          invoice.status !== "PAID"
      );
  
    const [invoiceId, setInvoiceId] =
      useState("");
  
    const [amount, setAmount] =
      useState("");
  
    const [
      paymentMethod,
      setPaymentMethod,
    ] = useState(
      "BANK_TRANSFER"
    );
  
    const [
      referenceNumber,
      setReferenceNumber,
    ] = useState("");
  
    const [dueAmount, setDueAmount] =
      useState(0);
  
    const [
      invoiceNumber,
      setInvoiceNumber,
    ] = useState("");
  
    useEffect(() => {
      if (!invoiceId) return;
  
      const selectedInvoice =
        unpaidInvoices.find(
          (invoice) =>
            invoice._id === invoiceId
        );
  
      if (selectedInvoice) {
        setDueAmount(
          selectedInvoice.dueAmount
        );
  
        setInvoiceNumber(
          selectedInvoice.invoiceNumber
        );
      }
    }, [
      invoiceId,
      unpaidInvoices,
    ]);
  
    if (!isOpen) return null;
  
    const resetForm = () => {
      setInvoiceId("");
      setAmount("");
      setPaymentMethod(
        "BANK_TRANSFER"
      );
      setReferenceNumber("");
      setDueAmount(0);
      setInvoiceNumber("");
    };
  
    const handleClose = () => {
      resetForm();
      onClose();
    };
  
    const handleSubmit =
      async () => {
        try {
          if (
            !invoiceId ||
            !amount
          ) {
            alert(
              "Please fill all required fields"
            );
            return;
          }
  
          await createPaymentMutation.mutateAsync(
            {
              invoiceId,
              amount:
                Number(amount),
              paymentMethod,
              referenceNumber,
            }
          );
  
          handleClose();
        } catch (error) {
          alert(
            error?.response?.data
              ?.message ||
              "Failed to create payment"
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
                Record Payment
              </h2>
  
              <p className="text-sm text-gray-500">
                Record customer payment
              </p>
            </div>
  
            <button
              onClick={
                handleClose
              }
            >
              <X className="w-5 h-5" />
            </button>
  
          </div>
  
          {/* BODY */}
  
          <div className="p-8 space-y-6">
  
            {/* INVOICE */}
  
            <div>
  
              <label className="block text-xs font-bold uppercase text-gray-600 mb-2">
                Invoice
              </label>
  
              <select
                value={invoiceId}
                onChange={(e) =>
                  setInvoiceId(
                    e.target.value
                  )
                }
                className="w-full border border-gray-200 rounded-xl px-4 py-3"
              >
  
                <option value="">
                  Select Invoice
                </option>
  
                {unpaidInvoices.map(
                  (invoice) => (
                    <option
                      key={
                        invoice._id
                      }
                      value={
                        invoice._id
                      }
                    >
                      {
                        invoice.invoiceNumber
                      }
                    </option>
                  )
                )}
  
              </select>
  
            </div>
  
            {/* DUE AMOUNT */}
  
            <div>
  
              <label className="block text-xs font-bold uppercase text-gray-600 mb-2">
                Due Amount
              </label>
  
              <input
                value={`₹${Number(
                  dueAmount
                ).toLocaleString()}`}
                readOnly
                className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-gray-50"
              />
  
            </div>
  
            {/* PAYMENT AMOUNT */}
  
            <div>
  
              <label className="block text-xs font-bold uppercase text-gray-600 mb-2">
                Payment Amount
              </label>
  
              <input
                type="number"
                value={amount}
                onChange={(e) =>
                  setAmount(
                    e.target.value
                  )
                }
                className="w-full border border-gray-200 rounded-xl px-4 py-3"
              />
  
            </div>
  
            {/* PAYMENT METHOD */}
  
            <div>
  
              <label className="block text-xs font-bold uppercase text-gray-600 mb-2">
                Payment Method
              </label>
  
              <select
                value={
                  paymentMethod
                }
                onChange={(e) =>
                  setPaymentMethod(
                    e.target.value
                  )
                }
                className="w-full border border-gray-200 rounded-xl px-4 py-3"
              >
                <option value="BANK_TRANSFER">
                  BANK TRANSFER
                </option>
  
                <option value="UPI">
                  UPI
                </option>
  
                <option value="CASH">
                  CASH
                </option>
  
                <option value="CHEQUE">
                  CHEQUE
                </option>
              </select>
  
            </div>
  
            {/* REFERENCE */}
  
            <div>
  
              <label className="block text-xs font-bold uppercase text-gray-600 mb-2">
                Reference Number
              </label>
  
              <input
                value={
                  referenceNumber
                }
                onChange={(e) =>
                  setReferenceNumber(
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
              onClick={
                handleClose
              }
              className="text-gray-600"
            >
              Cancel
            </button>
  
            <button
              onClick={
                handleSubmit
              }
              disabled={
                createPaymentMutation.isPending
              }
              className="bg-black text-white px-6 py-3 rounded-xl font-semibold"
            >
              Record Payment
            </button>
  
          </div>
  
        </div>
  
      </div>
    );
  };
  
  export default PaymentModal;