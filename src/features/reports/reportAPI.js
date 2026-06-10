import API from "../../api/axios";

export const getSalesReport =
  async () => {
    const response =
      await API.get(
        "/reports/sales"
      );

    return response.data;
  };

export const getInventoryReport =
  async () => {
    const response =
      await API.get(
        "/reports/inventory"
      );

    return response.data;
  };

export const getRevenueReport =
  async () => {
    const response =
      await API.get(
        "/reports/revenue"
      );

    return response.data;
  };

export const getProcurementReport =
  async () => {
    const response =
      await API.get(
        "/reports/procurement"
      );

    return response.data;
  };