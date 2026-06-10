import API from "../../api/axios";

export const getGRNs =
  async () => {
    const response =
      await API.get("/grn");

    return response.data;
  };

export const createGRN =
  async (data) => {
    const response =
      await API.post(
        "/grn",
        data
      );

    return response.data;
  };