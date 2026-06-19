import React, {
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  Plus,
  Trash2,
  X,
} from "lucide-react";

import {
  useGetClients,
} from "../../features/clients/clientHooks";
import {
  useGetInventory,
} from "../../features/inventory/inventoryHooks";
import {
  useGetQuotations,
} from "../../features/quotations/quotationHooks";
import {
  useCreateOrder,
  useUpdateOrder,
} from "../../features/orders/orderHooks";

const emptyItem = () => ({
  inventoryId: "",
  itemName: "",
  sku: "",
  quantity: 1,
  price: 0,
  discountPercent: 0,
  source: "ADDED",
});

const getReferenceId = (reference) =>
  typeof reference === "object"
    ? reference?._id
    : reference;

const NewOrderModal = ({
  isOpen,
  onClose,
  order = null,
}) => {
  const {
    data: clientsData,
  } = useGetClients();
  const {
    data: quotationsData,
  } = useGetQuotations();
  const {
    data: inventoryData,
  } = useGetInventory();
  const createOrderMutation =
    useCreateOrder();
  const updateOrderMutation =
    useUpdateOrder();
  const isEditing = !!order;

  const clients =
    clientsData?.data || [];
  const quotations =
    quotationsData?.data || [];
  const inventory =
    inventoryData?.data || [];

  const [selectedClient, setSelectedClient] =
    useState("");
  const [
    selectedQuotation,
    setSelectedQuotation,
  ] = useState("");
  const [items, setItems] =
    useState([]);
  const [
    discountPercent,
    setDiscountPercent,
  ] = useState(0);
  const [
    cgstPercent,
    setCgstPercent,
  ] = useState(0);
  const [
    sgstPercent,
    setSgstPercent,
  ] = useState(0);
  const [
    igstPercent,
    setIgstPercent,
  ] = useState(0);
  const [dueDate, setDueDate] =
    useState("");

  const selectedClientData =
    clients.find(
      (client) =>
        client._id ===
        selectedClient
    );
  const selectedQuotationData =
    quotations.find(
      (quotation) =>
        quotation._id ===
        selectedQuotation
    );
  const clientLeadId =
    getReferenceId(
      selectedClientData?.leadId
    );
  const gstNumber =
    selectedClientData?.leadId
      ?.gstNumber ||
    selectedClientData?.gstNumber ||
    "";

  const clientQuotations =
    quotations.filter(
      (quotation) =>
        getReferenceId(
          quotation.leadId
        ) === clientLeadId
    );

  const poNumber =
    useMemo(
      () =>
        order?.poNumber ||
        `PO-${Date.now()}`,
      [isOpen, order]
    );

  useEffect(() => {
    if (isEditing) return;

    setSelectedQuotation("");
    setItems([]);
  }, [selectedClient, isEditing]);

  useEffect(() => {
    if (isEditing) return;

    if (!selectedQuotationData) {
      setItems([]);
      return;
    }

    setItems(
      selectedQuotationData.items.map(
        (item) => ({
          inventoryId:
            getReferenceId(
              item.inventoryId
            ) || "",
          itemName:
            item.itemName,
          sku: item.sku || "",
          quantity:
            Number(item.quantity) || 1,
          price:
            Number(item.unitPrice) || 0,
          discountPercent:
            Number(
              item.discountPercent
            ) || 0,
          source: "QUOTATION",
        })
      )
    );
  }, [
    selectedQuotationData,
    isEditing,
  ]);

  useEffect(() => {
    if (!isOpen || !order) {
      return;
    }

    setSelectedClient(
      getReferenceId(order.clientId) ||
      ""
    );
    setSelectedQuotation(
      getReferenceId(
        order.quotationId
      ) || ""
    );
    setItems(
      (order.items || []).map(
        (item) => ({
          inventoryId:
            getReferenceId(
              item.inventoryId
            ) || "",
          itemName:
            item.itemName,
          sku: item.sku,
          quantity:
            Number(item.quantity) || 1,
          price:
            Number(item.price) || 0,
          discountPercent:
            Number(
              item.discountPercent
            ) || 0,
          source: "ORDER",
        })
      )
    );
    setDiscountPercent(
      Number(
        order.discountPercent
      ) || 0
    );
    setCgstPercent(
      Number(order.cgstPercent) ||
      0
    );
    setSgstPercent(
      Number(order.sgstPercent) ||
      0
    );
    setIgstPercent(
      Number(order.igstPercent) ||
      0
    );
  }, [isOpen, order]);

  const totals = useMemo(() => {
    const subTotal =
      items.reduce(
        (sum, item) =>
          sum +
          (
            Number(item.quantity) ||
            0
          ) *
          (
            Number(item.price) ||
            0
          ),
        0
      );
    const lineDiscount =
      items.reduce(
        (sum, item) => {
          const amount =
            (
              Number(item.quantity) ||
              0
            ) *
            (
              Number(item.price) ||
              0
            );

          return (
            sum +
            amount *
            (
              Number(
                item.discountPercent
              ) || 0
            ) /
            100
          );
        },
        0
      );
    const afterLineDiscount =
      subTotal - lineDiscount;
    const orderDiscount =
      afterLineDiscount *
      (
        Number(discountPercent) ||
        0
      ) /
      100;
    const taxableAmount =
      afterLineDiscount -
      orderDiscount;
    const cgstAmount =
      taxableAmount *
      (
        Number(cgstPercent) ||
        0
      ) /
      100;
    const sgstAmount =
      taxableAmount *
      (
        Number(sgstPercent) ||
        0
      ) /
      100;
    const igstAmount =
      taxableAmount *
      (
        Number(igstPercent) ||
        0
      ) /
      100;

    return {
      subTotal,
      lineDiscount,
      orderDiscount,
      totalDiscount:
        lineDiscount +
        orderDiscount,
      taxableAmount,
      cgstAmount,
      sgstAmount,
      igstAmount,
      grandTotal:
        taxableAmount +
        cgstAmount +
        sgstAmount +
        igstAmount,
    };
  }, [
    items,
    discountPercent,
    cgstPercent,
    sgstPercent,
    igstPercent,
  ]);

  if (!isOpen) return null;

  const updateItem = (
    index,
    field,
    value
  ) => {
    setItems((current) =>
      current.map((item, itemIndex) =>
        itemIndex === index
          ? {
              ...item,
              [field]: value,
            }
          : item
      )
    );
  };

  const selectInventoryItem = (
    index,
    inventoryId
  ) => {
    const inventoryItem =
      inventory.find(
        (item) =>
          item._id ===
          inventoryId
      );

    setItems((current) =>
      current.map((item, itemIndex) =>
        itemIndex === index
          ? inventoryItem
            ? {
                ...item,
                inventoryId:
                  inventoryItem._id,
                itemName:
                  inventoryItem.itemName,
                sku:
                  inventoryItem.sku,
                price:
                  Number(
                    inventoryItem.price
                  ) || 0,
              }
            : emptyItem()
          : item
      )
    );
  };

  const resetAndClose = () => {
    setSelectedClient("");
    setSelectedQuotation("");
    setItems([]);
    setDiscountPercent(0);
    setCgstPercent(0);
    setSgstPercent(0);
    setIgstPercent(0);
    setDueDate("");
    onClose();
  };

  const handleSaveOrder =
    async () => {
      if (
        !selectedClient ||
        !selectedQuotation
      ) {
        alert(
          "Please select a client and quotation"
        );
        return;
      }

      if (
        items.length === 0 ||
        items.some(
          (item) =>
            !item.itemName ||
            !item.sku ||
            Number(item.quantity) <= 0
        )
      ) {
        alert(
          "Please complete every order item"
        );
        return;
      }

      if (
        Number(igstPercent) > 0 &&
        (
          Number(cgstPercent) > 0 ||
          Number(sgstPercent) > 0
        )
      ) {
        alert(
          "Use either IGST or CGST/SGST, not both"
        );
        return;
      }

      try {
        const orderPayload = {
              clientId:
                selectedClient,
              dealId:
                getReferenceId(
                  selectedQuotationData
                    ?.dealId
                ),
              quotationId:
                selectedQuotation,
              poNumber,
              dueDate:
                dueDate || undefined,
              discountPercent:
                Number(
                  discountPercent
                ) || 0,
              cgstPercent:
                Number(cgstPercent) ||
                0,
              sgstPercent:
                Number(sgstPercent) ||
                0,
              igstPercent:
                Number(igstPercent) ||
                0,
              items: items.map(
                (item) => ({
                  inventoryId:
                    item.inventoryId ||
                    undefined,
                  itemName:
                    item.itemName,
                  sku: item.sku,
                  quantity:
                    Number(
                      item.quantity
                    ),
                  price:
                    Number(item.price),
                  discountPercent:
                    Number(
                      item.discountPercent
                    ) || 0,
                })
              ),
            };
        const result =
          isEditing
            ? await updateOrderMutation.mutateAsync(
                {
                  id: order._id,
                  data:
                    orderPayload,
                }
              )
            : await createOrderMutation.mutateAsync(
                orderPayload
              );

        alert(
          result?.message ||
          (
            isEditing
              ? "Order and invoice updated successfully"
              : "Order and invoice created successfully"
          )
        );
        resetAndClose();
      } catch (error) {
        alert(
          error?.response?.data
            ?.message ||
          (
            isEditing
              ? "Failed to update order"
              : "Failed to create order and invoice"
          )
        );
      }
    };

  const money = (value) =>
    `₹${Number(value || 0).toLocaleString(
      "en-IN",
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }
    )}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
      <div className="flex max-h-[92vh] w-full max-w-6xl flex-col overflow-hidden rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-gray-100 px-8 py-5">
          <div>
            <h3 className="text-xl font-bold text-gray-950">
              {isEditing
                ? `Edit Order ${poNumber}`
                : "New Purchase Order"}
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {isEditing
                ? "Update items, pricing, discounts, and GST before fulfillment begins."
                : "Quotation items and pricing are loaded automatically."}
            </p>
          </div>
          <button
            type="button"
            onClick={resetAndClose}
            className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
            aria-label="Close new order"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-7 overflow-y-auto p-8">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-4">
            <label className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wide text-gray-600">
                Client *
              </span>
              <select
                value={selectedClient}
                onChange={(event) =>
                  setSelectedClient(
                    event.target.value
                  )
                }
                disabled={isEditing}
                className="w-full rounded-xl border border-gray-200 px-4 py-3"
              >
                <option value="">
                  Select client
                </option>
                {clients.map((client) => (
                  <option
                    key={client._id}
                    value={client._id}
                  >
                    {client.clientName}
                  </option>
                ))}
              </select>
            </label>

            <label className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wide text-gray-600">
                Quotation *
              </span>
              <select
                value={selectedQuotation}
                onChange={(event) =>
                  setSelectedQuotation(
                    event.target.value
                  )
                }
                disabled={
                  isEditing ||
                  !selectedClient
                }
                className="w-full rounded-xl border border-gray-200 px-4 py-3 disabled:bg-gray-50"
              >
                <option value="">
                  Select quotation
                </option>
                {clientQuotations.map(
                  (quotation) => (
                    <option
                      key={quotation._id}
                      value={quotation._id}
                    >
                      {quotation.quotationNumber}
                      {" — "}
                      {money(
                        quotation.grandTotal
                      )}
                    </option>
                  )
                )}
              </select>
            </label>

            <label className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wide text-gray-600">
                GST Number
              </span>
              <input
                value={gstNumber}
                readOnly
                placeholder="Not available on lead"
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm"
              />
            </label>

            <label className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wide text-gray-600">
                Invoice Due Date
              </span>
              <input
                type="date"
                value={dueDate}
                onChange={(event) =>
                  setDueDate(
                    event.target.value
                  )
                }
                className="w-full rounded-xl border border-gray-200 px-4 py-3"
              />
            </label>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-bold text-gray-950">
                  Order Items
                </h4>
                <p className="text-xs text-gray-500">
                  Quotation discounts are preserved and remain editable.
                </p>
              </div>
              <button
                type="button"
                onClick={() =>
                  setItems((current) => [
                    ...current,
                    emptyItem(),
                  ])
                }
                disabled={!selectedQuotation}
                className="flex items-center gap-2 rounded-lg bg-black px-4 py-2 text-xs font-bold text-white disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Plus className="h-4 w-4" />
                Add Item
              </button>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-gray-200">
              <table className="w-full min-w-[950px] text-left">
                <thead className="bg-gray-50 text-[10px] font-bold uppercase tracking-wider text-gray-500">
                  <tr>
                    <th className="px-4 py-3">
                      Item
                    </th>
                    <th className="px-4 py-3">
                      SKU
                    </th>
                    <th className="px-4 py-3 text-center">
                      Qty
                    </th>
                    <th className="px-4 py-3 text-right">
                      Price
                    </th>
                    <th className="px-4 py-3 text-center">
                      Discount %
                    </th>
                    <th className="px-4 py-3 text-right">
                      Net
                    </th>
                    <th className="w-14 px-4 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {items.length === 0 ? (
                    <tr>
                      <td
                        colSpan="7"
                        className="px-6 py-10 text-center text-sm text-gray-400"
                      >
                        Select a quotation to load its items.
                      </td>
                    </tr>
                  ) : (
                    items.map(
                      (item, index) => {
                        const gross =
                          Number(
                            item.quantity
                          ) *
                          Number(
                            item.price
                          );
                        const net =
                          gross -
                          gross *
                          Number(
                            item.discountPercent
                          ) /
                          100;

                        return (
                          <tr key={`${item.source}-${item.sku}-${index}`}>
                            <td className="px-4 py-3">
                              {item.source ===
                              "ADDED" ? (
                                <select
                                  value={
                                    item.inventoryId
                                  }
                                  onChange={(
                                    event
                                  ) =>
                                    selectInventoryItem(
                                      index,
                                      event
                                        .target
                                        .value
                                    )
                                  }
                                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                                >
                                  <option value="">
                                    Select inventory item
                                  </option>
                                  {inventory.map(
                                    (
                                      inventoryItem
                                    ) => (
                                      <option
                                        key={
                                          inventoryItem._id
                                        }
                                        value={
                                          inventoryItem._id
                                        }
                                      >
                                        {
                                          inventoryItem.itemName
                                        }
                                      </option>
                                    )
                                  )}
                                </select>
                              ) : (
                                <div>
                                  <div className="font-semibold text-gray-800">
                                    {item.itemName}
                                  </div>
                                  <div className="text-[10px] font-bold uppercase text-indigo-500">
                                    {item.source === "ORDER"
                                      ? "Existing order item"
                                      : "From quotation"}
                                  </div>
                                </div>
                              )}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-500">
                              {item.sku || "-"}
                            </td>
                            <td className="px-4 py-3">
                              <input
                                type="number"
                                min="1"
                                value={
                                  item.quantity
                                }
                                onChange={(
                                  event
                                ) =>
                                  updateItem(
                                    index,
                                    "quantity",
                                    event
                                      .target
                                      .value
                                  )
                                }
                                className="w-20 rounded-lg border border-gray-200 px-3 py-2 text-center"
                              />
                            </td>
                            <td className="px-4 py-3">
                              <input
                                type="number"
                                min="0"
                                value={
                                  item.price
                                }
                                onChange={(
                                  event
                                ) =>
                                  updateItem(
                                    index,
                                    "price",
                                    event
                                      .target
                                      .value
                                  )
                                }
                                className="ml-auto block w-28 rounded-lg border border-gray-200 px-3 py-2 text-right"
                              />
                            </td>
                            <td className="px-4 py-3">
                              <input
                                type="number"
                                min="0"
                                max="100"
                                value={
                                  item.discountPercent
                                }
                                onChange={(
                                  event
                                ) =>
                                  updateItem(
                                    index,
                                    "discountPercent",
                                    event
                                      .target
                                      .value
                                  )
                                }
                                className="mx-auto block w-20 rounded-lg border border-gray-200 px-3 py-2 text-center"
                              />
                            </td>
                            <td className="px-4 py-3 text-right font-bold text-gray-800">
                              {money(net)}
                            </td>
                            <td className="px-4 py-3">
                              <button
                                type="button"
                                onClick={() =>
                                  setItems(
                                    (
                                      current
                                    ) =>
                                      current.filter(
                                        (
                                          _,
                                          itemIndex
                                        ) =>
                                          itemIndex !==
                                          index
                                      )
                                  )
                                }
                                className="rounded-lg p-2 text-gray-400 hover:bg-red-50 hover:text-red-600"
                                title="Remove item"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </td>
                          </tr>
                        );
                      }
                    )
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="grid grid-cols-2 gap-4 rounded-2xl border border-gray-200 p-5 sm:grid-cols-4">
              {[
                [
                  "Order Discount %",
                  discountPercent,
                  setDiscountPercent,
                ],
                [
                  "CGST %",
                  cgstPercent,
                  setCgstPercent,
                ],
                [
                  "SGST %",
                  sgstPercent,
                  setSgstPercent,
                ],
                [
                  "IGST %",
                  igstPercent,
                  setIgstPercent,
                ],
              ].map(
                ([
                  label,
                  value,
                  setter,
                ]) => (
                  <label
                    key={label}
                    className="space-y-2"
                  >
                    <span className="text-[10px] font-bold uppercase text-gray-500">
                      {label}
                    </span>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={value}
                      onChange={(event) =>
                        setter(
                          event.target.value
                        )
                      }
                      className="w-full rounded-lg border border-gray-200 px-3 py-2"
                    />
                  </label>
                )
              )}
            </div>

            <div className="space-y-2 rounded-2xl bg-gray-950 p-5 text-sm text-white">
              {[
                [
                  "Subtotal",
                  totals.subTotal,
                ],
                [
                  "Total Discount",
                  -totals.totalDiscount,
                ],
                [
                  "Taxable Amount",
                  totals.taxableAmount,
                ],
                [
                  `CGST (${Number(cgstPercent) || 0}%)`,
                  totals.cgstAmount,
                ],
                [
                  `SGST (${Number(sgstPercent) || 0}%)`,
                  totals.sgstAmount,
                ],
                [
                  `IGST (${Number(igstPercent) || 0}%)`,
                  totals.igstAmount,
                ],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="flex justify-between text-gray-300"
                >
                  <span>{label}</span>
                  <span>{money(value)}</span>
                </div>
              ))}
              <div className="mt-3 flex justify-between border-t border-gray-700 pt-3 text-lg font-extrabold">
                <span>Grand Total</span>
                <span>
                  {money(
                    totals.grandTotal
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-gray-100 px-8 py-5">
          <p className="text-xs text-gray-500">
            Processing creates both the purchase order and its invoice.
          </p>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={resetAndClose}
              className="px-5 py-2.5 text-sm font-semibold text-gray-600"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSaveOrder}
              disabled={
                createOrderMutation.isPending ||
                updateOrderMutation.isPending
              }
              className="rounded-xl bg-black px-6 py-3 text-sm font-bold text-white disabled:cursor-wait disabled:opacity-50"
            >
              {createOrderMutation.isPending ||
              updateOrderMutation.isPending
                ? "Saving..."
                : isEditing
                  ? "Save Order Changes"
                  : "Create Order & Invoice"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewOrderModal;
