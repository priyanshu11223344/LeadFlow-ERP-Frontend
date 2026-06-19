import API from "../../api/axios";

export const getTickets =
  async () => {
    const response =
      await API.get("/tickets");

    return response.data;
  };

export const createTicket =
  async (data) => {
    const response =
      await API.post(
        "/tickets",
        data
      );

    return response.data;
  };

export const updateTicket =
  async (id, data) => {
    const response =
      await API.patch(
        `/tickets/${id}`,
        data
      );

    return response.data;
  };
