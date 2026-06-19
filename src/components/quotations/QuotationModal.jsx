import React, { useState, useMemo } from "react";
import { X, Trash2, Calendar, Search, FileText } from "lucide-react";
import { useGetInventory } from "../../features/inventory/inventoryHooks";
import { useCreateQuotation } from "../../features/quotations/quotationHooks";

const QuotationModal = ({ lead, onClose }) => {
    const { data: inventoryData } = useGetInventory();
    const createQuotationMutation = useCreateQuotation();

    const inventory = inventoryData?.data || [];

    const [searchTerm, setSearchTerm] = useState("");
    const [selectedItems, setSelectedItems] = useState([]);
    const [validityDate, setValidityDate] = useState("");
    const [termsAndConditions, setTermsAndConditions] = useState("");
    const [recipientEmail, setRecipientEmail] = useState(
        lead?.email || ""
    );
    const quotationSummary = useMemo(() => {
        let subTotal = 0;
        let totalDiscount = 0;
        let totalTax = 0;

        selectedItems.forEach((item) => {
            const lineAmount =
                item.quantity * item.unitPrice;

            const discountAmount =
                (lineAmount * item.discountPercent) / 100;

            const taxableAmount =
                lineAmount - discountAmount;

            const taxAmount =
                (taxableAmount * item.gstPercent) / 100;

            subTotal += lineAmount;
            totalDiscount += discountAmount;
            totalTax += taxAmount;
        });

        return {
            subTotal,
            totalDiscount,
            totalTax,
            grandTotal:
                subTotal -
                totalDiscount +
                totalTax,
        };
    }, [selectedItems]);
    const payload = {
        leadId: lead._id,
        recipientEmail,
        validityDate,
        termsAndConditions,

        items: selectedItems.map(
            (item) => {
                const lineAmount =
                    item.quantity *
                    item.unitPrice;

                const discountAmount =
                    (lineAmount *
                        item.discountPercent) /
                    100;

                const taxableAmount =
                    lineAmount -
                    discountAmount;

                const taxAmount =
                    (taxableAmount *
                        item.gstPercent) /
                    100;

                return {
                    inventoryId:
                        item.inventoryId,
                    itemName: item.itemName,
                    sku: item.sku,
                    quantity: item.quantity,
                    unitPrice: item.unitPrice,
                    discountPercent:
                        item.discountPercent,
                    discountAmount,
                    gstPercent:
                        item.gstPercent,
                    taxableAmount,
                    totalAmount:
                        taxableAmount +
                        taxAmount,
                };
            }
        ),

        subTotal:
            quotationSummary.subTotal,

        totalDiscount:
            quotationSummary.totalDiscount,

        totalTax:
            quotationSummary.totalTax,

        grandTotal:
            quotationSummary.grandTotal,
    };
    const handleCreateQuotation =
        async () => {
            if (selectedItems.length === 0) {
                return;
            }

            if (!validityDate) {
                return;
            }
            if (!recipientEmail.trim()) {
                return;
            }
            try {
                await createQuotationMutation.mutateAsync(
                    payload
                );

                onClose();
            } catch (error) {
                console.log(error);
            }
        };

    const filteredInventory = useMemo(() => {
        if (!searchTerm) {
            return [];
        }
        return inventory.filter((item) =>
            item.itemName?.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [searchTerm, inventory]);

    const addInventoryItem = (item) => {
        const alreadyExists = selectedItems.find(
            (selected) => selected.inventoryId === item._id
        );

        if (alreadyExists) {
            return;
        }

        setSelectedItems([
            ...selectedItems,
            {
                inventoryId: item._id,
                itemName: item.itemName,
                sku: item.sku,
                quantity: 1,
                unitPrice: item.price,
                discountPercent: 0,
                gstPercent: 18,
            },
        ]);

        setSearchTerm("");
    };

    return (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-[100] p-4 animate-fade-in">
            <div className="bg-white w-full max-w-5xl rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] border border-slate-100">

                {/* HEADER */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-slate-50/50">
                    <div>
                        <h2 className="text-xl font-semibold text-slate-800 tracking-tight">
                            Create Quotation
                        </h2>
                        <p className="text-xs font-medium text-indigo-600 mt-0.5">
                            {lead?.companyName || "No Company Specified"}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors focus:outline-none"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* BODY (Scrollable if content overflows) */}
                <div className="p-6 overflow-y-auto space-y-6 custom-scrollbar">

                    {/* LEAD INFO */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                                Lead Name
                            </label>
                            <input
                                disabled
                                value={lead?.name || ""}
                                className="w-full border border-slate-200 rounded-lg p-2.5 bg-slate-50 text-slate-600 font-medium shadow-sm cursor-not-allowed"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                                Company
                            </label>
                            <input
                                disabled
                                value={lead?.companyName || ""}
                                className="w-full border border-slate-200 rounded-lg p-2.5 bg-slate-50 text-slate-600 font-medium shadow-sm cursor-not-allowed"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                                Recipient Email
                            </label>
                            <input
                                type="email"
                                required
                                value={recipientEmail}
                                onChange={(e) => setRecipientEmail(e.target.value)}
                                className="w-full border border-slate-200 rounded-lg p-2.5 text-slate-700 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all outline-none"
                                placeholder="customer@example.com"
                            />
                        </div>
                    </div>

                    {/* VALIDITY DATE */}
                    <div className="max-w-md">
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                            Validity Date
                        </label>
                        <div className="relative flex items-center">
                            <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none z-10" />
                            <input
                                type="date"
                                value={validityDate}
                                onChange={(e) => setValidityDate(e.target.value)}
                                className="w-full border border-slate-200 rounded-lg p-2.5 pl-10 pr-3 text-slate-700 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all outline-none"
                            />
                        </div>
                    </div>

                    {/* SEARCH INVENTORY */}
                    <div className="relative">
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                            Search Product
                        </label>
                        <div className="relative flex items-center">
                            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none z-10" />
                            <input
                                type="text"
                                placeholder="Type item name to search..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full border border-slate-200 rounded-lg p-2.5 pl-10 pr-3 text-slate-700 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all outline-none"
                            />
                        </div>

                        {/* DROPDOWN RESULTS */}
                        {filteredInventory.length > 0 && (
                            <div className="absolute top-full mt-1 left-0 w-full z-50 border border-slate-200 bg-white rounded-lg max-h-60 overflow-y-auto shadow-xl">
                                {filteredInventory.map((item) => (
                                    <button
                                        key={item._id}
                                        type="button"
                                        onClick={() => addInventoryItem(item)}
                                        className="w-full text-left p-3 hover:bg-slate-50 flex items-center justify-between transition-colors group"
                                    >
                                        <div>
                                            <div className="font-medium text-slate-700 group-hover:text-indigo-600 transition-colors">
                                                {item.itemName}
                                            </div>
                                            <div className="text-xs text-slate-400 mt-0.5">
                                                SKU: <span className="font-mono text-slate-500">{item.sku}</span>
                                            </div>
                                        </div>
                                        <div className="text-right text-xs text-slate-500 font-medium patches-wrapper">
                                            <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-600 mr-2">
                                                Stock: {item.quantity}
                                            </span>
                                            <span className="text-slate-700 font-semibold">
                                                ₹{item.price?.toLocaleString()}
                                            </span>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* SELECTED ITEMS TABLE */}
                    {selectedItems.length > 0 ? (
                        <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                            <div className="bg-slate-50/70 px-4 py-3 border-b border-slate-200 flex items-center gap-2">
                                <FileText className="w-4 h-4 text-slate-500" />
                                <span className="font-semibold text-sm text-slate-700">Selected Products</span>
                                <span className="ml-auto bg-indigo-50 text-indigo-700 text-xs px-2 py-0.5 rounded-full font-medium">
                                    {selectedItems.length} {selectedItems.length === 1 ? 'item' : 'items'}
                                </span>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full border-collapse">
                                    <thead>
                                        <tr className="border-b border-slate-200 bg-slate-50/50 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                            <th className="text-left px-5 py-3">Product Details</th>
                                            <th className="text-center px-4 py-3 w-32">Qty</th>
                                            <th className="text-right px-4 py-3">Unit Price</th>
                                            <th className="text-center px-4 py-3 w-32">Discount %</th>
                                            <th className="text-right px-4 py-3">
                                                Total
                                            </th>

                                            <th className="text-center px-5 py-3 w-20">Action</th>

                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 text-sm">
                                        {selectedItems.map((item, index) => (
                                            <tr key={index} className="hover:bg-slate-50/50 transition-colors">
                                                <td className="px-5 py-3.5">
                                                    <div className="font-medium text-slate-700">{item.itemName}</div>
                                                    <div className="text-xs text-slate-400 font-mono mt-0.5">{item.sku}</div>
                                                </td>

                                                <td className="px-4 py-3.5 text-center">
                                                    <input
                                                        type="number"
                                                        min="1"
                                                        value={item.quantity}
                                                        onChange={(e) => {
                                                            const updated = [...selectedItems];
                                                            updated[index].quantity = Number(e.target.value);
                                                            setSelectedItems(updated);
                                                        }}
                                                        className="w-20 border border-slate-200 rounded-md p-1.5 text-center text-slate-700 shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all"
                                                    />
                                                </td>

                                                <td className="px-4 py-3.5 text-right font-medium text-slate-700">
                                                    ₹{item.unitPrice?.toLocaleString()}
                                                </td>

                                                <td className="px-4 py-3.5 text-center">
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        max="100"
                                                        value={item.discountPercent}
                                                        onChange={(e) => {
                                                            const updated = [...selectedItems];
                                                            updated[index].discountPercent = Number(e.target.value);
                                                            setSelectedItems(updated);
                                                        }}
                                                        className="w-20 border border-slate-200 rounded-md p-1.5 text-center text-slate-700 shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all"
                                                    />
                                                </td>
                                                <td className="px-4 py-3.5 text-right font-semibold text-slate-700">
                                                    ₹
                                                    {(
                                                        (
                                                            item.quantity *
                                                            item.unitPrice
                                                        ) -
                                                        (
                                                            item.quantity *
                                                            item.unitPrice *
                                                            item.discountPercent
                                                        ) /
                                                        100
                                                    ).toLocaleString()}
                                                </td>
                                                <td className="px-5 py-3.5 text-center">
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setSelectedItems(
                                                                selectedItems.filter((_, i) => i !== index)
                                                            );
                                                        }}
                                                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-all group"
                                                        title="Remove item"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                {/* TERMS & CONDITIONS */}
                                <div className="p-5 border-t border-slate-200">
                                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                                        Terms & Conditions
                                    </label>

                                    <textarea
                                        rows={4}
                                        value={termsAndConditions}
                                        onChange={(e) =>
                                            setTermsAndConditions(e.target.value)
                                        }
                                        className="w-full border border-slate-200 rounded-lg p-3"
                                        placeholder="Enter quotation terms..."
                                    />
                                </div>

                                <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
                                    <div className="space-y-2">

                                        <div className="flex justify-between">
                                            <span>Sub Total</span>
                                            <span>
                                                ₹{quotationSummary.subTotal.toLocaleString()}
                                            </span>
                                        </div>

                                        <div className="flex justify-between">
                                            <span>Total Discount</span>
                                            <span>
                                                ₹{quotationSummary.totalDiscount.toLocaleString()}
                                            </span>
                                        </div>

                                        <div className="flex justify-between">
                                            <span>Total GST</span>
                                            <span>
                                                ₹{quotationSummary.totalTax.toLocaleString()}
                                            </span>
                                        </div>

                                        <div className="border-t pt-3 flex justify-between font-bold text-lg">
                                            <span>Grand Total</span>
                                            <span className="text-indigo-600">
                                                ₹{quotationSummary.grandTotal.toLocaleString()}
                                            </span>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center bg-slate-50/30">
                            <p className="text-sm text-slate-400 font-medium">
                                No products selected yet. Use the search bar above to add items.
                            </p>
                        </div>
                    )}
                </div>
                <div className="border-t p-4 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 border rounded-lg"
                    >
                        Cancel
                    </button>

                    <button
  onClick={handleCreateQuotation}
  disabled={createQuotationMutation.isPending}
  className="
    px-5
    py-2.5
    bg-indigo-600
    hover:bg-indigo-700
    !text-white
    font-semibold
    rounded-lg
    shadow-sm
    transition
    disabled:opacity-50
    disabled:cursor-not-allowed
  "
>
  {createQuotationMutation.isPending
    ? "Creating..."
    : "Create Quotation"}
</button>
                </div>
            </div>
        </div>
    );
};

export default QuotationModal;
