import React,
{
  useState,
  useEffect
}
  from "react";
import { Plus, X } from 'lucide-react';
import {
  useGetInventory,
  useCreateInventory,
  useUpdateInventory,
  useDeleteInventory,
} from "../../features/inventory/inventoryHooks";
// --- Modal Component ---
const NewItemModal = ({ isOpen, onClose, editingItem }) => {
  const createInventoryMutation =
    useCreateInventory();
  const updateInventoryMutation =
    useUpdateInventory();
  const [formData, setFormData] =
    useState({
      itemName:
        editingItem?.itemName || "",
      sku:
        editingItem?.sku || "",
      quantity:
        editingItem?.quantity || 0,
      minQuantity:
        editingItem?.minQuantity || 0,
      price:
        editingItem?.price || 0,
      category:
        editingItem?.category || "",
    });
  useEffect(() => {
    if (editingItem) {
      setFormData({
        itemName: editingItem.itemName || "",
        sku: editingItem.sku || "",
        quantity: editingItem.quantity || 0,
        minQuantity: editingItem.minQuantity || 0,
        price: editingItem.price || 0,
        category: editingItem.category || "",
      });
    } else {
      setFormData({
        itemName: "",
        sku: "",
        quantity: 0,
        minQuantity: 0,
        price: 0,
        category: "",
      });
    }
  }, [editingItem]);
  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async () => {
    try {
      const payload = {
        ...formData,
        quantity:
          Number(formData.quantity),
        minQuantity:
          Number(
            formData.minQuantity
          ),
        price:
          Number(formData.price),
      };

      if (editingItem) {
        await updateInventoryMutation.mutateAsync(
          {
            id: editingItem._id,
            data: payload,
          }
        );
      } else {
        await createInventoryMutation.mutateAsync(
          payload
        );
      }

      onClose();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative bg-white w-full max-w-md rounded-[32px] shadow-2xl overflow-hidden flex flex-col">
        <div className="flex items-center justify-between px-8 pt-8 pb-4">
          <h3 className="text-xl font-bold text-gray-950">
            {editingItem
              ? "Update Inventory Item"
              : "Add Inventory Item"}
          </h3>

          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full"
          >
            <X className="w-6 h-6 text-gray-400" />
          </button>
        </div>

        <div className="px-8 py-4 space-y-5">
          <div>
            <label className="text-sm font-bold text-gray-700">
              Item Name *
            </label>

            <input
              type="text"
              name="itemName"
              value={formData.itemName}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-gray-200"
            />
          </div>

          <div>
            <label className="text-sm font-bold text-gray-700">
              SKU *
            </label>

            <input
              type="text"
              name="sku"
              value={formData.sku}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-gray-200"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-bold text-gray-700">
                Quantity
              </label>

              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-200"
              />
            </div>

            <div>
              <label className="text-sm font-bold text-gray-700">
                Min Quantity
              </label>

              <input
                type="number"
                name="minQuantity"
                value={formData.minQuantity}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-200"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-bold text-gray-700">
              Price
            </label>

            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-gray-200"
            />
          </div>

          <div>
            <label className="text-sm font-bold text-gray-700">
              Category
            </label>

            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-gray-200"
            />
          </div>
        </div>

        <div className="px-8 pt-4 pb-8 flex justify-end gap-6">
          <button
            onClick={onClose}
            className="text-gray-500 font-bold"
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            disabled={
              createInventoryMutation.isPending
            }
            className="bg-black text-white px-8 py-3 rounded-xl font-bold"
          >
            {createInventoryMutation.isPending
              ? "Saving..."
              : "Save Item"}
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Main Inventory Section ---
const InventorySection = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] =
    useState(null);
  const {
    data,
    isLoading,
    error,
  } = useGetInventory();

  const inventory =
    data?.data || [];
  const handleEdit = (item) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };
  if (isLoading) {
    return (
      <div className="p-6">
        Loading Inventory...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-red-500">
        Failed to load inventory
      </div>
    );
  }
  return (
    <div className="max-w-screen-2xl mx-auto space-y-8">
      <div className="flex justify-between items-end">
        <div className="space-y-1">
          <h2 className="text-3xl font-extrabold text-gray-950 tracking-tighter">Inventory</h2>
          <p className="text-gray-500 text-sm font-medium">Manage your business growth effectively.</p>
        </div>
        <button
          onClick={() => {
            setEditingItem(null);
            setIsModalOpen(true);
          }}
          className="bg-black text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2.5 hover:bg-gray-800 shadow-md active:scale-95 transition-transform"
        >
          <Plus className="w-5 h-5 stroke-[2.5px]" />
          New Item
        </button>
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-100 text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">
              <th className="px-6 py-4">Item</th>
              <th className="px-6 py-4 text-center">SKU</th>
              <th className="px-6 py-4 text-center">Stock</th>
              <th className="px-6 py-4 text-center">To Order</th>
              <th className="px-6 py-4 text-center">Status</th>
              <th className="px-6 py-4 text-center">Price</th>
              <th className="px-6 py-4 text-center">
                Last Updated
              </th>

              <th className="px-6 py-4 text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {inventory.map((item, i) => (
              <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-5 font-bold text-gray-950 text-sm">{item.itemName}</td>
                <td className="px-6 py-5 text-center text-xs font-medium text-gray-500">{item.sku}</td>
                <td className="px-6 py-5 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <span className="font-extrabold text-gray-950">{item.quantity}</span>
                    {item.badge && <span className="bg-red-50 text-red-600 px-1.5 py-0.5 rounded text-[9px] font-black italic">LOW</span>}
                  </div>
                </td>
                <td className="px-6 py-5 text-center">
                  {(item.toBeOrderedQuantity || 0) > 0 ? (
                    <span className="inline-flex rounded-full bg-orange-50 px-2.5 py-1 text-[10px] font-black text-orange-700 border border-orange-100">
                      {item.toBeOrderedQuantity}
                    </span>
                  ) : (
                    <span className="text-xs font-semibold text-gray-300">0</span>
                  )}
                </td>
                <td className="px-6 py-5 text-center">
                  <span
                    className={`px-2 py-0.5 rounded text-[9px] font-extrabold ${item.status === "IN_STOCK"
                        ? "bg-green-100 text-green-700"
                        : item.status === "LOW_STOCK"
                          ? "bg-yellow-100 text-yellow-700"
                          : item.status === "OUT_OF_STOCK"
                            ? "bg-red-100 text-red-700"
                            : "bg-orange-100 text-orange-700"
                      }`}
                  >
                    {item.status}
                  </span>
                </td>
                <td className="px-6 py-5 text-center font-extrabold text-gray-950 text-sm">${item.price?.toLocaleString()}</td>
                <td className="px-6 py-5 text-center text-xs text-gray-500">
  {new Date(
    item.updatedAt
  ).toLocaleDateString()}
</td>

<td className="px-6 py-5 text-right">
  <button
    onClick={() => handleEdit(item)}
    className="text-blue-600 text-xs font-bold"
  >
    Edit
  </button>
</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Render the Modal component */}
      <NewItemModal
        isOpen={isModalOpen}
        editingItem={editingItem}
        onClose={() => {
          setEditingItem(null);
          setIsModalOpen(false);
        }}
      />
    </div>
  );
};

export default InventorySection;
