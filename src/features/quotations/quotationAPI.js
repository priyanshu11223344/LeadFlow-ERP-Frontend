import API from "../../api/axios";

// GET ALL QUOTATIONS

export const getQuotations =
  async () => {
    try {
      const response =
        await API.get(
          "/quotations"
        );

      return response.data;
    } catch (error) {
      console.log(
        "GET QUOTATIONS ERROR:",
        error
      );

      throw error;
    }
  };

// CREATE QUOTATION

export const createQuotation =
  async (data) => {
    try {
      const response =
        await API.post(
          "/quotations",
          data
        );

      return response.data;
    } catch (error) {
      console.log(
        "CREATE QUOTATION ERROR:",
        error
      );

      throw error;
    }
  };

// UPDATE STATUS

export const updateQuotationStatus =
  async ({
    id,
    status,
  }) => {
    try {
      const response =
        await API.patch(
          `/quotations/${id}/status`,
          { status }
        );

      return response.data;
    } catch (error) {
      console.log(
        "UPDATE STATUS ERROR:",
        error
      );

      throw error;
    }
  };

// CONVERT TO DEAL

export const convertQuotation =
  async (id) => {
    try {
      const response =
        await API.post(
          `/quotations/${id}/convert`
        );

      return response.data;
    } catch (error) {
      console.log(
        "CONVERT QUOTATION ERROR:",
        error
      );

      throw error;
    }
  };
  export const downloadQuotationPdf =
  async (id) => {
    const response =
      await API.get(
        `/quotations/${id}/pdf`,
        {
          responseType:
            "blob",
        }
      );

    return response.data;
  };