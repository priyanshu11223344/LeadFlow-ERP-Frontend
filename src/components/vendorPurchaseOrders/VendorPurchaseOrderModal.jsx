import React, {
    useState,
    useEffect,
  } from "react";
  
  import { X } from "lucide-react";
  
  import {
    useGetVendors,
  } from "../../features/vendors/vendorHooks";
  
  import {
    useGetPurchaseRequisitions
  } from "../../features/purchaseRequisition/purchaseRequisitionHooks";
  
  import {
    useCreateVendorPurchaseOrder,
  } from "../../features/vendorPurchaseOrders/vendorPurchaseOrderHooks";
  
  const VendorPurchaseOrderModal = ({
    isOpen,
    onClose,
  }) => {
    const {
      data: vendorData,
    } = useGetVendors();
  
    const {
      data: requisitionData,
    } =
      useGetPurchaseRequisitions();
  
    const createPOMutation =
      useCreateVendorPurchaseOrder();
  
    const vendors =
      vendorData?.data || [];
   
    const requisitions =
      requisitionData?.data || [];
  
    const [vendorId, setVendorId] =
      useState("");
  
    const [
      selectedRequisitions,
      setSelectedRequisitions,
    ] = useState([]);
  
    const [items, setItems] =
      useState([]);
  
    useEffect(() => {
      const selected =
        requisitions.filter(
          (req) =>
            selectedRequisitions.includes(
              req._id
            )
        );
  
      const mappedItems =
        selected.map((req) => ({
          inventoryId:
            req.inventoryId?._id,
          itemName:
            req.itemName,
          sku: req.sku,
          quantity:
            req.requiredQuantity,
          unitPrice: 0,
        }));
  
      setItems(mappedItems);
    }, [
      selectedRequisitions,
      requisitions,
    ]);
  
    if (!isOpen) return null;
  
    const handleCreate =
      async () => {
        try {
          await createPOMutation.mutateAsync(
            {
              vendorId,
              requisitionIds:
                selectedRequisitions,
              items,
            }
          );
  
          onClose();
        } catch (error) {
          alert(
            error?.response?.data
              ?.message ||
              "Failed to create PO"
          );
        }
      };
  
    return (
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
  
        <div className="bg-white w-full max-w-4xl rounded-2xl">
  
          <div className="flex justify-between items-center p-6 border-b">
  
            <h2 className="text-xl font-bold">
              Create Vendor PO
            </h2>
  
            <button
              onClick={onClose}
            >
              <X />
            </button>
  
          </div>
  
          <div className="p-6 space-y-6">
  
            <select
              value={vendorId}
              onChange={(e) =>
                setVendorId(
                  e.target.value
                )
              }
              className="w-full border rounded-xl px-4 py-3"
            >
              <option value="">
                Select Vendor
              </option>
  
              {vendors.map(
                (vendor) => (
                  <option
                    key={vendor._id}
                    value={
                      vendor._id
                    }
                  >
                    {
                      vendor.vendorName
                    }
                  </option>
                )
              )}
            </select>
  
            <div className="border rounded-xl p-4">
  
              <h3 className="font-semibold mb-3">
                Purchase
                Requisitions
              </h3>
  
              <div className="space-y-2 max-h-48 overflow-y-auto">
  
                {requisitions.map(
                  (req) => (
                    <label
                      key={req._id}
                      className="flex items-center gap-3"
                    >
                      <input
                        type="checkbox"
                        checked={selectedRequisitions.includes(
                          req._id
                        )}
                        onChange={(
                          e
                        ) => {
                          if (
                            e.target
                              .checked
                          ) {
                            setSelectedRequisitions(
                              [
                                ...selectedRequisitions,
                                req._id,
                              ]
                            );
                          } else {
                            setSelectedRequisitions(
                              selectedRequisitions.filter(
                                (
                                  id
                                ) =>
                                  id !==
                                  req._id
                              )
                            );
                          }
                        }}
                      />
  
                      <span>
                        {
                          req.itemName
                        }
                        {" - "}
                        {
                          req.requiredQuantity
                        }
                      </span>
                    </label>
                  )
                )}
  
              </div>
  
            </div>
  
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
                        item.quantity
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
                      placeholder="Unit Price"
                      value={
                        item.unitPrice
                      }
                      onChange={(
                        e
                      ) => {
                        const updated =
                          [
                            ...items,
                          ];
  
                        updated[
                          index
                        ].unitPrice =
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
              Create PO
            </button>
  
          </div>
  
        </div>
  
      </div>
    );
  };
  
  export default VendorPurchaseOrderModal;