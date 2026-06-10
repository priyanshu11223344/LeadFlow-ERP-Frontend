import API from "../../api/axios";

export const getVendorPurchaseOrders =
  async () => {
    const response =
      await API.get(
        "/vendor-purchase-orders"
      );

    return response.data;
  };

export const createVendorPurchaseOrder =
  async (data) => {
    const response =
      await API.post(
        "/vendor-purchase-orders",
        data
      );

    return response.data;
  };