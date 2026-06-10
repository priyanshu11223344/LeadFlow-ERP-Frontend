import API from "../../api/axios";

export const getUsers =
  async () => {
    const response =
      await API.get("/users");

    return response.data;
  };

export const createUser =
  async (data) => {
    const response =
      await API.post(
        "/users",
        data
      );

    return response.data;
  };

export const updateUser =
  async (id, data) => {
    const response =
      await API.patch(
        `/users/${id}`,
        data
      );

    return response.data;
  };

export const deleteUser =
  async (id) => {
    const response =
      await API.delete(
        `/users/${id}`
      );

    return response.data;
  };