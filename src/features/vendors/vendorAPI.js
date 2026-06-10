import API from "../../api/axios";

// GET ALL VENDORS
export const getVendors = async () => {
  const response = await API.get("/vendors");
  return response.data;
};

// CREATE VENDOR
export const createVendor = async (
  data
) => {
  const response = await API.post(
    "/vendors",
    data
  );

  return response.data;
};