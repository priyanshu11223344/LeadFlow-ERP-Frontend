import API from "../../api/axios";

// GET ALL INVENTORY ITEMS
export const getInventory = async () => {
  try {
    const response = await API.get(
      "/inventory"
    );

    return response.data;
  } catch (error) {
    console.log(
      "GET INVENTORY ERROR:",
      error
    );

    throw error;
  }
};

// GET SINGLE INVENTORY ITEM
export const getInventoryById =
  async (id) => {
    try {
      const response =
        await API.get(
          `/inventory/${id}`
        );

      return response.data;
    } catch (error) {
      console.log(
        "GET INVENTORY BY ID ERROR:",
        error
      );

      throw error;
    }
  };

// CREATE INVENTORY ITEM
export const createInventory =
  async (data) => {
    try {
      const response =
        await API.post(
          "/inventory",
          data
        );

      return response.data;
    } catch (error) {
      console.log(
        "CREATE INVENTORY ERROR:",
        error
      );

      throw error;
    }
  };

// UPDATE INVENTORY ITEM
export const updateInventory =
  async (id, data) => {
    try {
      const response =
        await API.patch(
          `/inventory/${id}`,
          data
        );

      return response.data;
    } catch (error) {
      console.log(
        "UPDATE INVENTORY ERROR:",
        error
      );

      throw error;
    }
  };

// DELETE INVENTORY ITEM
export const deleteInventory =
  async (id) => {
    try {
      const response =
        await API.delete(
          `/inventory/${id}`
        );

      return response.data;
    } catch (error) {
      console.log(
        "DELETE INVENTORY ERROR:",
        error
      );

      throw error;
    }
  };