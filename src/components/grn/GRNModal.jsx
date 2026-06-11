import React, {
    useState,
    useEffect,
  } from "react";
  
  import { X } from "lucide-react";
  
  import {
    useGetVendorPurchaseOrders,
  } from "../../features/vendorPurchaseOrders/vendorPurchaseOrderHooks";
  
  import {
    useCreateGRN,
  } from "../../features/grn/grnHooks";
  
  const GRNModal = ({
    isOpen,
    onClose,
  }) => {
    const {
      data: poData,
    } =
      useGetVendorPurchaseOrders();
  
    const createGRNMutation =
      useCreateGRN();
  
    const pos =
      poData?.data || [];
      console.log(
        "PO STATUS",
        pos.map(po => ({
          poNumber: po.poNumber,
          status: po.status
        }))
      );
      console.log("ALL POS", pos);
    const [
      vendorPurchaseOrderId,
      setVendorPurchaseOrderId,
    ] = useState("");
  
    const [items, setItems] =
      useState([]);
  
    useEffect(() => {
      if (
        !vendorPurchaseOrderId
      )
        return;
  
      const selectedPO =
        pos.find(
          (po) =>
            po._id ===
            vendorPurchaseOrderId
        );
  
      if (selectedPO) {
        setItems(
          selectedPO.items.map(
            (item) => ({
              inventoryId:
                item.inventoryId,
              itemName:
                item.itemName,
              sku: item.sku,
              orderedQuantity:
                item.quantity,
              receivedQuantity: 0,
            })
          )
        );
      }
    }, [
      vendorPurchaseOrderId,
      pos,
    ]);
  
    if (!isOpen) return null;
  
    const handleCreate =
      async () => {
        try {
            const invalidItem = items.find(
                (item) =>
                  item.receivedQuantity <= 0
              );
              
              if (invalidItem) {
                alert(
                  "Please enter received quantity for all items"
                );
                return;
              } 
          await createGRNMutation.mutateAsync(
            {
              vendorPurchaseOrderId,
              items,
            }
          );
  
          onClose();
  
          setVendorPurchaseOrderId(
            ""
          );
  
          setItems([]);
        } catch (error) {
          alert(
            error?.response?.data
              ?.message ||
              "Failed to create GRN"
          );
        }
      };
  
    return (
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
  
        <div className="bg-white w-full max-w-4xl rounded-2xl">
  
          <div className="flex justify-between items-center p-6 border-b">
  
            <h2 className="text-xl font-bold">
              Create GRN
            </h2>
  
            <button
              onClick={onClose}
            >
              <X />
            </button>
  
          </div>
  
          <div className="p-6 space-y-6">
  
            <select
              value={
                vendorPurchaseOrderId
              }
              onChange={(e) =>
                setVendorPurchaseOrderId(
                  e.target.value
                )
              }
              className="w-full border rounded-xl px-4 py-3"
            >
              <option value="">
                Select Vendor PO
              </option>
  
              {pos
  .filter(
    (po) =>
      po.status !==
      "RECEIVED"
  )
  .map((po) => (
    <option
      key={po._id}
      value={po._id}
    >
      {po.poNumber}
      {" - "}
      {
        po.vendorId
          ?.vendorName
      }
    </option>
))}
            </select>
  
            <div className="space-y-3">
  
              {items.map(
                (
                  item,
                  index
                ) => (
                  <div
                    key={index}
                    className="grid grid-cols-4 gap-3"
                  >
                    <input
                      value={
                        item.itemName
                      }
                      readOnly
                      className="border rounded-lg px-3 py-2"
                    />
  
                    <input
                      value={
                        item.orderedQuantity
                      }
                      readOnly
                      className="border rounded-lg px-3 py-2"
                    />
  
                    <input
                      value={
                        item.sku
                      }
                      readOnly
                      className="border rounded-lg px-3 py-2"
                    />
  
                    <input
                      type="number"
                      placeholder="Received Qty"
                      value={
                        item.receivedQuantity
                      }
                      onChange={(
                        e
                      ) => {
                        const updated =
                          [...items];
  
                        updated[
                          index
                        ].receivedQuantity =
                          Number(
                            e
                              .target
                              .value
                          );
  
                        setItems(
                          updated
                        );
                      }}
                      className="border rounded-lg px-3 py-2"
                    />
                  </div>
                )
              )}
  
            </div>
  
          </div>
  
          <div className="flex justify-end gap-4 p-6 border-t">
  
            <button
              onClick={onClose}
            >
              Cancel
            </button>
  
            <button
              onClick={
                handleCreate
              }
              className="bg-black text-white px-6 py-3 rounded-xl"
            >
              Create GRN
            </button>
  
          </div>
  
        </div>
  
      </div>
    );
  };
  
  export default GRNModal;