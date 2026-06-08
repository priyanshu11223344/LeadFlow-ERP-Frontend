import API from "../../api/axios";

export const getClients = async () => {
  try {
    const response = await API.get("/clients");

    return response.data;
  } catch (error) {
    console.log(
      "GET CLIENTS ERROR:",
      error
    );

    throw error;
  }
};