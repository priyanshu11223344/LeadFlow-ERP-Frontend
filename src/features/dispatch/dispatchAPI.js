import API from "../../api/axios";

// GET ALL DISPATCHES
export const getDispatches = async () => {
  try {
    const response = await API.get("/dispatch");

    return response.data;
  } catch (error) {
    console.log(
      "GET DISPATCHES ERROR:",
      error
    );

    throw error;
  }
};

// CREATE DISPATCH
export const createDispatch = async (
  data
) => {
  try {
    const response = await API.post(
      "/dispatch",
      data
    );

    return response.data;
  } catch (error) {
    console.log(
      "CREATE DISPATCH ERROR:",
      error
    );

    throw error;
  }
};