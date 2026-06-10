import React, { useState } from 'react';
import { Plus, X, Trash2 } from 'lucide-react'; // Added Trash2 icon
import {
  useGetInventory,
} from "../../features/inventory/inventoryHooks";

import {
  useGetClients,
} from "../../features/clients/clientHooks";
import DispatchModal from "../dispatch/DispatchModal";
import {
  useCreateOrder,
  useGetOrders,
} from "../../features/orders/orderHooks";
import {
  useGetDealsByLead,
} from "../../features/deals/dealHooks";
// --- NEW ORDER MODAL COMPONENT ---
const NewOrderModal = ({ isOpen, onClose }) => {


  const [selectedClient, setSelectedClient] =
    useState("");
    const [selectedDeal,
      setSelectedDeal] =
      useState("");
  const {
    data: clientsData,
  } = useGetClients();

  const clients =
    clientsData?.data || [];
    const selectedClientData =
  clients.find(
    (client) =>
      client._id ===
      selectedClient
  );
  const {
    data: dealsData,
  } = useGetDealsByLead(
    selectedClientData?.leadId
  );
  const {
    data: inventoryData,
  } = useGetInventory();
  const createOrderMutation =
    useCreateOrder();
  const inventory =
    inventoryData?.data || [];
  const getFilteredInventory = (
    searchTerm
  ) => {
    return inventory.filter((item) => {
      return (
        item.itemName
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        item.sku
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      );
    });
  };
  const poNumber =
    `PO-${Date.now()}`; // Simulated auto-generated PO
  const [items, setItems] = useState([
    {
      inventoryId: "",
      name: "",
      sku: "",
      quantity: 1,
      price: 0,

      searchTerm: "",
      showDropdown: false,
      showNewItemForm: false,

      newItemName: "",
      newItemSku: "",
      newItemPrice: 0,
    },
  ]);

  if (!isOpen) return null;

  const handleAddItem = () => {
    setItems([
      ...items,
      {
        inventoryId: "",
        name: "",
        sku: "",
        quantity: 1,
        price: 0,

        searchTerm: "",
        showDropdown: false,
        showNewItemForm: false,

        newItemName: "",
        newItemSku: "",
        newItemPrice: 0,
      },
    ]);
  };

  // NEW: Function to remove a specific item row
  const handleRemoveItem = (indexToRemove) => {
    setItems(items.filter((_, idx) => idx !== indexToRemove));
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...items];
    updatedItems[index][field] = value;
    setItems(updatedItems);
  };

  const handleCreateOrder =
    async () => {
      try {
        if (!selectedClient) {
          alert("Please select a client");
          return;
        }

        const invalidItem = items.find(
          (item) => !item.name
        );

        if (invalidItem) {
          alert(
            "Please select or request an item"
          );
          return;
        }
        await createOrderMutation.mutateAsync(
          {
            clientId:
              selectedClient,
              dealId:
              selectedDeal,
            poNumber,
            items: items.map(
              (item) => ({
                inventoryId:
                  item.inventoryId,

                itemName:
                  item.name,

                sku:
                  item.sku,

                quantity:
                  Number(
                    item.quantity
                  ),

                price:
                  Number(
                    item.price
                  ),
              })
            ),
          }
        );

        onClose();
      } catch (error) {
        console.log(error);
      }
    };
  // Calculate total price dynamically
  const orderTotal = items.reduce((sum, item) => {
    const qty = parseFloat(item.quantity) || 0;
    const prc = parseFloat(item.price) || 0;
    return sum + (qty * prc);
  }, 0);
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-xl overflow-hidden flex flex-col">

        {/* Header */}
        <div className="flex justify-between items-center px-8 py-6 border-b border-gray-100">
          <h3 className="text-xl font-bold text-gray-950">New Purchase Order</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5 stroke-[2.5px]" />
          </button>
        </div>

        {/* Content Form */}
        <div className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Top Inputs */}
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-700 tracking-wide">
                Select Client <span className="text-red-500">*</span>
              </label>
              <select
                value={selectedClient}
                onChange={(e) =>
                  setSelectedClient(
                    e.target.value
                  )
                }
                className="w-full px-4 py-3 rounded-xl border border-gray-200"
              >
                <option value="">
                  Select Client
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
            </div>
            <div className="space-y-2">
  <label className="text-xs font-bold text-gray-700 tracking-wide">
    Select Deal
  </label>

  <select
    value={selectedDeal}
    onChange={(e) =>
      setSelectedDeal(
        e.target.value
      )
    }
    className="w-full px-4 py-3 rounded-xl border border-gray-200"
  >
    <option value="">
      Select Deal
    </option>

    {dealsData?.data?.map(
      (deal) => (
        <option
          key={deal._id}
          value={deal._id}
        >
          {deal.dealName}
          {" - ₹"}
          {deal.amount}
        </option>
      )
    )}
  </select>
</div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-700 tracking-wide">P.O. Number</label>
              <input
                type="text"
                value={poNumber}
                disabled
                className="w-full border border-gray-200 bg-gray-50/50 rounded-xl px-4 py-3 text-sm text-gray-600 font-medium focus:outline-none"
              />
            </div>
          </div>

          {/* Dynamic Order Items Section */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="text-sm font-bold text-gray-950">Order Items</h4>
              <button
                type="button"
                onClick={handleAddItem}
                className="bg-black text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 hover:bg-gray-800 transition-all shadow-sm"
              >
                <Plus className="w-3.5 h-3.5 stroke-[3px]" /> Add Item
              </button>
            </div>

            {/* Item Wrapper Box */}
            <div className="bg-gray-50/30 border border-gray-100 rounded-2xl p-6 space-y-4">
              {items.map((item, idx) => (
                <div key={idx} className="grid grid-cols-12 gap-4 items-center border-b border-gray-100/50 pb-4 last:border-0 last:pb-0">

                  {/* Item Details Block */}
                  <div className="col-span-5 space-y-3">
                    <div>
                      <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider block mb-1">
                        Item Details
                      </label>

                      <div className="relative">

                        <input
                          type="text"
                          placeholder="Search SKU or Item"
                          value={item.searchTerm}
                          onFocus={() => {
                            const updatedItems = [...items];
                            updatedItems[idx].showDropdown = true;
                            setItems(updatedItems);
                          }}
                          onChange={(e) => {
                            const updatedItems = [...items];

                            updatedItems[idx].searchTerm =
                              e.target.value;

                            updatedItems[idx].showDropdown =
                              true;

                            setItems(updatedItems);
                          }}
                          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm"
                        />

                        {item.showDropdown && (
                          <div className="absolute z-50 w-full bg-white border border-gray-200 rounded-xl shadow-lg max-h-56 overflow-y-auto mt-1">

                            <div className="p-4 border-t">
                              {getFilteredInventory(
                                item.searchTerm
                              ).length === 0 && (
                                  <div className="text-sm text-gray-500 mb-3">
                                    No inventory item found
                                  </div>
                                )}

                              <button
                                type="button"
                                onClick={() => {
                                  const updatedItems = [...items];

                                  updatedItems[idx].showNewItemForm =
                                    true;

                                  updatedItems[idx].showDropdown =
                                    false;

                                  updatedItems[idx].newItemName =
                                    item.searchTerm;

                                  updatedItems[idx].newItemSku =
                                    "";

                                  updatedItems[idx].newItemPrice =
                                    0;

                                  setItems(updatedItems);
                                }}
                                className="text-blue-600 font-semibold text-sm"
                              >
                                + Request New Item
                              </button>
                            </div>

                           
                          </div>
                        )}

                      </div>
                      {item.showNewItemForm && (
                        <div className="mt-3 border border-orange-200 bg-orange-50 rounded-xl p-4 space-y-3">

                          <h4 className="font-semibold text-orange-700">
                            New Item Request
                          </h4>

                          <input
                            type="text"
                            placeholder="Item Name"
                            value={item.newItemName}
                            onChange={(e) => {
                              const updatedItems = [...items];

                              updatedItems[idx].newItemName =
                                e.target.value;

                              setItems(updatedItems);
                            }}
                            className="w-full border border-gray-200 rounded-lg px-3 py-2"
                          />

                          <input
                            type="text"
                            placeholder="SKU"
                            value={item.newItemSku}
                            onChange={(e) => {
                              const updatedItems = [...items];

                              updatedItems[idx].newItemSku =
                                e.target.value;

                              setItems(updatedItems);
                            }}
                            className="w-full border border-gray-200 rounded-lg px-3 py-2"
                          />

                          <input
                            type="number"
                            placeholder="Expected Price"
                            value={item.newItemPrice}
                            onChange={(e) => {
                              const updatedItems = [...items];

                              updatedItems[idx].newItemPrice =
                                e.target.value;

                              setItems(updatedItems);
                            }}
                            className="w-full border border-gray-200 rounded-lg px-3 py-2"
                          />

                          <button
                            type="button"
                            onClick={() => {
                              const updatedItems = [...items];

                              updatedItems[idx] = {
                                ...updatedItems[idx],

                                inventoryId: null,

                                name:
                                  item.newItemName,

                                sku:
                                  item.newItemSku,

                                price: Number(
                                  item.newItemPrice
                                ),
                              };

                              updatedItems[idx].showNewItemForm =
                                false;

                              updatedItems[idx].searchTerm =
                                item.newItemName;

                              setItems(updatedItems);
                            }}
                            className="bg-orange-600 text-white px-4 py-2 rounded-lg text-sm"
                          >
                            Add Requested Item
                          </button>
                        </div>
                      )}

                    </div>
                    <input
                      type="text"
                      value={item.sku}
                      readOnly
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 bg-gray-50"
                    />
                  </div>

                  {/* Quantity Block */}
                  <div className="col-span-3 self-start">
                    <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider block mb-1">Quantity</label>
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => handleItemChange(idx, 'quantity', e.target.value)}
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-gray-400"
                    />
                  </div>

                  {/* Price Block */}
                  <div className="col-span-3 self-start">
                    <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider block mb-1">Price</label>
                    <input
                      type="number"
                      value={item.price}
                      readOnly
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 bg-gray-50"
                    />
                  </div>

                  {/* Remove Button Block */}
                  <div className="col-span-1 flex justify-center pt-5">
                    {items.length > 1 ? (
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(idx)}
                        className="text-gray-400 hover:text-red-500 p-2 rounded-lg hover:bg-red-50 transition-colors"
                        title="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    ) : (
                      // Hidden placeholder to preserve spacing layout consistency
                      <div className="w-8 h-8" />
                    )}
                  </div>

                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex justify-between items-center px-8 py-6 border-t border-gray-100 bg-white mt-auto">
          <div className="text-gray-500 font-medium">
            Order Total: <span className="text-gray-950 font-extrabold text-xl ml-1">${orderTotal.toFixed(2)}</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={onClose}
              className="text-gray-600 hover:text-gray-900 font-semibold text-sm transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleCreateOrder}
              className="bg-black text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-gray-800 shadow-md transition-all"
            >
              Process Order
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

{/* --- MAIN MAIN ORDERS PAGE --- */ }
const OrdersSection = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isDispatchModalOpen, setIsDispatchModalOpen] = useState(false);
  const handleDispatch = (order) => {
    setSelectedOrder(order);
    setIsDispatchModalOpen(true);
  };

  const {
    data: ordersData,
    isLoading,
  } = useGetOrders();

  const orders =
    ordersData?.data || [];
  if (isLoading) {
    return (
      <div className="p-6">
        Loading Orders...
      </div>
    );
  }
  return (
    <div className="max-w-screen-2xl mx-auto space-y-8 p-6">
      <div className="flex justify-between items-end">
        <div className="space-y-1">
          <h2 className="text-3xl font-extrabold text-gray-950 tracking-tighter">Orders</h2>
          <p className="text-gray-500 text-sm font-medium">Manage your business growth effectively.</p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-black text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2.5 hover:bg-gray-800 shadow-md transition-all"
        >
          <Plus className="w-5 h-5 stroke-[2.5px]" />
          New Order
        </button>
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-100">
              <th className="px-8 py-4 text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">Order #</th>
              <th className="px-8 py-4 text-[10px] font-extrabold text-gray-400 uppercase tracking-widest text-center">Client</th>
              <th className="px-8 py-4 text-[10px] font-extrabold text-gray-400 uppercase tracking-widest text-center">
  Deal
</th>
              <th className="px-8 py-4 text-[10px] font-extrabold text-gray-400 uppercase tracking-widest text-center">Items</th>
              <th className="px-8 py-4 text-[10px] font-extrabold text-gray-400 uppercase tracking-widest text-center">Total</th>
              <th className="px-8 py-4 text-[10px] font-extrabold text-gray-400 uppercase tracking-widest text-right">Date</th>
              <th className="px-8 py-4 text-[10px] font-extrabold text-gray-400 uppercase tracking-widest text-center">
                Status
              </th>
              <th className="px-8 py-4 text-[10px] font-extrabold text-gray-400 uppercase tracking-widest text-center">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {orders.map((order, i) => (
              <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-8 py-5 font-bold text-gray-950 text-sm">{order.poNumber}</td>
                <td className="px-8 py-5 text-center text-sm font-medium text-gray-600">{order.clientId?.clientName}</td>
                <td className="px-8 py-5 text-center text-sm font-medium text-gray-600">
  {order.dealId?.dealName || "-"}
</td>
                <td className="px-8 py-5 text-center text-xs text-gray-400 font-medium">{order.items.length} items</td>
                <td className="px-8 py-5 text-center font-extrabold text-gray-950 text-sm">₹{order.totalAmount}</td>
                <td className="px-8 py-5 text-right text-xs font-semibold text-gray-400">
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>

                <td className="px-8 py-5 text-center">
                  <span
                    className={`px-2 py-1 rounded text-[10px] font-bold ${order.status === "DELIVERED"
                      ? "bg-green-100 text-green-700"
                      : order.status === "PARTIALLY_DISPATCHED"
                        ? "bg-yellow-100 text-yellow-700"
                        : order.status === "ALLOCATED"
                          ? "bg-blue-100 text-blue-700"
                          : order.status === "PARTIALLY_ALLOCATED"
                            ? "bg-orange-100 text-orange-700"
                            : order.status === "PENDING_PROCUREMENT"
                              ? "bg-red-100 text-red-700"
                              : "bg-gray-100 text-gray-700"
                      }`}
                  >
                    {order.status}
                  </span>
                </td>

                <td className="px-8 py-5 text-center">
                  <button
                    disabled={
                      order.status === "PENDING" ||
                      order.status === "PENDING_PROCUREMENT" ||
                      order.status === "DELIVERED" ||
                      order.status === "COMPLETED"
                    }
                    onClick={() => handleDispatch(order)}
                    className={`px-3 py-2 rounded-lg text-xs font-bold transition-all ${order.status === "PENDING" ||
                      order.status === "PENDING_PROCUREMENT" ||
                      order.status === "DELIVERED" ||
                      order.status === "COMPLETED"
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                      : "bg-black text-white hover:bg-gray-800"
                      }`}
                  >
                    Dispatch
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <NewOrderModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
      <DispatchModal
        isOpen={isDispatchModalOpen}
        onClose={() =>
          setIsDispatchModalOpen(false)
        }
        order={selectedOrder}
      />
    </div>
  );
};

export default OrdersSection;