// leadAPI.js

import API from "../../api/axios";

// GET LEADS
export const getLeads = async () => {

  try {

    const response = await API.get("/leads");

    return response.data;

  } catch (error) {

    console.log("GET LEADS ERROR:", error);

    throw error;
  }
};

// CREATE LEAD
export const createLead = async (data) => {

  try {

    const response = await API.post(
      "/leads",
      data
    );

    return response.data;

  } catch (error) {

    console.log("CREATE LEAD ERROR:", error);

    throw error;
  }
};

// UPDATE LEAD
export const updateLead = async (id, data) => {

  try {

    const response = await API.patch(
      `/leads/${id}`,
      data
    );

    return response.data;

  } catch (error) {

    console.log("UPDATE LEAD ERROR:", error);

    throw error;
  }
};