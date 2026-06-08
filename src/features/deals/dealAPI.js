import API from "../../api/axios";

// GET ALL DEALS
export const getDeals=async()=>{
    try {
        const response=await API.get("/deals");
        return response.data;
    } catch (error) {
        console.log("GET DEALS ERROR:",error);
    };
    throw error;
}
// GET SINGLE DEAL 
export const getDealById = async (id) => {

    try {
  
      const response = await API.get(
        `/deals/${id}`
      );
  
      return response.data;
  
    } catch (error) {
  
      console.log(
        "GET DEAL BY ID ERROR:",
        error
      );
  
      throw error;
    }
  };
  // CREATE DEAL
export const createDeal = async (data) => {

    try {
  
      const response = await API.post(
        "/deals",
        data
      );
  
      return response.data;
  
    } catch (error) {
  
      console.log(
        "CREATE DEAL ERROR:",
        error
      );
  
      throw error;
    }
  };
  export const updateDeal = async (
    id,
    data
  ) => {
  
    try {
  
      const response = await API.put(
        `/deals/${id}`,
        data
      );
  
      return response.data;
  
    } catch (error) {
  
      console.log(
        "UPDATE DEAL ERROR:",
        error
      );
  
      throw error;
    }
  };
  
  // DELETE DEAL
  export const deleteDeal = async (id) => {
  
    try {
  
      const response = await API.delete(
        `/deals/${id}`
      );
  
      return response.data;
  
    } catch (error) {
  
      console.log(
        "DELETE DEAL ERROR:",
        error
      );
  
      throw error;
    }
  };