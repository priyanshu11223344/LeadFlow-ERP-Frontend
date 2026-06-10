import API from "../../api/axios";

// GET ALL INVOICES
export const getInvoices =
  async () => {
    try {
      const response =
        await API.get(
          "/invoices"
        );

      return response.data;
    } catch (error) {
      console.log(
        "GET INVOICES ERROR:",
        error
      );

      throw error;
    }
  };

// CREATE INVOICE
export const createInvoice =
  async (data) => {
    try {
      const response =
        await API.post(
          "/invoices",
          data
        );

      return response.data;
    } catch (error) {
      console.log(
        "CREATE INVOICE ERROR:",
        error
      );

      throw error;
    }
  };