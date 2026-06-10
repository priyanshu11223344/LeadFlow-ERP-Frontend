import API from "../../api/axios";

// GET ORDERS
export const getOrders = async () => {
  try {
    const response = await API.get(
      "/orders"
    );

    return response.data;
  } catch (error) {
    console.log(
      "GET ORDERS ERROR:",
      error
    );

    throw error;
  }
};

// CREATE ORDER
export const createOrder =
  async (data) => {
    try {
      const response =
        await API.post(
          "/orders",
          data
        );

      return response.data;
    } catch (error) {
      console.log(
        "CREATE ORDER ERROR:",
        error
      );

      throw error;
    }
  };
  // GET SINGLE ORDER
export const getOrderById = async (id) => {
  try {
    const response = await API.get(
      `/orders/${id}`
    );

    return response.data;
  } catch (error) {
    console.log(
      "GET ORDER BY ID ERROR:",
      error
    );

    throw error;
  }
};