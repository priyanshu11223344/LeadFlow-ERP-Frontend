import API from "../../api/axios";

// GET PAYMENTS
export const getPayments =
  async () => {
    try {
      const response =
        await API.get(
          "/payments"
        );

      return response.data;
    } catch (error) {
      console.log(
        "GET PAYMENTS ERROR:",
        error
      );

      throw error;
    }
  };

// CREATE PAYMENT
export const createPayment =
  async (data) => {
    try {
      const response =
        await API.post(
          "/payments",
          data
        );

      return response.data;
    } catch (error) {
      console.log(
        "CREATE PAYMENT ERROR:",
        error
      );

      throw error;
    }
  };