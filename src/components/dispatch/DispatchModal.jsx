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

  const [
    eWayBillNumber,
    setEWayBillNumber,
  ] = useState("");

  const [
    billOfLadingNumber,
    setBillOfLadingNumber,
  ] = useState("");

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

            eWayBillNumber,

            billOfLadingNumber,

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
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-0 backdrop-blur-sm sm:items-center sm:p-4">

      <div className="max-h-[96vh] w-full max-w-5xl overflow-hidden rounded-t-[26px] bg-white shadow-xl sm:rounded-2xl">

        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-gray-100 px-4 py-4 sm:px-8 sm:py-6">

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
        <div className="max-h-[76vh] space-y-6 overflow-y-auto p-4 sm:max-h-[70vh] sm:p-8">

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">

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

            <div>
              <label className="text-xs font-bold text-gray-600 uppercase">
                E-Way Bill / BL
              </label>

              <input
                value={
                  eWayBillNumber
                }
                onChange={(e) =>
                  setEWayBillNumber(
                    e.target.value
                  )
                }
                placeholder="E-Way Bill No."
                className="w-full border border-gray-200 rounded-xl px-4 py-3 mt-2"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-600 uppercase">
                Bill of Lading
              </label>

              <input
                value={
                  billOfLadingNumber
                }
                onChange={(e) =>
                  setBillOfLadingNumber(
                    e.target.value
                  )
                }
                placeholder="BL Number"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 mt-2"
              />
            </div>

          </div>

          {/* ITEMS TABLE */}

          <div className="hidden overflow-hidden rounded-2xl border border-gray-100 md:block">

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

          <div className="space-y-3 md:hidden">
            {order.items.map((item, index) => {
              const remaining =
                item.allocatedQuantity -
                item.dispatchedQuantity;

              return (
                <div key={item.sku} className="rounded-2xl border border-gray-100 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-bold text-gray-900">{item.itemName}</p>
                      <p className="text-xs text-gray-500">{item.sku}</p>
                    </div>
                    <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-700">
                      {remaining} remaining
                    </span>
                  </div>
                  <div className="mt-3 grid grid-cols-[repeat(3,minmax(0,1fr))] gap-2 text-center">
                    <div className="rounded-xl bg-gray-50 p-2">
                      <p className="text-[9px] font-bold uppercase text-gray-400">Ordered</p>
                      <p className="font-bold">{item.quantity}</p>
                    </div>
                    <div className="rounded-xl bg-gray-50 p-2">
                      <p className="text-[9px] font-bold uppercase text-gray-400">Allocated</p>
                      <p className="font-bold">{item.allocatedQuantity}</p>
                    </div>
                    <div className="rounded-xl bg-gray-50 p-2">
                      <p className="text-[9px] font-bold uppercase text-gray-400">Sent</p>
                      <p className="font-bold">{item.dispatchedQuantity}</p>
                    </div>
                  </div>
                  <label className="mt-3 block">
                    <span className="text-[10px] font-bold uppercase text-gray-500">Dispatch quantity</span>
                    <input
                      type="number"
                      min="0"
                      max={remaining}
                      value={dispatchItems[index]?.quantity || 0}
                      onChange={(event) => handleQtyChange(index, event.target.value)}
                      className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-center"
                    />
                  </label>
                </div>
              );
            })}
          </div>

        </div>

        {/* FOOTER */}

        <div className="grid grid-cols-[auto_1fr] gap-3 border-t border-gray-100 px-4 py-4 sm:flex sm:justify-end sm:gap-4 sm:px-8 sm:py-6">

          <button
            onClick={onClose}
            className="min-h-11 px-3 text-gray-600"
          >
            Cancel
          </button>

          <button
            onClick={
              handleCreateDispatch
            }
            className="min-h-11 rounded-xl bg-black px-5 py-3 font-semibold text-white"
          >
            Create Dispatch
          </button>

        </div>

      </div>

    </div>
  );
};

export default DispatchModal;
