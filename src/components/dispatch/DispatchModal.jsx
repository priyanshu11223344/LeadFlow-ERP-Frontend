import React, { useState } from "react";
import { X } from "lucide-react";

import {
  useCreateDispatch,
} from "../../features/dispatch/dispatchHooks";

const DispatchModal = ({
  isOpen,
  onClose,
  order,
}) => {
  const createDispatchMutation =
    useCreateDispatch();

  const [trackingNumber, setTrackingNumber] =
    useState("");

  const [transporter, setTransporter] =
    useState("");

  const [dispatchItems, setDispatchItems] =
    useState([]);

  React.useEffect(() => {
    if (order) {
      setDispatchItems(
        order.items.map((item) => ({
          inventoryId:
            item.inventoryId,

          itemName:
            item.itemName,

          sku:
            item.sku,

          quantity:
            item.allocatedQuantity -
            item.dispatchedQuantity,
        }))
      );
    }
  }, [order]);

  if (!isOpen || !order) return null;

  const handleQtyChange = (
    index,
    value
  ) => {
    const updated = [
      ...dispatchItems,
    ];

    updated[index].quantity =
      Number(value);

    setDispatchItems(updated);
  };

  const handleCreateDispatch =
    async () => {
      try {
        const filteredItems =
          dispatchItems.filter(
            (item) =>
              item.quantity > 0
          );

        if (
          filteredItems.length === 0
        ) {
          alert(
            "Please dispatch at least one item"
          );
          return;
        }

        await createDispatchMutation.mutateAsync(
          {
            orderId:
              order._id,

            trackingNumber,

            transporter,

            items:
              filteredItems,
          }
        );

        onClose();
      } catch (error) {
        console.log(error);
      }
    };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 p-4">

      <div className="bg-white w-full max-w-5xl rounded-2xl shadow-xl overflow-hidden">

        {/* HEADER */}
        <div className="flex justify-between items-center px-8 py-6 border-b border-gray-100">

          <div>
            <h2 className="text-xl font-bold">
              Create Dispatch
            </h2>

            <p className="text-sm text-gray-500">
              {order.poNumber}
            </p>
          </div>

          <button
            onClick={onClose}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* BODY */}
        <div className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">

          <div className="grid grid-cols-2 gap-6">

            <div>
              <label className="text-xs font-bold text-gray-600 uppercase">
                Tracking Number
              </label>

              <input
                value={
                  trackingNumber
                }
                onChange={(e) =>
                  setTrackingNumber(
                    e.target.value
                  )
                }
                className="w-full border border-gray-200 rounded-xl px-4 py-3 mt-2"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-600 uppercase">
                Transporter
              </label>

              <input
                value={
                  transporter
                }
                onChange={(e) =>
                  setTransporter(
                    e.target.value
                  )
                }
                className="w-full border border-gray-200 rounded-xl px-4 py-3 mt-2"
              />
            </div>

          </div>

          {/* ITEMS TABLE */}

          <div className="border border-gray-100 rounded-2xl overflow-hidden">

            <table className="w-full">

              <thead>

                <tr className="bg-gray-50">

                  <th className="px-4 py-3 text-left text-xs">
                    Item
                  </th>

                  <th className="px-4 py-3 text-center text-xs">
                    Ordered
                  </th>

                  <th className="px-4 py-3 text-center text-xs">
                    Allocated
                  </th>

                  <th className="px-4 py-3 text-center text-xs">
                    Dispatched
                  </th>

                  <th className="px-4 py-3 text-center text-xs">
                    Remaining
                  </th>

                  <th className="px-4 py-3 text-center text-xs">
                    Dispatch Qty
                  </th>

                </tr>

              </thead>

              <tbody>

                {order.items.map(
                  (
                    item,
                    index
                  ) => {
                    const remaining =
                      item.allocatedQuantity -
                      item.dispatchedQuantity;

                    return (
                      <tr
                        key={
                          item.sku
                        }
                        className="border-t"
                      >
                        <td className="px-4 py-4">
                          {
                            item.itemName
                          }
                        </td>

                        <td className="text-center">
                          {
                            item.quantity
                          }
                        </td>

                        <td className="text-center">
                          {
                            item.allocatedQuantity
                          }
                        </td>

                        <td className="text-center">
                          {
                            item.dispatchedQuantity
                          }
                        </td>

                        <td className="text-center font-bold">
                          {
                            remaining
                          }
                        </td>

                        <td className="text-center">
                          <input
                            type="number"
                            min="0"
                            max={
                              remaining
                            }
                            value={
                              dispatchItems[
                                index
                              ]
                                ?.quantity ||
                              0
                            }
                            onChange={(
                              e
                            ) =>
                              handleQtyChange(
                                index,
                                e
                                  .target
                                  .value
                              )
                            }
                            className="w-24 border border-gray-200 rounded-lg px-2 py-1 text-center"
                          />
                        </td>
                      </tr>
                    );
                  }
                )}

              </tbody>

            </table>

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
              handleCreateDispatch
            }
            className="bg-black text-white px-6 py-3 rounded-xl font-semibold"
          >
            Create Dispatch
          </button>

        </div>

      </div>

    </div>
  );
};

export default DispatchModal;