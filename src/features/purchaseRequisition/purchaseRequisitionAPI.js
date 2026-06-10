import API from "../../api/axios";

// GET ALL PRs
export const getPurchaseRequisitions =
  async () => {
    const response =
      await API.get(
        "/purchase-requisitions"
      );

    return response.data;
  };

// UPDATE PR
export const updatePurchaseRequisition =
  async (id, data) => {
    const response =
      await API.patch(
        `/purchase-requisitions/${id}`,
        data
      );

    return response.data;
  };